import { runClaude } from '../adapters/claude'
import { connectDB } from '@/lib/db/mongoose'
import { ReviewLog } from '@/lib/models/ReviewLog'
import { appendReviewEntry, mergeProjectState } from '@/lib/utils/projectState'
import type {
  OrchestratorTask,
  ModelRole,
  TaskType,
  ModelResponse,
  ReviewEntry,
} from '@/types'

// --- Arbitration result ---
export interface ArbitrationResult {
  winner: ModelRole | 'neither'
  finalOutput: string
  rationale: string
  patched: boolean
  tokensUsed: number
  confidence: number
}

// --- Conflict detection ---
// Determines whether two model responses are genuinely in conflict
// and warrant arbitration vs. being complementary outputs.
export interface ConflictCandidate {
  taskType: TaskType
  primary: ModelResponse
  reviewer: ModelResponse
  prompt: string
}

export function detectConflict(
  primaryResponse: ModelResponse,
  reviewResponse: ModelResponse,
  _taskType: TaskType
): boolean {
  // No conflict if either output is empty
  if (!primaryResponse.output || !reviewResponse.output) return false

  // No conflict if the reviewer approved
  try {
    const cleaned = reviewResponse.output
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    if (parsed.approved === true) return false
    // Conflict if explicitly rejected with a patch and high confidence
    if (
      parsed.approved === false &&
      parsed.patch &&
      typeof parsed.confidence === 'number' &&
      parsed.confidence >= 0.7
    ) {
      return true
    }
  } catch {
    // Review wasn't JSON — check for conflict signals in plain text
  }

  // Check for conflict signals in reviewer's flagged issues
  if (reviewResponse.flaggedIssues.length >= 2) return true

  return false
}

// --- Build arbitration prompt ---
function buildArbitrationPrompt(
  conflict: ConflictCandidate,
  projectStateContext: object
): string {
  // Extract reviewer's patch if available
  let reviewerPatch = ''
  try {
    const cleaned = conflict.reviewer.output
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    if (parsed.patch) reviewerPatch = parsed.patch
  } catch {
    reviewerPatch = conflict.reviewer.output
  }

  return `
You are Claude, the Architect and final arbiter on the CouncilCode engineering team. Two models have produced conflicting outputs for the same task. You must resolve this conflict definitively.

Original task:
${conflict.prompt}

Output from ${conflict.primary.model} (primary implementer):
${conflict.primary.output}

Output from ${conflict.reviewer.model} (reviewer — flagged issues):
Flagged issues: ${conflict.reviewer.flaggedIssues.join('; ')}
${reviewerPatch ? `Proposed correction:\n${reviewerPatch}` : ''}

Project context (use this to inform your decision):
${JSON.stringify(projectStateContext, null, 2)}

Your arbitration instructions:
1. Read both outputs carefully against the project context.
2. Determine which output is more correct, or whether neither is acceptable.
3. If the reviewer's patch is correct, adopt it. If the primary output is correct, defend it. If neither is right, produce a corrected version yourself.
4. Write a clear, specific rationale that explains your decision — this will be shown to the user in the session log.
5. Be decisive. Do not hedge.

Return ONLY valid JSON in this exact format, no other text:
{
  "winner": "${conflict.primary.model}" | "${conflict.reviewer.model}" | "neither",
  "finalOutput": string,
  "rationale": string,
  "patched": boolean,
  "confidence": number
}

finalOutput must contain the complete, correct output — not a summary.
patched must be true if you modified either output.
confidence is a number between 0 and 1.
`.trim()
}

