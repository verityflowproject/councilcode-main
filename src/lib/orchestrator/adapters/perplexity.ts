import type { OrchestratorTask, ModelResponse } from '@/types'
import { withRetry, MODEL_RETRY_OPTIONS } from '@/lib/utils/retry'
import { ModelAdapterError, RateLimitError, isRateLimitError } from '@/lib/utils/errors'

const MODEL = 'sonar-pro'
const API_URL = 'https://api.perplexity.ai/chat/completions'

const SYSTEM_PROMPT = `You are Sonar Pro, the Researcher on an AI engineering team called CouncilCode. Your job is to verify all external dependencies, library APIs, and package versions before any code is written. You have real-time web access. You never guess — every claim you make is grounded in current documentation. If you cannot verify something, you say so explicitly. Always return structured JSON in this exact format:
{
  "verified": [{ "package": string, "version": string, "notes": string }],
  "warnings": [{ "package": string, "issue": string }],
  "unverified": string[]
}
Do not include any text outside the JSON object.`

export async function runPerplexity(task: OrchestratorTask): Promise<ModelResponse> {
  try {
    const contextBlock = Object.keys(task.context).length > 0
      ? `\n\n--- Project dependencies context ---\n${JSON.stringify(task.context.dependencies ?? {}, null, 2)}`
      : ''

    const response = await withRetry(
      async () => {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
            max_tokens: 2048,
            temperature: 0.1, // near-deterministic for factual research
            return_citations: true,
          }),
        })
        if (!res.ok) {
          const errorText = await res.text()
          const err = new Error(`Perplexity API ${res.status}: ${errorText}`) as Error & { status: number }
          err.status = res.status
          throw err
        }
        return res
      },
      MODEL_RETRY_OPTIONS
    )

    const data = await response.json()
    const output = data.choices?.[0]?.message?.content ?? ''
    const tokensUsed =
      (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0)

    // Parse warnings from the structured JSON response
    let flaggedIssues: string[] = []
    try {
      const parsed = JSON.parse(output)
      if (Array.isArray(parsed.warnings)) {
        flaggedIssues = parsed.warnings.map(
          (w: { package: string; issue: string }) => `${w.package}: ${w.issue}`
        )
      }
      if (Array.isArray(parsed.unverified) && parsed.unverified.length > 0) {
        flaggedIssues.push(`Unverified: ${parsed.unverified.join(', ')}`)
      }
    } catch {
      // Output wasn't valid JSON — flag it
      flaggedIssues = ['Perplexity response was not valid JSON — manual review required']
    }

    return {
      model: 'perplexity',
      output,
      confidence: 0.97, // highest confidence — grounded in live web data
      flaggedIssues,
      tokensUsed,
    }
  } catch (err: unknown) {
    console.error('[Perplexity adapter] error:', err)
    if (isRateLimitError(err)) throw new RateLimitError('perplexity')
    throw new ModelAdapterError(
      `Perplexity API error: ${(err as Error).message ?? String(err)}`,
      'perplexity',
      err
    )
  }
}
