import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'VerityFlow vs Cursor, Copilot, Lovable & more | VerityFlow',
  description:
    'An honest comparison of AI coding tools. How VerityFlow\'s 5-model AI Council compares to Cursor, GitHub Copilot, Lovable, Emergent, and Replit.',
}

// Cell value types
type CellValue =
  | { type: 'check'; note?: string }
  | { type: 'cross' }
  | { type: 'text'; value: string }

const CHECK = (note?: string): CellValue => ({ type: 'check', note })
const CROSS: CellValue = { type: 'cross' }
const TEXT = (value: string): CellValue => ({ type: 'text', value })

interface CompareRow {
  label: string
  verityflow: CellValue
  cursor: CellValue
  copilot: CellValue
  lovable: CellValue
  emergent: CellValue
  replit: CellValue
}

interface RowGroup {
  group: string
  rows: CompareRow[]
}

const TABLE_DATA: RowGroup[] = [
  {
    group: 'Architecture',
    rows: [
      {
        label: 'Single vs multi-model',
        verityflow: TEXT('Multi-model Council (5 roles)'),
        cursor: TEXT('Single model per request'),
        copilot: TEXT('Single model per request'),
        lovable: TEXT('Single model'),
        emergent: TEXT('Single model'),
        replit: TEXT('Single model per request'),
      },
      {
        label: 'Cross-model review',
        verityflow: CHECK('Core feature'),
        cursor: CROSS,
        copilot: CROSS,
        lovable: CROSS,
        emergent: CROSS,
        replit: CROSS,
      },
      {
        label: 'Shared project state',
        verityflow: CHECK('Persistent across session'),
        cursor: TEXT('Partial — codebase indexing'),
        copilot: TEXT('Limited or session-only'),
        lovable: TEXT('Limited or session-only'),
        emergent: TEXT('Limited or session-only'),
        replit: TEXT('Limited or session-only'),
      },
      {
        label: 'Context drift prevention',
        verityflow: CHECK('Architectural solution'),
        cursor: TEXT('Partial — context window limited'),
        copilot: CROSS,
        lovable: CROSS,
        emergent: CROSS,
        replit: CROSS,
      },
    ],
  },
  {
    group: 'Cost & Ownership',
    rows: [
      {
        label: 'BYOK support',
        verityflow: CHECK('Required or optional'),
        cursor: TEXT('Partial — available on some plans'),
        copilot: CROSS,
        lovable: CROSS,
        emergent: CROSS,
        replit: CROSS,
      },
      {
        label: 'API cost markup',
        verityflow: TEXT('None with BYOK'),
        cursor: TEXT('Markup on platform credits'),
        copilot: TEXT('Subscription includes markup'),
        lovable: TEXT('Yes — credits with markup'),
        emergent: TEXT('Yes'),
        replit: TEXT('Yes — subscription + credits'),
      },
    ],
  },
  {
    group: 'Code Quality',
    rows: [
      {
        label: 'Hallucination mitigation',
        verityflow: CHECK('Multi-model cross-check + firewall'),
        cursor: TEXT('Standard — single model'),
        copilot: TEXT('Standard — single model'),
        lovable: TEXT('Standard — single model'),
        emergent: TEXT('Standard — single model'),
        replit: TEXT('Standard — single model'),
      },
      {
        label: 'Self-review problem',
        verityflow: TEXT('Eliminated by design'),
        cursor: TEXT('Present — model reviews own output'),
        copilot: TEXT('Present — model reviews own output'),
        lovable: TEXT('Present — model reviews own output'),
        emergent: TEXT('Present — model reviews own output'),
        replit: TEXT('Present — model reviews own output'),
      },
      {
        label: 'Long-session quality',
        verityflow: TEXT('High — state doc prevents drift'),
        cursor: TEXT('Good — better than most'),
        copilot: TEXT('Degrades with session length'),
        lovable: TEXT('Degrades with session length'),
        emergent: TEXT('Degrades with session length'),
        replit: TEXT('Degrades with session length'),
      },
    ],
  },
  {
    group: 'Use Case Fit',
    rows: [
      {
        label: 'Best for simple landing pages',
        verityflow: TEXT('Possible, not optimal'),
        cursor: TEXT('Good'),
        copilot: TEXT('Good'),
        lovable: CHECK('Excellent'),
        emergent: CHECK('Very fast'),
        replit: TEXT('Good'),
      },
      {
        label: 'Best for complex full-stack',
        verityflow: CHECK('Primary use case'),
        cursor: TEXT('Good with manual context management'),
        copilot: TEXT('Limited'),
        lovable: TEXT('Limited'),
        emergent: TEXT('Limited'),
        replit: TEXT('Limited'),
      },
      {
        label: 'Best for in-editor autocomplete',
        verityflow: CROSS,
        cursor: CHECK('Best in class'),
        copilot: CHECK('Strong'),
        lovable: CROSS,
        emergent: CROSS,
        replit: CROSS,
      },
      {
        label: 'Best for beginners',
        verityflow: TEXT('Moderate — some setup required'),
        cursor: TEXT('Moderate'),
        copilot: CHECK('Very accessible'),
        lovable: CHECK('Excellent'),
        emergent: CHECK('Excellent'),
        replit: CHECK('Best in class'),
      },
    ],
  },
]

