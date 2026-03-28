'use client'

import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function TermsPage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: '140px',
          paddingBottom: '64px',
          paddingLeft: '40px',
          paddingRight: '40px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 600px 320px at 50% -40px, rgba(67,97,238,0.1), transparent 70%)',
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
            marginBottom: '14px',
          }}
        >
          Legal
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            lineHeight: 1.05,
          }}
        >
          Terms of Service
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            maxWidth: '480px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          The terms governing your use of VerityFlow.
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
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 40px 120px',
        }}
      >
        {/* Last updated */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '48px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Last updated
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent-blue)',
              background: 'rgba(67,97,238,0.08)',
              border: '1px solid rgba(67,97,238,0.2)',
              borderRadius: '4px',
              padding: '2px 8px',
            }}
          >
            March 2026
          </span>
        </div>

        {/* Placeholder content block */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '36px 40px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: 'var(--accent-blue)',
                background: 'rgba(67,97,238,0.08)',
                border: '1px solid rgba(67,97,238,0.2)',
                borderRadius: '4px',
                padding: '2px 7px',
              }}
            >
              In progress
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            This page is being finalized.
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '20px',
            }}
          >
            Our full Terms of Service are being drafted and will be published here shortly. Here are the core terms in effect now:
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {[
              'By using VerityFlow, you agree to use the platform only for lawful purposes and in accordance with these terms.',
              'You retain full ownership of all code, content, and projects you create using the platform.',
              'VerityFlow is provided as-is during the beta period. We are not liable for losses resulting from service interruptions.',
              'We reserve the right to suspend accounts that violate these terms or are used for harmful purposes.',
              'You may cancel your account at any time. Paid subscriptions are not refunded for partial billing periods.',
              'These terms may be updated. Continued use of the platform constitutes acceptance of any changes.',
            ].map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    marginTop: '7px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'var(--accent-blue)',
                    display: 'inline-block',
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Questions CTA */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
              Questions about these terms?
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Reach us directly — we respond to every message.
            </p>
          </div>
          <Link
            href="/contact"
            style={{
              textDecoration: 'none',
              background: 'var(--accent-blue)',
              color: '#fff',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#3251d4'
              el.style.boxShadow = '0 0 16px rgba(67,97,238,0.3)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--accent-blue)'
              el.style.boxShadow = 'none'
            }}
          >
            Contact us →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
