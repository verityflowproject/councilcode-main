'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

// ── Request type definitions ─────────────────────────────────────────────────
type RequestTypeId = 'feature' | 'bug' | 'feedback' | 'business'

interface RequestType {
  id: RequestTypeId
  icon: string
  title: string
  tagline: string
  description: string
  color: string
  extraField?: { label: string; placeholder: string }
}

const REQUEST_TYPES: RequestType[] = [
  {
    id: 'feature',
    icon: '✦',
    title: 'Feature Request',
    tagline: 'Shape what we build next',
    description:
      'Have an idea that would make VerityFlow better? Every feature on our roadmap started as a user request. Submit yours — we read each one and follow up directly.',
    color: '#9580FF',
    extraField: {
      label: 'What problem does this solve?',
      placeholder: 'Describe the workflow or friction point this would address (optional)',
    },
  },
  {
    id: 'bug',
    icon: '⚠',
    title: 'Bug Report',
    tagline: 'Something not behaving right',
    description:
      'Something broken or working unexpectedly? Tell us exactly what happened — what you expected, what occurred, and any steps to reproduce. We prioritize reported bugs fast.',
    color: '#EF4444',
    extraField: {
      label: 'Steps to reproduce',
      placeholder: '1. Go to... 2. Click... 3. See error... (optional but helpful)',
    },
  },
  {
    id: 'feedback',
    icon: '◎',
    title: 'General Feedback',
    tagline: 'Tell us what you think',
    description:
      "Thoughts on the product, the experience, the pricing, or anything else — we read every message. Honest feedback, even critical feedback, is what makes VerityFlow better.",
    color: '#34D399',
  },
  {
    id: 'business',
    icon: '↗',
    title: 'Business & Partnerships',
    tagline: 'Enterprise, press, or integrations',
    description:
      'Press inquiries, enterprise agreements, integration partnerships, or white-label discussions. Reach us here and we will respond within one business day.',
    color: '#60A5FA',
  },
]

// ── Input / Textarea styles ───────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  padding: '11px 14px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
}

