import { NextRequest, NextResponse } from 'next/server'
import { stripe, getPlanById, getModelCallsLimit } from '@/lib/stripe'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/models/User'
import type Stripe from 'stripe'

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (err as any)?.message ?? 'Unknown error'
    console.error('[Webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    switch (event.type) {
      // Payment succeeded — upgrade user plan
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId
        if (!userId || !planId) break
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const limit = getModelCallsLimit(planId as any)
        await User.findByIdAndUpdate(userId, {
          plan: planId,
          modelCallsLimit: limit,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        })
        console.log(`[Webhook] User ${userId} upgraded to ${planId}`)
        break
      }

      // Subscription updated (plan change)
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (!userId) break
        const priceId = subscription.items.data[0]?.price?.id
        if (!priceId) break
        const planId = getPlanById(priceId)
        if (!planId) break
        const limit = getModelCallsLimit(planId)
        await User.findByIdAndUpdate(userId, {
          plan: planId,
          modelCallsLimit: limit,
          stripeSubscriptionId: subscription.id,
        })
        console.log(`[Webhook] User ${userId} plan updated to ${planId}`)
        break
      }

      // Subscription cancelled or payment failed — downgrade to free
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object as Stripe.Subscription | Stripe.Invoice
        const userId =
          (obj as Stripe.Subscription).metadata?.userId ??
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any).subscription_details?.metadata?.userId
        if (!userId) break
        await User.findByIdAndUpdate(userId, {
          plan: 'free',
          modelCallsLimit: 50,
          stripeSubscriptionId: null,
        })
        console.log(`[Webhook] User ${userId} downgraded to free`)
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }
  } catch (err: unknown) {
    console.error('[Webhook] Handler error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
