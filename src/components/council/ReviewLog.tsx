'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ModelRole, TaskType } from '@/types'

const MODEL_COLORS: Record<ModelRole, string> = {
  claude:     'var(--claude)',
  gpt4o:      'var(--gpt4o)',
  codestral:  'var(--codestral)',
  gemini:     'var(--gemini)',
  perplexity: 'var(--perplexity)',
}

const MODEL_LABELS: Record<ModelRole, string> = {
  claude:     'Claude',
  gpt4o:      'GPT-5.4',
  codestral:  'Codestral',
  gemini:     'Gemini',
  perplexity: 'Perplexity',
}

const OUTCOME_CONFIG = {
  approved:  { label: 'Approved',  color: '#10b981' },
  rejected:  { label: 'Rejected',  color: '#ef4444' },
  patched:   { label: 'Patched',   color: 'var(--accent)' },
  escalated: { label: 'Escalated', color: '#f59e0b' },
}

type Outcome = keyof typeof OUTCOME_CONFIG

interface ReviewEntry {
  _id: string
  reviewingModel: ModelRole
  authorModel: ModelRole
  taskType: TaskType
  inputSummary: string
  outputSummary: string
  flaggedIssues: string[]
  outcome: Outcome
  arbitrationRequired: boolean
  arbitrationRationale?: string
  tokensUsed: number
  createdAt: string
}

interface ReviewLogProps {
  projectId: string
  sessionId?: string
  compact?: boolean
}

