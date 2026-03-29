'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-red)',
            marginBottom: '12px',
          }}
        >
          Error · Something went wrong
        </p>

        {/* Large muted symbol */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 10vw, 100px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--accent-red)',
            lineHeight: 1,
            opacity: 0.15,
            marginBottom: '32px',
          }}
        >
          ⚠
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: error.digest ? '12px' : '36px',
          }}
        >
          {error.message || 'An unexpected error occurred. The council is investigating.'}
        </p>

        {error.digest && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '36px',
            }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-blue)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)',
          }}
        >
          Try again →
        </button>
      </div>
    </div>
  )
}
