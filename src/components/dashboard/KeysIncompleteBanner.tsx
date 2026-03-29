'use client'

import { useState } from 'react'
import Link from 'next/link'

interface KeysIncompleteBannerProps {
  missingCount: number
}

export default function KeysIncompleteBanner({ missingCount }: KeysIncompleteBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (missingCount === 0 || dismissed) return null

  return (
    <div
      className="rounded-xl border px-5 py-4 flex items-center justify-between gap-4"
      style={{
        borderColor: 'rgba(245,158,11,0.4)',
        background: 'rgba(245,158,11,0.05)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span style={{ color: 'var(--accent-amber)', flexShrink: 0 }}>⚠</span>
        <p className="text-sm" style={{ color: 'var(--accent-amber)' }}>
          Your AI Council is incomplete —{' '}
          {missingCount === 5
            ? 'add your API keys'
            : `${missingCount} key${missingCount !== 1 ? 's' : ''} missing`}{' '}
          to unlock full functionality.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/dashboard/settings/api-keys"
          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 whitespace-nowrap"
          style={{ background: 'var(--accent-amber)', color: 'var(--bg-base)' }}
        >
          Add API Keys →
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs w-6 h-6 flex items-center justify-center rounded transition-colors hover:opacity-70"
          style={{ color: 'var(--accent-amber)' }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
