import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <SessionProvider session={session}>
      <div
        className="min-h-screen"
        style={{ background: 'var(--background)' }}
      >
        {/* Sticky blurred navbar */}
        <nav
          className="sticky top-0 z-40 border-b px-6 py-4 flex items-center justify-between"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(9,9,11,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <Link
            href="/dashboard"
            className="text-base font-bold tracking-tight transition-opacity hover:opacity-80"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Verity<span style={{ color: 'var(--accent)' }}>Flow</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/billing"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent hidden sm:block"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              Usage
            </Link>
            <Link
              href="/dashboard/pricing"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent hidden sm:block"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              {session.user.plan === 'free' ? '↑ Upgrade' : 'Billing'}
            </Link>
            <span
              className="text-sm hidden sm:block"
              style={{ color: 'var(--text-muted)' }}
            >
              {session.user.email}
            </span>
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {session.user.plan ?? 'free'}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 hover:border-accent"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
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
