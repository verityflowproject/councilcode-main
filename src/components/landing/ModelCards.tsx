const MODELS = [
  {
    name: 'Claude',
    model: 'Opus 4.6',
    role: 'Architect',
    color: 'var(--claude)',
    description:
      'Designs system architecture, makes data modeling decisions, and acts as the final arbiter when models conflict. Every architectural choice is written to the shared ProjectState.',
    strengths: ['System design', 'Conflict arbitration', 'Long-horizon reasoning'],
  },
  {
    name: 'GPT',
    model: '5.4',
    role: 'Generalist & Reviewer',
    color: 'var(--gpt4o)',
    description:
      'Handles broad implementation tasks and serves as the primary code reviewer — cross-checking every output for correctness, security issues, and hallucinations before it reaches you.',
    strengths: ['Code review', 'API integrations', 'Security checks'],
  },
  {
    name: 'Codestral',
    model: 'Latest',
    role: 'Implementer',
    color: 'var(--codestral)',
    description:
      'Purpose-built for code generation. Writes fast, accurate, production-ready code using only verified dependencies and architecture decisions as its ground truth.',
    strengths: ['Code generation', '80+ languages', 'Fill-in-the-middle'],
  },
  {
    name: 'Gemini',
    model: '3.1 Pro',
    role: 'Refactor Specialist',
    color: 'var(--gemini)',
    description:
      'With a 2M token context window, Gemini reads your entire codebase at once — enforcing naming conventions, eliminating drift, and catching inconsistencies across every file.',
    strengths: ['Full codebase sweeps', '2M token context', 'Consistency enforcement'],
  },
  {
    name: 'Perplexity',
    model: 'Sonar Pro',
    role: 'Researcher',
    color: 'var(--perplexity)',
    description:
      'The hallucination firewall. Verifies every library, package version, and API against live documentation before implementation begins. If it can\'t verify it, it blocks it.',
    strengths: ['Live web access', 'Package verification', 'Hallucination prevention'],
  },
]

export default function ModelCards() {
  return (
    <section className="px-6 py-24" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span
            className="text-xs font-mono tracking-widest uppercase mb-4 block"
            style={{ color: 'var(--accent)' }}
          >
            The council
          </span>
          <h2
            className="text-4xl font-bold leading-tight"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
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
              className="rounded-xl border p-6 space-y-4 transition-all duration-200 hover:translate-y-[-2px]"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--background)',
              }}
            >
              {/* Model header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: model.color,
                        boxShadow: `0 0 8px ${model.color}`,
                      }}
                    />
                    <span
                      className="text-base font-bold"
                      style={{
                        color: model.color,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {model.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {model.model}
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full border font-mono"
                  style={{
                    borderColor: `${model.color}40`,
                    color: model.color,
                    background: `${model.color}10`,
                  }}
                >
                  {model.role}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {model.description}
              </p>

              {/* Strengths */}
              <div className="flex flex-wrap gap-2">
                {model.strengths.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 rounded border font-mono"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-muted)',
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
            className="rounded-xl border p-6 flex flex-col justify-between"
            style={{
              borderColor: 'var(--accent)',
              background: 'rgba(99,102,241,0.05)',
            }}
          >
            <div className="space-y-3">
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
              >
                Ready to build?
              </span>
              <p
                className="text-2xl font-bold leading-tight"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
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
