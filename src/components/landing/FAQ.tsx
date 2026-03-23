'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: "How is CouncilCode different from GitHub Copilot or Cursor?",
    answer:
      "Copilot and Cursor are single-model autocomplete tools — they suggest code based on context but have no memory, no review process, and no accountability. CouncilCode runs five specialized models in a structured pipeline: one verifies your dependencies, one designs architecture, one writes code, one reviews every output, and one sweeps your entire codebase for consistency. No model ever reviews its own work. That's a fundamental difference in quality guarantees.",
  },
  {
    question: "How does CouncilCode actually prevent hallucinations?",
    answer:
      "Before a single line of code is written, Perplexity Sonar Pro — our Researcher model — verifies every library, package version, and external API against live documentation. If it can't confirm something exists and works as described, it blocks it. This firewall runs on every implementation and architecture task. You'll never get a convincingly-written import for a package that doesn't exist.",
  },
  {
    question: "Does context persist between sessions?",
    answer:
      "Yes. CouncilCode maintains a living ProjectState document for every project, stored in Redis for fast reads and synced to MongoDB for durability. It tracks your architecture decisions, data models, API routes, naming conventions, and open questions. Every model reads from this shared memory, so context never drifts — even on large codebases across multiple sessions.",
  },
  {
    question: "What languages and frameworks are supported?",
    answer:
      "Codestral (our Implementer model) supports 80+ languages with particular strength in TypeScript, Python, Go, Rust, and Java. Full-stack frameworks like Next.js, FastAPI, Express, and Rails are well-supported. The Researcher model verifies package availability before implementation, so you're always building on confirmed, working foundations.",
  },
  {
    question: "What if I disagree with a decision the models made?",
    answer:
      "Every session produces a full, readable audit log — you can see each model's output, the reviewer's decision (approved, patched, or escalated), and the arbitration rationale when models disagreed. Nothing is a black box. You can reference specific decisions, understand the reasoning behind them, and guide the next session with that context.",
  },
  {
    question: "How does the pricing compare to hiring a developer?",
    answer:
      "A junior developer costs $60–100k/year. CouncilCode Pro is $29/month for 2,000 model calls — that's five AI specialists available 24/7, with no onboarding, no sick days, and no context loss between tasks. For early-stage founders and solo engineers, it's a team that fits a startup budget.",
  },
  {
    question: "Is my code and project data private?",
    answer:
      "Yes. Every project runs in an isolated environment with its own ProjectState. Your code and session data are never shared between users or used for training any of the underlying models. You own your data.",
  },
  {
    question: "Can I use CouncilCode on an existing codebase?",
    answer:
      "Yes. You can describe your existing project and CouncilCode will build a ProjectState from it — architecture decisions, conventions, known dependencies. Gemini's 2M token context window means it can read your entire codebase at once and reason about it holistically, rather than just the file you have open.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
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
            FAQ
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
            Questions, answered.
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ maxWidth: '700px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <button
                  className="w-full flex items-start justify-between gap-6 py-6 text-left transition-colors duration-150"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-base font-medium"
                    style={{
                      color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="flex-shrink-0 text-lg leading-none mt-0.5 transition-transform duration-200"
                    style={{
                      color: 'var(--text-muted)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="pb-6"
                    style={{
                      animation: 'accordion-open 0.22s ease forwards',
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
