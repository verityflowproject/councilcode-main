'use client'

import Link from 'next/link'
import { useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

interface FAQItem {
  question: string
  parts: Array<
    | { type: 'text'; content: string; muted?: boolean }
    | { type: 'list'; items: string[] }
  >
}

interface FAQCategory {
  label: string
  icon: string
  items: FAQItem[]
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    label: 'How It Works',
    icon: '⚙️',
    items: [
      {
        question: 'Why not just open five tabs?',
        parts: [
          {
            type: 'text',
            content:
              'This is the right question to ask. You could open Claude, ChatGPT, Gemini, Codestral, and Perplexity in separate tabs and manually route your work between them. Some developers do exactly this.',
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
            content:
              'VerityFlow automates exactly this workflow — but with a structured review protocol, a persistent project state that every model reads before responding, automatic conflict detection between models, and smart routing so the right model handles the right task without you deciding every time.',
          },
          {
            type: 'text',
            content:
              "The five-tab approach works. It just means you're doing the job VerityFlow was built to do.",
            muted: true,
          },
        ],
      },
      {
        question: 'How is VerityFlow different from Cursor, Copilot, or Lovable?',
        parts: [
          {
            type: 'text',
            content:
              'Cursor and Copilot are in-editor autocomplete tools — single-model, no memory, no review process. They suggest code based on the file you have open. Lovable and similar tools generate a project from a prompt using one model, and what you see is what you get.',
          },
          {
            type: 'text',
            content:
              'VerityFlow runs five specialized models in a pipeline with defined roles. One verifies your dependencies against live docs before anything is written. One designs the architecture. One generates the code. One cross-reviews every output. One sweeps your entire codebase for consistency. No model ever reviews its own work.',
          },
          {
            type: 'text',
            content:
              "These are genuinely different categories of tool. Cursor is best for fast in-editor suggestions. VerityFlow is for complex builds where you need quality guarantees and persistent context across sessions.",
            muted: true,
          },
        ],
      },
      {
        question: 'What are the five models and what does each one do?',
        parts: [
          {
            type: 'list',
            items: [
              'Claude Opus (Architect) — system design, data models, logic decisions, and conflict arbitration when models disagree',
              'GPT-5.4 (Generalist & Reviewer) — broad implementation, API integrations, and post-generation code review',
              'Codestral Latest (Implementer) — raw code generation, speed tasks, and fill-in-the-middle completions',
              'Gemini 3.1 Pro (Refactor Specialist) — full-codebase context sweeps and consistency enforcement across all files',
              'Perplexity Sonar Pro (Researcher) — live documentation verification, package version confirmation, hallucination firewall',
            ],
          },
          {
            type: 'text',
            content:
              'Each model has a clearly scoped role. The routing logic decides which model handles which task — you describe what you want to build, not which model should do it.',
          },
        ],
      },
      {
        question: 'How does the review pipeline work?',
        parts: [
          {
            type: 'text',
            content: 'Every output goes through a structured pipeline before you see it:',
          },
          {
            type: 'list',
            items: [
              'Pre-check: If the task touches external libraries or APIs, Perplexity verifies them against live documentation first',
              'Primary execution: The correct model for the task type runs against verified context',
              'Cross-model review: A different model reviews the output — approved, patched, or escalated',
              'Arbitration (if needed): Claude reviews both outputs with written rationale and makes a final call',
              'Codebase sweep: Gemini checks that the output is consistent with the rest of the project',
            ],
          },
          {
            type: 'text',
            content:
              'Every step is logged in a readable review log. Nothing is a black box.',
          },
        ],
      },
      {
        question: 'What happens when models disagree?',
        parts: [
          {
            type: 'text',
            content:
              "When the Implementer's code and the Reviewer's assessment conflict, the system escalates to Claude acting as Architect. Claude reads both outputs, identifies the conflict, and produces a written arbitration rationale — explaining which approach is correct and why.",
          },
          {
            type: 'text',
            content:
              'The full conflict, both positions, and the arbitration decision are logged to the review log for that session. You can see every disagreement and the reasoning behind how it was resolved.',
          },
          {
            type: 'text',
            content:
              "Disagreement between models isn't a failure state. It's often the signal that catches a real problem before it reaches your codebase.",
            muted: true,
          },
        ],
      },
      {
        question: 'What is the ProjectState document?',
        parts: [
          {
            type: 'text',
            content:
              'ProjectState is a structured shared-memory document that persists across every council session for a project. It tracks:',
          },
          {
            type: 'list',
            items: [
              'Architecture decisions and their rationale',
              'Data models and schema definitions',
              'API routes and their contracts',
              'Naming conventions and coding standards',
              'Dependencies and confirmed package versions',
              'Open questions and unresolved decisions',
            ],
          },
          {
            type: 'text',
            content:
              'Before each model responds, it receives a task-relevant slice of the ProjectState. Gemini, for refactor tasks, receives the full document. This is why context never drifts — every model is reading from the same source of truth, not just the current conversation.',
          },
        ],
      },
    ],
  },
  {
    label: 'Getting Started',
    icon: '🚀',
    items: [
      {
        question: 'What is VerityFlow, in one sentence?',
        parts: [
          {
            type: 'text',
            content:
              'VerityFlow is an AI engineering firm — five specialized models working as a structured team on your codebase, with each model having a defined role, a shared memory of your project, and every output reviewed before you see it.',
          },
        ],
      },
      {
        question: 'Do I need to bring my own API keys?',
        parts: [
          {
            type: 'text',
            content:
              "Yes. VerityFlow is a BYOK (Bring Your Own Key) platform. You connect your own keys for each of the five providers in Settings → API Keys. You pay each provider directly at their published rates — VerityFlow doesn't add a markup on top of API costs.",
          },
          {
            type: 'text',
            content:
              'This model is intentional. It means your costs scale with what you actually use, and you have full visibility into spend per provider. VerityFlow charges only for the orchestration layer — the routing, review pipeline, ProjectState management, and conflict arbitration.',
          },
        ],
      },
      {
        question: 'Which API keys do I need, and where do I get them?',
        parts: [
          {
            type: 'list',
            items: [
              'Anthropic (Claude) → console.anthropic.com',
              'OpenAI (GPT-5.4) → platform.openai.com/api-keys',
              'Mistral (Codestral) → console.mistral.ai',
              'Google AI (Gemini) → aistudio.google.com',
              'Perplexity (Sonar Pro) → perplexity.ai/settings/api',
            ],
          },
          {
            type: 'text',
            content:
              'All five are required for the full council pipeline. If a key is missing, VerityFlow will surface a clear error with a link to the settings page — not a generic failure.',
          },
        ],
      },
      {
        question: 'How much does it cost to use my own keys?',
        parts: [
          {
            type: 'text',
            content:
              "API costs vary by provider and usage. For a typical council session involving research, architecture, implementation, and review, you're running roughly 3–5 model calls across multiple providers. Each call is short — models receive task-relevant slices of context, not the full conversation history every time.",
          },
          {
            type: 'text',
            content:
              "As a rough reference: Anthropic charges ~$15/M input tokens and ~$75/M output tokens for Claude Opus. Most sessions consume a few thousand tokens per model. Track your spend in each provider's dashboard — VerityFlow doesn't handle billing for API usage.",
          },
        ],
      },
      {
        question: 'How do I get started?',
        parts: [
          {
            type: 'list',
            items: [
              'Create an account at verityflow.com/register',
              'Add your API keys in Settings → API Keys (all five providers)',
              'Create a new project and describe what you\'re building',
              'Submit your first prompt — the council takes it from there',
            ],
          },
          {
            type: 'text',
            content:
              "There's no setup wizard, no template selection, no boilerplate choices. Describe your project in plain language. The Architect model will ask clarifying questions if needed before anything is built.",
          },
        ],
      },
    ],
  },
  {
    label: 'Reliability & Accuracy',
    icon: '🛡️',
    items: [
      {
        question: 'How does VerityFlow prevent hallucinations?',
        parts: [
          {
            type: 'text',
            content:
              'The hallucination firewall runs before any implementation task. Perplexity Sonar Pro queries live documentation for every library, package version, and external API referenced in the task. If it cannot confirm that something exists and works as described, it blocks implementation and surfaces the issue.',
          },
          {
            type: 'text',
            content:
              "This covers the most common hallucination failure mode: a convincingly-written import for a package that doesn't exist, or a function call to an API that was deprecated two versions ago. The firewall catches these before Codestral writes a single line.",
          },
          {
            type: 'text',
            content:
              'Post-generation, GPT-5.4 reviews the output for correctness. These are two independent checks at different stages of the pipeline.',
          },
        ],
      },
      {
        question: 'What if Perplexity cannot verify a package?',
        parts: [
          {
            type: 'text',
            content:
              "If Perplexity can't confirm that a dependency is stable, current, and works as described, the task is paused and you're informed of the specific uncertainty. You can confirm manually and proceed, or choose an alternative. VerityFlow never silently continues with unverified dependencies.",
          },
        ],
      },
      {
        question: 'Is every output reviewed by a human?',
        parts: [
          {
            type: 'text',
            content:
              "No — the review layer is cross-model, not human. A different AI model reviews every output before it reaches you. You're not waiting for a human reviewer; you're waiting for the review pipeline to complete, which typically takes seconds.",
          },
          {
            type: 'text',
            content:
              'You can see the full review decision — approved, patched, or escalated — in the review log for every session. If you want human review, the review log gives you exactly the right place to focus your attention.',
          },
        ],
      },
    ],
  },
  {
    label: 'Context & Memory',
    icon: '🧠',
    items: [
      {
        question: 'Does context persist between sessions?',
        parts: [
          {
            type: 'text',
            content:
              'Yes. The ProjectState document persists across every session for a project. Architecture decisions, data models, API routes, naming conventions, confirmed dependencies, and open questions are all preserved and available to every model on every subsequent session.',
          },
          {
            type: 'text',
            content:
              "This is the difference from any chat-based workflow. You don't start fresh. You pick up where the last session left off — and every model on the council already knows what was decided.",
          },
        ],
      },
      {
        question: 'Can I use VerityFlow on an existing codebase?',
        parts: [
          {
            type: 'text',
            content:
              "Yes. You describe your existing project — its architecture, stack, conventions, and current state — and VerityFlow builds a ProjectState from it. Gemini's 2M-token context window means it can read your entire codebase at once and reason about it holistically, not just the file you currently have open.",
          },
          {
            type: 'text',
            content:
              "Onboarding an existing project takes one session. After that, the council has the same grounding it would have on a greenfield project it built from scratch.",
          },
        ],
      },
      {
        question: 'What if I start a new session mid-project?',
        parts: [
          {
            type: 'text',
            content:
              "The ProjectState loads automatically at the start of every session. There is no 'start fresh' — context is always there. If you want to override a previous architectural decision, you describe the change and the Architect model updates the ProjectState with the new decision and its rationale.",
          },
        ],
      },
    ],
  },
  {
    label: 'Pricing & Plans',
    icon: '💳',
    items: [
      {
        question: 'Is there a free tier? What are the limits?',
        parts: [
          {
            type: 'text',
            content:
              '50 council sessions per month on the free tier. A council session is one prompt submitted to the council — the number of internal model calls it triggers does not count against your limit.',
          },
          {
            type: 'text',
            content:
              'All five models, the full review pipeline, the hallucination firewall, and persistent ProjectState are available on the free tier. The only limit is session volume.',
          },
        ],
      },
      {
        question: 'What counts as a council session?',
        parts: [
          {
            type: 'text',
            content:
              'One prompt submitted to the council = one session. A single session may trigger the hallucination firewall, the primary model, the reviewer, and arbitration — but that still counts as one session from your monthly allocation.',
          },
        ],
      },
      {
        question: 'Do unused sessions roll over?',
        parts: [
          {
            type: 'text',
            content:
              'No. Session counts reset monthly on your billing date. This is consistent across all plans.',
          },
        ],
      },
      {
        question: 'Can I cancel anytime?',
        parts: [
          {
            type: 'text',
            content:
              'Yes. Cancel through the billing portal at any time. You retain Pro or Teams access until the end of your current billing period — no prorated refunds, no access cutoff on cancellation date.',
          },
        ],
      },
      {
        question: 'How does BYOK affect my total cost?',
        parts: [
          {
            type: 'text',
            content:
              "VerityFlow charges for orchestration sessions — not for API usage. Your total cost is: VerityFlow plan ($0 / $29 / $99 per month) + direct API costs from each provider at their published rates.",
          },
          {
            type: 'text',
            content:
              'There is no VerityFlow markup on API calls. When you run a council session, Anthropic charges you directly for Claude usage, OpenAI charges you for GPT usage, and so on. VerityFlow collects nothing from those charges.',
          },
        ],
      },
    ],
  },
  {
    label: 'Privacy & Security',
    icon: '🔒',
    items: [
      {
        question: 'Is my code and project data private?',
        parts: [
          {
            type: 'text',
            content:
              'Yes. Every project runs in an isolated environment with its own ProjectState. Your code, session history, and project data are never shared between users and are never used to train any of the underlying models.',
          },
        ],
      },
      {
        question: 'Are my API keys stored securely?',
        parts: [
          {
            type: 'text',
            content:
              'API keys are encrypted at rest using AES-256-GCM before being written to the database. The encryption key is stored separately from your key data. Keys are never logged, never returned in plaintext via the API (only the last 4 characters are exposed for identification), and deleted instantly on request.',
          },
        ],
      },
      {
        question: 'Are my keys or project data used for model training?',
        parts: [
          {
            type: 'text',
            content:
              "No. VerityFlow does not send your data to any provider with training enabled. Your API calls go directly to each provider's production API endpoints under your account. Check each provider's data usage policies — by default, all five providers exclude API usage from training data.",
          },
        ],
      },
    ],
  },
  {
    label: 'Technical Details',
    icon: '🔧',
    items: [
      {
        question: 'What languages and frameworks are supported?',
        parts: [
          {
            type: 'text',
            content:
              'Codestral supports 80+ languages with particular strength in TypeScript, Python, Go, Rust, and Java. Full-stack frameworks including Next.js, FastAPI, Express, Rails, and Django are well-supported.',
          },
          {
            type: 'text',
            content:
              'The Perplexity researcher verifies package availability in the language ecosystem before implementation begins — so you always build on confirmed, working foundations regardless of the stack.',
          },
        ],
      },
      {
        question: 'Can I see the full review log?',
        parts: [
          {
            type: 'text',
            content:
              "Yes. Every council session produces a complete, human-readable review log. You can see each model's output, the reviewer's decision (approved, patched, or escalated), the arbitration rationale when models disagreed, and Gemini's consistency check notes.",
          },
          {
            type: 'text',
            content:
              'Nothing is hidden. If something looks wrong in the final output, you have the full trace to diagnose exactly where in the pipeline it went wrong.',
          },
        ],
      },
      {
        question: 'What if I disagree with a decision the models made?',
        parts: [
          {
            type: 'text',
            content:
              "Reference the specific decision in your next prompt — the ProjectState tracks the rationale behind every architectural choice. You can override any decision, and the Architect model will update the ProjectState with the new direction and its reasoning.",
          },
          {
            type: 'text',
            content:
              "The council doesn't lock you into decisions. It documents them so you can review, challenge, and change them with full context.",
          },
        ],
      },
      {
        question: "What's the difference between a council session and a regular AI chat?",
        parts: [
          {
            type: 'text',
            content: 'Several structural differences:',
          },
          {
            type: 'list',
            items: [
              'A chat has one model. A council session has five, each with a defined role.',
              "A chat starts blank every time. A council session loads your project's full history and decisions.",
              'A chat gives you one answer. A council session gives you a reviewed, arbitrated output with a full audit trail.',
              'A chat has no dependency verification. A council session runs Perplexity before any implementation.',
              'A chat has no consistency layer. A council session includes a full-codebase sweep by Gemini.',
            ],
          },
          {
            type: 'text',
            content:
              "For a quick one-off question, a chat is fine. For building something real, these structural differences are the gap between 'looks right' and 'is right'.",
            muted: true,
          },
        ],
      },
    ],
  },
  {
    label: 'Future & Evolution',
    icon: '🔭',
    items: [
      {
        question: 'What happens if a better model comes along for a role?',
        parts: [
          {
            type: 'text',
            content: 'It gets the role. The council architecture is permanent — which model fills each position is not.',
          },
          {
            type: 'text',
            content:
              'Each model holds its current role because it has a measurable, documented advantage on the specific tasks that role requires. Claude is the Architect because it currently leads on long-horizon reasoning and arbitration quality. Gemini is the Refactor Specialist because no other model has a 2M-token context window. If those advantages shift, the assignments shift.',
          },
          {
            type: 'text',
            content:
              'When benchmarks meaningfully change, we run both the incumbent and the challenger in parallel on a standardized task suite specific to that role — not general AI leaderboards. If the challenger produces demonstrably better outputs on the tasks that role actually requires, we transition. The rationale is documented.',
          },
          {
            type: 'text',
            content: 'The goal is always the best council, not loyalty to any vendor.',
            muted: true,
          },
        ],
      },
      {
        question: 'What if Claude is outperformed as Architect by a newer model?',
        parts: [
          {
            type: 'text',
            content:
              "The Architect role requires three things that are evaluated independently: long-horizon multi-step reasoning, the ability to produce written rationale for contested decisions, and enough calibration to know when to defer rather than decide. Claude currently leads on all three.",
          },
          {
            type: 'text',
            content:
              "If a newer model demonstrates a significant and consistent advantage on these tasks — not just on general benchmarks, but specifically on architecture-class decision problems and arbitration quality — we would run a parallel evaluation period. Both models would handle the Architect role on a set of real sessions, outputs would be compared against a quality rubric, and the better performer would take the role.",
          },
          {
            type: 'text',
            content:
              "This isn't hypothetical caution. Claude Opus 4.6 replaced an earlier model in this role for exactly these reasons. Role assignments have a history, and they will have a future.",
          },
        ],
      },
      {
        question: 'How do you decide when a model upgrade is worth the transition risk?',
        parts: [
          {
            type: 'text',
            content: 'Role transitions carry real risk: prompts tuned to one model may produce different outputs with another, edge cases shift, and users who rely on specific behavioral patterns may notice changes. We evaluate three things before transitioning:',
          },
          {
            type: 'list',
            items: [
              'Quality delta: Is the performance improvement large enough to justify the disruption? Minor benchmark improvements do not qualify.',
              'Stability: Has the new model been available long enough to trust that its behavior is consistent and that its provider will maintain it?',
              'Compatibility: Do the existing orchestration prompts and review protocols work correctly with the new model, or do they need rework?',
            ],
          },
          {
            type: 'text',
            content:
              'A model that scores 5% better on a benchmark but requires rewriting 30% of the orchestration layer is not obviously an improvement. The evaluation is holistic.',
          },
        ],
      },
      {
        question: 'Will the council always be exactly five models?',
        parts: [
          {
            type: 'text',
            content:
              'Five is the current architecture, and it was chosen deliberately — not as a round number, but because each of the five fills a genuinely distinct function with no overlap. Adding a sixth model would only make sense if it contributes a capability that none of the existing five can replicate.',
          },
          {
            type: 'text',
            content: 'Possible candidates for expansion:',
          },
          {
            type: 'list',
            items: [
              'A formal verification model — one that can mathematically prove correctness properties about generated code, not just review it heuristically',
              'A security specialist — a model trained exclusively on vulnerability detection and exploit patterns, distinct from GPT\'s general review function',
              'A domain specialist — a model fine-tuned on a specific industry stack (e.g. medical device software, financial systems) for regulated-environment builds',
            ],
          },
          {
            type: 'text',
            content:
              "We won't add a model to add a model. The bar is a new capability, not a bigger number.",
            muted: true,
          },
        ],
      },
      {
        question: 'What if one of the AI providers shuts down or changes their API significantly?',
        parts: [
          {
            type: 'text',
            content:
              "Because VerityFlow is BYOK, provider risk is shared with you — if Anthropic changes their API, your key stops working, and VerityFlow surfaces a clear error pointing to the relevant settings page. We don't silently fail.",
          },
          {
            type: 'text',
            content:
              "On the orchestration side, each adapter is isolated — a breaking change to the Anthropic API affects only the Claude adapter, not the rest of the pipeline. In the event of a provider outage or deprecation, we would evaluate a replacement model for that role and communicate the transition timeline clearly.",
          },
          {
            type: 'text',
            content:
              "The council is designed to be resilient. No single provider failure takes down the whole system.",
          },
        ],
      },
      {
        question: 'Will VerityFlow ever offer platform-provided API credits instead of BYOK?',
        parts: [
          {
            type: 'text',
            content:
              "Possibly, as a future option — not as a replacement for BYOK. Platform credits would be a convenience layer for users who don't want to manage five sets of API keys. The pricing would be transparent: cost at provider rates plus an explicit orchestration fee, with no hidden markup.",
          },
          {
            type: 'text',
            content:
              "BYOK will always remain available for users who want direct cost control and direct provider relationships. The BYOK model is a commitment, not a transitional state.",
          },
        ],
      },
    ],
  },
]

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={idx}
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
                padding: '18px 0',
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
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  animation: 'accordion-open 0.22s ease forwards',
                }}
              >
                {faq.parts.map((part, pIdx) => {
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
                        {part.items.map((item, iIdx) => (
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
                                marginTop: '6px',
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
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function FAQPage() {
  return (
    <main style={{ background: 'var(--bg-base)', position: 'relative', zIndex: 1 }}>
      <Navbar />

      {/* Hero header */}
      <section
        style={{
          paddingTop: '140px',
          paddingBottom: '64px',
          paddingLeft: '40px',
          paddingRight: '40px',
          textAlign: 'center',
          background: `radial-gradient(ellipse 700px 400px at 50% -60px, rgba(67,97,238,0.14), transparent 70%)`,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--accent-blue)',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Knowledge base
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            lineHeight: 1.0,
          }}
        >
          Everything you wanted to know.
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            maxWidth: '500px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          How it works, what it costs, how data is handled, and the hard questions we think you deserve a straight answer to.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
        >
          ← Back to homepage
        </Link>
      </section>

      {/* Category nav (sticky pill bar) */}
      <div
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 50,
          background: 'rgba(5,5,8,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 40px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {FAQ_CATEGORIES.map((cat) => (
            <a
              key={cat.label}
              href={`#${cat.label.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255,255,255,0.02)',
                whiteSpace: 'nowrap' as const,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-primary)'
                el.style.borderColor = 'var(--border-default)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-muted)'
                el.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ categories */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '80px 40px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '80px',
        }}
      >
        {FAQ_CATEGORIES.map((category) => (
          <section
            key={category.label}
            id={category.label.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}
          >
            {/* Category header */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{category.icon}</span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {category.label}
                </h2>
              </div>
              <div
                style={{
                  height: '1px',
                  background: `linear-gradient(90deg, var(--accent-blue) 0%, transparent 60%)`,
                  opacity: 0.4,
                }}
              />
            </div>

            {/* Accordion for this category */}
            <FAQAccordion items={category.items} />
          </section>
        ))}

        {/* CTA */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'var(--accent-blue)',
              marginBottom: '12px',
            }}
          >
            Still have questions?
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            The best way to understand it is to use it.
          </h3>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginBottom: '28px',
              lineHeight: 1.7,
              maxWidth: '420px',
              margin: '0 auto 28px',
            }}
          >
            Free tier includes 50 sessions. Bring your API keys and see the council in action.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent-blue)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              padding: '13px 28px',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 0 0 1px rgba(67,97,238,0.6), 0 0 80px rgba(67,97,238,0.3)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)'
            }}
          >
            Start building free →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
