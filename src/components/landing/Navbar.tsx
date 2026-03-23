import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'rgba(8, 10, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Link
        href="/"
        className="text-lg font-bold tracking-tight"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
        }}
      >
        Council<span style={{ color: 'var(--accent)' }}>Code</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'The council', href: '#council' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm transition-colors duration-150 hover:text-text-primary"
            style={{ color: 'var(--text-secondary)' }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm px-4 py-2 rounded-lg border transition-all duration-150 hover:border-accent"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 rounded-lg font-medium transition-all duration-150 hover:opacity-90"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          Get started
        </Link>
      </div>
    </nav>
  )
}
