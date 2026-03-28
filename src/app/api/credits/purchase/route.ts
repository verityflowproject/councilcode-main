import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CREDIT_PACKAGES } from '@/lib/utils/credit-costs'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { packageId } = body as { packageId?: string }

  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId)
  if (!pkg) {
    return NextResponse.json(
      { error: 'Invalid packageId. Must be one of: starter, builder, pro, studio' },
      { status: 400 }
    )
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: pkg.priceCents,
            product_data: {
              name: `VerityFlow ${pkg.label} — ${pkg.credits} Credits`,
              description: pkg.approxSessions,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/credits?success=true`,
      cancel_url: `${appUrl}/dashboard/credits?cancelled=true`,
      metadata: {
        userId: session.user.id,
        packageId: pkg.id,
        credits: pkg.credits.toString(),
      },
      customer_email: session.user.email ?? undefined,
    })

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/credits/purchase] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
