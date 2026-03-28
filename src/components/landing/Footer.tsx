'use client'

import Link from 'next/link'

const PRODUCT_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'The council',  href: '/#council' },
  { label: 'Compare',      href: '/compare' },
  { label: 'Pricing',      href: '/dashboard/pricing' },
  { label: 'FAQ',          href: '/faq' },
]

const SUPPORT_LINKS = [
  { label: 'Contact us',       href: '/contact' },
  { label: 'Feature request',  href: '/contact?type=feature' },
  { label: 'Report a bug',     href: '/contact?type=bug' },
  { label: 'Dashboard',        href: '/dashboard' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

const ACCOUNT_LINKS = [
  { label: 'Sign in',     href: '/login' },
  { label: 'Get started', href: '/register' },
]

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
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
        {heading}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '56px 40px 32px',
        background: 'var(--bg-surface)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand column */}
          <div>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '10px',
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
            </Link>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                maxWidth: '230px',
                marginBottom: '20px',
              }}
            >
              Five AI models. Your keys. Zero hallucinations. A structured engineering team built into every session.
            </p>

            {/* BYOK chip */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent-blue)',
                background: 'rgba(67,97,238,0.08)',
                border: '1px solid rgba(67,97,238,0.2)',
                borderRadius: '5px',
                padding: '3px 8px',
                marginBottom: '16px',
                display: 'flex' as const,
                width: 'fit-content',
              }}
            >
              BYOK — zero markup
            </span>

            {/* Status dot */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  boxShadow: '0 0 6px var(--accent-green)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              All systems operational
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn heading="Product" links={PRODUCT_LINKS} />
          <FooterColumn heading="Support" links={SUPPORT_LINKS} />
          <FooterColumn heading="Legal" links={LEGAL_LINKS} />
          <FooterColumn heading="Account" links={ACCOUNT_LINKS} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            © {new Date().getFullYear()} VerityFlow. All rights reserved.
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          >
            <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
            >
              Privacy
            </Link>
            <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
            >
              Terms
            </Link>
            <Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
            >
              Contact
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
