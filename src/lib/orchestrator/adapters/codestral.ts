import { Mistral } from '@mistralai/mistralai'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
})

const MODEL = 'codestral-latest'

const SYSTEM_PROMPT = `You are Codestral, the Implementer on an AI engineering team called CouncilCode. Your job is fast, accurate code generation. You write clean, typed, production-ready code. You strictly follow the project conventions and architecture decisions provided in your context. You never invent library methods or APIs — if you are unsure whether a method exists, you leave a TODO comment flagging it for the researcher to verify. Output code only, with minimal prose unless explaining a non-obvious decision.`

export async function runCodestral(task: OrchestratorTask): Promise<ModelResponse> {
  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    const response = await withRetry(
      () => client.chat.complete({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `${task.prompt}${contextBlock}`,
          },
        ],
        maxTokens: 4096,
        temperature: 0.2, // low temperature for consistent, deterministic code
      }),
      MODEL_RETRY_OPTIONS
    )

    const choice = response.choices?.[0]
    const output = typeof choice?.message?.content === 'string'
      ? choice.message.content
      : ''

    const tokensUsed = (response.usage?.promptTokens ?? 0) + (response.usage?.completionTokens ?? 0)

    return {
      model: 'codestral',
      output,
      confidence: 0.88,
      flaggedIssues: [],
      tokensUsed,
    }
  } catch (err: unknown) {
    console.error('[Codestral adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('codestral')
    throw new ModelAdapterError(
      `Codestral API error: ${(err as Error).message ?? String(err)}`,
      'codestral',
      err
    )
  }
}
