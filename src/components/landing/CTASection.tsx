'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section
      className="fade-up"
      style={{
        background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(67,97,238,0.12), transparent 70%)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '120px 40px',
        textAlign: 'center',
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
          marginBottom: '12px',
        }}
      >
        Ready to build?
      </span>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '40px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          margin: '12px 0 20px',
        }}
      >
        Put the whole council to work on your project.
      </h2>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}
      >
        Five AI specialists available 24/7 — no onboarding, no context loss, no hallucinations.
      </p>

      <Link
        href="/register"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--accent-blue)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '16px 36px',
          fontSize: '16px',
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

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginTop: '16px',
        }}
      >
        Free tier: 50 model calls/month · Bring your own API keys · No credit card required.
      </p>
    </section>
  )
}
