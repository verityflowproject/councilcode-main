import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, MissingApiKeyError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'
import { resolveApiKey, OPENROUTER_BASE_URL } from '@/lib/utils/get-model-key'
import { calculateCreditCost } from '@/lib/utils/credit-costs'
import { classifyComplexity, selectModelString } from '../smart-routing'

const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai'
const OPENROUTER_PERPLEXITY_MODEL = 'perplexity/sonar-pro'

const SYSTEM_PROMPT = `You are Sonar Pro (Perplexity), the Researcher on an AI engineering team called VerityFlow. Your job is real-time factual verification. Before the team writes any code that touches an external API, library, or dependency, you verify: Does this method exist? Is this the current API signature? What is the latest stable version? You return concise, sourced answers. You never guess. If you cannot verify something with confidence, you say so clearly and explain what the team should double-check manually.`

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface PerplexityResponse {
  choices: Array<{
    message: { content: string }
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
  }
}

async function callPerplexityApi(
  apiKey: string,
  baseUrl: string,
  model: string,
  messages: PerplexityMessage[]
): Promise<{ output: string; inputTok: number; outputTok: number }> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 2048,
      temperature: 0.1,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    const err = new Error(`Perplexity API ${response.status}: ${body}`)
    ;(err as NodeJS.ErrnoException).code = response.status === 429 ? 'RATE_LIMIT' : 'API_ERROR'
    throw err
  }

  const data: PerplexityResponse = await response.json()
  const output = data.choices[0]?.message?.content ?? ''
  const inputTok = data.usage?.prompt_tokens ?? 0
  const outputTok = data.usage?.completion_tokens ?? 0
  return { output, inputTok, outputTok }
}

export async function runPerplexity(task: OrchestratorTask): Promise<ModelResponse> {
  const complexity = classifyComplexity(task.prompt)
  const baseModelString = selectModelString('perplexity', complexity)

  let resolved
  try {
    resolved = await resolveApiKey(task.userId, 'perplexity')
  } catch (err) {
    throw new MissingApiKeyError('perplexity')
  }

  const isOpenRouter = resolved.source === 'byok-openrouter'
  const modelString = isOpenRouter ? OPENROUTER_PERPLEXITY_MODEL : baseModelString
  const baseUrl = isOpenRouter ? OPENROUTER_BASE_URL : PERPLEXITY_BASE_URL

  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    const messages: PerplexityMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `${task.prompt}${contextBlock}` },
    ]

    const { output, inputTok, outputTok } = await withRetry(
      () => callPerplexityApi(resolved.apiKey, baseUrl, modelString, messages),
      MODEL_RETRY_OPTIONS
    )

    const creditCost = resolved.shouldDeductCredits
      ? calculateCreditCost(modelString, inputTok, outputTok)
      : 0

    return {
      model: 'perplexity',
      output,
      confidence: 0.93,
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
    console.error('[Perplexity adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('perplexity')
    throw new ModelAdapterError(
      `Perplexity API error: ${(err as Error).message ?? String(err)}`,
      'perplexity',
      err
    )
  }
}