// --- Core arbitration function ---
export async function runArbitration(
  projectId: string,
  sessionId: string,
  conflict: ConflictCandidate,
  projectStateContext: object
): Promise<ArbitrationResult> {
  const arbitrationPrompt = buildArbitrationPrompt(conflict, projectStateContext)

  const arbitrationTask: OrchestratorTask = {
    projectId,
    taskType: 'arbitration',
    prompt: arbitrationPrompt,
    assignedModel: 'claude',
    context: { projectId },
  }

  let claudeResponse: ModelResponse
  try {
    claudeResponse = await runClaude(arbitrationTask)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[Arbitration] Claude call failed:', err)
    // Fail gracefully — return the primary output unchanged
    return {
      winner: conflict.primary.model,
      finalOutput: conflict.primary.output,
      rationale: `Arbitration failed: ${err.message ?? String(err)}. Defaulting to primary output.`,
      patched: false,
      tokensUsed: 0,
      confidence: 0,
    }
  }

  // Parse Claude's arbitration response
  let result: ArbitrationResult
  try {
    const cleaned = claudeResponse.output
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    result = {
      winner: parsed.winner ?? conflict.primary.model,
      finalOutput: parsed.finalOutput ?? conflict.primary.output,
      rationale: parsed.rationale ?? 'No rationale provided',
      patched: Boolean(parsed.patched),
      tokensUsed: claudeResponse.tokensUsed,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
    }
  } catch {
    // Could not parse — default to primary output with note
    result = {
      winner: conflict.primary.model,
      finalOutput: conflict.primary.output,
      rationale: 'Arbitration response could not be parsed. Defaulting to primary output.',
      patched: false,
      tokensUsed: claudeResponse.tokensUsed,
      confidence: 0,
    }
  }

  // Persist arbitration to ReviewLog
  try {
    await connectDB()
    await ReviewLog.create({
      projectId,
      sessionId,
      reviewingModel: 'claude',
      authorModel: conflict.primary.model,
      taskType: conflict.taskType,
      inputSummary: conflict.prompt.slice(0, 500),
      outputSummary: result.finalOutput.slice(0, 500),
      flaggedIssues: conflict.reviewer.flaggedIssues,
      outcome: result.patched ? 'patched' : 'approved',
      patchApplied: result.patched ? result.finalOutput : undefined,
      arbitrationRequired: true,
      arbitrationRationale: result.rationale,
      tokensUsed: result.tokensUsed,
      durationMs: 0,
    })
  } catch (err) {
    console.error('[Arbitration] ReviewLog persist failed:', err)
  }

  // Append to ProjectState review log
  const entry: ReviewEntry = {
    modelSource: 'claude',
    decision: `Arbitration: winner=${result.winner}, patched=${result.patched}`,
    rationale: result.rationale,
    timestamp: new Date(),
    taskType: 'arbitration',
  }
  await appendReviewEntry(projectId, entry).catch((err) =>
    console.error('[Arbitration] appendReviewEntry failed:', err)
  )

  // If a new architectural decision was made, record it in ProjectState
  if (result.patched && conflict.taskType === 'architecture') {
    await mergeProjectState(projectId, {
      architecture: {
        decisions: [`[Arbitrated] ${result.rationale.slice(0, 200)}`],
        fileTree: '',
        dataModels: [],
        apiRoutes: [],
      },
    }).catch((err) =>
      console.error('[Arbitration] architecture state merge failed:', err)
    )
  }

  return result
}

// --- Batch arbitration ---
// Processes all conflicts from a batchReview pass.
export interface BatchArbitrationResult {
  arbitrations: {
    model: ModelRole
    originalOutput: string
    finalOutput: string
    rationale: string
    patched: boolean
    winner: ModelRole | 'neither'
  }[]
  totalArbitrationTokens: number
}

export async function runBatchArbitration(
  projectId: string,
  sessionId: string,
  conflicts: ConflictCandidate[],
  projectStateContext: object
): Promise<BatchArbitrationResult> {
  const arbitrations: BatchArbitrationResult['arbitrations'] = []
  let totalArbitrationTokens = 0

  for (const conflict of conflicts) {
    const result = await runArbitration(
      projectId,
      sessionId,
      conflict,
      projectStateContext
    )
    totalArbitrationTokens += result.tokensUsed
    arbitrations.push({
      model: conflict.primary.model,
      originalOutput: conflict.primary.output,
      finalOutput: result.finalOutput,
      rationale: result.rationale,
      patched: result.patched,
      winner: result.winner,
    })
  }

  return { arbitrations, totalArbitrationTokens }
}
