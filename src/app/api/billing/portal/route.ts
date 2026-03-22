import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/models/User'

export async function POST(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    await connectDB()
    const user = await User.findById(session.user.id)
    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please upgrade first.' },
        { status: 400 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url }, { status: 200 })
  } catch (err: unknown) {
    console.error('[/api/billing/portal] error:', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (err as any)?.message ?? 'Portal session failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
