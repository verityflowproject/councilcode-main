import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { UserApiKeys } from '@/lib/models/UserApiKeys'
import { encrypt, decrypt } from '@/lib/encryption'
import {
  validateAnthropicKey,
  validateOpenAiKey,
  validateMistralKey,
  validateGoogleAiKey,
  validatePerplexityKey,
} from '@/lib/validate-api-keys'

type KeyType = 'anthropic' | 'openai' | 'mistral' | 'googleAi' | 'perplexity'

const KEY_TYPE_TO_FIELD: Record<KeyType, keyof typeof FIELD_MAP> = {
  anthropic: 'anthropicKey',
  openai: 'openaiKey',
  mistral: 'mistralKey',
  googleAi: 'googleAiKey',
  perplexity: 'perplexityKey',
}

// Used purely for the type reference above — matches IUserApiKeys fields
const FIELD_MAP = {
  anthropicKey: true,
  openaiKey: true,
  mistralKey: true,
  googleAiKey: true,
  perplexityKey: true,
} as const

const VALIDATORS: Record<KeyType, (key: string) => Promise<boolean>> = {
  anthropic: validateAnthropicKey,
  openai: validateOpenAiKey,
  mistral: validateMistralKey,
  googleAi: validateGoogleAiKey,
  perplexity: validatePerplexityKey,
}

function maskKey(decrypted: string): string {
  const last4 = decrypted.slice(-4)
  return `••••••••••••${last4}`
}

function isValidKeyType(value: unknown): value is KeyType {
  return typeof value === 'string' && value in KEY_TYPE_TO_FIELD
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

    if (!doc) {
      return NextResponse.json({}, { status: 200 })
    }

    const fields = ['anthropicKey', 'openaiKey', 'mistralKey', 'googleAiKey', 'perplexityKey'] as const
    const result: Record<string, string | null> = {}

    for (const field of fields) {
      const raw = doc[field]
      result[field] = raw ? maskKey(decrypt(raw)) : null
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/user/api-keys GET] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── POST — validate a key live, encrypt, and upsert ──────────────────────────

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
      { error: 'keyType must be one of: anthropic, openai, mistral, googleAi, perplexity' },
      { status: 400 }
    )
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return NextResponse.json({ error: 'value must be a non-empty string' }, { status: 400 })
  }

  const isValid = await VALIDATORS[keyType](value.trim())
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid or inactive API key' },
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

    return NextResponse.json({ success: true }, { status: 200 })
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
      { error: 'keyType must be one of: anthropic, openai, mistral, googleAi, perplexity' },
      { status: 400 }
    )
  }

  try {
    await connectDB()
    const field = KEY_TYPE_TO_FIELD[keyType]
    await UserApiKeys.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { [field]: null } }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[/api/user/api-keys DELETE] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
