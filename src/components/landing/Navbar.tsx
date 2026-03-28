'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 40px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(5,5,8,0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border-subtle)',
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
            verticalAlign: 'middle',
            lineHeight: '1.4',
          }}
        >
          Beta
        </span>
      </Link>

      {/* Nav links — hidden on mobile */}
      <div
        className="hidden md:flex"
        style={{ alignItems: 'center', gap: '32px' }}
      >
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'The council', href: '#council' },
          { label: 'Compare', href: '/compare' },
          { label: 'FAQ', href: '/faq' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color =
                'var(--text-secondary)'
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          href="/login"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.color =
              'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.color =
              'var(--text-secondary)'
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
            padding: '8px 16px',
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
