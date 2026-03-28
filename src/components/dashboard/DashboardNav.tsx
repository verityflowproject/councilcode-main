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
  const [hovered, setHovered] = useState<string | null>(null)

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
  const balanceCritical  = showBalanceWarning && balance < 20
  const balanceWarning   = showBalanceWarning && balance < 50
  const balanceColor = balanceCritical ? '#ef4444' : balanceWarning ? '#f59e0b' : 'var(--accent-blue)'
  const balanceBorder = balanceCritical
    ? 'rgba(239,68,68,0.35)'
    : balanceWarning
    ? 'rgba(245,158,11,0.35)'
    : 'rgba(67,97,238,0.3)'

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(9,9,11,0.88)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid var(--border-subtle)',
        gap: '24px',
      }}
    >

      {/* ── Left: wordmark + FlowDash workspace chip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '17px',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
        </Link>

        <span style={{ color: 'var(--border-subtle)', fontSize: '16px', fontWeight: 300, userSelect: 'none' }}>
          /
        </span>

        <Link
          href="/dashboard"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'var(--accent-blue)',
            background: 'rgba(67,97,238,0.1)',
            border: '1px solid rgba(67,97,238,0.22)',
            borderRadius: '6px',
            padding: '4px 10px',
            transition: 'box-shadow 0.2s ease, background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(67,97,238,0.16)'
            el.style.boxShadow = '0 0 14px rgba(67,97,238,0.25)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(67,97,238,0.1)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* tiny grid icon */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0, opacity: 0.8 }}>
            <rect x="0" y="0" width="4.5" height="4.5" rx="1" fill="currentColor" />
            <rect x="6.5" y="0" width="4.5" height="4.5" rx="1" fill="currentColor" />
            <rect x="0" y="6.5" width="4.5" height="4.5" rx="1" fill="currentColor" />
            <rect x="6.5" y="6.5" width="4.5" height="4.5" rx="1" fill="currentColor" />
          </svg>
          flowdash
        </Link>
      </div>

      {/* ── Center: primary nav ── */}
      <div
        className="hidden md:flex"
        style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href)
          const isHov  = hovered === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              style={{
                textDecoration: 'none',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                letterSpacing: '-0.01em',
                color: active
                  ? 'var(--accent-blue)'
                  : isHov
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
                background: active
                  ? 'rgba(67,97,238,0.1)'
                  : isHov
                  ? 'rgba(255,255,255,0.04)'
                  : 'transparent',
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
            >
              {link.label}
              {/* active underline */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '14px',
                    right: '14px',
                    height: '2px',
                    borderRadius: '2px',
                    background: 'var(--accent-blue)',
                    boxShadow: '0 0 8px rgba(67,97,238,0.6)',
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* ── Right: guest auth buttons OR authenticated user info ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

        {isGuest ? (
          <>
            {/* Preview chip */}
            <span
              className="hidden sm:inline-flex"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '5px',
                padding: '3px 8px',
              }}
            >
              preview
            </span>

            <span style={{ width: '1px', height: '22px', background: 'var(--border-subtle)', flexShrink: 0 }} />

            {/* Sign in */}
            <Link
              href="/login"
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '7px',
                border: '1px solid var(--border-subtle)',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-primary)'
                el.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-secondary)'
                el.style.borderColor = 'var(--border-subtle)'
              }}
            >
              Sign in
            </Link>

            {/* Get started */}
            <Link
              href="/register"
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#fff',
                background: 'var(--accent-blue)',
                padding: '6px 14px',
                borderRadius: '7px',
                transition: 'opacity 0.15s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.opacity = '0.88'
                el.style.boxShadow = '0 0 18px rgba(67,97,238,0.4)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.opacity = '1'
                el.style.boxShadow = 'none'
              }}
            >
              Get started
            </Link>
          </>
        ) : (
          <>
            {/* Credit balance */}
            {balance !== null && (
              <Link
                href="/dashboard/credits"
                className="hidden sm:flex"
                style={{
                  textDecoration: 'none',
                  alignItems: 'center',
                  gap: '5px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: balanceColor,
                  background: balanceCritical
                    ? 'rgba(239,68,68,0.08)'
                    : balanceWarning
                    ? 'rgba(245,158,11,0.08)'
                    : 'rgba(67,97,238,0.08)',
                  border: `1px solid ${balanceBorder}`,
                  borderRadius: '7px',
                  padding: '5px 10px',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
              >
                <span style={{ fontSize: '10px' }}>⚡</span>
                <span>{balance.toLocaleString()}</span>
              </Link>
            )}

            {/* Plan badge */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: plan === 'pro' || plan === 'teams' ? 'var(--accent-blue)' : 'var(--text-muted)',
                background: plan === 'pro' || plan === 'teams'
                  ? 'rgba(67,97,238,0.1)'
                  : 'rgba(255,255,255,0.04)',
                border: plan === 'pro' || plan === 'teams'
                  ? '1px solid rgba(67,97,238,0.28)'
                  : '1px solid var(--border-subtle)',
                borderRadius: '5px',
                padding: '3px 8px',
              }}
            >
              {plan ?? 'free'}
            </span>

            {/* Divider */}
            <span style={{ width: '1px', height: '22px', background: 'var(--border-subtle)', flexShrink: 0 }} />

            {/* User avatar */}
            <div
              title={email ?? ''}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(67,97,238,0.18)',
                border: '1px solid rgba(67,97,238,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                flexShrink: 0,
                boxShadow: '0 0 10px rgba(67,97,238,0.15)',
              }}
            >
              {initials(email)}
            </div>

            {/* Sign out */}
            <Link
              href="/api/auth/signout"
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                padding: '5px 10px',
                borderRadius: '7px',
                border: '1px solid var(--border-subtle)',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-secondary)'
                el.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-muted)'
                el.style.borderColor = 'var(--border-subtle)'
              }}
            >
              out
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
