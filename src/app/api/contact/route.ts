import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import mongoose, { Document, Schema } from 'mongoose'

// ── ContactSubmission model (defined inline — no separate file needed) ────────
interface IContactSubmission extends Document {
  type: 'feature' | 'bug' | 'feedback' | 'business'
  name: string
  email: string
  message: string
  extra?: string
  createdAt: Date
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    type:    { type: String, enum: ['feature', 'bug', 'feedback', 'business'], required: true },
    name:    { type: String, required: true, trim: true, maxlength: 200 },
    email:   { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    extra:   { type: String, trim: true, maxlength: 3000 },
  },
  { timestamps: true }
)

const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema)

// ── POST /api/contact ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, name, email, message, extra } = body

    const VALID_TYPES = ['feature', 'bug', 'feedback', 'business']
    if (!VALID_TYPES.includes(type))
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    if (!name?.trim() || !email?.trim() || !message?.trim())
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    await connectDB()
    await ContactSubmission.create({ type, name: name.trim(), email: email.trim(), message: message.trim(), extra: extra?.trim() || undefined })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
