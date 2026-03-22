import { GoogleGenerativeAI } from '@google/generative-ai'
import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

const MODEL = 'gemini-3.1-pro-preview'

const SYSTEM_PROMPT = `You are Gemini, the Refactor specialist on an AI engineering team called CouncilCode. Your unique strength is your massive context window — you receive the full project state and are responsible for full-codebase consistency sweeps, refactoring for clarity and convention adherence, and catching drift between different parts of the codebase. You reason over the entire project before making any suggestion. You never break existing functionality — if a refactor carries risk, you flag it explicitly as a warning comment in your output.`

export async function runGemini(task: OrchestratorTask): Promise<ModelResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_PROMPT,
    })

    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Full project context ---\n${JSON.stringify(task.context, null, 2)}`
      : ''

    const result = await withRetry(
      () => model.generateContent(`${task.prompt}${contextBlock}`),
      MODEL_RETRY_OPTIONS
    )
    const response = result.response
    const output = response.text()

    const tokensUsed =
      (response.usageMetadata?.promptTokenCount ?? 0) +
      (response.usageMetadata?.candidatesTokenCount ?? 0)

    return {
      model: 'gemini',
      output,
      confidence: 0.9,
      flaggedIssues: [],
      tokensUsed,
    }
  } catch (err: unknown) {
    console.error('[Gemini adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('gemini')
    throw new ModelAdapterError(
      `Gemini API error: ${(err as Error).message ?? String(err)}`,
      'gemini',
      err
    )
  }
}
