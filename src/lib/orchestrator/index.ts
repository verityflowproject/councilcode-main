import {
  buildTaskQueue,
  classifyTask,
} from './router'
import {
  getProjectState,
  mergeProjectState,
  appendReviewEntry,
} from '@/lib/utils/projectState'
import type {
  OrchestratorTask,
  ModelResponse,
  ModelRole,
  ProjectStateDoc,
  ReviewEntry,
} from '@/types'

import { runClaude } from './adapters/claude'
import { runGpt4o } from './adapters/gpt4o'
import { runCodestral } from './adapters/codestral'
import { runGemini } from './adapters/gemini'
import { runPerplexity } from './adapters/perplexity'
import { batchReview } from './review/pipeline'
import { runHallucinationFirewall } from './review/hallucination'
import { detectConflict, runBatchArbitration } from './review/arbitration'
import type { ConflictCandidate, BatchArbitrationResult } from './review/arbitration'

// --- Adapter dispatch ---
async function runAdapter(task: OrchestratorTask): Promise<ModelResponse> {
  switch (task.assignedModel) {
    case 'claude':
      return runClaude(task)
    case 'gpt4o':
      return runGpt4o(task)
    case 'codestral':
      return runCodestral(task)
    case 'gemini':
      return runGemini(task)
    case 'perplexity':
      return runPerplexity(task)
    default:
      throw new Error(`Unknown model: ${task.assignedModel}`)
  }
}

