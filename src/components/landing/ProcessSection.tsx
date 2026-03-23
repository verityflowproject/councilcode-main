const STEPS = [
  {
    number: '01',
    title: 'You describe your project',
    description:
      'Write your project in plain language. No spec docs, no boilerplate. Just describe what you want to build.',
    detail: 'Natural language → structured task queue',
  },
  {
    number: '02',
    title: 'Perplexity verifies all dependencies',
    description:
      'Before a single line is written, our Researcher model checks every library, package version, and API against live documentation.',
    detail: 'Zero hallucinated imports. Every package confirmed.',
  },
  {
    number: '03',
    title: 'Claude designs the architecture',
    description:
      'The Architect model produces the system design, data models, and API structure. All decisions are written to the shared ProjectState.',
    detail: 'Decisions persist across the entire session.',
  },
  {
    number: '04',
    title: 'Codestral implements at speed',
    description:
      'The Implementer model generates production-ready code using the verified dependencies and architecture decisions as its ground truth.',
    detail: 'Code generated against confirmed facts only.',
  },
  {
    number: '05',
    title: 'GPT-5.4 reviews every output',
    description:
      'The Generalist model cross-checks every output for correctness, security issues, and consistency with the established conventions.',
    detail: 'Approved, patched, or escalated — never silently wrong.',
  },
  {
    number: '06',
    title: 'Gemini sweeps the full codebase',
    description:
      'With its massive context window, the Refactor model reads your entire project at once and enforces consistency across every file.',
    detail: 'Context that never drifts — even on large codebases.',
  },
  {
    number: '07',
    title: 'Conflicts go to arbitration',
    description:
      'When models disagree, Claude acts as the final arbiter — picking the correct approach and writing a rationale you can read in the session log.',
    detail: 'Every decision is transparent and auditable.',
  },
]

export default function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="section-fade px-6"
      style={{
        background: 'var(--surface)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section header */}
        <div className="mb-20" style={{ maxWidth: '600px' }}>
          <span
            className="text-xs uppercase block"
            style={{
              color: 'var(--text-muted)',
              marginBottom: '12px',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            How it works
          </span>
          <h2
            className="font-bold leading-tight mb-5"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              letterSpacing: '-0.03em',
            }}
          >
            Not a coding assistant.{' '}
            <span style={{ color: 'var(--text-muted)' }}>
              A structured engineering process.
            </span>
          </h2>
          <p
            className="text-base"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            Every project runs through the same rigorous pipeline.
            Models don&apos;t take turns — they collaborate, verify, review,
            and only ship output that has passed every gate.
          </p>
        </div>

        {/* Steps — vertical timeline */}
        <div style={{ maxWidth: '800px' }}>
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="flex gap-8"
              style={{ paddingBottom: idx < STEPS.length - 1 ? '40px' : '0' }}
            >
              {/* Left — number + connecting line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="flex items-center justify-center text-xs font-semibold rounded-full flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}
                >
                  {step.number}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className="flex-1 w-px mt-3"
                    style={{
                      background: 'var(--border)',
                      minHeight: '32px',
                    }}
                  />
                )}
              </div>

              {/* Right — content */}
              <div className="pb-2" style={{ paddingTop: '6px' }}>
                <h3
                  className="font-semibold mb-2"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '17px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
                >
                  {step.description}
                </p>
                {/* Neutral chip */}
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '2px 10px',
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
