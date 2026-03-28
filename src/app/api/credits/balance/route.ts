import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getUserBalance } from '@/lib/utils/credits'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const balance = await getUserBalance(session.user.id)
    return NextResponse.json(
      {
        balance,
        estimatedSessions: Math.floor(balance / 30),
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/credits/balance] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
