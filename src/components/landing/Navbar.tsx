'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <Link
        href="/"
        className="text-base font-bold tracking-tight"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}
      >
        Council<span style={{ color: 'var(--accent)' }}>Code</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'The council',  href: '#council' },
          { label: 'FAQ',          href: '#faq' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            background: '#FAFAFA',
            color: '#0A0A0A',
          }}
        >
          Get started
        </Link>
      </div>
    </nav>
  )
}
