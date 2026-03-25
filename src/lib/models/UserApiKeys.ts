import mongoose, { Document, Schema } from 'mongoose'

export interface IUserApiKeys extends Document {
  userId: string
  anthropicKey?: string
  openaiKey?: string
  mistralKey?: string
  googleAiKey?: string
  perplexityKey?: string
  createdAt: Date
  updatedAt: Date
}

const UserApiKeysSchema = new Schema<IUserApiKeys>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    anthropicKey: {
      type: String,
      default: null,
    },
    openaiKey: {
      type: String,
      default: null,
    },
    mistralKey: {
      type: String,
      default: null,
    },
    googleAiKey: {
      type: String,
      default: null,
    },
    perplexityKey: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const UserApiKeys =
  mongoose.models.UserApiKeys ||
  mongoose.model<IUserApiKeys>('UserApiKeys', UserApiKeysSchema)