function Cell({ value, isVerityFlow }: { value: CellValue; isVerityFlow?: boolean }) {
  if (value.type === 'check') {
    return (
      <td
        style={{
          padding: '14px 20px',
          verticalAlign: 'top',
          background: isVerityFlow ? 'rgba(67,97,238,0.04)' : 'transparent',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)',
              color: '#10b981',
              fontSize: '10px',
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            ✓
          </span>
          {value.note && (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {value.note}
            </span>
          )}
        </div>
      </td>
    )
  }

  if (value.type === 'cross') {
    return (
      <td
        style={{
          padding: '14px 20px',
          verticalAlign: 'top',
          background: isVerityFlow ? 'rgba(67,97,238,0.04)' : 'transparent',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-muted)',
            fontSize: '10px',
          }}
        >
          ✕
        </span>
      </td>
    )
  }

  return (
    <td
      style={{
        padding: '14px 20px',
        verticalAlign: 'top',
        background: isVerityFlow ? 'rgba(67,97,238,0.04)' : 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {value.value}
      </span>
    </td>
  )
}

const CALLOUTS = [
  {
    title: 'The self-review problem',
    body: `Every major AI coding tool uses a single model to write code and, implicitly, validate it. When you ask the model to check its own work, you're asking it to find mistakes it doesn't know it made. This is not a criticism of those tools — it's a structural limitation of single-model architecture.

VerityFlow eliminates this by design. The model that writes your code is not the model that reviews it. Claude architects the solution. Codestral implements it. Gemini refactors and audits it. GPT-4o generalizes and cross-checks. Perplexity grounds decisions in current documentation. No model grades its own homework.`,
  },
  {
    title: 'Why not just open five tabs?',
    body: `This is the right question to ask. You could open Claude, ChatGPT, Gemini, Codestral, and Perplexity in separate tabs and manually route your work between them. Some developers do exactly this.

Here's what that workflow actually looks like in practice: You paste context into each tab separately — and each model only knows what you told it, not what the others said. When models give conflicting answers, you decide which is right with no structured arbitration. When you start a new session, all tabs are blank. Copy-pasting between tabs is your orchestration layer. You are the shared context document.

VerityFlow automates exactly this workflow — with a structured review protocol, a persistent project state every model reads before responding, automatic conflict detection, and smart routing so the right model handles the right task.

The five-tab approach works. It just means you're doing the job VerityFlow was built to do.`,
  },
  {
    title: 'Context drift at scale',
    body: `In a 20-minute session, single-model tools perform well. In a 3-hour build spanning dozens of prompts, they begin to drift. The model starts contradicting earlier decisions — importing libraries it told you not to use, redefining functions it already wrote, forgetting the schema it designed.

VerityFlow's shared project state document travels with every Council request. Every model — regardless of when it joins the session — has access to the same architectural decisions, naming conventions, and constraints established at the start. Drift is not managed. It is prevented.`,
  },
  {
    title: 'What BYOK actually means for your costs',
    body: `When you use a platform-key tool, you're paying: the underlying API cost (what Anthropic or OpenAI charges), the platform's margin on top of that cost, and a subscription fee on top of that.

With VerityFlow's BYOK model, the middle layer disappears entirely. You pay Anthropic directly. You pay OpenAI directly. VerityFlow charges only for the orchestration layer.

Or use VerityFlow Credits for zero-setup access — one purchase, all five models, no API accounts required.`,
  },
]

export default function ComparePage() {
  return (
    <div
      style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Nav spacer */}
      <div style={{ height: '64px' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px' }}>

        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent-blue)',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Comparison
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              lineHeight: 1.05,
            }}
          >
            How VerityFlow compares
          </h1>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            An honest look at AI coding tools — where we win, where we don&apos;t,
            and why the architecture difference matters at scale.
          </p>
        </div>

        {/* Disclaimer box */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: '40px',
            maxWidth: '720px',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            This comparison reflects our honest assessment as of March 2026. These tools update
            frequently — if you spot something outdated, email us at{' '}
            <a
              href="mailto:contact@verityflow.io"
              style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
            >
              contact@verityflow.io
            </a>
            .
          </p>
        </div>

        {/* Comparison table — horizontally scrollable on mobile */}
        <div
          style={{
            overflowX: 'auto',
            marginBottom: '80px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: '860px',
              borderCollapse: 'collapse',
              background: 'var(--bg-surface)',
            }}
          >
            {/* Column headers */}
            <thead>
              <tr>
                <th
                  style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-default)',
                    width: '220px',
                    position: 'sticky',
                    left: 0,
                    zIndex: 2,
                  }}
                >
                  Criteria
                </th>
                {[
                  { label: 'VerityFlow', accent: true },
                  { label: 'Cursor', accent: false },
                  { label: 'GitHub Copilot', accent: false },
                  { label: 'Lovable', accent: false },
                  { label: 'Emergent', accent: false },
                  { label: 'Replit', accent: false },
                ].map(({ label, accent }) => (
                  <th
                    key={label}
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: accent ? 'var(--accent-blue)' : 'var(--text-primary)',
                      background: accent ? 'rgba(67,97,238,0.06)' : 'var(--bg-surface)',
                      borderBottom: '1px solid var(--border-default)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {TABLE_DATA.map((group) => (
                <>
                  {/* Group header row */}
                  <tr key={`group-${group.group}`}>
                    <td
                      colSpan={7}
                      style={{
                        padding: '10px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-blue)',
                        background: 'rgba(67,97,238,0.04)',
                        borderTop: '1px solid var(--border-default)',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      {group.group}
                    </td>
                  </tr>

                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      {/* Sticky label column */}
                      <td
                        style={{
                          padding: '14px 20px',
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                          fontWeight: 500,
                          borderBottom: '1px solid var(--border-subtle)',
                          position: 'sticky',
                          left: 0,
                          background: 'var(--bg-surface)',
                          zIndex: 1,
                          lineHeight: 1.4,
                        }}
                      >
                        {row.label}
                      </td>
                      <Cell value={row.verityflow} isVerityFlow />
                      <Cell value={row.cursor} />
                      <Cell value={row.copilot} />
                      <Cell value={row.lovable} />
                      <Cell value={row.emergent} />
                      <Cell value={row.replit} />
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Narrative callouts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '80px' }}>
          {CALLOUTS.map((callout) => (
            <div
              key={callout.title}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 44px',
                maxWidth: '840px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '20px',
                }}
              >
                {callout.title}
              </h2>
              {callout.body.split('\n\n').map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    marginBottom: i < callout.body.split('\n\n').length - 1 ? '16px' : 0,
                    fontWeight: 300,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(67,97,238,0.1), transparent 70%)',
            borderTop: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '48px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            Ready to build with a full team?
          </h2>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              marginBottom: '36px',
            }}
          >
            Bring your own keys. Ship code you can trust.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent-blue)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                boxShadow: '0 0 0 1px rgba(67,97,238,0.4)',
              }}
            >
              Start building free
            </Link>
            <Link
              href="/#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 400,
                textDecoration: 'none',
              }}
            >
              See how it works →
            </Link>
          </div>
          <p
            style={{
              marginTop: '20px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            No API markup with BYOK. Five models. One coherent build.
          </p>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          Last updated: March 2026
        </p>

      </div>
    </div>
  )
}
