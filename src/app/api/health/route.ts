import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import redis from '@/lib/db/redis'

export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {}

  // MongoDB check
  try {
    await connectDB()
    checks.mongodb = 'ok'
  } catch {
    checks.mongodb = 'error'
  }

  // Redis check
  try {
    await redis.ping()
    checks.redis = 'ok'
  } catch {
    checks.redis = 'error'
  }

  const allOk = Object.values(checks).every((v) => v === 'ok')
  const status = allOk ? 200 : 503

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}
