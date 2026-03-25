'use client'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 40px',
        background: 'var(--bg-surface)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '48px',
          }}
        >
          {/* Logo column */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '18px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
            </span>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: '260px',
              }}
            >
              Five AI models. Your keys. Zero hallucinations.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Navigation
            </span>
            {[
              { label: 'How it works', href: '#how-it-works' },
              { label: 'The council', href: '#council' },
              { label: 'FAQ', href: '/faq' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '10px',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'
                }}
              >
                {link.label}
              </a>
            ))}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-blue)',
                background: 'rgba(67,97,238,0.08)',
                border: '1px solid rgba(67,97,238,0.2)',
                borderRadius: '4px',
                padding: '3px 8px',
              }}
            >
              🔑 BYOK — zero markup
            </span>
          </div>

          {/* Account column */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Account
            </span>
            <a
              href="/login"
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '10px',
                textDecoration: 'none',
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
            </a>
            <a
              href="/register"
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '10px',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'
              }}
            >
              Get started
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '40px',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>© {new Date().getFullYear()} VerityFlow</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
              }}
            />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  )
}
