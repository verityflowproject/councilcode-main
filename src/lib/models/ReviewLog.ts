import mongoose, { Document, Schema } from 'mongoose'
import type { ModelRole, TaskType } from '@/types'

export type ReviewOutcome = 'approved' | 'rejected' | 'patched' | 'escalated'

export interface IReviewLog extends Document {
  projectId: mongoose.Types.ObjectId
  sessionId: string
  reviewingModel: ModelRole
  authorModel: ModelRole
  taskType: TaskType
  inputSummary: string
  outputSummary: string
  flaggedIssues: string[]
  outcome: ReviewOutcome
  patchApplied?: string
  arbitrationRequired: boolean
  arbitrationRationale?: string
  tokensUsed: number
  durationMs: number
  createdAt: Date
  updatedAt: Date
}

const ReviewLogSchema = new Schema<IReviewLog>(
  {
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
    reviewingModel: {
      type: String,
      enum: ['claude', 'gpt4o', 'codestral', 'gemini', 'perplexity'],
      required: true,
    },
    authorModel: {
      type: String,
      enum: ['claude', 'gpt4o', 'codestral', 'gemini', 'perplexity'],
      required: true,
    },
    taskType: {
      type: String,
      enum: ['architecture', 'implementation', 'research', 'refactor', 'review', 'arbitration'],
      required: true,
    },
    inputSummary: { type: String, required: true },
    outputSummary: { type: String, required: true },
    flaggedIssues: { type: [String], default: [] },
    outcome: {
      type: String,
      enum: ['approved', 'rejected', 'patched', 'escalated'],
      required: true,
    },
    patchApplied: { type: String },
    arbitrationRequired: { type: Boolean, default: false },
    arbitrationRationale: { type: String },
    tokensUsed: { type: Number, default: 0 },
    durationMs: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

export const ReviewLog =
  mongoose.models.ReviewLog ||
  mongoose.model<IReviewLog>('ReviewLog', ReviewLogSchema)