// --- Main orchestrator ---
export async function runOrchestrator(
  projectId: string,
  userPrompt: string,
  sessionId: string
): Promise<{
  responses: ModelResponse[]
  reviewedOutputs: {
    model: ModelRole
    output: string
    approved: boolean
    patched: boolean
    flaggedIssues: string[]
  }[]
  arbitrationResults: {
    model: ModelRole
    originalOutput: string
    finalOutput: string
    rationale: string
    patched: boolean
    winner: ModelRole | 'neither'
  }[]
  updatedState: ProjectStateDoc | null
  requiresArbitration: boolean
  reviewTokensUsed: number
  arbitrationTokensUsed: number
}> {
  // 1. Load current ProjectState
  const state = await getProjectState(projectId)
  if (!state) {
    throw new Error(`[Orchestrator] No ProjectState found for project ${projectId}`)
  }

  // 2. Update currentTask in state
  const _taskType = classifyTask(userPrompt)
  await mergeProjectState(projectId, {
    currentTask: {
      scope: userPrompt,
      constraints: [],
      relatedFiles: [],
    },
  })

  // 3. Build task queue
  const tasks = buildTaskQueue(projectId, userPrompt, state)
  const responses: ModelResponse[] = []
  let requiresArbitration = false

  // 4. Execute tasks sequentially
  // Research task always runs first and its findings feed into subsequent tasks
  let researchFindings: string | null = null

  for (const task of tasks) {
    try {
      // Run hallucination firewall for implementation tasks
      let enrichedTask = task
      if (
        task.taskType === 'implementation' ||
        task.taskType === 'architecture'
      ) {
        const firewallResult = await runHallucinationFirewall(task, state)
        if (firewallResult.blocked) {
          // Block this task — push an error response and skip execution
          responses.push({
            model: task.assignedModel,
            output: '',
            confidence: 0,
            flaggedIssues: [firewallResult.blockReason ?? 'Blocked by hallucination firewall'],
            tokensUsed: firewallResult.tokensUsed,
          })
          continue
        }
        // Use the enriched prompt with verified dependency info
        enrichedTask = { ...task, prompt: firewallResult.enrichedPrompt }
      }

      // Also inject prior research findings if available
      if (researchFindings && task.taskType !== 'research') {
        enrichedTask = {
          ...enrichedTask,
          prompt: enrichedTask.prompt.includes('Verified dependency info')
            ? enrichedTask.prompt
            : `${enrichedTask.prompt}\n\n--- Additional research context ---\n${researchFindings}`,
        }
      }

      const response = await runAdapter(enrichedTask)
      responses.push(response)

      // Store research findings for downstream tasks
      if (task.taskType === 'research') {
        researchFindings = response.output
      }

      // Check if reviewer flagged issues requiring arbitration
      if (
        task.taskType === 'review' &&
        response.flaggedIssues.length > 0 &&
        !response.output.includes('"approved": true')
      ) {
        requiresArbitration = true
      }

      // Log review entries to ProjectState
      if (task.taskType === 'review' || task.taskType === 'arbitration') {
        const entry: ReviewEntry = {
          modelSource: task.assignedModel,
          decision: response.output.slice(0, 300),
          rationale: response.flaggedIssues.join('; ') || 'No issues flagged',
          timestamp: new Date(),
          taskType: task.taskType,
        }
        await appendReviewEntry(projectId, entry)
      }
    } catch (err) {
      console.error(`[Orchestrator] Task failed for ${task.assignedModel}:`, err)
      responses.push({
        model: task.assignedModel,
        output: '',
        confidence: 0,
        flaggedIssues: [`Task execution failed: ${String(err)}`],
        tokensUsed: 0,
      })
    }
  }

  // 6. Run batch review pipeline on all non-research, non-arbitration responses
  const reviewableTasks = tasks.filter(
    (t) => t.taskType !== 'research' && t.taskType !== 'arbitration'
  )
  const reviewableResponses = responses.filter(
    (r) => r.model !== 'perplexity'
  )
  let reviewResult = {
    anyRequiresArbitration: false,
    totalReviewTokens: 0,
    finalOutputs: reviewableResponses.map((r) => ({
      model: r.model,
      output: r.output,
      approved: true,
      patched: false,
      flaggedIssues: r.flaggedIssues,
    })),
  }
  if (reviewableResponses.length > 0) {
    reviewResult = await batchReview(
      projectId,
      sessionId,
      reviewableTasks,
      reviewableResponses
    )
  }

  // 7. Run arbitration on any genuine conflicts
  let arbitrationResults: BatchArbitrationResult | null = null
  if (reviewResult.anyRequiresArbitration) {
    requiresArbitration = true
    // Build conflict candidates
    const conflicts: ConflictCandidate[] = []
    for (let i = 0; i < reviewableResponses.length; i++) {
      const primary = reviewableResponses[i]
      const task = reviewableTasks[i] ?? reviewableTasks[reviewableTasks.length - 1]
      // Find the corresponding review response
      const reviewResponse = responses.find(
        (r) => r.model !== primary.model &&
        (r.model === 'claude' || r.model === 'gpt4o')
      )
      if (
        reviewResponse &&
        detectConflict(primary, reviewResponse, task.taskType)
      ) {
        conflicts.push({
          taskType: task.taskType,
          primary,
          reviewer: reviewResponse,
          prompt: task.prompt,
        })
      }
    }
    if (conflicts.length > 0) {
      const arbitrationContext = {
        architecture: state.architecture,
        conventions: state.conventions,
        reviewLog: state.reviewLog.slice(-10),
      }
      arbitrationResults = await runBatchArbitration(
        projectId,
        sessionId,
        conflicts,
        arbitrationContext
      )
      // Merge arbitrated outputs back into finalOutputs
      for (const arb of arbitrationResults.arbitrations) {
        const idx = reviewResult.finalOutputs.findIndex(
          (o) => o.model === arb.model
        )
        if (idx !== -1) {
          reviewResult.finalOutputs[idx] = {
            ...reviewResult.finalOutputs[idx],
            output: arb.finalOutput,
            patched: arb.patched,
          }
        }
      }
    }
  }

  // 8. Return final state
  const updatedState = await getProjectState(projectId)
  return {
    responses,
    reviewedOutputs: reviewResult.finalOutputs,
    arbitrationResults: arbitrationResults?.arbitrations ?? [],
    updatedState,
    requiresArbitration,
    reviewTokensUsed: reviewResult.totalReviewTokens,
    arbitrationTokensUsed: arbitrationResults?.totalArbitrationTokens ?? 0,
  }
}
