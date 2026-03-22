import mongoose, { Document, Schema } from 'mongoose'
import type { ModelRole, TaskType } from '@/types'

interface ReviewEntrySubdoc {
  modelSource: ModelRole
  decision: string
  rationale: string
  timestamp: Date
  taskType: TaskType
}

interface OpenQuestionSubdoc {
  text: string
  flaggedBy: ModelRole
  resolved: boolean
}

export interface IProjectState extends Document {
  projectId: mongoose.Types.ObjectId
  architecture: {
    decisions: string[]
    fileTree: string
    dataModels: string[]
    apiRoutes: string[]
  }
  conventions: {
    naming: string
    folderStructure: string
    componentPatterns: string[]
  }
  dependencies: {
    packages: string[]
    versions: Map<string, string>
    knownGotchas: string[]
  }
  openQuestions: OpenQuestionSubdoc[]
  reviewLog: ReviewEntrySubdoc[]
  currentTask: {
    scope: string
    constraints: string[]
    relatedFiles: string[]
  }
  version: number
  createdAt: Date
  updatedAt: Date
}

const ReviewEntrySchema = new Schema<ReviewEntrySubdoc>(
  {
    modelSource: {
      type: String,
      enum: ['claude', 'gpt4o', 'codestral', 'gemini', 'perplexity'],
      required: true,
    },
    decision: { type: String, required: true },
    rationale: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    taskType: {
      type: String,
      enum: ['architecture', 'implementation', 'research', 'refactor', 'review', 'arbitration'],
      required: true,
    },
  },
  { _id: false }
)

const OpenQuestionSchema = new Schema<OpenQuestionSubdoc>(
  {
    text: { type: String, required: true },
    flaggedBy: {
      type: String,
      enum: ['claude', 'gpt4o', 'codestral', 'gemini', 'perplexity'],
      required: true,
    },
    resolved: { type: Boolean, default: false },
  },
  { _id: false }
)

const ProjectStateSchema = new Schema<IProjectState>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
      index: true,
    },
    architecture: {
      decisions: { type: [String], default: [] },
      fileTree: { type: String, default: '' },
      dataModels: { type: [String], default: [] },
      apiRoutes: { type: [String], default: [] },
    },
    conventions: {
      naming: { type: String, default: '' },
      folderStructure: { type: String, default: '' },
      componentPatterns: { type: [String], default: [] },
    },
    dependencies: {
      packages: { type: [String], default: [] },
      versions: { type: Map, of: String, default: {} },
      knownGotchas: { type: [String], default: [] },
    },
    openQuestions: { type: [OpenQuestionSchema], default: [] },
    reviewLog: { type: [ReviewEntrySchema], default: [] },
    currentTask: {
      scope: { type: String, default: '' },
      constraints: { type: [String], default: [] },
      relatedFiles: { type: [String], default: [] },
    },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
)

export const ProjectState =
  mongoose.models.ProjectState ||
  mongoose.model<IProjectState>('ProjectState', ProjectStateSchema)
