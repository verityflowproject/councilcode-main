'use client'

import Link from 'next/link'

interface UsageWarningBannerProps {
  used: number
  limit: number
}

export default function UsageWarningBanner({
  used,
  limit,
}: UsageWarningBannerProps) {
  const pct = (used / limit) * 100
  if (pct < 80) return null

  const isCritical = pct >= 95

  return (
    <div
      className="rounded-xl border px-5 py-4 flex items-center justify-between gap-6"
      style={{
        borderColor: isCritical
          ? 'rgba(239,68,68,0.4)'
          : 'rgba(245,158,11,0.4)',
        background: isCritical
          ? 'rgba(239,68,68,0.05)'
          : 'rgba(245,158,11,0.05)',
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: isCritical ? '#ef4444' : '#f59e0b' }}>
          {isCritical ? '⚠' : '○'}
        </span>
        <p
          className="text-sm"
          style={{ color: isCritical ? '#ef4444' : '#f59e0b' }}
        >
          {isCritical
            ? `You've used ${used} of ${limit} sessions this month. Your council will stop when you hit the limit.`
            : `You've used ${Math.round(pct)}% of your monthly sessions. Consider upgrading to keep building.`}
        </p>
      </div>
      <Link
        href="/dashboard/pricing"
        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 whitespace-nowrap"
        style={{
          background: isCritical ? '#ef4444' : '#f59e0b',
          color: '#fff',
        }}
      >
        Upgrade
      </Link>
    </div>
  )
}
