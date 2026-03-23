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
      { threshold: 0.1 }
    )
    const targets = document.querySelectorAll('.section-fade')
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-20 overflow-hidden text-center"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />
      {/* Very faint radial warmth — neutral, no color */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '480px',
          background: 'radial-gradient(ellipse 900px 480px at 50% 0%, rgba(255,255,255,0.04), transparent)',
        }}
      />

      {/* Copy */}
      <div className="relative w-full" style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Eyebrow */}
        <div className="animate-fade-up delay-100 flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.06em',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#34D399',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
            Five models. One codebase.
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-bold leading-[1.06] mb-6"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 6vw, 72px)',
            letterSpacing: '-0.04em',
          }}
        >
          <span className="animate-word delay-100" style={{ marginRight: '0.22em' }}>Your</span>
          <span className="animate-word delay-160" style={{ marginRight: '0.22em' }}>AI</span>
          <span className="animate-word delay-240" style={{ color: 'var(--accent)', marginRight: '0.22em' }}>Engineering</span>
          <span className="animate-word delay-320">Firm.</span>
        </h1>

        {/* Sub-copy */}
        <p
          className="animate-fade-up delay-300 text-lg mx-auto mb-10"
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '540px',
          }}
        >
          CouncilCode deploys five specialized AI models that collaborate as a structured team —
          each with a defined role, reviewing each other&apos;s work, resolving conflicts,
          and shipping code you can actually trust.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 flex items-center justify-center flex-wrap gap-4 mb-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: '#FAFAFA',
              color: '#0A0A0A',
            }}
          >
            Start building free
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-sm transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
          >
            See how it works
            <span aria-hidden>↓</span>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-up delay-500 flex items-center justify-center flex-wrap gap-6">
          {[
            'Zero hallucinations',
            'Context never drifts',
            'Every line reviewed',
          ].map((signal) => (
            <span
              key={signal}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <span style={{ color: '#34D399' }}>✓</span>
              {signal}
            </span>
          ))}
        </div>
      </div>

      {/* Terminal panel — below copy, full-width centered */}
      <div
        className="animate-fade-in delay-500 relative w-full mt-16 overflow-hidden"
        style={{
          maxWidth: '760px',
          margin: '64px auto 0',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-xs"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            council-session-0001
          </span>
          <span
            className="text-xs flex items-center gap-1.5"
            style={{ color: '#34D399', fontFamily: 'var(--font-mono)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#34D399',
                animation: 'glow-pulse 1.5s ease-in-out infinite',
              }}
            />
            live
          </span>
        </div>

        {/* Prompt */}
        <div
          className="px-5 py-3 text-xs"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>› </span>
          Build a full-stack SaaS with auth, billing, and user dashboard
          <span
            className="inline-block w-[7px] h-3.5 ml-0.5 align-middle rounded-sm"
            style={{
              background: 'var(--text-secondary)',
              opacity: cursor ? 0.7 : 0,
              transition: 'opacity 0.1s',
            }}
          />
        </div>

        {/* Messages */}
        <div className="p-5 space-y-4 min-h-[300px]" style={{ textAlign: 'left' }}>
          {COUNCIL_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
            <div
              key={i}
              className="flex gap-3 items-start"
              style={{
                animation: 'typewriter-line 0.3s ease forwards',
                animationDelay: `${i * 150}ms`,
                opacity: 0,
              }}
            >
              <span
                className="flex-shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full"
                style={{ background: MODEL_COLORS[msg.model] }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-primary)' }}
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
            <div className="flex gap-1.5 pl-[18px] pt-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{
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
    </section>
  )
}
