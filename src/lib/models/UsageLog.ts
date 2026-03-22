import mongoose, { Document, Schema } from 'mongoose'
import type { ModelRole, TaskType } from '@/types'

export interface IUsageLog extends Omit<Document, 'model'> {
  userId: mongoose.Types.ObjectId
  projectId: mongoose.Types.ObjectId
  sessionId: string
  model: ModelRole
  taskType: TaskType
  tokensUsed: number
  estimatedCostUsd: number
  success: boolean
  durationMs: number
  createdAt: Date
  updatedAt: Date
}

// Rough cost estimates per 1k tokens (input+output blended)
const COST_PER_1K_TOKENS: Record<ModelRole, number> = {
  claude:     0.015,  // Opus 4.6
  gpt4o:      0.005,  // GPT-5.4
  codestral:  0.001,  // Codestral
  gemini:     0.0025, // Gemini 3.1 Pro
  perplexity: 0.003,  // Sonar Pro
}

export function estimateCost(model: ModelRole, tokens: number): number {
  const rate = COST_PER_1K_TOKENS[model] ?? 0.005
  return Math.round((tokens / 1000) * rate * 10000) / 10000
}

const UsageLogSchema = new Schema<IUsageLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    model: {
      type: String,
      enum: ['claude', 'gpt4o', 'codestral', 'gemini', 'perplexity'],
      required: true,
    },
    taskType: {
      type: String,
      enum: ['architecture', 'implementation', 'research', 'refactor', 'review', 'arbitration'],
      required: true,
    },
    tokensUsed: { type: Number, default: 0 },
    estimatedCostUsd: { type: Number, default: 0 },
    success: { type: Boolean, default: true },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const UsageLog =
  mongoose.models.UsageLog ||
  mongoose.model<IUsageLog>('UsageLog', UsageLogSchema)
