// Credit costs are at SELL PRICE (already includes ~2x margin over provider cost).
// 1 credit = $0.01 at sell price. Provider real cost is ~half this.

export const CREDIT_COSTS_PER_1K_TOKENS: Record<
  string,
  { input: number; output: number }
> = {
  // Full models — used for complex tasks
  'claude-opus-4-6':        { input: 3,    output: 15   },
  'gpt-5.4':                { input: 5,    output: 20   },
  'codestral-latest':       { input: 0.6,  output: 1.8  },
  'gemini-3.1-pro-preview': { input: 2.5,  output: 7.5  },
  'sonar-pro':              { input: 3,    output: 3    },
  // Cheap routing variants — used for simple tasks
  'claude-haiku-3-5':       { input: 0.08, output: 0.4  },
  'gpt-4o-mini':            { input: 0.06, output: 0.24 },
  'gemini-1.5-flash':       { input: 0.04, output: 0.12 },
  'sonar':                  { input: 0.6,  output: 0.6  },
}

/**
 * Calculates the credit cost for a single model call.
 * Returns a minimum of 1 credit.
 */
export function calculateCreditCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = CREDIT_COSTS_PER_1K_TOKENS[model]
  if (!costs) return 5 // safe fallback for unknown models
  const raw =
    (inputTokens / 1000) * costs.input + (outputTokens / 1000) * costs.output
  return Math.max(1, Math.ceil(raw))
}

export const CREDIT_PACKAGES = [
  {
    id: 'starter',
    credits: 500,
    priceCents: 500,
    label: 'Starter',
    approxSessions: '~15 sessions',
  },
  {
    id: 'builder',
    credits: 1200,
    priceCents: 1000,
    label: 'Builder',
    approxSessions: '~35 sessions',
    bonusCredits: 200,
  },
  {
    id: 'pro',
    credits: 3000,
    priceCents: 2000,
    label: 'Pro Pack',
    approxSessions: '~90 sessions',
    bonusCredits: 500,
    bestValue: true,
  },
  {
    id: 'studio',
    credits: 8000,
    priceCents: 4000,
    label: 'Studio',
    approxSessions: '~240 sessions',
    bonusCredits: 1333,
  },
] as const

export type CreditPackageId = (typeof CREDIT_PACKAGES)[number]['id']