// --- Stats bar ---
function StatsBar({ entries }: { entries: ReviewEntry[] }) {
  const total = entries.length
  if (total === 0) return null

  const counts = entries.reduce(
    (acc, e) => {
      acc[e.outcome] = (acc[e.outcome] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const totalTokens = entries.reduce((sum, e) => sum + e.tokensUsed, 0)
  const arbitrations = entries.filter((e) => e.arbitrationRequired).length

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg border"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--surface)',
      }}
    >
      {[
        {
          label: 'Reviews',
          value: total,
          color: 'var(--text-primary)',
        },
        {
          label: 'Approved',
          value: counts.approved ?? 0,
          color: '#10b981',
        },
        {
          label: 'Arbitrated',
          value: arbitrations,
          color: '#f59e0b',
        },
        {
          label: 'Tokens used',
          value: totalTokens.toLocaleString(),
          color: 'var(--accent)',
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
            className="text-base font-bold"
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
  )
}

// --- Filter bar ---
type OutcomeFilter = Outcome | 'all'
type ModelFilter = ModelRole | 'all'

interface FilterBarProps {
  outcomeFilter: OutcomeFilter
  modelFilter: ModelFilter
  onOutcome: (v: OutcomeFilter) => void
  onModel: (v: ModelFilter) => void
  resultCount: number
}

function FilterBar({
  outcomeFilter,
  modelFilter,
  onOutcome,
  onModel,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Outcome filter */}
      <div className="flex items-center gap-1">
        {(['all', 'approved', 'patched', 'rejected', 'escalated'] as OutcomeFilter[]).map(
          (o) => (
            <button
              key={o}
              onClick={() => onOutcome(o)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-150"
              style={{
                borderColor:
                  outcomeFilter === o ? 'var(--accent)' : 'var(--border)',
                background:
                  outcomeFilter === o ? 'rgba(99,102,241,0.1)' : 'transparent',
                color:
                  outcomeFilter === o ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {o}
            </button>
          )
        )}
      </div>
      {/* Model filter */}
      <div className="flex items-center gap-1">
        {(['all', 'claude', 'gpt4o', 'codestral', 'gemini', 'perplexity'] as ModelFilter[]).map(
          (m) => (
            <button
              key={m}
              onClick={() => onModel(m)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-150"
              style={{
                borderColor:
                  modelFilter === m
                    ? m === 'all'
                      ? 'var(--border)'
                      : MODEL_COLORS[m as ModelRole]
                    : 'var(--border)',
                background:
                  modelFilter === m && m !== 'all'
                    ? `${MODEL_COLORS[m as ModelRole]}15`
                    : modelFilter === m
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                color:
                  modelFilter === m && m !== 'all'
                    ? MODEL_COLORS[m as ModelRole]
                    : modelFilter === m
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
              }}
            >
              {m === 'all' ? 'all' : MODEL_LABELS[m as ModelRole]}
            </button>
          )
        )}
      </div>
      <span
        className="ml-auto text-xs font-mono"
        style={{ color: 'var(--text-muted)' }}
      >
        {resultCount} entr{resultCount !== 1 ? 'ies' : 'y'}
      </span>
    </div>
  )
}

// --- Single entry row ---
function EntryRow({ entry }: { entry: ReviewEntry }) {
  const [expanded, setExpanded] = useState(false)
  const outcome = OUTCOME_CONFIG[entry.outcome] ?? OUTCOME_CONFIG.approved

  return (
    <div
      className="rounded-lg border overflow-hidden transition-all duration-150"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        {/* Reviewer */}
        <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: MODEL_COLORS[entry.reviewingModel] }}
          />
          <span
            className="text-xs font-semibold truncate"
            style={{ color: MODEL_COLORS[entry.reviewingModel] }}
          >
            {MODEL_LABELS[entry.reviewingModel]}
          </span>
        </div>
        <span
          className="text-xs font-mono flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          →
        </span>
        {/* Author */}
        <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: MODEL_COLORS[entry.authorModel] }}
          />
          <span
            className="text-xs font-semibold truncate"
            style={{ color: MODEL_COLORS[entry.authorModel] }}
          >
            {MODEL_LABELS[entry.authorModel]}
          </span>
        </div>
        {/* Task type */}
        <span
          className="text-xs font-mono hidden sm:block flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {entry.taskType}
        </span>
        {/* Summary preview */}
        <span
          className="text-xs flex-1 truncate hidden md:block"
          style={{ color: 'var(--text-secondary)' }}
        >
          {entry.inputSummary}
        </span>
        {/* Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded border"
            style={{
              color: outcome.color,
              borderColor: `${outcome.color}40`,
            }}
          >
            {outcome.label}
          </span>
          {entry.arbitrationRequired && (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded border hidden sm:block"
              style={{
                color: '#f59e0b',
                borderColor: 'rgba(245,158,11,0.4)',
              }}
            >
              arb
            </span>
          )}
        </div>
        {/* Chevron */}
        <span
          className="text-xs flex-shrink-0 transition-transform duration-150"
          style={{
            color: 'var(--text-muted)',
            display: 'inline-block',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>

      {/* Expanded */}
      {expanded && (
        <div
          className="px-4 pb-4 space-y-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <p
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Task
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {entry.inputSummary}
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Output summary
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {entry.outputSummary}
              </p>
            </div>
          </div>
          {entry.flaggedIssues.length > 0 && (
            <div className="space-y-1.5">
              <p
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Flagged issues
              </p>
              <div
                className="rounded-lg border p-3 space-y-1"
                style={{
                  borderColor: 'rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.04)',
                }}
              >
                {entry.flaggedIssues.map((issue, i) => (
                  <p
                    key={i}
                    className="text-xs font-mono"
                    style={{ color: '#f59e0b' }}
                  >
                    ⚠ {issue}
                  </p>
                ))}
              </div>
            </div>
          )}
          {entry.arbitrationRationale && (
            <div className="space-y-1.5">
              <p
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Arbitration rationale
              </p>
              <div
                className="rounded-lg border p-3"
                style={{
                  borderColor: 'rgba(249,115,22,0.3)',
                  background: 'rgba(249,115,22,0.04)',
                }}
              >
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {entry.arbitrationRationale}
                </p>
              </div>
            </div>
          )}
          <div
            className="flex items-center gap-6 border-t"
            style={{ borderColor: 'var(--border)', paddingTop: '12px' }}
          >
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              {entry.tokensUsed.toLocaleString()} tokens
            </span>
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              {new Date(entry.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main component ---
export default function ReviewLog({
  projectId,
  sessionId,
  compact = false,
}: ReviewLogProps) {
  const [entries, setEntries] = useState<ReviewEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all')
  const [modelFilter, setModelFilter] = useState<ModelFilter>('all')

  const fetchReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ projectId, limit: '100' })
      if (sessionId) params.set('sessionId', sessionId)
      const res = await fetch(`/api/project/reviews?${params}`)
      const data = await res.json()
      if (data.reviews) setEntries(data.reviews)
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [projectId, sessionId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const filtered = entries.filter((e) => {
    const outcomeMatch =
      outcomeFilter === 'all' || e.outcome === outcomeFilter
    const modelMatch =
      modelFilter === 'all' ||
      e.reviewingModel === modelFilter ||
      e.authorModel === modelFilter
    return outcomeMatch && modelMatch
  })

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg border animate-pulse"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
            }}
          />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div
        className="rounded-lg border p-8 text-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <p
          className="text-sm font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          No reviews yet
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          Start a session to see the council at work
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {!compact && <StatsBar entries={entries} />}
      {/* Filters */}
      {!compact && (
        <FilterBar
          outcomeFilter={outcomeFilter}
          modelFilter={modelFilter}
          onOutcome={setOutcomeFilter}
          onModel={setModelFilter}
          resultCount={filtered.length}
        />
      )}
      {/* Entries */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div
            className="rounded-lg border p-6 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <p
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              No entries match these filters
            </p>
          </div>
        ) : (
          filtered.map((entry) => (
            <EntryRow key={entry._id} entry={entry} />
          ))
        )}
      </div>
      {/* Refresh */}
      <button
        onClick={fetchReviews}
        className="w-full text-xs font-mono py-2 rounded-lg border transition-all duration-150 hover:border-accent"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        Refresh log
      </button>
    </div>
  )
}
