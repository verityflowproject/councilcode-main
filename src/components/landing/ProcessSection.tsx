'use client'

import { useEffect, useRef, useState } from 'react'

// ── Shared palette (mirrors Hero.tsx + ModelCards.tsx) ──────────────────────
const MODEL_COLORS: Record<string, string> = {
  Claude:     '#9580FF',
  GPT:        '#34D399',
  Codestral:  '#FBBF24',
  Gemini:     '#60A5FA',
  Perplexity: '#C084FC',
}

const MODEL_ROLES: Record<string, string> = {
  Claude:     'Architect',
  GPT:        'Reviewer',
  Codestral:  'Implementer',
  Gemini:     'Refactor',
  Perplexity: 'Researcher',
}

type BadgeType = 'PATCH' | 'CONFLICT' | 'ARBITRATED' | 'APPROVED' | null

interface ChatMessage {
  model: string
  text: string
  badge: BadgeType
}

const CHAT_MESSAGES: ChatMessage[] = [
  {
    model: 'Perplexity',
    text: 'next-auth@5.0.0-beta.30 confirmed stable. MongoDBAdapter compatible. No breaking changes. Proceeding.',
    badge: null,
  },
  {
    model: 'Claude',
    text: 'Architecture decision: users collection needs `plan` (enum: free/pro/teams) and `usageCount` (int). Persisting to ProjectState.',
    badge: null,
  },
  {
    model: 'Codestral',
    text: 'UserSchema implemented. Timestamps enabled, plan enum validated against type definitions.',
    badge: null,
  },
  {
    model: 'GPT',
    text: 'Index on `userId` missing — query performance will degrade at scale. Applying patch before this ships.',
    badge: 'PATCH',
  },
  {
    model: 'Codestral',
    text: 'Session TTL proposal: 24 hours.',
    badge: null,
  },
  {
    model: 'GPT',
    text: 'Conflict: session TTL should be 7 days to match the stated cross-session context goal. Cannot approve at 24h.',
    badge: 'CONFLICT',
  },
  {
    model: 'Claude',
    text: 'Arbitrated: 7-day TTL. Users expect context to persist across work sessions, not hours. Rationale logged to ProjectState.',
    badge: 'ARBITRATED',
  },
  {
    model: 'Gemini',
    text: 'Full codebase sweep complete — naming consistent across 31 files. No drift detected.',
    badge: null,
  },
  {
    model: 'GPT',
    text: 'All outputs pass review. Ready to ship.',
    badge: 'APPROVED',
  },
]

