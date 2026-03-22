import type {
  TaskType,
  ModelRole,
  OrchestratorTask,
  ProjectStateDoc,
} from '@/types'
import { sliceStateForTask } from '@/lib/utils/projectState'
import { stateFitsInContext } from '@/lib/utils/tokenCounter'

// --- Task classification ---
// Analyzes the prompt text and returns the most appropriate TaskType.
// Rules are keyword/pattern based for speed — no LLM call needed here.
const TASK_PATTERNS: Record<TaskType, RegExp[]> = {
  architecture: [
    /\b(architect|design|structure|schema|data model|system design|plan|scaffold|blueprint|ERD|database design)\b/i,
    /\b(how should|how do we|what pattern|what approach|best way to structure)\b/i,
  ],
  implementation: [
    /\b(implement|build|create|write|code|develop|add|make|generate)\b/i,
    /\b(function|component|route|endpoint|handler|hook|class|module|service)\b/i,
  ],
  research: [
    /\b(latest|current version|up to date|docs|documentation|API|library|package|npm|breaking change|changelog)\b/i,
    /\b(how does .+ work|what is .+ used for|verify|check|confirm)\b/i,
  ],
  refactor: [
    /\b(refactor|clean up|improve|optimize|reorganize|simplify|consolidate|rename|restructure)\b/i,
    /\b(consistency|naming convention|duplicate|repeated|messy|spaghetti)\b/i,
  ],
  review: [
    /\b(review|check|audit|validate|verify|look over|assess|evaluate|critique)\b/i,
    /\b(is this correct|does this look right|any issues|any bugs|security)\b/i,
  ],
  arbitration: [
    /\b(conflict|disagree|contradiction|inconsistent|which is correct|decide|resolve|choose between)\b/i,
  ],
}

export function classifyTask(prompt: string): TaskType {
  const scores: Record<TaskType, number> = {
    architecture: 0,
    implementation: 0,
    research: 0,
    refactor: 0,
    review: 0,
    arbitration: 0,
  }

  for (const [taskType, patterns] of Object.entries(TASK_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(prompt)) {
        scores[taskType as TaskType]++
      }
    }
  }

  // Return highest scoring task type
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const topScore = sorted[0][1]

  // Default to implementation if no strong signal
  if (topScore === 0) return 'implementation'
  return sorted[0][0] as TaskType
}

// --- Model assignment ---
// Maps each TaskType to its primary model and optional secondary reviewer.
interface ModelAssignment {
  primary: ModelRole
  reviewer?: ModelRole
  requiresResearch: boolean
}

const TASK_MODEL_MAP: Record<TaskType, ModelAssignment> = {
  architecture: {
    primary: 'claude',
    reviewer: 'gpt4o',
    requiresResearch: false,
  },
  implementation: {
    primary: 'codestral',
    reviewer: 'gpt4o',
    requiresResearch: true, // always verify libs before implementing
  },
  research: {
    primary: 'perplexity',
    reviewer: undefined,
    requiresResearch: false,
  },
  refactor: {
    primary: 'gemini',
    reviewer: 'claude',
    requiresResearch: false,
  },
  review: {
    primary: 'gpt4o',
    reviewer: 'claude',
    requiresResearch: false,
  },
  arbitration: {
    primary: 'claude',
    reviewer: undefined,
    requiresResearch: false,
  },
}

export function assignModel(taskType: TaskType): ModelAssignment {
  return TASK_MODEL_MAP[taskType]
}

// --- Hallucination firewall check ---
// Returns true if this prompt touches external APIs, libraries,
// or version-specific features that require live verification.
const RESEARCH_TRIGGERS = [
  /\b(npm|yarn|pnpm)\b/i,
  /\b(import|require|install|package)\b/i,
  /\b(API|SDK|client|endpoint|webhook)\b/i,
  /\b(version|v\d+|release|changelog|breaking)\b/i,
  /\b(mongoose|prisma|drizzle|redis|ioredis|stripe|nextauth|next-auth)\b/i,
  /\b(react|next\.?js|tailwind|typescript|node)\b/i,
]

export function requiresHallucinationCheck(prompt: string): boolean {
  return RESEARCH_TRIGGERS.some((pattern) => pattern.test(prompt))
}

