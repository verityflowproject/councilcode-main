export type TaskComplexity = 'simple' | 'standard' | 'complex'

// Words that signal a simple, low-cost task
const SIMPLE_KEYWORDS =
  /\b(rename|fix typo|format|add comment|what is|summarize|list the)\b/i

// Words that signal a complex, full-model task
const COMPLEX_KEYWORDS =
  /\b(architect|design|schema|integrate|implement|debug|why is|race condition|auth|security|authentication|authorization)\b/i

// Stack trace signals
const STACK_TRACE = /(?:Error:|at .+\.(ts|js):|at .+:\d+:\d+)/

// Multiple file references
const MULTI_FILE = /src\/[^\s]+\.tsx?/g

export function classifyComplexity(prompt: string): TaskComplexity {
  const wordCount = prompt.trim().split(/\s+/).length
  const lineCount = prompt.split('\n').length
  const hasCodeBlock = prompt.includes('```')

  // --- Complex signals ---
  if (COMPLEX_KEYWORDS.test(prompt)) return 'complex'
  if (wordCount > 200) return 'complex'
  if (STACK_TRACE.test(prompt)) return 'complex'
  const fileMatches = prompt.match(MULTI_FILE)
  if (fileMatches && fileMatches.length > 1) return 'complex'

  // --- Simple signals ---
  if (wordCount < 80 && !hasCodeBlock && SIMPLE_KEYWORDS.test(prompt)) return 'simple'
  if (wordCount < 80 && !hasCodeBlock && lineCount < 5) {
    // Pure refactor of a short code snippet
    if (SIMPLE_KEYWORDS.test(prompt)) return 'simple'
  }

  return 'standard'
}

export interface ModelVariants {
  full: string
  cheap: string
}

export const MODEL_VARIANTS: Record<string, ModelVariants> = {
  claude:     { full: 'claude-opus-4-6',        cheap: 'claude-haiku-3-5'     },
  gpt4o:      { full: 'gpt-5.4',                cheap: 'gpt-4o-mini'          },
  codestral:  { full: 'codestral-latest',        cheap: 'codestral-latest'     }, // no cheap variant
  gemini:     { full: 'gemini-3.1-pro-preview',  cheap: 'gemini-1.5-flash'     },
  perplexity: { full: 'sonar-pro',               cheap: 'sonar'                },
}

// Claude (Architect) and Perplexity (Researcher) always use full models —
// never downgrade them regardless of prompt length or simplicity signals.
const ALWAYS_FULL = new Set(['claude', 'perplexity'])

export function selectModelString(role: string, complexity: TaskComplexity): string {
  const variants = MODEL_VARIANTS[role]
  if (!variants) return role

  if (ALWAYS_FULL.has(role)) return variants.full
  return complexity === 'simple' ? variants.cheap : variants.full
}
