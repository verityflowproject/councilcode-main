import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
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
