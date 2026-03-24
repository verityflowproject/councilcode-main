'use client'

const STEPS = [
  {
    number: '01',
    title: 'Research & Verify',
    description:
      'Before a single line is written, Perplexity verifies every library, package version, and API against live documentation. Claude then designs the architecture — data models, API structure, and system decisions — all persisted to a shared ProjectState.',
    highlights: [
      { text: 'Lab vs Field', color: 'var(--accent-cyan)' },
    ],
    detail: 'Zero hallucinated imports. Every package confirmed.',
  },
  {
    number: '02',
    title: 'Design & Implement',
    description:
      'Codestral generates production-ready code against verified dependencies and architecture decisions as ground truth. Every model reads from the same shared memory, so implementation always reflects the approved design.',
    highlights: [],
    detail: 'Code generated against confirmed facts only.',
  },
  {
    number: '03',
    title: 'Review & Ship',
    description:
      'GPT-5.4 cross-checks every output for correctness and security. Gemini sweeps the full codebase for consistency. When models disagree, Claude arbitrates with a written rationale. Nothing ships without passing every gate.',
    highlights: [],
    detail: 'Approved, patched, or escalated — never silently wrong.',
  },
]

export default function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="fade-up"
      style={{
        padding: '100px 40px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--accent-blue)',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            How it works
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '40px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            A structured engineering process.
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              textAlign: 'center',
              fontSize: '16px',
            }}
          >
            Models don&apos;t take turns — they collaborate, verify, review, and only ship reviewed output.
          </p>
        </div>

        {/* 3-column cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="fade-up"
              style={{
                background: 'var(--bg-surface)',
                padding: '40px 32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'
              }}
            >
              {/* Decorative background number */}
              <span
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '96px',
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.025)',
                  lineHeight: 1,
                  userSelect: 'none' as const,
                  pointerEvents: 'none' as const,
                }}
              >
                {step.number}
              </span>

              {/* Icon */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  marginBottom: '20px',
                  background: 'rgba(67,97,238,0.1)',
                  border: '1px solid rgba(67,97,238,0.2)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-blue)',
                  fontSize: '16px',
                }}
              >
                {step.number === '01' ? '🔍' : step.number === '02' ? '⚡' : '✓'}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                {step.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                }}
              >
                {step.description}
              </p>

              {/* Detail chip */}
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 10px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                }}
              >
                {step.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
