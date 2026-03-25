import Stripe from 'stripe'

/**
 * Lazy singleton — defers Stripe client creation to first use at request time.
 * This lets the module be imported during the Next.js build without STRIPE_SECRET_KEY
 * being present in the build environment.
 */
let _instance: Stripe | null = null

function getInstance(): Stripe {
  if (_instance) return _instance
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  _instance = new Stripe(key, { apiVersion: '2026-02-25.clover', typescript: true })
  return _instance
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// Plan definitions — create these products in your Stripe dashboard
// then paste the price IDs into .env.local
export const PLANS = {
  free: {
    name: 'Free',
    modelCallsLimit: 50,
    priceId: null, // no Stripe price — free tier
  },
  pro: {
    name: 'Pro',
    modelCallsLimit: 2000,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
  },
  teams: {
    name: 'Teams',
    modelCallsLimit: 10000,
    priceId: process.env.STRIPE_TEAMS_PRICE_ID ?? '',
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanById(priceId: string): PlanId | null {
  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.priceId && plan.priceId === priceId) {
      return planId as PlanId
    }
  }
  return null
}

export function getModelCallsLimit(plan: PlanId): number {
  return PLANS[plan].modelCallsLimit
}
