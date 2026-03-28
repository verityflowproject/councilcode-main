import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getTransactionHistory } from '@/lib/utils/credits'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const transactions = await getTransactionHistory(session.user.id, 20)
    return NextResponse.json({ transactions }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/credits/history] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
