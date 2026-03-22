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
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div
          className="text-5xl font-mono"
          style={{ color: 'var(--accent)', opacity: 0.6 }}
        >
          ⚠
        </div>
        <h1
          className="text-2xl font-bold"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Something went wrong
        </h1>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {error.message || 'An unexpected error occurred. The council is investigating.'}
        </p>
        {error.digest && (
          <p
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="text-sm px-5 py-2.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
