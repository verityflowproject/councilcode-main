import Anthropic from '@anthropic-ai/sdk'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, MissingApiKeyError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'
import { resolveApiKey } from '@/lib/utils/get-model-key'
import { calculateCreditCost } from '@/lib/utils/credit-costs'
import { classifyComplexity, selectModelString } from '../smart-routing'

function buildSystemPrompt(taskType: string): string {
  const base = `You are Claude, the Architect on an AI engineering team called VerityFlow. Your role is system design, data modeling, architectural decisions, and conflict arbitration. You reason carefully before acting. You never guess — if you are uncertain about a library, API, or pattern, you say so explicitly and flag it as an open question.`

  const taskInstructions: Record<string, string> = {
    architecture: `Your current task is ARCHITECTURE. Produce clear, opinionated architectural decisions. Output your decisions as a structured list followed by any open questions you are flagging for the team.`,
    arbitration: `Your current task is ARBITRATION. Two models have produced conflicting outputs. Read both carefully, reason through which is correct based on the project conventions in your context, and produce a final resolution with a clear written rationale. Return valid JSON matching the arbitration schema.`,
    review: `Your current task is REVIEW. Check the provided output for correctness, consistency with project conventions, hallucinations, and security issues. Return valid JSON matching the review schema.`,
    refactor: `Your current task is REFACTOR. Improve the code for clarity, consistency, and adherence to project conventions. Preserve all existing functionality.`,
  }

  return `${base}\n\n${taskInstructions[taskType] ?? 'Complete the task to the best of your ability following project conventions.'}`
}

export async function runClaude(task: OrchestratorTask): Promise<ModelResponse> {
  const complexity = classifyComplexity(task.prompt)
  const modelString = selectModelString('claude', complexity)

  let resolved
  try {
    resolved = await resolveApiKey(task.userId, 'anthropic')
  } catch (err) {
    throw new MissingApiKeyError('anthropic')
  }

  const c = new Anthropic({ apiKey: resolved.apiKey })

  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    const message = await withRetry(
      () => c.messages.create({
        model: modelString,
        max_tokens: 4096,
        system: buildSystemPrompt(task.taskType),
        messages: [
          {
            role: 'user',
            content: `${task.prompt}${contextBlock}`,
          },
        ],
      }),
      MODEL_RETRY_OPTIONS
    )

    const output = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')

    const inputTok = message.usage.input_tokens
    const outputTok = message.usage.output_tokens
    const creditCost = resolved.shouldDeductCredits
      ? calculateCreditCost(modelString, inputTok, outputTok)
      : 0

    return {
      model: 'claude',
      output,
      confidence: 0.95,
      flaggedIssues: [],
      tokensUsed: inputTok + outputTok,
      modelString,
      inputTokens: inputTok,
      outputTokens: outputTok,
      creditCost,
      keySource: resolved.source,
    }
  } catch (err: unknown) {
    if (err instanceof MissingApiKeyError) throw err
    console.error('[Claude adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('claude')
    throw new ModelAdapterError(
      `Claude API error: ${(err as Error).message ?? String(err)}`,
      'claude',
      err
    )
  }
}
