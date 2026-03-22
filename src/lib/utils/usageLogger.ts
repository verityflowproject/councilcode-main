import { connectDB } from '@/lib/db/mongoose'
import { UsageLog, estimateCost } from '@/lib/models/UsageLog'
import type { ModelRole, TaskType, ModelResponse } from '@/types'

interface LogUsageParams {
  userId: string
  projectId: string
  sessionId: string
  responses: ModelResponse[]
  taskTypes: TaskType[]
  durationMs?: number
}

export async function logUsage({
  userId,
  projectId,
  sessionId,
  responses,
  taskTypes,
  durationMs = 0,
}: LogUsageParams): Promise<void> {
  try {
    await connectDB()
    const logs = responses.map((response, i) => ({
      userId,
      projectId,
      sessionId,
      model: response.model,
      taskType: taskTypes[i] ?? taskTypes[taskTypes.length - 1],
      tokensUsed: response.tokensUsed,
      estimatedCostUsd: estimateCost(response.model, response.tokensUsed),
      success: response.output.length > 0,
      durationMs,
    }))
    await UsageLog.insertMany(logs)
  } catch (err) {
    // Non-fatal — never block the main flow for logging
    console.error('[usageLogger] Failed to log usage:', err)
  }
}

export async function getUserUsageStats(
  userId: string,
  days: number = 30
): Promise<{
  totalCalls: number
  totalTokens: number
  totalCostUsd: number
  byModel: Record<ModelRole, { calls: number; tokens: number; costUsd: number }>
  byDay: { date: string; calls: number; tokens: number; costUsd: number }[]
}> {
  await connectDB()
  const since = new Date()
  since.setDate(since.getDate() - days)

  const logs = await UsageLog.find({
    userId,
    createdAt: { $gte: since },
  }).lean()

  const totalCalls = logs.length
  const totalTokens = logs.reduce((sum, l) => sum + l.tokensUsed, 0)
  const totalCostUsd = logs.reduce((sum, l) => sum + l.estimatedCostUsd, 0)

  const byModel = {} as Record<
    ModelRole,
    { calls: number; tokens: number; costUsd: number }
  >
  const modelRoles: ModelRole[] = ['claude', 'gpt4o', 'codestral', 'gemini', 'perplexity']
  for (const model of modelRoles) {
    const modelLogs = logs.filter((l) => l.model === model)
    byModel[model] = {
      calls: modelLogs.length,
      tokens: modelLogs.reduce((sum, l) => sum + l.tokensUsed, 0),
      costUsd: modelLogs.reduce((sum, l) => sum + l.estimatedCostUsd, 0),
    }
  }

  // Group by day
  const dayMap = new Map<string, { calls: number; tokens: number; costUsd: number }>()
  for (const log of logs) {
    const date = new Date(log.createdAt).toISOString().slice(0, 10)
    const existing = dayMap.get(date) ?? { calls: 0, tokens: 0, costUsd: 0 }
    dayMap.set(date, {
      calls: existing.calls + 1,
      tokens: existing.tokens + log.tokensUsed,
      costUsd: existing.costUsd + log.estimatedCostUsd,
    })
  }

  const byDay = Array.from(dayMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalCalls,
    totalTokens,
    totalCostUsd: Math.round(totalCostUsd * 10000) / 10000,
    byModel,
    byDay,
  }
}
