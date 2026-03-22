'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const MODEL_COLORS: Record<string, string> = {
  Claude:      '#f97316',
  GPT:         '#10b981',
  Codestral:   '#f59e0b',
  Gemini:      '#3b82f6',
  Perplexity:  '#8b5cf6',
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

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            <div className="animate-fade-up delay-100">
              <span
                className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--accent)',
                  background: 'rgba(99,102,241,0.08)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'var(--accent)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }}
                />
                Five models. One codebase.
              </span>
            </div>

            <h1
              className="animate-fade-up delay-200 text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Your AI
              <br />
              <span style={{ color: 'var(--accent)' }}>Engineering</span>
              <br />
              Firm.
            </h1>

            <p
              className="animate-fade-up delay-300 text-lg leading-relaxed max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              CouncilCode deploys five specialized AI models that collaborate as a structured team —
              each with a defined role, reviewing each other&apos;s work, resolving conflicts,
              and shipping code you can actually trust.
            </p>

            <div className="animate-fade-up delay-400 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                }}
              >
                Start building free
                <span>→</span>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-all duration-150 hover:border-accent"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
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
                  <span style={{ color: '#10b981' }}>✓</span>
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Right — live council session panel */}
          <div
            className="animate-fade-in delay-300 rounded-xl border overflow-hidden"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                    <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span
                  className="text-xs font-mono ml-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  council-session-0001
                </span>
              </div>
              <span
                className="text-xs font-mono flex items-center gap-1.5"
                style={{ color: '#10b981' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#10b981',
                    animation: 'pulse-dot 1.5s ease-in-out infinite',
                  }}
                />
                live
              </span>
            </div>

            {/* Prompt */}
            <div
              className="px-4 py-3 border-b font-mono text-xs"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
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
                    animation: 'slide-in-right 0.3s ease forwards',
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
                        className="text-xs font-mono"
                        style={{ color: 'var(--text-muted)' }}
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
                        animation: `pulse-dot 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-3 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex gap-3">
                {Object.entries(MODEL_COLORS).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: color }}
                    />
                    <span
                      className="text-xs font-mono"
                      style={{ color: 'var(--text-muted)' }}
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
