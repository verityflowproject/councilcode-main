'use client'

import type { ModelRole } from '@/types'

const MODEL_CONFIG: Record<ModelRole, { label: string; color: string; role: string }> = {
  claude:     { label: 'Claude',     color: 'var(--claude)',     role: 'Architect'   },
  gpt4o:      { label: 'GPT-5.4',   color: 'var(--gpt4o)',     role: 'Reviewer'    },
  codestral:  { label: 'Codestral', color: 'var(--codestral)', role: 'Implementer' },
  gemini:     { label: 'Gemini',    color: 'var(--gemini)',     role: 'Refactor'    },
  perplexity: { label: 'Perplexity',color: 'var(--perplexity)', role: 'Researcher'  },
}

export type FeedEvent =
  | { type: 'thinking';     model: ModelRole; message: string }
  | { type: 'output';       model: ModelRole; output: string; approved?: boolean; patched?: boolean }
  | { type: 'review';       model: ModelRole; approved: boolean; issues: string[] }
  | { type: 'arbitration';  winner: ModelRole | 'neither'; rationale: string; patched: boolean }
  | { type: 'firewall';     blocked: boolean; warnings: string[]; verified: number }
  | { type: 'error';        model: ModelRole; message: string }
  | { type: 'system';       message: string }

interface ModelFeedProps {
  events: FeedEvent[]
  isRunning: boolean
}

function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n').slice(0, 24)
  const truncated = code.split('\n').length > 24
  return (
    <div
      className="rounded-lg border overflow-hidden mt-2"
      style={{ borderColor: 'var(--border)' }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{
          borderColor: 'var(--border)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <span
          className="text-xs font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          output
        </span>
      </div>
      <pre
        className="p-3 text-xs font-mono overflow-x-auto leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {lines.join('\n')}
        {truncated && (
          <span style={{ color: 'var(--text-muted)' }}>
            {'\n'}... {code.split('\n').length - 24} more lines
          </span>
        )}
      </pre>
    </div>
  )
}

function EventRow({ event }: { event: FeedEvent }) {
  if (event.type === 'system') {
    return (
      <div className="flex items-center gap-3 py-2">
        <div
          className="flex-shrink-0 h-px flex-1"
          style={{ background: 'var(--border)' }}
        />
        <span
          className="text-xs font-mono whitespace-nowrap"
          style={{ color: 'var(--text-muted)' }}
        >
          {event.message}
        </span>
        <div
          className="flex-shrink-0 h-px flex-1"
          style={{ background: 'var(--border)' }}
        />
      </div>
    )
  }

  if (event.type === 'firewall') {
    return (
      <div
        className="rounded-lg border p-3 space-y-1.5"
        style={{
          borderColor: event.blocked
            ? 'rgba(239,68,68,0.3)'
            : 'rgba(192,132,252,0.25)',
          background: event.blocked
            ? 'rgba(239,68,68,0.05)'
            : 'rgba(192,132,252,0.04)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: 'var(--perplexity)' }}
          >
            Perplexity / Researcher
          </span>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded border"
            style={{
              color: event.blocked ? 'var(--accent-red)' : 'var(--accent-green)',
              borderColor: event.blocked
                ? 'rgba(239,68,68,0.4)'
                : 'rgba(16,185,129,0.4)',
            }}
          >
            {event.blocked ? 'blocked' : `${event.verified} verified`}
          </span>
        </div>
        <p
          className="text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {event.blocked
            ? 'Execution blocked — unverified dependencies detected.'
            : `Hallucination firewall passed. ${event.verified} packages verified.`}
        </p>
        {event.warnings.length > 0 && (
          <ul className="space-y-0.5">
            {event.warnings.map((w, i) => (
              <li
                key={i}
                className="text-xs font-mono"
                style={{ color: 'var(--accent-amber)' }}
              >
                ⚠ {w}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (event.type === 'arbitration') {
    return (
      <div
        className="rounded-lg border p-3 space-y-2"
        style={{
          borderColor: 'rgba(245,158,11,0.3)',
          background: 'rgba(245,158,11,0.05)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: 'var(--claude)' }}
          >
            Claude / Arbiter
          </span>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded border"
            style={{
              color: 'var(--accent-amber)',
              borderColor: 'rgba(245,158,11,0.4)',
            }}
          >
            arbitration
          </span>
          {event.patched && (
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded border"
              style={{
                color: 'var(--accent-blue)',
                borderColor: 'rgba(67,97,238,0.4)',
              }}
            >
              patched
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Winner:{' '}
            <span
              style={{
                color: event.winner === 'neither'
                  ? 'var(--text-secondary)'
                  : MODEL_CONFIG[event.winner]?.color ?? 'var(--text-primary)',
              }}
            >
              {event.winner === 'neither'
                ? 'Neither — Claude produced corrected output'
                : `${MODEL_CONFIG[event.winner]?.label ?? event.winner}`}
            </span>
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {event.rationale}
          </p>
        </div>
      </div>
    )
  }

  if (event.type === 'error') {
    const cfg = MODEL_CONFIG[event.model]
    return (
      <div
        className="rounded-lg border p-3"
        style={{
          borderColor: 'rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.05)',
        }}
      >
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
        <p
          className="text-xs mt-1"
          style={{ color: 'var(--accent-red)' }}
        >
          {event.message}
        </p>
      </div>
    )
  }

  // Model events (thinking, output, review)
  const cfg = MODEL_CONFIG[(event as { model: ModelRole }).model]
  if (!cfg) return null

  return (
    <div className="flex gap-3 items-start group">
      {/* Indicator */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: cfg.color,
            boxShadow: event.type === 'thinking'
              ? `0 0 8px ${cfg.color}`
              : 'none',
            animation: event.type === 'thinking'
              ? 'pulse-dot 1.5s ease-in-out infinite'
              : 'none',
          }}
        />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            {cfg.role}
          </span>
          {event.type === 'thinking' && (
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              thinking...
            </span>
          )}
          {event.type === 'review' && (
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded border"
            style={{
              color: event.approved ? 'var(--accent-green)' : 'var(--accent-red)',
              borderColor: event.approved
                ? 'rgba(16,185,129,0.4)'
                : 'rgba(239,68,68,0.4)',
            }}
            >
              {event.approved ? 'approved' : 'flagged'}
            </span>
          )}
          {event.type === 'output' && event.patched && (
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded border"
              style={{
                color: 'var(--accent-blue)',
                borderColor: 'rgba(67,97,238,0.4)',
              }}
            >
              patched
            </span>
          )}
        </div>
        {event.type === 'thinking' && (
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {event.message}
          </p>
        )}
        {event.type === 'output' && (
          <CodeBlock code={event.output} />
        )}
        {event.type === 'review' && (
          <div className="space-y-1.5">
            {event.issues.length > 0 ? (
              <ul className="space-y-1">
                {event.issues.map((issue, i) => (
                  <li
                    key={i}
                  className="text-xs font-mono"
                  style={{ color: 'var(--accent-amber)' }}
                >
                  ⚠ {issue}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                No issues found. Output approved.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ModelFeed({ events, isRunning }: ModelFeedProps) {
  return (
    <div className="space-y-2">
      {events.map((event, i) => (
        <div
          key={i}
          style={{
            animation: 'slide-in-right 0.25s ease forwards',
          }}
        >
          <EventRow event={event} />
        </div>
      ))}
      {isRunning && events.length === 0 && (
        <div className="flex items-center gap-2 py-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--text-muted)',
                animation: `pulse-dot 1.2s ease-in-out infinite`,
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Council assembling...
          </span>
        </div>
      )}
    </div>
  )
}
