export const runtime = 'nodejs'

// Called monthly by a cron job (e.g. Vercel Cron) to reset modelCallsUsed
// Protect with a secret header so only your cron can call it
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const result = await User.updateMany(
      {},
      { $set: { modelCallsUsed: 0 } }
    )
    console.log(`[reset-usage] Reset usage for ${result.modifiedCount} users`)
    return NextResponse.json(
      {
        success: true,
        usersReset: result.modifiedCount,
        resetAt: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    console.error('[reset-usage] error:', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (err as any)?.message ?? 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
