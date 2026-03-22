import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getUserUsageStats } from '@/lib/utils/usageLogger'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days = parseInt(
    req.nextUrl.searchParams.get('days') ?? '30'
  )

  try {
    const stats = await getUserUsageStats(
      session.user.id,
      Math.min(Math.max(days, 1), 90)
    )
    return NextResponse.json({ stats }, { status: 200 })
  } catch (err: unknown) {
    console.error('[/api/billing/usage] error:', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (err as any)?.message ?? 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
