'use client'

const CARDS = [
  {
    icon: '⚖️',
    title: 'Five models. Zero echo chambers.',
    body: 'Cursor, Lovable, Emergent, Replit — all single model under the hood. One model writes the code, reviews the code, and approves the code. VerityFlow runs five specialized models that audit each other\'s work. Claude doesn\'t review Claude — Gemini does.',
  },
  {
    icon: '🔑',
    title: 'Your keys. Your costs. No markup.',
    body: 'Most AI tools charge you their margin on top of every API call. With VerityFlow\'s BYOK model, you pay Anthropic, OpenAI, and others directly at cost. We charge only for the orchestration — the Council architecture that makes five models work as one.',
  },
  {
    icon: '🧠',
    title: 'Context that doesn\'t drift.',
    body: 'Long builds on single-model tools degrade. The model loses the thread, contradicts earlier decisions, hallucinates dependencies. VerityFlow\'s shared project state doc keeps every model aligned from the first prompt to the last deployment.',
  },
  {
    icon: '🔍',
    title: 'You see the disagreements.',
    body: 'Other tools give you one answer. VerityFlow shows you when the Architect and Implementer disagree — and why. Disagreement isn\'t a bug. It\'s the signal that saves your project.',
  },
]

const NOT_FOR_US = [
  { task: 'Fastest for a simple landing page', tool: 'Lovable' },
  { task: 'Best in-editor autocomplete', tool: 'Cursor' },
  { task: 'Best for total beginners', tool: 'Replit' },
  { task: 'Fastest single-prompt deploy', tool: 'Emergent' },
]

export default function BuiltDifferently() {
  return (
    <section
      className="fade-up"
      style={{ padding: '100px 40px' }}
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
            Philosophy
          </span>
          <h2
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
            Built differently. Honestly.
          </h2>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            We&apos;re not the fastest way to ship a landing page. We&apos;re the most reliable way to build something real.
          </p>
        </div>

        {/* 4-card grid — 2×2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="fade-up"
              style={{
                background: 'var(--bg-surface)',
                padding: '40px 36px',
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
              {/* Icon */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  marginBottom: '20px',
                  background: 'rgba(67,97,238,0.08)',
                  border: '1px solid rgba(67,97,238,0.18)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Honest competitor contrast */}
        <div
          style={{
            marginTop: '48px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--text-muted)',
              marginBottom: '20px',
            }}
          >
            Where we&apos;re not the right tool
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px 48px',
            }}
          >
            {NOT_FOR_US.map((item) => (
              <div
                key={item.tool}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ color: 'var(--accent-amber)', flexShrink: 0 }}>→</span>
                <span>
                  {item.task}&nbsp;
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      padding: '1px 7px',
                    }}
                  >
                    {item.tool}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: '20px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            We respect these tools. We&apos;re solving a different problem.
          </p>
        </div>

      </div>
    </section>
  )
}
