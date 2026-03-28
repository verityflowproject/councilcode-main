import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { UserApiKeys } from '@/lib/models/UserApiKeys'
import { encrypt, decrypt } from '@/lib/utils/encryption'

type KeyType =
  | 'anthropic'
  | 'openai'
  | 'mistral'
  | 'googleAi'
  | 'perplexity'
  | 'openrouter'

const KEY_TYPE_TO_FIELD: Record<KeyType, string> = {
  anthropic:  'anthropicKey',
  openai:     'openaiKey',
  mistral:    'mistralKey',
  googleAi:   'googleAiKey',
  perplexity: 'perplexityKey',
  openrouter: 'openrouterKey',
}

const ALLOWED_KEY_TYPES = new Set<string>(Object.keys(KEY_TYPE_TO_FIELD))

const ALL_FIELDS = [
  'anthropicKey',
  'openaiKey',
  'mistralKey',
  'googleAiKey',
  'perplexityKey',
  'openrouterKey',
] as const

function maskKey(decrypted: string): string {
  const last4 = decrypted.slice(-4)
  return `••••••••••••${last4}`
}

function isValidKeyType(value: unknown): value is KeyType {
  return typeof value === 'string' && ALLOWED_KEY_TYPES.has(value)
}

// ── GET — return masked key values for the current user ──────────────────────

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const doc = await UserApiKeys.findOne({ userId: session.user.id }).lean()

    const result: Record<string, string | null> = {}
    let hasAnyKey = false

    for (const field of ALL_FIELDS) {
      const raw = doc?.[field] as string | undefined
      if (raw) {
        result[field] = maskKey(decrypt(raw))
        hasAnyKey = true
      } else {
        result[field] = null
      }
    }

    return NextResponse.json({ ...result, hasAnyKey }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/user/api-keys GET] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── POST — validate format, encrypt, and upsert ───────────────────────────────

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

  const { keyType, value } = body as { keyType: unknown; value: unknown }

  if (!isValidKeyType(keyType)) {
    return NextResponse.json(
      {
        error:
          'keyType must be one of: anthropic, openai, mistral, googleAi, perplexity, openrouter',
      },
      { status: 400 }
    )
  }

  if (typeof value !== 'string' || value.trim().length < 10) {
    return NextResponse.json(
      { error: 'Invalid key format — key must be at least 10 characters' },
      { status: 400 }
    )
  }

  try {
    await connectDB()
    const field = KEY_TYPE_TO_FIELD[keyType]
    await UserApiKeys.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { [field]: encrypt(value.trim()) } },
      { upsert: true, new: true }
    )

    const masked = maskKey(value.trim())
    return NextResponse.json({ success: true, masked }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/user/api-keys POST] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── DELETE — set a single key field to null ───────────────────────────────────

export async function DELETE(req: NextRequest) {
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

  const { keyType } = body as { keyType: unknown }

  if (!isValidKeyType(keyType)) {
    return NextResponse.json(
      {
        error:
          'keyType must be one of: anthropic, openai, mistral, googleAi, perplexity, openrouter',
      },
      { status: 400 }
    )
  }

  try {
    await connectDB()
    const field = KEY_TYPE_TO_FIELD[keyType]
    await UserApiKeys.findOneAndUpdate(
      { userId: session.user.id },
      { $unset: { [field]: '' } }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/user/api-keys DELETE] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
