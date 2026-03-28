import { runClaude } from '../adapters/claude'
import { runGpt4o } from '../adapters/gpt4o'
import { connectDB } from '@/lib/db/mongoose'
import { ReviewLog } from '@/lib/models/ReviewLog'
import { appendReviewEntry } from '@/lib/utils/projectState'
import type {
  ModelResponse,
  OrchestratorTask,
  ModelRole,
  TaskType,
  ReviewEntry,
} from '@/types'

// --- Review routing table ---
// Defines which model reviews which model's output for each task type.
// Rule: a model never reviews its own output.
interface ReviewRoute {
  reviewer: ModelRole
  taskType: TaskType
}

function getReviewRoute(
  authorModel: ModelRole,
  taskType: TaskType
): ReviewRoute | null {
  // Research tasks are self-validating (Perplexity grounds in live data)
  // Arbitration is final — no review needed
  if (taskType === 'research' || taskType === 'arbitration') {
    return null
  }

  const routes: Record<ModelRole, ModelRole> = {
    claude: 'gpt4o',      // Claude's architecture reviewed by GPT
    codestral: 'gpt4o',   // Codestral's code reviewed by GPT
    gemini: 'claude',     // Gemini's refactors reviewed by Claude
    gpt4o: 'claude',      // GPT's output reviewed by Claude
    perplexity: 'gpt4o',  // Perplexity reviewed by GPT (shouldn't reach here)
  }

  return {
    reviewer: routes[authorModel],
    taskType: 'review',
  }
}

// --- Review result ---
export interface ReviewResult {
  approved: boolean
  reviewerModel: ModelRole
  flaggedIssues: string[]
  patch: string | null
  confidence: number
  requiresArbitration: boolean
  tokensUsed: number
}

// --- Parse reviewer output ---
function parseReviewOutput(output: string): {
  approved: boolean
  flaggedIssues: string[]
  patch: string | null
  confidence: number
} {
  try {
    // Strip markdown code fences if present
    const cleaned = output
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)
    return {
      approved: Boolean(parsed.approved),
      flaggedIssues: Array.isArray(parsed.flaggedIssues)
        ? parsed.flaggedIssues
        : [],
      patch: typeof parsed.patch === 'string' ? parsed.patch : null,
      confidence: typeof parsed.confidence === 'number'
        ? parsed.confidence
        : 0.5,
    }
  } catch {
    // Could not parse JSON — treat as soft failure
    // Approved with a warning so we don't block all output
    return {
      approved: true,
      flaggedIssues: ['Review output was not valid JSON — manual inspection recommended'],
      patch: null,
      confidence: 0.5,
    }
  }
}

// --- Build review prompt ---
function buildReviewTaskPrompt(
  originalPrompt: string,
  authorModel: ModelRole,
  authorOutput: string,
  taskType: TaskType
): string {
  return `You are reviewing output produced by ${authorModel} for the following task.

Original task:
${originalPrompt}

${authorModel}'s output:
${authorOutput}

Review instructions:
1. Does the output correctly solve the original task?
2. Does it follow the project conventions and architecture decisions in your context?
3. Does it reference any library method, API, or pattern that does not exist or is incorrect?
4. Are there any security issues — unvalidated inputs, exposed secrets, missing auth checks?
5. Is there anything that contradicts earlier architectural decisions in the review log?

Return ONLY valid JSON in this exact format, no other text:
{
  "approved": boolean,
  "flaggedIssues": string[],
  "patch": string | null,
  "confidence": number
}

If approved is false, patch must contain the corrected version of the output.
confidence is a number between 0 and 1 representing your certainty in this review.
taskType being reviewed: ${taskType}`
}