// --- Router: builds the full task queue for a given prompt ---
// Returns an ordered array of OrchestratorTasks to execute.
// If requiresResearch, a Perplexity task is prepended automatically.
export function buildTaskQueue(
  projectId: string,
  prompt: string,
  state: ProjectStateDoc
): OrchestratorTask[] {
  const taskType = classifyTask(prompt)
  const assignment = assignModel(taskType)
  const tasks: OrchestratorTask[] = []

  // Step 1 — Prepend Perplexity research task if needed
  const needsResearch =
    assignment.requiresResearch || requiresHallucinationCheck(prompt)
  if (needsResearch && taskType !== 'research') {
    const researchSlice = sliceStateForTask(state, 'research', 'perplexity')
    tasks.push({
      projectId,
      taskType: 'research',
      prompt: buildResearchPrompt(prompt, state),
      assignedModel: 'perplexity',
      context: researchSlice,
    })
  }

  // Step 2 — Primary task
  const primarySlice = sliceStateForTask(state, taskType, assignment.primary)
  if (!stateFitsInContext(primarySlice, assignment.primary, prompt)) {
    console.warn(
      `[Router] State slice too large for ${assignment.primary} on ${taskType} task — truncating to currentTask only`
    )
  }
  tasks.push({
    projectId,
    taskType,
    prompt,
    assignedModel: assignment.primary,
    context: primarySlice,
  })

  // Step 3 — Append reviewer task if assigned
  if (assignment.reviewer) {
    const reviewSlice = sliceStateForTask(state, 'review', assignment.reviewer)
    tasks.push({
      projectId,
      taskType: 'review',
      prompt: buildReviewPrompt(prompt, assignment.primary),
      assignedModel: assignment.reviewer,
      context: reviewSlice,
    })
  }

  return tasks
}

// --- Prompt builders ---
function buildResearchPrompt(
  originalPrompt: string,
  state: ProjectStateDoc
): string {
  const packages = state.dependencies.packages.join(', ') || 'none yet'
  return `
You are the Researcher on an AI engineering team. Before any code is written, verify all external dependencies referenced in the following task.

Task: ${originalPrompt}

Current project packages: ${packages}

Your job:
1. Identify every library, package, or external API mentioned or implied in the task.
2. Confirm the current stable version of each.
3. Flag any known breaking changes, deprecations, or gotchas relevant to this task.
4. If any library is unfamiliar or you cannot verify it, say so explicitly — do NOT guess.
5. Return a structured JSON object:
{
  "verified": [{ "package": string, "version": string, "notes": string }],
  "warnings": [{ "package": string, "issue": string }],
  "unverified": string[]
}
`.trim()
}

function buildReviewPrompt(
  originalPrompt: string,
  authorModel: ModelRole
): string {
  return `
You are reviewing code/output just produced by ${authorModel} for the following task:

Task: ${originalPrompt}

The previous model's output will be provided to you. Your job:
1. Check for correctness — does the output actually solve the task?
2. Check for consistency — does it follow the project conventions in your context?
3. Check for hallucinations — does it reference any API, method, or pattern that doesn't exist or is wrong?
4. Check for security issues — any exposed secrets, unvalidated inputs, missing auth checks?
5. Return a structured JSON object:
{
  "approved": boolean,
  "flaggedIssues": string[],
  "patch": string | null,
  "confidence": number
}

If approved is false, patch must contain corrected code. Be specific and surgical.
`.trim()
}

// --- Arbitration prompt builder ---
// Used when two models produce conflicting outputs.
export function buildArbitrationPrompt(
  taskPrompt: string,
  outputA: { model: ModelRole; output: string },
  outputB: { model: ModelRole; output: string }
): string {
  return `
You are the Architect and final arbiter on this engineering team. Two models have produced conflicting outputs for the same task. You must pick the correct approach and explain why.

Original task: ${taskPrompt}

Output from ${outputA.model}:
${outputA.output}

Output from ${outputB.model}:
${outputB.output}

Your job:
1. Analyze both outputs against the project architecture and conventions.
2. Pick the correct or superior approach.
3. If neither is fully correct, produce a corrected version.
4. Return a structured JSON object:
{
  "winner": "${outputA.model}" | "${outputB.model}" | "neither",
  "finalOutput": string,
  "rationale": string,
  "patched": boolean
}
`.trim()
}
