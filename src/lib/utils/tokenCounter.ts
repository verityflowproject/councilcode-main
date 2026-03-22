// Lightweight token estimator — avoids importing tiktoken in the edge runtime.
// Approximation: 1 token ≈ 4 characters for English/code content.
// Use for budget checks and routing decisions only, not billing.

const CHARS_PER_TOKEN = 4

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

export function estimateTokensForState(state: object): number {
  return estimateTokens(JSON.stringify(state))
}

// Model context limits (conservative — leave headroom for output)
export const MODEL_CONTEXT_LIMITS: Record<string, number> = {
  claude: 150_000,
  gpt4o: 100_000,
  codestral: 30_000,
  gemini: 900_000,
  perplexity: 100_000,
}

// Returns true if the state slice fits safely in the model's context
export function stateFitsInContext(
  stateSlice: object,
  model: string,
  taskPrompt: string
): boolean {
  const stateTokens = estimateTokensForState(stateSlice)
  const promptTokens = estimateTokens(taskPrompt)
  const total = stateTokens + promptTokens
  const limit = MODEL_CONTEXT_LIMITS[model] ?? 50_000
  return total < limit * 0.75 // use max 75% of context for input
}
