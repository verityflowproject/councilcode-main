import { auth } from '@/lib/auth'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const plan = session?.user?.plan ?? 'free'

  return (
    <SessionProvider session={session}>
      <div
        className="min-h-screen"
        style={{ background: 'var(--background)' }}
      >
        <nav
          className="sticky top-0 z-40 border-b px-6 py-4 flex items-center justify-between"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(9,9,11,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Logo */}
          <Link
            href="/dashboard"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Verity<span style={{ color: 'var(--accent)' }}>Flow</span>
            </span>
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Plan badge */}
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {plan}
            </span>

            <Link
              href="/dashboard/billing"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Usage
            </Link>

            <Link
              href="/dashboard/pricing"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Billing
            </Link>

            <Link
              href="/api/auth/signout"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Sign out
            </Link>
          </div>
        </nav>

        <main className="px-6 py-8 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
