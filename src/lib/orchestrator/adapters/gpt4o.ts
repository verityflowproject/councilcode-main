import OpenAI from 'openai'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const MODEL = 'gpt-5.4'

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
  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    const response = await withRetry(
      () => client.responses.create({
        model: MODEL,
        instructions: buildSystemPrompt(task.taskType),
        input: `${task.prompt}${contextBlock}`,
        max_output_tokens: 4096,
      }),
      MODEL_RETRY_OPTIONS
    )

    const output = response.output_text ?? ''
    const tokensUsed = (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0)

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

    return {
      model: 'gpt4o',
      output,
      confidence: 0.92,
      flaggedIssues,
      tokensUsed,
    }
  } catch (err: unknown) {
    console.error('[GPT-5.4 adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('gpt4o')
    throw new ModelAdapterError(
      `GPT-5.4 API error: ${(err as Error).message ?? String(err)}`,
      'gpt4o',
      err
    )
  }
}
