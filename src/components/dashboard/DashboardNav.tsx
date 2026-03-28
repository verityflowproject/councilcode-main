'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface DashboardNavProps {
  email?: string | null
  plan?: string | null
}

const NAV_LINKS = [
  { label: 'Projects',  href: '/dashboard' },
  { label: 'Credits',   href: '/dashboard/credits' },
  { label: 'Settings',  href: '/dashboard/settings/api-keys' },
  { label: 'Billing',   href: '/dashboard/pricing' },
]

function initials(email?: string | null): string {
  if (!email) return '?'
  return email[0].toUpperCase()
}

export default function DashboardNav({ email, plan }: DashboardNavProps) {
  const pathname = usePathname()
  const isGuest = !email
  const [balance, setBalance] = useState<number | null>(null)
  const [hasAnyKey, setHasAnyKey] = useState<boolean>(true)

  useEffect(() => {
    if (isGuest) return
    fetch('/api/credits/balance')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d != null) setBalance(d.balance) })
      .catch(() => {})

    fetch('/api/user/api-keys')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d != null) setHasAnyKey(d.hasAnyKey ?? false) })
      .catch(() => {})
  }, [isGuest])

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const showBalanceWarning = balance !== null && !hasAnyKey
  const balanceCritical = showBalanceWarning && balance < 20
  const balanceWarning  = showBalanceWarning && balance < 50
  const balanceColor    = balanceCritical ? 'var(--accent-red)' : balanceWarning ? 'var(--accent-amber)' : 'var(--accent-blue)'
  const balanceBg       = balanceCritical
    ? 'rgba(239,68,68,0.08)'
    : balanceWarning
    ? 'rgba(245,158,11,0.08)'
    : 'rgba(67,97,238,0.08)'
  const balanceBorder   = balanceCritical
    ? 'rgba(239,68,68,0.3)'
    : balanceWarning
    ? 'rgba(245,158,11,0.3)'
    : 'rgba(67,97,238,0.25)'

  const isPaid = plan === 'pro' || plan === 'teams'

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(5,5,8,0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border-subtle)',
        gap: '24px',
      }}
    >
      {/* ── Left: logo ── */}
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '18px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
        </span>
      </Link>

      {/* ── Center: nav links ── */}
      <div
        className="hidden md:flex"
        style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'color 0.15s ease, background 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = 'var(--text-primary)'
                  el.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = 'var(--text-secondary)'
                  el.style.background = 'transparent'
                }
              }}
            >
              {link.label}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '12px',
                    right: '12px',
                    height: '1.5px',
                    borderRadius: '2px',
                    background: 'var(--accent-blue)',
                    opacity: 0.8,
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* ── Right: guest or authenticated ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

        {isGuest ? (
          <>
            <Link
              href="/login"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                textDecoration: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              style={{
                background: 'var(--accent-blue)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                padding: '7px 16px',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#3251d4'
                el.style.boxShadow = '0 0 20px rgba(67,97,238,0.35)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--accent-blue)'
                el.style.boxShadow = 'none'
              }}
            >
              Get started
            </Link>
          </>
        ) : (
          <>
            {/* Credit balance — only show if fetched */}
            {balance !== null && (
              <Link
                href="/dashboard/credits"
                className="hidden sm:flex"
                style={{
                  alignItems: 'center',
                  gap: '5px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: balanceColor,
                  background: balanceBg,
                  border: `1px solid ${balanceBorder}`,
                  borderRadius: '6px',
                  padding: '4px 10px',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M5 0L6.18 3.82L10 5L6.18 6.18L5 10L3.82 6.18L0 5L3.82 3.82L5 0Z" fill="currentColor" />
                </svg>
                {balance.toLocaleString()}
              </Link>
            )}

            {/* Plan badge */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: isPaid ? 'var(--accent-blue)' : 'var(--text-muted)',
                background: isPaid ? 'rgba(67,97,238,0.1)' : 'rgba(255,255,255,0.04)',
                border: isPaid ? '1px solid rgba(67,97,238,0.25)' : '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '3px 7px',
              }}
            >
              {plan ?? 'free'}
            </span>

            {/* Divider */}
            <span style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', flexShrink: 0 }} />

            {/* Avatar */}
            <div
              title={email ?? ''}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(67,97,238,0.15)',
                border: '1px solid rgba(67,97,238,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                flexShrink: 0,
              }}
            >
              {initials(email)}
            </div>

            {/* Sign out */}
            <Link
              href="/api/auth/signout"
              style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                textDecoration: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
            >
              Sign out
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
