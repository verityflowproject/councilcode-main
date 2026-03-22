import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/models/User'
import type { PlanId } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { planId } = body as { planId: PlanId }

  if (!planId || planId === 'free' || !PLANS[planId]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const plan = PLANS[planId]
  if (!plan.priceId) {
    return NextResponse.json(
      { error: 'Price ID not configured for this plan' },
      { status: 400 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    await connectDB()
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      })
      customerId = customer.id
      await User.findByIdAndUpdate(session.user.id, {
        stripeCustomerId: customer.id,
      })
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/dashboard?cancelled=true`,
      metadata: {
        userId: session.user.id,
        planId,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 })
  } catch (err: unknown) {
    console.error('[/api/billing/checkout] error:', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (err as any)?.message ?? 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
