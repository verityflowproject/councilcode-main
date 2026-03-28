import OpenAI from 'openai'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, MissingApiKeyError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'
import { resolveApiKey, OPENROUTER_BASE_URL } from '@/lib/utils/get-model-key'
import { calculateCreditCost } from '@/lib/utils/credit-costs'
import { classifyComplexity, selectModelString } from '../smart-routing'

// When routing through OpenRouter, gpt-5.4 is not available — fall back to gpt-4o
const OPENROUTER_GPT_MODEL = 'openai/gpt-4o'

function buildSystemPrompt(taskType: string): string {
  const base = `You are GPT-5.4, the Generalist and primary Reviewer on an AI engineering team called VerityFlow. You are responsible for broad implementation tasks, API integrations, and cross-checking other models' outputs for correctness, hallucinations, and security issues. You are thorough and precise. When reviewing, you always return structured JSON.`

  const taskInstructions: Record<string, string> = {
    implementation: `Your current task is IMPLEMENTATION. Write clean, production-ready code following the project conventions in your context. Add inline comments for any non-obvious logic.`,
    review: `Your current task is REVIEW. Carefully check the provided output against the project conventions, architecture decisions, and dependency versions in your context. Return valid JSON in this exact format:
{
  "approved": boolean,
  "flaggedIssues": string[],
  "patch": string | null,
  "confidence": number
}
If approved is false, patch must contain corrected code.`,
  }

  return `${base}\n\n${taskInstructions[taskType] ?? 'Complete the task carefully following project conventions.'}`
}

export async function runGpt4o(task: OrchestratorTask): Promise<ModelResponse> {
  const complexity = classifyComplexity(task.prompt)
  const baseModelString = selectModelString('gpt4o', complexity)

  let resolved
  try {
    resolved = await resolveApiKey(task.userId, 'openai')
  } catch (err) {
    throw new MissingApiKeyError('openai')
  }

  const isOpenRouter = resolved.source === 'byok-openrouter'
  const modelString = isOpenRouter ? OPENROUTER_GPT_MODEL : baseModelString

  const c = isOpenRouter
    ? new OpenAI({ apiKey: resolved.apiKey, baseURL: OPENROUTER_BASE_URL })
    : new OpenAI({ apiKey: resolved.apiKey })

  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    let output: string
    let inputTok: number
    let outputTok: number

    if (isOpenRouter) {
      // OpenRouter uses Chat Completions — Responses API is not compatible
      const response = await withRetry(
        () => c.chat.completions.create({
          model: modelString,
          messages: [
            { role: 'system', content: buildSystemPrompt(task.taskType) },
            { role: 'user', content: `${task.prompt}${contextBlock}` },
          ],
          max_tokens: 4096,
        }),
        MODEL_RETRY_OPTIONS
      )
      output = response.choices[0]?.message?.content ?? ''
      inputTok = response.usage?.prompt_tokens ?? 0
      outputTok = response.usage?.completion_tokens ?? 0
    } else {
      // Direct OpenAI — use Responses API
      const response = await withRetry(
        () => c.responses.create({
          model: modelString,
          instructions: buildSystemPrompt(task.taskType),
          input: `${task.prompt}${contextBlock}`,
          max_output_tokens: 4096,
        }),
        MODEL_RETRY_OPTIONS
      )
      output = response.output_text ?? ''
      inputTok = response.usage?.input_tokens ?? 0
      outputTok = response.usage?.output_tokens ?? 0
    }

    // Parse flagged issues from review output if present
    let flaggedIssues: string[] = []
    if (task.taskType === 'review') {
      try {
        const parsed = JSON.parse(output)
        if (!parsed.approved && Array.isArray(parsed.flaggedIssues)) {
          flaggedIssues = parsed.flaggedIssues
        }
      } catch {
        // Output wasn't JSON — treat as plain review text
      }
    }

    const creditCost = resolved.shouldDeductCredits
      ? calculateCreditCost(modelString, inputTok, outputTok)
      : 0

    return {
      model: 'gpt4o',
      output,
      confidence: 0.92,
      flaggedIssues,
      tokensUsed: inputTok + outputTok,
      modelString,
      inputTokens: inputTok,
      outputTokens: outputTok,
      creditCost,
      keySource: resolved.source,
    }
  } catch (err: unknown) {
    if (err instanceof MissingApiKeyError) throw err
    console.error('[GPT-5.4 adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('gpt4o')
    throw new ModelAdapterError(
      `GPT-5.4 API error: ${(err as Error).message ?? String(err)}`,
      'gpt4o',
      err
    )
  }
}