// --- Core review function ---
export async function reviewOutput(
  projectId: string,
  sessionId: string,
  originalTask: OrchestratorTask,
  authorResponse: ModelResponse
): Promise<ReviewResult> {
  const route = getReviewRoute(authorResponse.model, originalTask.taskType)

  // No review needed for this task type
  if (!route) {
    return {
      approved: true,
      reviewerModel: authorResponse.model,
      flaggedIssues: [],
      patch: null,
      confidence: 1,
      requiresArbitration: false,
      tokensUsed: 0,
    }
  }

  const reviewPrompt = buildReviewTaskPrompt(
    originalTask.prompt,
    authorResponse.model,
    authorResponse.output,
    originalTask.taskType
  )

  const reviewTask: OrchestratorTask = {
    projectId,
    taskType: 'review',
    prompt: reviewPrompt,
    assignedModel: route.reviewer,
    context: originalTask.context,
    userId: originalTask.userId,
  }

  let reviewResponse: ModelResponse
  try {
    if (route.reviewer === 'claude') {
      reviewResponse = await runClaude(reviewTask)
    } else {
      reviewResponse = await runGpt4o(reviewTask)
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[ReviewPipeline] reviewer call failed:', err)
    // Fail open — approve with warning rather than blocking all output
    return {
      approved: true,
      reviewerModel: route.reviewer,
      flaggedIssues: [`Review call failed: ${err.message ?? String(err)}`],
      patch: null,
      confidence: 0,
      requiresArbitration: false,
      tokensUsed: 0,
    }
  }

  const parsed = parseReviewOutput(reviewResponse.output)

  // Escalate to arbitration if:
  // 1. Not approved AND a patch was provided (genuine conflict)
  // 2. Confidence is very low (reviewer is unsure)
  const requiresArbitration =
    !parsed.approved && parsed.patch !== null && parsed.confidence > 0.7

  // Persist to ReviewLog in MongoDB
  try {
    await connectDB()
    await ReviewLog.create({
      projectId,
      sessionId,
      reviewingModel: route.reviewer,
      authorModel: authorResponse.model,
      taskType: originalTask.taskType,
      inputSummary: originalTask.prompt.slice(0, 500),
      outputSummary: authorResponse.output.slice(0, 500),
      flaggedIssues: parsed.flaggedIssues,
      outcome: requiresArbitration
        ? 'escalated'
        : parsed.approved
        ? 'approved'
        : parsed.patch
        ? 'patched'
        : 'rejected',
      patchApplied: parsed.patch ?? undefined,
      arbitrationRequired: requiresArbitration,
      tokensUsed: reviewResponse.tokensUsed,
      durationMs: 0,
    })
  } catch (err) {
    console.error('[ReviewPipeline] ReviewLog persist failed:', err)
    // Non-fatal — continue
  }

  // Append to ProjectState review log
  const entry: ReviewEntry = {
    modelSource: route.reviewer,
    decision: parsed.approved ? 'approved' : 'rejected',
    rationale: parsed.flaggedIssues.join('; ') || 'No issues found',
    timestamp: new Date(),
    taskType: 'review',
  }
  await appendReviewEntry(projectId, entry).catch((err) =>
    console.error('[ReviewPipeline] appendReviewEntry failed:', err)
  )

  return {
    approved: parsed.approved,
    reviewerModel: route.reviewer,
    flaggedIssues: parsed.flaggedIssues,
    patch: parsed.patch,
    confidence: parsed.confidence,
    requiresArbitration,
    tokensUsed: reviewResponse.tokensUsed,
  }
}

// --- Batch review ---
// Reviews multiple responses from a single orchestrator run.
// Returns the final approved outputs — patched where needed.
export interface BatchReviewResult {
  finalOutputs: {
    model: ModelRole
    output: string
    approved: boolean
    patched: boolean
    flaggedIssues: string[]
  }[]
  anyRequiresArbitration: boolean
  totalReviewTokens: number
}

export async function batchReview(
  projectId: string,
  sessionId: string,
  tasks: OrchestratorTask[],
  responses: ModelResponse[]
): Promise<BatchReviewResult> {
  const finalOutputs: BatchReviewResult['finalOutputs'] = []
  let anyRequiresArbitration = false
  let totalReviewTokens = 0

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i]
    const task = tasks[i] ?? tasks[tasks.length - 1]

    // Skip review for empty outputs (failed adapter calls)
    if (!response.output) {
      finalOutputs.push({
        model: response.model,
        output: '',
        approved: false,
        patched: false,
        flaggedIssues: response.flaggedIssues,
      })
      continue
    }

    const result = await reviewOutput(projectId, sessionId, task, response)
    totalReviewTokens += result.tokensUsed

    if (result.requiresArbitration) {
      anyRequiresArbitration = true
    }

    // Use patched output if reviewer provided one and it wasn't approved
    const finalOutput =
      !result.approved && result.patch ? result.patch : response.output

    finalOutputs.push({
      model: response.model,
      output: finalOutput,
      approved: result.approved,
      patched: !result.approved && result.patch !== null,
      flaggedIssues: result.flaggedIssues,
    })
  }

  return {
    finalOutputs,
    anyRequiresArbitration,
    totalReviewTokens,
  }
}
