const STEPS = [
  {
    number: '01',
    title: 'You describe your project',
    description:
      'Write your project in plain language. No spec docs, no boilerplate. Just describe what you want to build.',
    detail: 'Natural language → structured task queue',
    color: 'var(--text-muted)',
    colorHex: '#64748B',
  },
  {
    number: '02',
    title: 'Perplexity verifies all dependencies',
    description:
      'Before a single line is written, our Researcher model checks every library, package version, and API against live documentation.',
    detail: 'Zero hallucinated imports. Every package confirmed.',
    color: 'var(--perplexity)',
    colorHex: '#8B5CF6',
  },
  {
    number: '03',
    title: 'Claude designs the architecture',
    description:
      'The Architect model produces the system design, data models, and API structure. All decisions are written to the shared ProjectState.',
    detail: 'Decisions persist across the entire session.',
    color: 'var(--claude)',
    colorHex: '#4F6EF7',
  },
  {
    number: '04',
    title: 'Codestral implements at speed',
    description:
      'The Implementer model generates production-ready code using the verified dependencies and architecture decisions as its ground truth.',
    detail: 'Code generated against confirmed facts only.',
    color: 'var(--codestral)',
    colorHex: '#F59E0B',
  },
  {
    number: '05',
    title: 'GPT-5.4 reviews every output',
    description:
      'The Generalist model cross-checks every output for correctness, security issues, and consistency with the established conventions.',
    detail: 'Approved, patched, or escalated — never silently wrong.',
    color: 'var(--gpt4o)',
    colorHex: '#10B981',
  },
  {
    number: '06',
    title: 'Gemini sweeps the full codebase',
    description:
      'With its massive context window, the Refactor model reads your entire project at once and enforces consistency across every file.',
    detail: 'Context that never drifts — even on large codebases.',
    color: 'var(--gemini)',
    colorHex: '#3B82F6',
  },
  {
    number: '07',
    title: 'Conflicts go to arbitration',
    description:
      'When models disagree, Claude acts as the final arbiter — picking the correct approach and writing a rationale you can read in the session log.',
    detail: 'Every decision is transparent and auditable.',
    color: 'var(--claude)',
    colorHex: '#4F6EF7',
  },
]

export default function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="section-fade px-6"
      style={{ paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section header */}
        <div className="max-w-2xl mb-20">
          <span
            className="text-xs uppercase block"
            style={{
              color: 'var(--accent)',
              marginBottom: '8px',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            How it works
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em',
            }}
          >
            Not a coding assistant.
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>
              A structured engineering process.
            </span>
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            Every project runs through the same rigorous pipeline.
            Models don&apos;t take turns — they collaborate, verify, review,
            and only ship output that has passed every gate.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative pb-12 last:pb-0"
              style={{
                borderLeft: `2px solid ${step.colorHex}`,
                paddingLeft: '32px',
                marginLeft: '8px',
              }}
            >
              {/* Content */}
              <div className="pt-2 space-y-3 max-w-xl">
                {/* Title row with decorative ghost number */}
                <div className="relative">
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '-8px',
                      fontSize: '64px',
                      fontWeight: 800,
                      opacity: 0.08,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      lineHeight: 1,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    {step.number}
                  </span>
                  <h3
                    className="text-lg font-semibold relative"
                    style={{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {step.title}
                  </h3>
                </div>

                <p
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
                >
                  {step.description}
                </p>

                {/* Code chip */}
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(16,185,129,0.08)',
                    color: '#10B981',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
