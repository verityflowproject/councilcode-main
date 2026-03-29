'use client'

import Link from 'next/link'

interface UsageWarningBannerProps {
  used: number
  limit: number
}

export default function UsageWarningBanner({ used, limit }: UsageWarningBannerProps) {
  const pct = (used / limit) * 100
  if (pct < 80) return null

  const isCritical = pct >= 95

  return (
    <div
      className="rounded-xl border px-5 py-4 flex items-center justify-between gap-6"
      style={{
        borderColor: isCritical ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)',
        background:  isCritical ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)',
            display: 'inline-block',
            flexShrink: 0,
            animation: 'glow-pulse 1.5s ease-in-out infinite',
          }}
        />
        <p
          className="text-sm"
          style={{ color: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)' }}
        >
          {isCritical
            ? `You've used ${used} of ${limit} sessions this month. Your council will stop when you hit the limit.`
            : `You've used ${Math.round(pct)}% of your monthly sessions. Consider upgrading to keep building.`}
        </p>
      </div>
      <Link
        href="/dashboard/pricing"
        className="flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 whitespace-nowrap border"
        style={{
          borderColor: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)',
          color: isCritical ? 'var(--accent-red)' : 'var(--accent-amber)',
          background: isCritical ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
        }}
      >
        Upgrade
      </Link>
    </div>
  )
}
