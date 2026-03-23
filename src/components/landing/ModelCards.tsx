'use client'

const MODEL_DOT_COLORS: Record<string, string> = {
  Claude:     '#9580FF',
  GPT:        '#34D399',
  Codestral:  '#FBBF24',
  Gemini:     '#60A5FA',
  Perplexity: '#C084FC',
}

const MODELS = [
  {
    name: 'Claude',
    model: 'Opus 4.6',
    role: 'Architect',
    description:
      'Designs system architecture, makes data modeling decisions, and acts as the final arbiter when models conflict. Every architectural choice is written to the shared ProjectState.',
    strengths: ['System design', 'Conflict arbitration', 'Long-horizon reasoning'],
  },
  {
    name: 'GPT',
    model: '5.4',
    role: 'Generalist & Reviewer',
    description:
      'Handles broad implementation tasks and serves as the primary code reviewer — cross-checking every output for correctness, security issues, and hallucinations before it reaches you.',
    strengths: ['Code review', 'API integrations', 'Security checks'],
  },
  {
    name: 'Codestral',
    model: 'Latest',
    role: 'Implementer',
    description:
      'Purpose-built for code generation. Writes fast, accurate, production-ready code using only verified dependencies and architecture decisions as its ground truth.',
    strengths: ['Code generation', '80+ languages', 'Fill-in-the-middle'],
  },
  {
    name: 'Gemini',
    model: '3.1 Pro',
    role: 'Refactor Specialist',
    description:
      'With a 2M token context window, Gemini reads your entire codebase at once — enforcing naming conventions, eliminating drift, and catching inconsistencies across every file.',
    strengths: ['Full codebase sweeps', '2M token context', 'Consistency enforcement'],
  },
  {
    name: 'Perplexity',
    model: 'Sonar Pro',
    role: 'Researcher',
    description:
      'The hallucination firewall. Verifies every library, package version, and API against live documentation before implementation begins. If it can\'t verify it, it blocks it.',
    strengths: ['Live web access', 'Package verification', 'Hallucination prevention'],
  },
]

export default function ModelCards() {
  return (
    <section
      id="council"
      className="section-fade px-6"
      style={{
        background: 'var(--background)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-16" style={{ maxWidth: '560px' }}>
          <span
            className="text-xs uppercase block"
            style={{
              color: 'var(--text-muted)',
              marginBottom: '12px',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            The council
          </span>
          <h2
            className="font-bold leading-tight"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              letterSpacing: '-0.03em',
            }}
          >
            Five specialists.{' '}
            <span style={{ color: 'var(--text-muted)' }}>One shared mission.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className="transition-all duration-200 cursor-default"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '28px',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--border-strong)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--border)'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: MODEL_DOT_COLORS[model.name] }}
                  />
                  <div>
                    <span
                      className="text-sm font-semibold block"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {model.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                    >
                      {model.model}
                    </span>
                  </div>
                </div>
                {/* Role badge — neutral */}
                <span
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 500,
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
                className="text-sm leading-relaxed mb-5"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
              >
                {model.description}
              </p>

              {/* Strength pills */}
              <div className="flex flex-wrap gap-2">
                {model.strengths.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{
                      background: 'var(--surface-2)',
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
            className="rounded-2xl p-7 flex flex-col justify-between"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: '16px',
            }}
          >
            <div className="space-y-3">
              <span
                className="text-xs uppercase tracking-widest block"
                style={{
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Ready to build?
              </span>
              <p
                className="font-bold leading-tight"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  letterSpacing: '-0.02em',
                }}
              >
                Put the whole council to work on your project.
              </p>
            </div>
            <a
              href="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{
                background: '#FAFAFA',
                color: '#0A0A0A',
              }}
            >
              Start free
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
