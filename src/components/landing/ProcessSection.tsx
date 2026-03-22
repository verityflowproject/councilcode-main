const STEPS = [
  {
    number: '01',
    title: 'You describe your project',
    description:
      'Write your project in plain language. No spec docs, no boilerplate. Just describe what you want to build.',
    detail: 'Natural language → structured task queue',
    color: 'var(--text-muted)',
  },
  {
    number: '02',
    title: 'Perplexity verifies all dependencies',
    description:
      'Before a single line is written, our Researcher model checks every library, package version, and API against live documentation.',
    detail: 'Zero hallucinated imports. Every package confirmed.',
    color: 'var(--perplexity)',
  },
  {
    number: '03',
    title: 'Claude designs the architecture',
    description:
      'The Architect model produces the system design, data models, and API structure. All decisions are written to the shared ProjectState.',
    detail: 'Decisions persist across the entire session.',
    color: 'var(--claude)',
  },
  {
    number: '04',
    title: 'Codestral implements at speed',
    description:
      'The Implementer model generates production-ready code using the verified dependencies and architecture decisions as its ground truth.',
    detail: 'Code generated against confirmed facts only.',
    color: 'var(--codestral)',
  },
  {
    number: '05',
    title: 'GPT-5.4 reviews every output',
    description:
      'The Generalist model cross-checks every output for correctness, security issues, and consistency with the established conventions.',
    detail: 'Approved, patched, or escalated — never silently wrong.',
    color: 'var(--gpt4o)',
  },
  {
    number: '06',
    title: 'Gemini sweeps the full codebase',
    description:
      'With its massive context window, the Refactor model reads your entire project at once and enforces consistency across every file.',
    detail: 'Context that never drifts — even on large codebases.',
    color: 'var(--gemini)',
  },
  {
    number: '07',
    title: 'Conflicts go to arbitration',
    description:
      'When models disagree, Claude acts as the final arbiter — picking the correct approach and writing a rationale you can read in the session log.',
    detail: 'Every decision is transparent and auditable.',
    color: 'var(--claude)',
  },
]

export default function ProcessSection() {
  return (
    <section id="how-it-works" className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mb-20">
          <span
            className="text-xs font-mono tracking-widest uppercase mb-4 block"
            style={{ color: 'var(--accent)' }}
          >
            How it works
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Not a coding assistant.
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>
              A structured engineering process.
            </span>
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every project runs through the same rigorous pipeline.
            Models don&apos;t take turns — they collaborate, verify, review,
            and only ship output that has passed every gate.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-0 bottom-0 w-px hidden lg:block"
            style={{ background: 'var(--border)' }}
          />
          <div className="space-y-0">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative flex gap-8 lg:gap-12 group"
              >
                {/* Step indicator */}
                <div className="relative flex-shrink-0 flex flex-col items-center">
                  <div
                    className="relative z-10 w-10 h-10 rounded-full border flex items-center justify-center text-xs font-mono font-medium transition-all duration-300"
                    style={{
                      borderColor: step.color === 'var(--text-muted)'
                        ? 'var(--border)'
                        : step.color,
                      background: 'var(--background)',
                      color: step.color === 'var(--text-muted)'
                        ? 'var(--text-muted)'
                        : step.color,
                    }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div
                  className="pb-12 flex-1 border-b last:border-b-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="pt-2 space-y-3 max-w-xl">
                    <h3
                      className="text-lg font-semibold"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {step.description}
                    </p>
                    <div
                      className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border"
                      style={{
                        borderColor: step.color === 'var(--text-muted)'
                          ? 'var(--border)'
                          : `${step.color}40`,
                        color: step.color,
                        background: step.color === 'var(--text-muted)'
                          ? 'transparent'
                          : `${step.color}10`,
                      }}
                    >
                      {step.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
