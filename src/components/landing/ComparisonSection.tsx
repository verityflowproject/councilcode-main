'use client'

const COMPARISON_ROWS = [
  {
    left: { text: 'Single model, single perspective', icon: '✕', iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.1)' },
    right: { text: 'Five specialized models with defined roles', icon: '✓', iconColor: 'var(--accent-green)' },
  },
  {
    left: { text: 'No review — output goes straight to you', icon: '✕', iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.1)' },
    right: { text: 'Cross-model review on every output', icon: '✓', iconColor: 'var(--accent-green)' },
  },
  {
    left: { text: 'Context drifts on long sessions', icon: '⚠', iconColor: 'var(--accent-amber)', iconBg: 'rgba(245,158,11,0.1)' },
    right: { text: 'Persistent ProjectState — context never drifts', icon: '✓', iconColor: 'var(--accent-green)' },
  },
  {
    left: { text: 'Hallucinated imports and phantom APIs', icon: '✕', iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.1)' },
    right: { text: 'Perplexity firewall blocks unverified deps', icon: '✓', iconColor: 'var(--accent-green)' },
  },
  {
    left: { text: 'No conflict resolution process', icon: '✕', iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.1)' },
    right: { text: 'Claude arbitrates with written rationale', icon: '✓', iconColor: 'var(--accent-green)' },
  },
  {
    left: { text: 'No codebase-wide consistency checks', icon: '⚠', iconColor: 'var(--accent-amber)', iconBg: 'rgba(245,158,11,0.1)' },
    right: { text: 'Gemini sweeps entire codebase every session', icon: '✓', iconColor: 'var(--accent-green)' },
  },
]

const STATS = [
  { number: '5', label: 'Specialized Models', description: 'Each with a defined role in the pipeline' },
  { number: '3×', label: 'Review Layers', description: 'Pre-check, post-review, full-codebase sweep' },
  { number: '0', label: 'Hallucinations', description: 'Every dependency verified against live docs' },
  { number: '∞', label: 'Context Persistence', description: 'ProjectState synced across every session' },
]

export default function ComparisonSection() {
  return (
    <section
      className="fade-up"
      style={{ padding: '100px 40px' }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            textAlign: 'center',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}
        >
          Not all AI coding tools<br />
          <span
            style={{
              background: 'linear-gradient(135deg, #4361EE, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            are created equal.
          </span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '48px' }}>
          See how a structured council compares to single-model assistants.
        </p>

        {/* Comparison table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          {/* Headers */}
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Other AI tools
            </span>
          </div>
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(67,97,238,0.06) 0%, transparent 100%)',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              borderLeft: '1px solid rgba(67,97,238,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
              VerityFlow
            </span>
            <span
              style={{
                background: 'rgba(16,185,129,0.1)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '100px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '3px 10px',
              }}
            >
              ✓ Recommended
            </span>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, idx) => (
            <div key={idx} style={{ display: 'contents' }}>
              {/* Left cell */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '16px 24px',
                  borderBottom: idx < COMPARISON_ROWS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span
                  style={{
                    color: row.left.iconColor,
                    fontSize: '12px',
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: row.left.iconBg,
                  }}
                >
                  {row.left.icon}
                </span>
                {row.left.text}
              </div>
              {/* Right cell */}
              <div
                style={{
                  background: idx % 2 === 0 ? 'rgba(67,97,238,0.02)' : 'transparent',
                  borderLeft: '1px solid rgba(67,97,238,0.2)',
                  padding: '16px 24px',
                  borderBottom: idx < COMPARISON_ROWS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ color: row.right.iconColor, fontSize: '14px', flexShrink: 0 }}>
                  {row.right.icon}
                </span>
                {row.right.text}
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="fade-up"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginTop: '64px',
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="fade-up"
              style={{
                background: 'var(--bg-surface)',
                padding: '32px 28px',
                textAlign: 'left',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '48px',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: 'var(--accent-blue)',
                  marginBottom: '4px',
                  lineHeight: 1,
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '6px',
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}
              >
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
