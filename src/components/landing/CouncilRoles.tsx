'use client'

const ROLES = [
  {
    model: 'Claude',
    version: 'Opus 4.6',
    role: 'Architect',
    color: '#9580FF',
    why: 'Architecture needs a reasoner, not just a coder.',
    body: "Claude Opus consistently outperforms every other model on complex multi-step reasoning and decisions with cascading consequences. When an architecture choice made today shapes 40 files a week from now, you need a model that thinks in systems — not just syntax. Claude is also the only model in the council given arbitration authority, because resolving conflict requires explaining why one position is more defensible than another. That's a reasoning task, not a generation task.",
    chip: 'Highest benchmark: long-horizon reasoning',
  },
  {
    model: 'Perplexity',
    version: 'Sonar Pro',
    role: 'Researcher',
    color: '#C084FC',
    why: 'Real-time truth beats trained-in memory.',
    body: "Every other model in the council works from training data with a knowledge cutoff. Perplexity Sonar Pro queries live documentation in real time. When a package releases a breaking change the morning of your build, Claude doesn't know it happened. Perplexity does. No other model was even considered for this role — it's the only one in the industry purpose-built for live retrieval. Asking a generalist model to verify a package version is asking it to guess. Perplexity asks the internet.",
    chip: 'Purpose-built for live web retrieval',
  },
  {
    model: 'Codestral',
    version: 'Latest',
    role: 'Implementer',
    color: '#FBBF24',
    why: 'A model trained only on code writes better code.',
    body: "Mistral's Codestral is trained exclusively on code — not conversations, not essays, not general knowledge. That focused training translates directly to higher token efficiency and lower error rates on raw generation tasks compared to generalist models. When you need 300 lines of TypeScript written correctly on the first pass, you don't want a model that spent half its training data learning to write blog posts. Codestral is faster, tighter, and makes fewer implementation mistakes than any model outside its category.",
    chip: '80+ languages, code-native training',
  },
  {
    model: 'GPT',
    version: '5.4',
    role: 'Generalist & Reviewer',
    color: '#34D399',
    why: 'The best reviewer is the one most likely to disagree.',
    body: "Reviewing your own work is the most common failure mode in software engineering — and in AI. GPT-5.4 wasn't chosen for its code generation quality. It was chosen for its precision in structured evaluation: catching logical errors, security gaps, and edge cases that generation-focused models overlook precisely because they were optimized to produce output, not critique it. GPT-5.4 reviews Codestral's work because it thinks differently. That difference is the point.",
    chip: 'Highest structured evaluation precision',
  },
  {
    model: 'Gemini',
    version: '3.1 Pro',
    role: 'Refactor Specialist',
    color: '#60A5FA',
    why: 'Only one model can hold your entire codebase in memory.',
    body: "Gemini 3.1 Pro has a 2 million token context window. No other model in the council is even close. Sweeping 200 files for naming inconsistencies, architectural drift, and cross-module contradictions requires holding all of it in memory simultaneously — not sampling, not summarizing, but genuinely processing the full document. On large codebases, every other model has to make educated guesses about what they haven't seen. Gemini doesn't. That's not a feature. It's a structural advantage.",
    chip: '2M token context window',
  },
]

export default function CouncilRoles() {
  return (
    <section
      className="fade-up"
      style={{
        padding: '100px 40px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            color: 'var(--accent-blue)', display: 'block', marginBottom: '12px',
          }}>
            Role assignment
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            lineHeight: 1.05,
          }}>
            The right model.<br />
            <span style={{
              background: 'linear-gradient(135deg, #4361EE 0%, #9580FF 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              For the right reason.
            </span>
          </h2>
          <p style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Every role in your AI Council was earned. These aren&apos;t arbitrary assignments — each model holds its position because it has a documented, measurable advantage over every other model at that specific job.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {ROLES.map((r, idx) => (
            <div
              key={r.model}
              className="fade-up"
              style={{
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: '0',
                background: 'var(--border-subtle)',
                borderRadius: idx === 0 ? 'var(--radius-lg) var(--radius-lg) 0 0'
                  : idx === ROLES.length - 1 ? '0 0 var(--radius-lg) var(--radius-lg)'
                  : '0',
                overflow: 'hidden',
                transition: 'background 0.15s ease',
              }}
            >
              {/* Left: identity column */}
              <div style={{
                background: 'var(--bg-surface)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px',
                borderRight: `1px solid ${r.color}22`,
              }}>
                {/* Color bar accent */}
                <div style={{
                  width: '3px',
                  height: '40px',
                  borderRadius: '2px',
                  background: `linear-gradient(180deg, ${r.color}, ${r.color}44)`,
                  marginBottom: '4px',
                }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: r.color,
                      boxShadow: `0 0 10px ${r.color}88`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '20px',
                      fontWeight: 700, color: r.color, letterSpacing: '-0.01em',
                    }}>
                      {r.model}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    color: 'var(--text-muted)',
                    display: 'block', marginBottom: '10px',
                  }}>
                    v{r.version}
                  </span>
                </div>

                {/* Role badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  alignSelf: 'flex-start',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                  color: r.color,
                  background: `${r.color}12`,
                  border: `1px solid ${r.color}33`,
                  borderRadius: '100px',
                  padding: '4px 12px',
                  letterSpacing: '0.04em',
                }}>
                  {r.role}
                </span>

                {/* Benchmark chip */}
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: 'var(--text-muted)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '3px 8px',
                  alignSelf: 'flex-start',
                  marginTop: '4px',
                  lineHeight: 1.4,
                }}>
                  {r.chip}
                </span>
              </div>

              {/* Right: reasoning column */}
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '12px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}>
                  {r.why}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.78,
                  maxWidth: '680px',
                }}>
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          marginTop: '32px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          Roles are reviewed when benchmarks shift. If a model earns a better position, it gets one.
          <br />
          <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            The council architecture is permanent. Which model fills each role is not.
          </span>
        </p>

      </div>
    </section>
  )
}
