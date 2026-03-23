'use client'

const MODELS = [
  {
    name: 'Claude',
    model: 'Opus 4.6',
    role: 'Architect',
    color: 'var(--claude)',
    colorHex: '#4F6EF7',
    description:
      'Designs system architecture, makes data modeling decisions, and acts as the final arbiter when models conflict. Every architectural choice is written to the shared ProjectState.',
    strengths: ['System design', 'Conflict arbitration', 'Long-horizon reasoning'],
  },
  {
    name: 'GPT',
    model: '5.4',
    role: 'Generalist & Reviewer',
    color: 'var(--gpt4o)',
    colorHex: '#10B981',
    description:
      'Handles broad implementation tasks and serves as the primary code reviewer — cross-checking every output for correctness, security issues, and hallucinations before it reaches you.',
    strengths: ['Code review', 'API integrations', 'Security checks'],
  },
  {
    name: 'Codestral',
    model: 'Latest',
    role: 'Implementer',
    color: 'var(--codestral)',
    colorHex: '#F59E0B',
    description:
      'Purpose-built for code generation. Writes fast, accurate, production-ready code using only verified dependencies and architecture decisions as its ground truth.',
    strengths: ['Code generation', '80+ languages', 'Fill-in-the-middle'],
  },
  {
    name: 'Gemini',
    model: '3.1 Pro',
    role: 'Refactor Specialist',
    color: 'var(--gemini)',
    colorHex: '#3B82F6',
    description:
      'With a 2M token context window, Gemini reads your entire codebase at once — enforcing naming conventions, eliminating drift, and catching inconsistencies across every file.',
    strengths: ['Full codebase sweeps', '2M token context', 'Consistency enforcement'],
  },
  {
    name: 'Perplexity',
    model: 'Sonar Pro',
    role: 'Researcher',
    color: 'var(--perplexity)',
    colorHex: '#8B5CF6',
    description:
      'The hallucination firewall. Verifies every library, package version, and API against live documentation before implementation begins. If it can\'t verify it, it blocks it.',
    strengths: ['Live web access', 'Package verification', 'Hallucination prevention'],
  },
]

export default function ModelCards() {
  return (
    <section
      className="section-fade px-6"
      style={{
        background: 'var(--surface)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span
            className="text-xs font-mono tracking-widest uppercase block"
            style={{
              color: 'var(--accent)',
              marginBottom: '8px',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            The council
          </span>
          <h2
            className="text-4xl font-bold leading-tight"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em',
            }}
          >
            Five specialists.
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>One shared mission.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className="group transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: `3px solid ${model.colorHex}`,
                borderRadius: '12px',
                padding: '24px',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = `rgba(255,255,255,0.12)`
                el.style.borderTopColor = model.colorHex
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.borderTopColor = model.colorHex
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Model header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: model.colorHex,
                        boxShadow: `0 0 8px ${model.colorHex}`,
                      }}
                    />
                    <span
                      className="text-base font-bold"
                      style={{
                        color: model.colorHex,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {model.name}
                    </span>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                  >
                    {model.model}
                  </span>
                </div>
                {/* Role badge — pill */}
                <span
                  style={{
                    background: `${model.colorHex}1A`,
                    color: model.colorHex,
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '999px',
                    padding: '3px 10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {model.role}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                {model.description}
              </p>

              {/* Strengths */}
              <div className="flex flex-wrap gap-2">
                {model.strengths.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 rounded border"
                    style={{
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div
            className="rounded-xl p-6 flex flex-col justify-between"
            style={{
              border: '1px solid rgba(79,110,247,0.3)',
              borderTop: '3px solid #4F6EF7',
              background: 'rgba(79,110,247,0.06)',
              borderRadius: '12px',
            }}
          >
            <div className="space-y-3">
              <span
                className="text-xs tracking-widest uppercase"
                style={{
                  color: 'var(--accent)',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Ready to build?
              </span>
              <p
                className="text-2xl font-bold leading-tight"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                Put the whole council to work on your project.
              </p>
            </div>
            <a
              href="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90"
              style={{
                background: 'var(--accent)',
                color: '#fff',
              }}
            >
              Start free
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
