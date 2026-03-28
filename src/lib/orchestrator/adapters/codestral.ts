import { Mistral } from '@mistralai/mistralai'
import OpenAI from 'openai'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, MissingApiKeyError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'
import { resolveApiKey, OPENROUTER_BASE_URL } from '@/lib/utils/get-model-key'
import { calculateCreditCost } from '@/lib/utils/credit-costs'
import { classifyComplexity, selectModelString } from '../smart-routing'

const OPENROUTER_CODESTRAL_MODEL = 'mistral/codestral-latest'

const SYSTEM_PROMPT = `You are Codestral, the Implementer on an AI engineering team called VerityFlow. Your job is fast, accurate code generation. You write clean, typed, production-ready code. You strictly follow the project conventions and architecture decisions provided in your context. You never invent library methods or APIs — if you are unsure whether a method exists, you leave a TODO comment flagging it for the researcher to verify. Output code only, with minimal prose unless explaining a non-obvious decision.`

export async function runCodestral(task: OrchestratorTask): Promise<ModelResponse> {
  const complexity = classifyComplexity(task.prompt)
  const baseModelString = selectModelString('codestral', complexity)

  let resolved
  try {
    resolved = await resolveApiKey(task.userId, 'mistral')
  } catch (err) {
    throw new MissingApiKeyError('mistral')
  }

  const isOpenRouter = resolved.source === 'byok-openrouter'
  const modelString = isOpenRouter ? OPENROUTER_CODESTRAL_MODEL : baseModelString

  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    let output: string
    let inputTok: number
    let outputTok: number

    if (isOpenRouter) {
      const c = new OpenAI({ apiKey: resolved.apiKey, baseURL: OPENROUTER_BASE_URL })
      const response = await withRetry(
        () => c.chat.completions.create({
          model: modelString,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `${task.prompt}${contextBlock}` },
          ],
          max_tokens: 4096,
          temperature: 0.2,
        }),
        MODEL_RETRY_OPTIONS
      )
      output = response.choices[0]?.message?.content ?? ''
      inputTok = response.usage?.prompt_tokens ?? 0
      outputTok = response.usage?.completion_tokens ?? 0
    } else {
      const c = new Mistral({ apiKey: resolved.apiKey })
      const response = await withRetry(
        () => c.chat.complete({
          model: modelString,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `${task.prompt}${contextBlock}` },
          ],
          maxTokens: 4096,
          temperature: 0.2,
        }),
        MODEL_RETRY_OPTIONS
      )
      const choice = response.choices?.[0]
      output = typeof choice?.message?.content === 'string' ? choice.message.content : ''
      inputTok = response.usage?.promptTokens ?? 0
      outputTok = response.usage?.completionTokens ?? 0
    }

    const creditCost = resolved.shouldDeductCredits
      ? calculateCreditCost(modelString, inputTok, outputTok)
      : 0

    return {
      model: 'codestral',
      output,
      confidence: 0.88,
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
    console.error('[Codestral adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('codestral')
    throw new ModelAdapterError(
      `Codestral API error: ${(err as Error).message ?? String(err)}`,
      'codestral',
      err
    )
  }
}
