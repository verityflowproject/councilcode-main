'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const MODEL_COLORS: Record<string, string> = {
  Claude:      '#4F6EF7',
  GPT:         '#10B981',
  Codestral:   '#F59E0B',
  Gemini:      '#3B82F6',
  Perplexity:  '#8B5CF6',
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
  const [ctaGlow, setCtaGlow] = useState(false)

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

  // Global scroll-fade observer — drives .section-fade elements across the page
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
      { threshold: 0.12 }
    )
    const targets = document.querySelectorAll('.section-fade')
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(79,110,247,0.15), transparent)',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            <div className="animate-fade-up delay-100">
              <span
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: 'rgba(79,110,247,0.3)',
                  color: 'var(--accent)',
                  background: 'rgba(79,110,247,0.08)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'var(--accent)',
                    animation: 'glow-pulse 2s ease-in-out infinite',
                  }}
                />
                Five models. One codebase.
              </span>
            </div>

            <h1
              className="font-bold leading-[1.05]"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 7vw, 80px)',
                letterSpacing: '-0.03em',
              }}
            >
              <span className="animate-word delay-100" style={{ marginRight: '0.25em' }}>Your</span>
              <span className="animate-word delay-160" style={{ marginRight: '0.25em' }}>AI</span>
              <br />
              <span
                className="animate-word delay-240"
                style={{ color: 'var(--accent)', marginRight: '0.25em' }}
              >
                Engineering
              </span>
              <br />
              <span className="animate-word delay-320">Firm.</span>
            </h1>

            <p
              className="animate-fade-up delay-300 text-lg max-w-md"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
            >
              CouncilCode deploys five specialized AI models that collaborate as a structured team —
              each with a defined role, reviewing each other&apos;s work, resolving conflicts,
              and shipping code you can actually trust.
            </p>

            <div className="animate-fade-up delay-400 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  boxShadow: ctaGlow ? '0 0 20px rgba(79,110,247,0.4), 0 0 40px rgba(79,110,247,0.2)' : 'none',
                  transition: 'box-shadow 0.2s ease, opacity 0.15s ease',
                }}
                onMouseEnter={() => setCtaGlow(true)}
                onMouseLeave={() => setCtaGlow(false)}
              >
                Start building free
                <span>→</span>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-all duration-150"
                style={{
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                See how it works
              </Link>
            </div>

            {/* Trust signals */}
            <div className="animate-fade-up delay-500 flex flex-wrap gap-6 pt-2">
              {[
                'Zero hallucinations',
                'Context never drifts',
                'Every line reviewed',
              ].map((signal) => (
                <span
                  key={signal}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span style={{ color: '#10B981' }}>✓</span>
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Right — live council session panel */}
          <div
            className="animate-fade-in delay-300 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '16px',
            }}
          >
            {/* Panel header — macOS chrome */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                    <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span
                  className="text-xs ml-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  council-session-0001
                </span>
              </div>
              <span
                className="text-xs flex items-center gap-1.5"
                style={{ color: '#10B981', fontFamily: 'var(--font-mono)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#10B981',
                    animation: 'glow-pulse 1.5s ease-in-out infinite',
                  }}
                />
                live
              </span>
            </div>

            {/* Prompt line */}
            <div
              className="px-4 py-3 border-b text-xs"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>prompt › </span>
              Build a full-stack SaaS with auth, billing, and user dashboard
              <span
                className="inline-block w-2 h-3.5 ml-0.5 align-middle"
                style={{
                  background: 'var(--accent)',
                  opacity: cursor ? 1 : 0,
                  transition: 'opacity 0.1s',
                }}
              />
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3 min-h-[320px]">
              {COUNCIL_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start"
                  style={{
                    animation: 'typewriter-line 0.3s ease forwards',
                    animationDelay: `${i * 200}ms`,
                    opacity: 0,
                  }}
                >
                  <div
                    className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full"
                    style={{
                      background: MODEL_COLORS[msg.model],
                      boxShadow: `0 0 6px ${MODEL_COLORS[msg.model]}`,
                    }}
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: MODEL_COLORS[msg.model] }}
                      >
                        {msg.model}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                      >
                        {MODEL_ROLES[msg.model]}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              {visibleMessages < COUNCIL_MESSAGES.length && (
                <div className="flex gap-1.5 pl-5 pt-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{
                        background: 'var(--text-muted)',
                        animation: `glow-pulse 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Panel footer — model legend */}
            <div
              className="px-4 py-3 border-t flex items-center"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex flex-wrap gap-3">
                {Object.entries(MODEL_COLORS).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: color }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
