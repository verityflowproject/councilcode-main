import mongoose, { Document, Schema } from 'mongoose'

export type ProjectStatus = 'draft' | 'building' | 'review' | 'complete' | 'error'

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  description: string
  techStack: string[]
  status: ProjectStatus
  activeSessionId?: string
  totalSessions: number
  lastBuiltAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    techStack: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'building', 'review', 'complete', 'error'],
      default: 'draft',
    },
    activeSessionId: {
      type: String,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    lastBuiltAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