const BADGE_CONFIG: Record<NonNullable<BadgeType>, { label: string; color: string; bg: string }> = {
  PATCH:      { label: 'PATCH',      color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  CONFLICT:   { label: 'CONFLICT',   color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  ARBITRATED: { label: 'ARBITRATED', color: '#9580FF', bg: 'rgba(149,128,255,0.12)' },
  APPROVED:   { label: '✓ APPROVED', color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
}

// ── Card 1: Animated council chat ────────────────────────────────────────────
function CouncilChatCard() {
  const [visible, setVisible] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function scheduleNext(idx: number) {
      timerRef.current = setTimeout(() => {
        const next = idx + 1
        setVisible(next)
        if (next < CHAT_MESSAGES.length) {
          scheduleNext(next)
        } else {
          // Pause then restart
          timerRef.current = setTimeout(() => {
            setVisible(0)
            scheduleNext(0)
          }, 3200)
        }
      }, idx === 0 ? 600 : 1400)
    }

    setVisible(0)
    scheduleNext(0)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        minHeight: '420px',
      }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '4px' }}>
            Council session · live
          </p>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            This is what collaboration actually looks like.
          </h3>
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-green)',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--accent-green)',
            boxShadow: '0 0 8px var(--accent-green)',
            animation: 'glow-pulse 1.5s ease-in-out infinite',
            flexShrink: 0,
          }} />
          live
        </span>
      </div>

      {/* Prompt line */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '12px',
        color: 'var(--text-secondary)',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 14px',
        marginBottom: '20px',
      }}>
        <span style={{ color: 'var(--text-muted)' }}>›&nbsp;</span>
        Build a full-stack SaaS with auth, billing, and user dashboard
      </div>

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {CHAT_MESSAGES.slice(0, visible).map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              animation: 'fadeInUp 0.28s ease forwards',
            }}
          >
            {/* Color dot */}
            <span style={{
              flexShrink: 0,
              marginTop: '5px',
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: MODEL_COLORS[msg.model],
              boxShadow: `0 0 10px ${MODEL_COLORS[msg.model]}55`,
            }} />

            <div style={{ minWidth: 0, flex: 1 }}>
              {/* Name + role */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: MODEL_COLORS[msg.model] }}>
                  {msg.model}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: 'var(--text-muted)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '1px 5px',
                }}>
                  {MODEL_ROLES[msg.model]}
                </span>
                {msg.badge && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                    color: BADGE_CONFIG[msg.badge].color,
                    background: BADGE_CONFIG[msg.badge].bg,
                    border: `1px solid ${BADGE_CONFIG[msg.badge].color}44`,
                    borderRadius: '3px',
                    padding: '1px 6px',
                    letterSpacing: '0.04em',
                  }}>
                    {BADGE_CONFIG[msg.badge].label}
                  </span>
                )}
              </div>
              {/* Text */}
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {visible < CHAT_MESSAGES.length && visible > 0 && (
          <div style={{ display: 'flex', gap: '5px', paddingLeft: '19px', paddingTop: '2px' }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: '4px', height: '4px', borderRadius: '50%',
                background: 'var(--text-muted)',
                animation: 'glow-pulse 1.2s ease-in-out infinite',
                animationDelay: `${i * 180}ms`,
                display: 'inline-block',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Card 2: Every output has a verdict ──────────────────────────────────────
const VERDICTS = [
  {
    icon: '✓',
    label: 'Approved',
    color: '#34D399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.25)',
    description: 'Output passes review unchanged. Ships as-is.',
  },
  {
    icon: '~',
    label: 'Patched',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
    description: 'Reviewer corrects the output before you see it. The error never reaches you.',
  },
  {
    icon: '↑',
    label: 'Escalated',
    color: '#9580FF',
    bg: 'rgba(149,128,255,0.1)',
    border: 'rgba(149,128,255,0.25)',
    description: 'Models disagree. Claude arbitrates with a written rationale. Decision is logged.',
  },
]

function VerdictCard() {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '8px' }}>
        Review outcomes
      </p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.25 }}>
        Every output has a verdict.
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {VERDICTS.map((v) => (
          <div key={v.label} style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            background: v.bg,
            border: `1px solid ${v.border}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
          }}>
            <span style={{
              flexShrink: 0,
              width: '26px', height: '26px',
              borderRadius: '50%',
              background: `${v.color}20`,
              border: `1px solid ${v.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: v.color,
              fontFamily: 'var(--font-mono)',
            }}>
              {v.icon}
            </span>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: v.color, display: 'block', marginBottom: '3px' }}>
                {v.label}
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {v.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Card 3: ProjectState / Shared memory ────────────────────────────────────
const PROJECT_STATE_ENTRIES = [
  { key: 'architecture', value: 'REST + MongoDB, NextAuth v5',     keyColor: '#60A5FA' },
  { key: 'stack',        value: 'Next.js 14, TypeScript strict',   keyColor: '#60A5FA' },
  { key: 'auth',         value: 'Google + Email, MongoDBAdapter',  keyColor: '#60A5FA' },
  { key: 'conventions',  value: 'cc: Redis prefix, @/ imports',    keyColor: '#60A5FA' },
  { key: 'open',         value: 'Image storage provider TBD',      keyColor: '#F59E0B' },
]

function ProjectStateCard() {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '8px' }}>
        Shared memory
      </p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.25 }}>
        Context that outlives every session.
      </h3>

      {/* File viewer panel */}
      <div style={{
        flex: 1,
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        {/* File header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            ProjectState.json
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-green)' }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'var(--accent-green)',
              animation: 'glow-pulse 1.5s ease-in-out infinite',
              display: 'inline-block',
            }} />
            updated 4m ago
          </span>
        </div>

        {/* Entries */}
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PROJECT_STATE_ENTRIES.map((entry) => (
            <div key={entry.key} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: entry.keyColor,
                flexShrink: 0,
                minWidth: '94px',
              }}>
                {entry.key}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>→</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: entry.key === 'open' ? '#F59E0B' : 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                &quot;{entry.value}&quot;
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Card 4: Five roles, one output ──────────────────────────────────────────
const PIPELINE_ROLES = [
  { num: '①', model: 'Perplexity', color: '#C084FC', task: 'Verifies every dependency before anything is written' },
  { num: '②', model: 'Claude',     color: '#9580FF', task: 'Designs architecture, arbitrates conflicts' },
  { num: '③', model: 'Codestral',  color: '#FBBF24', task: 'Generates code against verified, approved context' },
  { num: '④', model: 'GPT-5.4',    color: '#34D399', task: 'Reviews every output — approved, patched, or escalated' },
  { num: '⑤', model: 'Gemini',     color: '#60A5FA', task: 'Sweeps the full codebase for consistency' },
]

function FiveRolesCard() {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '8px' }}>
        The pipeline
      </p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.25 }}>
        Five roles. One output.
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flex: 1 }}>
        {PIPELINE_ROLES.map((r, idx) => (
          <div key={r.model} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '10px 0',
            borderBottom: idx < PIPELINE_ROLES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '13px',
              color: 'var(--text-muted)',
              flexShrink: 0,
              lineHeight: 1.5,
            }}>
              {r.num}
            </span>
            <span style={{
              flexShrink: 0,
              marginTop: '6px',
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: r.color,
              boxShadow: `0 0 6px ${r.color}66`,
            }} />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: r.color, display: 'block', marginBottom: '2px' }}>
                {r.model}
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {r.task}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Card 5: Hallucination firewall ──────────────────────────────────────────
function FirewallCard() {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '8px' }}>
        Hallucination firewall
      </p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.25 }}>
        Perplexity checks before anyone writes a line.
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {/* Blocked */}
        <div style={{
          background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>Unverified request</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              color: '#EF4444',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '3px',
              padding: '2px 7px',
            }}>
              BLOCKED
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.7 }}>
            <span style={{ color: '#C084FC' }}>import</span>
            <span style={{ color: 'var(--text-secondary)' }}> {'{ signIn }'} </span>
            <span style={{ color: '#C084FC' }}>from</span>
            <span style={{ color: '#34D399' }}> &apos;next-auth/client&apos;</span>
            <br />
            <span style={{ color: 'rgba(239,68,68,0.6)' }}>{'// deprecated in v5 — does not exist'}</span>
          </div>
        </div>

        {/* Verified */}
        <div style={{
          background: 'rgba(52,211,153,0.05)',
          border: '1px solid rgba(52,211,153,0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>After Perplexity check</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              color: '#34D399',
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: '3px',
              padding: '2px 7px',
            }}>
              VERIFIED
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.7 }}>
            <span style={{ color: '#C084FC' }}>import</span>
            <span style={{ color: 'var(--text-secondary)' }}> {'{ signIn }'} </span>
            <span style={{ color: '#C084FC' }}>from</span>
            <span style={{ color: '#34D399' }}> &apos;next-auth/react&apos;</span>
            <br />
            <span style={{ color: 'rgba(52,211,153,0.6)' }}>{'// confirmed ✓ next-auth@5.0.0-beta.30'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────
export default function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="fade-up"
      style={{ padding: '100px 40px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            color: 'var(--accent-blue)', display: 'block', marginBottom: '12px',
          }}>
            How it works
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 700,
            letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '8px',
          }}>
            A structured engineering process.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '520px', margin: '0 auto' }}>
            Models don&apos;t take turns — they collaborate, verify, review, and only ship output that passes every gate.
          </p>
        </div>

        {/* Unified card grid */}
        <div style={{
          display: 'grid',
          gap: '1px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}>

          {/* Row 1: Chat card — full width */}
          <CouncilChatCard />

          {/* Row 2: 4 equal info cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'var(--border-subtle)',
          }}>
            <VerdictCard />
            <ProjectStateCard />
            <FiveRolesCard />
            <FirewallCard />
          </div>

        </div>
      </div>
    </section>
  )
}
