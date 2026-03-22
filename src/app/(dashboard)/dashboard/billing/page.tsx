import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UsageDashboard from '@/components/dashboard/UsageDashboard'
import Link from 'next/link'

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard"
              className="text-sm transition-colors hover:text-text-primary"
              style={{ color: 'var(--text-muted)' }}
            >
              ← Dashboard
            </Link>
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Usage & billing
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Council session usage, model breakdown, and cost estimates
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/dashboard/pricing"
            className="text-sm px-4 py-2 rounded-lg border transition-all duration-150 hover:border-accent"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            View plans
          </Link>
          {session.user.plan !== 'free' && (
            <a
              href="/api/billing/portal"
              className="text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-150 hover:opacity-90"
              style={{
                background: 'var(--accent)',
                color: '#fff',
              }}
            >
              Manage billing
            </a>
          )}
        </div>
      </div>

      <UsageDashboard
        modelCallsUsed={session.user.modelCallsUsed ?? 0}
        modelCallsLimit={session.user.modelCallsLimit ?? 50}
        plan={session.user.plan ?? 'free'}
      />
    </div>
  )
}
