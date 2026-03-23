'use client'

export default function Footer() {
  return (
    <footer
      className="px-6 py-16"
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      <div
        className="flex flex-col md:flex-row items-start justify-between gap-10"
        style={{ maxWidth: '1100px', margin: '0 auto' }}
      >
        {/* Brand */}
        <div style={{ maxWidth: '260px' }}>
          <span
            className="text-base font-bold block mb-3"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
            }}
          >
            Council<span style={{ color: 'var(--accent)' }}>Code</span>
          </span>
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}
          >
            Five AI models. One codebase. Zero hallucinations.
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-3">
          <span
            className="text-xs uppercase mb-1"
            style={{
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Navigation
          </span>
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'The council',  href: '#council' },
            { label: 'FAQ',          href: '#faq' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-150"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 md:text-right">
          <span
            className="text-xs uppercase mb-1"
            style={{
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Account
          </span>
          <a
            href="/login"
            className="text-sm transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
          >
            Sign in
          </a>
          <a
            href="/register"
            className="text-sm transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
          >
            Get started
          </a>
          <p
            className="text-xs mt-4"
            style={{ color: 'var(--text-muted)' }}
          >
            © {new Date().getFullYear()} CouncilCode
          </p>
        </div>
      </div>
    </footer>
  )
}
