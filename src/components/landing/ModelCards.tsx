'use client'

const MODEL_DOT_COLORS: Record<string, string> = {
  Claude:     '#9580FF',
  GPT:        '#34D399',
  Codestral:  '#FBBF24',
  Gemini:     '#60A5FA',
  Perplexity: '#C084FC',
}

const MODELS = [
  { name: 'Claude',     model: 'Opus 4.6',    role: 'Architect' },
  { name: 'GPT',        model: '5.4',          role: 'Generalist & Reviewer' },
  { name: 'Codestral',  model: 'Latest',       role: 'Implementer' },
  { name: 'Gemini',     model: '3.1 Pro',      role: 'Refactor Specialist' },
  { name: 'Perplexity', model: 'Sonar Pro',    role: 'Researcher' },
]

export default function ModelCards() {
  return (
    <section
      id="council"
      className="fade-up"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '32px 40px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'var(--text-muted)',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Powered by the council
        </p>

        {/* Model strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0',
          }}
        >
          {MODELS.map((model, idx) => (
            <div
              key={model.name}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 24px',
                borderRight: idx < MODELS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: MODEL_DOT_COLORS[model.name],
                    boxShadow: `0 0 6px ${MODEL_DOT_COLORS[model.name]}40`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {model.name} <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{model.model}</span>
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}
              >
                {model.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
