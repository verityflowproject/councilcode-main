'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'The council',  href: '/#council' },
  { label: 'Compare',      href: '/compare' },
  { label: 'FAQ',          href: '/faq' },
  { label: 'Contact',      href: '/contact' },
  { label: 'Dashboard',    href: '/dashboard' },
]

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(5,5,8,0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border-subtle)',
        gap: '24px',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
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
          }}
        >
          Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            background: 'rgba(67,97,238,0.15)',
            color: 'var(--accent-blue)',
            border: '1px solid rgba(67,97,238,0.3)',
            borderRadius: '4px',
            padding: '2px 6px',
            marginLeft: '8px',
            lineHeight: '1.4',
          }}
        >
          Beta
        </span>
      </Link>

      {/* Center nav links */}
      <div
        className="hidden md:flex"
        style={{ alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontWeight: 400,
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '6px',
              transition: 'color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-primary)'
              el.style.background = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--text-secondary)'
              el.style.background = 'transparent'
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <Link
          href="/login"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            textDecoration: 'none',
            padding: '5px 10px',
            borderRadius: '6px',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'
          }}
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
      </div>
    </nav>
  )
}
