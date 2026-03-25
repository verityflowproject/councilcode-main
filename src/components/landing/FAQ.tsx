'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    question: 'Why not just open five tabs?',
    answer: null,
    longAnswer: true,
    parts: [
      {
        type: 'text',
        content: 'This is the right question to ask. You could open Claude, ChatGPT, Gemini, Codestral, and Perplexity in separate tabs and manually route your work between them. Some developers do exactly this.',
      },
      {
        type: 'text',
        content: "Here's what that workflow actually looks like in practice:",
      },
      {
        type: 'list',
        items: [
          'You paste context into each tab separately — and each model only knows what you told it, not what the others said',
          'When Claude and GPT-4o give conflicting answers, you decide which one is right with no structured way to arbitrate',
          'When you start a new session, all five tabs are blank — none of them remember the architectural decisions from yesterday',
          'Copy-pasting between tabs is your orchestration layer',
          'You are the shared context document',
        ],
      },
      {
        type: 'text',
        content: 'VerityFlow automates exactly this workflow — but with a structured review protocol, a persistent project state that every model reads before responding, automatic conflict detection between models, and smart routing so the right model handles the right task without you deciding every time.',
      },
      {
        type: 'text',
        content: 'The five-tab approach works. It just means you\'re doing the job VerityFlow was built to do.',
        muted: true,
      },
    ],
  },
  {
    question: 'How is VerityFlow different from GitHub Copilot or Cursor?',
    answer:
      'Copilot and Cursor are single-model autocomplete tools — they suggest code based on context but have no memory, no review process, and no accountability. VerityFlow runs five specialized models in a structured pipeline: one verifies your dependencies, one designs architecture, one writes code, one reviews every output, and one sweeps your entire codebase for consistency. No model ever reviews its own work.',
  },
  {
    question: 'How does VerityFlow actually prevent hallucinations?',
    answer:
      "Before a single line of code is written, Perplexity Sonar Pro verifies every library, package version, and external API against live documentation. If it can't confirm something exists and works as described, it blocks it. This firewall runs on every implementation and architecture task. You'll never get a convincingly-written import for a package that doesn't exist.",
  },
  {
    question: 'Does context persist between sessions?',
    answer:
      'Yes. VerityFlow maintains a living ProjectState document for every project, stored in Redis for fast reads and synced to MongoDB for durability. It tracks your architecture decisions, data models, API routes, naming conventions, and open questions. Every model reads from this shared memory before responding — so context never drifts, even across multiple sessions.',
  },
  {
    question: 'What happens if a better model comes along for a role?',
    answer: null,
    longAnswer: true,
    parts: [
      {
        type: 'text',
        content: "It gets the role. The council architecture is permanent — which model fills each position is not.",
      },
      {
        type: 'text',
        content: "Each model was assigned its role because it has a measurable advantage on that specific job right now. Claude is the Architect because it currently leads on long-horizon reasoning and arbitration quality. Gemini is the Refactor Specialist because no other model has a 2M-token context window. If those advantages shift, the assignments shift.",
      },
      {
        type: 'text',
        content: "When benchmarks meaningfully change, we run both the incumbent and the challenger in parallel on a standardized task suite specific to that role — not general leaderboards. If the challenger produces demonstrably better outputs on the tasks that role actually requires, we transition. The rationale is documented publicly.",
      },
      {
        type: 'text',
        content: "The goal is always the best council, not loyalty to any vendor.",
        muted: true,
      },
    ],
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="fade-up"
      style={{ padding: '120px 40px' }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
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
            FAQ
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Questions, answered.
          </h2>
        </div>

        {/* Accordion */}
        <div>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="fade-up"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '24px',
                    padding: '20px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    const span = e.currentTarget.querySelector('span:first-child') as HTMLSpanElement
                    if (span) span.style.color = 'var(--accent-blue)'
                  }}
                  onMouseLeave={(e) => {
                    const span = e.currentTarget.querySelector('span:first-child') as HTMLSpanElement
                    if (span) span.style.color = isOpen ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: '20px',
                      fontWeight: 300,
                      lineHeight: 1,
                      color: 'var(--text-muted)',
                      transition: 'transform 0.2s ease',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      marginTop: '2px',
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      paddingBottom: '24px',
                      animation: 'accordion-open 0.22s ease forwards',
                    }}
                  >
                    {faq.longAnswer ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {faq.parts?.map((part, pIdx) => {
                          if (part.type === 'text') {
                            return (
                              <p
                                key={pIdx}
                                style={{
                                  fontSize: '14px',
                                  color: part.muted ? 'var(--text-muted)' : 'var(--text-secondary)',
                                  lineHeight: 1.75,
                                  fontStyle: part.muted ? 'italic' : 'normal',
                                }}
                              >
                                {part.content}
                              </p>
                            )
                          }
                          if (part.type === 'list') {
                            return (
                              <ul
                                key={pIdx}
                                style={{
                                  paddingLeft: '0',
                                  margin: '0',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                  listStyle: 'none',
                                }}
                              >
                                {part.items?.map((item, iIdx) => (
                                  <li
                                    key={iIdx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '10px',
                                      fontSize: '14px',
                                      color: 'var(--text-secondary)',
                                      lineHeight: 1.65,
                                    }}
                                  >
                                    <span
                                      style={{
                                        flexShrink: 0,
                                        marginTop: '5px',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-blue)',
                                        display: 'inline-block',
                                      }}
                                    />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )
                          }
                          return null
                        })}
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.75,
                        }}
                      >
                        {faq.answer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Link to full FAQ page */}
        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/faq"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: 'var(--accent-blue)',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            See all questions →
          </Link>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Pricing, privacy, technical details, and more.
          </span>
        </div>
      </div>
    </section>
  )
}
