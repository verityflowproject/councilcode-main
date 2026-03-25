'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const MODEL_COLORS: Record<string, string> = {
  Claude:     '#9580FF',
  GPT:        '#34D399',
  Codestral:  '#FBBF24',
  Gemini:     '#60A5FA',
  Perplexity: '#C084FC',
}

const MODEL_ROLES: Record<string, string> = {
  Claude:     'Architect',
  GPT:        'Generalist',
  Codestral:  'Implementer',
  Gemini:     'Refactor',
  Perplexity: 'Researcher',
}

const COUNCIL_MESSAGES = [
  { model: 'Perplexity', text: 'Verifying next-auth@5.0 — confirmed stable, no breaking changes.' },
  { model: 'Claude',     text: 'Schema decision: users table needs plan + usage columns. Flagging for review.' },
  { model: 'Codestral',  text: 'Implementing UserSchema with timestamps and plan enum...' },
  { model: 'GPT',        text: 'Review: approved. Conventions match. No hallucinations detected.' },
  { model: 'Gemini',     text: 'Full codebase sweep complete — naming consistent across 24 files.' },
  { model: 'Claude',     text: 'Architecture locked. Proceeding to API route generation.' },
]

export default function Hero() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev < COUNCIL_MESSAGES.length) return prev + 1
        clearInterval(interval)
        return prev
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const blink = setInterval(() => setCursor((c) => !c), 530)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up, .section-fade').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '160px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
        overflow: 'hidden',
        textAlign: 'center',
        background: `
          radial-gradient(ellipse 900px 600px at 50% -100px, rgba(67,97,238,0.18), transparent 70%),
          radial-gradient(ellipse 400px 300px at 80% 20%, rgba(6,182,212,0.06), transparent 60%)
        `,
      }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        {/* Eyebrow badge */}
        <div className="animate-fade-up delay-100" style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-default)',
              borderRadius: '100px',
              padding: '6px 16px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            Lab
            <span style={{ color: 'var(--accent-blue)' }}>·</span>
            Field Data
            <span style={{ color: 'var(--accent-blue)' }}>·</span>
            AI Council
            <span style={{ color: 'var(--accent-blue)' }}>·</span>
            Zero Hallucinations
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(60px, 8vw, 104px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            maxWidth: '800px',
            margin: '0 auto 20px',
            textAlign: 'center',
          }}
        >
          <span className="animate-word delay-100" style={{ marginRight: '0.22em' }}>Your</span>
          <span className="animate-word delay-160" style={{ marginRight: '0.22em' }}>AI</span>
          <span
            className="animate-word delay-240 gradient-shift"
            style={{
              marginRight: '0.22em',
              background: 'linear-gradient(90deg, #4361EE 0%, #06B6D4 25%, #9580FF 50%, #4361EE 75%, #06B6D4 100%)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 28px rgba(67,97,238,0.55))',
            }}
          >
            Engineering
          </span>
          <span className="animate-word delay-320">Firm.</span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-up delay-300"
          style={{
            fontSize: '22px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            maxWidth: '600px',
            margin: '0 auto 48px',
            textAlign: 'center',
            lineHeight: 1.7,
          }}
        >
          VerityFlow deploys <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>five specialized AI models</strong>{' '}that
          collaborate as a structured team — reviewing each other&apos;s work, resolving conflicts,
          and shipping code you can <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>actually trust</strong>.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent-blue)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 0 0 1px rgba(67,97,238,0.6), 0 0 80px rgba(67,97,238,0.3)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)'
            }}
          >
            Start building free
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href="#how-it-works"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 28px',
              color: 'var(--text-secondary)',
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--border-strong)'
              el.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--border-default)'
              el.style.color = 'var(--text-secondary)'
            }}
          >
            See how it works
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        {/* BYOK trust badge */}
        <div className="animate-fade-up delay-450" style={{ textAlign: 'center', marginBottom: '12px' }}>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            🔑 Bring your own keys — no API markup
          </span>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-up delay-500" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '0' }}>
          {[
            'Zero hallucinations',
            'Context never drifts',
            'Every line reviewed',
            'Bring your own keys',
          ].map((signal) => (
            <span
              key={signal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: 'var(--accent-green)' }}>✓</span>
              {signal}
            </span>
          ))}
        </div>
      </div>

      {/* Terminal panel */}
      <div
        className="animate-fade-in delay-500"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '760px',
          marginTop: '64px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card), var(--shadow-glow-blue)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          </div>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            council-session-0001
          </span>
          <span
            style={{
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-green)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
                animation: 'glow-pulse 1.5s ease-in-out infinite',
              }}
            />
            live
          </span>
        </div>

        {/* Prompt */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>› </span>
          Build a full-stack SaaS with auth, billing, and user dashboard
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '14px',
              marginLeft: '2px',
              verticalAlign: 'middle',
              borderRadius: '2px',
              background: 'var(--accent-blue)',
              opacity: cursor ? 0.7 : 0,
              transition: 'opacity 0.1s',
            }}
          />
        </div>

        {/* Messages */}
        <div style={{ padding: '20px', minHeight: '300px', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {COUNCIL_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  animation: 'typewriter-line 0.3s ease forwards',
                  animationDelay: `${i * 150}ms`,
                  opacity: 0,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    marginTop: '5px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: MODEL_COLORS[msg.model],
                    boxShadow: `0 0 8px ${MODEL_COLORS[msg.model]}40`,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {msg.model}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {MODEL_ROLES[msg.model]}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
            {visibleMessages < COUNCIL_MESSAGES.length && (
              <div style={{ display: 'flex', gap: '6px', paddingLeft: '18px', paddingTop: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--text-muted)',
                      animation: 'glow-pulse 1.2s ease-in-out infinite',
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