// ── Form component (reads ?type= from URL) ────────────────────────────────────
function ContactForm() {
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as RequestTypeId) ?? null

  const [selected, setSelected] = useState<RequestTypeId | null>(initialType)
  const [mounted, setMounted] = useState(false)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [extra, setExtra]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const formRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // scroll form into view on type select
  useEffect(() => {
    if (selected && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 120)
    }
  }, [selected])

  const selectedType = REQUEST_TYPES.find((t) => t.id === selected)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !name.trim() || !email.trim() || !message.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected, name, email, message, extra }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === field ? 'rgba(67,97,238,0.55)' : 'var(--border-subtle)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(67,97,238,0.08)' : 'none',
  })

  return (
    <>
      {/* ── Type selector cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '48px',
        }}
      >
        {REQUEST_TYPES.map((type, i) => {
          const isSelected = selected === type.id
          const isDimmed   = selected !== null && !isSelected
          return (
            <button
              key={type.id}
              onClick={() => setSelected(isSelected ? null : type.id)}
              style={{
                textAlign: 'left',
                background: isSelected ? `rgba(${hexToRgb(type.color)},0.08)` : 'var(--bg-surface)',
                border: `1px solid ${isSelected ? type.color + '55' : 'var(--border-subtle)'}`,
                borderRadius: '14px',
                padding: '22px 20px',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                opacity: isDimmed ? 0.45 : 1,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 24px ${type.color}22` : 'none',
                animation: mounted ? `fadeInUp 0.35s ease both` : 'none',
                animationDelay: `${i * 70}ms`,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = type.color + '44'
                  el.style.background = `rgba(${hexToRgb(type.color)},0.05)`
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = 'var(--border-subtle)'
                  el.style.background = 'var(--bg-surface)'
                }
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px',
                  background: `rgba(${hexToRgb(type.color)},0.12)`,
                  border: `1px solid ${type.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  color: type.color,
                  marginBottom: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}
              >
                {type.icon}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: isSelected ? type.color : 'var(--text-primary)',
                  marginBottom: '4px',
                  transition: 'color 0.2s',
                }}
              >
                {type.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: isSelected ? type.color + 'cc' : 'var(--text-muted)',
                  letterSpacing: '0.04em',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
              >
                {type.tagline}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {type.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Form panel ── */}
      {selected && !submitted && (
        <div
          ref={formRef}
          style={{
            background: 'var(--bg-surface)',
            border: `1px solid ${selectedType!.color}33`,
            borderRadius: '16px',
            padding: '36px 40px',
            animation: 'formSlideIn 0.3s ease forwards',
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          {/* Form header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px', color: selectedType!.color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {selectedType!.icon}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                {selectedType!.title}
              </h2>
            </div>
            {selected === 'feature' && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                We build based on what users ask for. Your suggestion could be the next thing we ship.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your name"
                  required
                  style={fieldStyle('name')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  required
                  style={fieldStyle('email')}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                MESSAGE
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="Tell us what's on your mind..."
                required
                rows={5}
                style={{
                  ...fieldStyle('message'),
                  resize: 'vertical',
                  minHeight: '120px',
                }}
              />
            </div>

            {/* Type-specific extra field */}
            {selectedType?.extraField && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  {selectedType.extraField.label.toUpperCase()}
                </label>
                <textarea
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  onFocus={() => setFocusedField('extra')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={selectedType.extraField.placeholder}
                  rows={3}
                  style={{
                    ...fieldStyle('extra'),
                    resize: 'vertical',
                    minHeight: '80px',
                  }}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p style={{ fontSize: '13px', color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '4px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                We reply to every message personally.
              </p>
              <button
                type="submit"
                disabled={submitting || !name.trim() || !email.trim() || !message.trim()}
                style={{
                  background: submitting ? 'rgba(67,97,238,0.6)' : 'var(--accent-blue)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.18s ease',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: (!name.trim() || !email.trim() || !message.trim()) ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = '#3251d4'
                    el.style.boxShadow = '0 0 20px rgba(67,97,238,0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'var(--accent-blue)'
                  el.style.boxShadow = 'none'
                }}
              >
                {submitting ? (
                  <>
                    <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Sending…
                  </>
                ) : (
                  'Send message →'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Success state ── */}
      {submitted && (
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            textAlign: 'center',
            animation: 'fadeInUp 0.4s ease forwards',
            padding: '48px 40px',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(52,211,153,0.3)',
            borderRadius: '16px',
          }}
        >
          {/* Animated checkmark circle */}
          <div
            style={{
              width: '56px', height: '56px',
              borderRadius: '50%',
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '22px',
              animation: 'successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            ✓
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}
          >
            Sent. We&apos;ll be in touch.
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
            {selected === 'feature'
              ? "Your feature request is logged. If it's something we build, you'll hear from us directly."
              : selected === 'bug'
              ? "Bug received. We'll investigate and follow up — usually within 24 hours."
              : "Message received. We read and reply to everything personally."}
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelected(null); setName(''); setEmail(''); setMessage(''); setExtra('') }}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '7px',
              padding: '8px 18px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          >
            Send another message
          </button>
        </div>
      )}
    </>
  )
}

// ── Helper: convert hex to rgb components ────────────────────────────────────
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '67,97,238'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Keyframe injections */}
      <style>{`
        @keyframes formSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPop {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          paddingTop: '140px',
          paddingBottom: '72px',
          paddingLeft: '40px',
          paddingRight: '40px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 700px 400px at 50% -40px, rgba(67,97,238,0.14), transparent 70%)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--accent-blue)',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Talk to us
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            lineHeight: 1.0,
            marginBottom: '20px',
          }}
        >
          We build what{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #9580FF, #4361EE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            you ask for.
          </span>
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            maxWidth: '520px',
            margin: '0 auto 12px',
            lineHeight: 1.7,
          }}
        >
          Every feature on our roadmap started as a user request. Whether it&apos;s an idea, a bug, or just a thought —
          we read everything and follow up directly.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '40px',
          }}
        >
          Pick a category below to get started.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none',
            fontFamily: 'var(--font-mono)', transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
        >
          ← Back to homepage
        </Link>
      </section>

      {/* Content */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 40px 120px',
        }}
      >
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
