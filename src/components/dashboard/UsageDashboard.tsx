'use client'

import { useEffect, useState } from 'react'

const MODEL_CONFIG = {
  claude:     { label: 'Claude',     color: 'var(--claude)'     },
  gpt4o:      { label: 'GPT-5.4',   color: 'var(--gpt4o)'     },
  codestral:  { label: 'Codestral', color: 'var(--codestral)' },
  gemini:     { label: 'Gemini',    color: 'var(--gemini)'     },
  perplexity: { label: 'Perplexity',color: 'var(--perplexity)' },
}

type ModelRole = keyof typeof MODEL_CONFIG

interface UsageStats {
  totalCalls: number
  totalTokens: number
  totalCostUsd: number
  byModel: Record<ModelRole, { calls: number; tokens: number; costUsd: number }>
  byDay: { date: string; calls: number; tokens: number; costUsd: number }[]
}

interface UsageDashboardProps {
  modelCallsUsed: number
  modelCallsLimit: number
  plan: string
}

export default function UsageDashboard({
  modelCallsUsed,
  modelCallsLimit,
  plan,
}: UsageDashboardProps) {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/billing/usage?days=${days}`)
        const data = await res.json()
        if (data.stats) setStats(data.stats)
      } catch (err) {
        console.error('Failed to fetch usage stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [days])

  const usagePct = Math.min(100, (modelCallsUsed / modelCallsLimit) * 100)
  const isWarning = usagePct >= 80
  const isCritical = usagePct >= 95

  return (
    <div className="space-y-6">
      {/* Current period usage */}
      <div
        className="rounded-xl border p-6 space-y-4"
        style={{
          borderColor: isCritical
            ? 'rgba(239,68,68,0.4)'
            : isWarning
            ? 'rgba(245,158,11,0.4)'
            : 'var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-sm font-semibold"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Current billing period
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Resets monthly
            </p>
          </div>
          <span
            className="text-xs font-mono px-2.5 py-1 rounded-full border capitalize"
            style={{
              borderColor: 'rgba(99,102,241,0.3)',
              color: 'var(--accent)',
              background: 'rgba(99,102,241,0.08)',
            }}
          >
            {plan} plan
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{
                color: isCritical
                  ? '#ef4444'
                  : isWarning
                  ? '#f59e0b'
                  : 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {modelCallsUsed.toLocaleString()}
            </span>
            <span
              className="text-sm font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              / {modelCallsLimit.toLocaleString()} sessions
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${usagePct}%`,
                background: isCritical
                  ? '#ef4444'
                  : isWarning
                  ? '#f59e0b'
                  : 'var(--accent)',
              }}
            />
          </div>
          <p
            className="text-xs font-mono"
            style={{
              color: isCritical
                ? '#ef4444'
                : isWarning
                ? '#f59e0b'
                : 'var(--text-muted)',
            }}
          >
            {Math.round(usagePct)}% used
            {isWarning && !isCritical && ' — approaching limit'}
            {isCritical && ' — limit almost reached'}
          </p>
        </div>

        {isCritical && (
          <div
            className="rounded-lg border px-4 py-3 flex items-center justify-between gap-4"
            style={{
              borderColor: 'rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.05)',
            }}
          >
            <p
              className="text-xs leading-relaxed"
              style={{ color: '#ef4444' }}
            >
              You&apos;re almost out of sessions. Upgrade to keep your council running.
            </p>
            <a
              href="/dashboard/pricing"
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ background: '#ef4444', color: '#fff' }}
            >
              Upgrade now
            </a>
          </div>
        )}
      </div>

      {/* Historical stats */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3
            className="text-sm font-semibold"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Usage history
          </h3>
          <div className="flex items-center gap-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-150"
                style={{
                  borderColor: days === d ? 'var(--accent)' : 'var(--border)',
                  background: days === d ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: days === d ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 rounded animate-pulse"
                style={{ background: 'var(--border)' }}
              />
            ))}
          </div>
        ) : !stats ? (
          <div className="p-6 text-center">
            <p
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              No usage data yet
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'Total sessions',
                  value: stats.totalCalls.toLocaleString(),
                  color: 'var(--accent)',
                },
                {
                  label: 'Tokens used',
                  value: stats.totalTokens.toLocaleString(),
                  color: 'var(--text-primary)',
                },
                {
                  label: 'Est. cost',
                  value: `$${stats.totalCostUsd.toFixed(4)}`,
                  color: '#10b981',
                },
              ].map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <p
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{
                      color: stat.color,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* By model breakdown */}
            <div className="space-y-2">
              <p
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                By model
              </p>
              <div className="space-y-2">
                {(Object.entries(stats.byModel) as [ModelRole, { calls: number; tokens: number; costUsd: number }][])
                  .filter(([, data]) => data.calls > 0)
                  .sort(([, a], [, b]) => b.calls - a.calls)
                  .map(([model, data]) => {
                    const cfg = MODEL_CONFIG[model]
                    const pct =
                      stats.totalCalls > 0
                        ? (data.calls / stats.totalCalls) * 100
                        : 0
                    return (
                      <div key={model} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: cfg.color }}
                            />
                            <span
                              className="text-xs font-semibold"
                              style={{ color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className="text-xs font-mono"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {data.calls} calls
                            </span>
                            <span
                              className="text-xs font-mono w-12 text-right"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              ${data.costUsd.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{ background: 'var(--border)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: cfg.color,
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Daily activity */}
            {stats.byDay.length > 0 && (
              <div className="space-y-2">
                <p
                  className="text-xs font-mono uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Daily activity
                </p>
                <div className="flex items-end gap-1 h-16">
                  {stats.byDay.map((day) => {
                    const maxCalls = Math.max(
                      ...stats.byDay.map((d) => d.calls),
                      1
                    )
                    const heightPct = (day.calls / maxCalls) * 100
                    return (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col justify-end group relative"
                      >
                        <div
                          className="w-full rounded-sm transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${Math.max(heightPct, 4)}%`,
                            background: 'var(--accent)',
                            opacity: 0.6,
                          }}
                          title={`${day.date}: ${day.calls} calls`}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stats.byDay[0]?.date ?? ''}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stats.byDay[stats.byDay.length - 1]?.date ?? ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
