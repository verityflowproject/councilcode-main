import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UpgradeButton from '@/components/dashboard/UpgradeButton'
import Link from 'next/link'

const PLAN_DETAILS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: '$0',
    period: 'forever',
    calls: '50',
    features: [
      'All 5 AI models',
      '50 council sessions',
      'ProjectState memory',
      'Full review log',
      'Hallucination firewall',
      'BYOK supported — use your own keys',
    ],
    cta: 'Current plan',
    highlight: false,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$29',
    period: 'per month',
    calls: '2,000',
    features: [
      'Everything in Free',
      '2,000 council sessions',
      'Priority model routing',
      'Extended session history',
      'Email support',
      'BYOK supported',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    id: 'teams' as const,
    name: 'Teams',
    price: '$99',
    period: 'per month',
    calls: '10,000',
    features: [
      'Everything in Pro',
      '10,000 council sessions',
      'Team project sharing',
      'Usage analytics',
      'Priority support',
      'BYOK supported',
    ],
    cta: 'Upgrade to Teams',
    highlight: false,
  },
]

export default async function PricingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const currentPlan = (session.user.plan ?? 'free') as string

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm transition-colors hover:text-text-primary"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Dashboard
        </Link>
      </div>
      <div className="max-w-2xl">
        <h1
          className="text-3xl font-bold"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Scale your council
        </h1>
        <p
          className="text-sm mt-2 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Every plan includes all five models, the full review pipeline,
          and the hallucination firewall. Bring your own API keys — you
          pay providers directly, no markup. Upgrade for more sessions.
        </p>
      </div>

      {/* BYOK callout */}
      <div
        className="rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderColor: 'var(--border)', background: 'rgba(99,102,241,0.04)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          All plans support{' '}
          <strong style={{ color: 'var(--text-primary)' }}>Bring Your Own Keys (BYOK)</strong>
          {' '}— connect your provider keys to pay at cost with zero markup. Or use{' '}
          <strong style={{ color: 'var(--text-primary)' }}>VerityFlow Credits</strong>
          {' '}for instant access with no setup.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <Link
            href="/dashboard/settings/api-keys"
            className="text-xs font-mono px-3 py-2 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Add API Keys →
          </Link>
          <Link
            href="/dashboard/credits"
            className="text-xs font-mono px-3 py-2 rounded-lg transition-colors"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Buy Credits →
          </Link>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLAN_DETAILS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id

          return (
            <div
              key={plan.id}
              className="rounded-xl border p-6 space-y-6 relative"
              style={{
                borderColor: plan.highlight
                  ? 'var(--accent)'
                  : 'var(--border)',
                background: plan.highlight
                  ? 'rgba(99,102,241,0.04)'
                  : 'var(--surface)',
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-mono px-3 py-1 rounded-full"
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                  }}
                >
                  Most popular
                </div>
              )}
              {isCurrentPlan && (
                <div
                  className="absolute -top-3 right-4 text-xs font-mono px-3 py-1 rounded-full border"
                  style={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    background: 'rgba(16,185,129,0.1)',
                  }}
                >
                  Current plan
                </div>
              )}

              {/* Plan header */}
              <div className="space-y-1">
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {plan.name}
                </h2>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    /{plan.period}
                  </span>
                </div>
                <p
                  className="text-xs font-mono"
                  style={{ color: 'var(--accent)' }}
                >
                  {plan.calls} council sessions/mo
                </p>
                <p
                  className="text-xs font-mono"
                  style={{ color: 'var(--text-muted)', marginTop: '4px' }}
                >
                  🔑 BYOK required · pay providers directly
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10b981',
                      }}
                    >
                      ✓
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrentPlan ? (
                <div
                  className="w-full text-center text-sm py-2.5 rounded-lg border font-medium"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  Current plan
                </div>
              ) : plan.id === 'free' ? (
                <div
                  className="w-full text-center text-sm py-2.5 rounded-lg border font-medium"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  Downgrade via billing portal
                </div>
              ) : (
                <UpgradeButton
                  currentPlan={currentPlan}
                  targetPlan={plan.id}
                  className="w-full justify-center"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div
        className="rounded-xl border p-6 space-y-4 max-w-2xl"
        style={{ borderColor: 'var(--border)' }}
      >
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Common questions
        </h3>
          {[
            {
              q: 'Do I need to bring my own API keys?',
              a: 'Yes — VerityFlow is a BYOK (Bring Your Own Key) platform. Connect your Anthropic, OpenAI, Mistral, Google AI, and Perplexity keys in Settings → API Keys. You pay each provider directly at cost; VerityFlow charges only for the orchestration layer.',
            },
            {
              q: 'What counts as a council session?',
              a: 'Each prompt you submit to the council counts as one session, regardless of how many models are invoked internally.',
            },
            {
              q: 'Do unused sessions roll over?',
              a: 'No — session counts reset monthly on your billing date.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancel through the billing portal at any time. You keep Pro/Teams access until the end of your billing period.',
            },
          ].map((item) => (
          <div key={item.q} className="space-y-1">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {item.q}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
