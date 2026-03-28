'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardNavProps {
  email?: string | null
  plan?: string | null
}

export default function DashboardNav({ email, plan }: DashboardNavProps) {
  const [balance, setBalance] = useState<number | null>(null)
  const [hasAnyKey, setHasAnyKey] = useState<boolean>(true)

  useEffect(() => {
    fetch('/api/credits/balance')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d != null) setBalance(d.balance) })
      .catch(() => {})

    fetch('/api/user/api-keys')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d != null) setHasAnyKey(d.hasAnyKey ?? false) })
      .catch(() => {})
  }, [])

  const showBalanceWarning = balance !== null && !hasAnyKey
  const balanceColor =
    showBalanceWarning && balance < 20
      ? '#ef4444'
      : showBalanceWarning && balance < 50
      ? '#f59e0b'
      : 'var(--text-muted)'

  return (
    <nav
      className="sticky top-0 z-40 border-b px-6 py-4 flex items-center justify-between"
      style={{
        borderColor: 'var(--border)',
        background: 'rgba(9,9,11,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Link
        href="/dashboard"
        className="text-base font-bold tracking-tight transition-opacity hover:opacity-80"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        Verity<span style={{ color: 'var(--accent)' }}>Flow</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Credit balance chip */}
        {balance !== null && (
          <Link
            href="/dashboard/credits"
            className="text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-150 hover:opacity-80 hidden sm:flex items-center gap-1"
            style={{
              borderColor: showBalanceWarning && balance < 20
                ? 'rgba(239,68,68,0.4)'
                : showBalanceWarning && balance < 50
                ? 'rgba(245,158,11,0.4)'
                : 'var(--border)',
              color: balanceColor,
            }}
          >
            <span>⚡</span>
            <span>{balance.toLocaleString()}</span>
          </Link>
        )}

        <Link
          href="/dashboard/credits"
          className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent hidden sm:block"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Credits
        </Link>

        <Link
          href="/dashboard/settings/api-keys"
          className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent hidden sm:block"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          API Keys
        </Link>

        <Link
          href="/dashboard/pricing"
          className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent hidden sm:block"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          {plan === 'free' ? '↑ Upgrade' : 'Billing'}
        </Link>

        <span
          className="text-sm hidden sm:block"
          style={{ color: 'var(--text-muted)' }}
        >
          {email}
        </span>

        <span
          className="text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          {plan ?? 'free'}
        </span>

        <Link
          href="/api/auth/signout"
          className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Sign out
        </Link>
      </div>
    </nav>
  )
}
