import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, MissingApiKeyError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'
import { resolveApiKey, OPENROUTER_BASE_URL } from '@/lib/utils/get-model-key'
import { calculateCreditCost } from '@/lib/utils/credit-costs'
import { classifyComplexity, selectModelString } from '../smart-routing'

// Gemini model name used via OpenRouter
const OPENROUTER_GEMINI_MODEL = 'google/gemini-pro-1.5'

const SYSTEM_PROMPT = `You are Gemini, the Refactor specialist on an AI engineering team called VerityFlow. You have full-codebase context and your job is consistency enforcement — finding naming drift, architectural violations, redundant patterns, and dead code. You also handle large-scale refactors that require understanding the whole system, not just a single file. Be specific and precise. Reference actual file names and line-level patterns when you flag issues.`

export async function runGemini(task: OrchestratorTask): Promise<ModelResponse> {
  const complexity = classifyComplexity(task.prompt)
  const baseModelString = selectModelString('gemini', complexity)

  let resolved
  try {
    resolved = await resolveApiKey(task.userId, 'google')
  } catch (err) {
    throw new MissingApiKeyError('google')
  }

  const isOpenRouter = resolved.source === 'byok-openrouter'
  const modelString = isOpenRouter ? OPENROUTER_GEMINI_MODEL : baseModelString

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
          max_tokens: 8192,
        }),
        MODEL_RETRY_OPTIONS
      )
      output = response.choices[0]?.message?.content ?? ''
      inputTok = response.usage?.prompt_tokens ?? 0
      outputTok = response.usage?.completion_tokens ?? 0
    } else {
      const genAI = new GoogleGenerativeAI(resolved.apiKey)
      const model = genAI.getGenerativeModel({
        model: modelString,
        systemInstruction: SYSTEM_PROMPT,
      })

      const result = await withRetry(
        () => model.generateContent(`${task.prompt}${contextBlock}`),
        MODEL_RETRY_OPTIONS
      )
      output = result.response.text()
      inputTok = result.response.usageMetadata?.promptTokenCount ?? 0
      outputTok = result.response.usageMetadata?.candidatesTokenCount ?? 0
    }

    const creditCost = resolved.shouldDeductCredits
      ? calculateCreditCost(modelString, inputTok, outputTok)
      : 0

    return {
      model: 'gemini',
      output,
      confidence: 0.90,
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
    console.error('[Gemini adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('gemini')
    throw new ModelAdapterError(
      `Gemini API error: ${(err as Error).message ?? String(err)}`,
      'gemini',
      err
    )
  }
}
