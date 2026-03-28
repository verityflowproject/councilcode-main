import mongoose, { Document, Schema } from 'mongoose'

export interface IUserApiKeys extends Document {
  userId: mongoose.Types.ObjectId
  // Standard 5 provider keys — stored encrypted, null if not set
  anthropicKey?: string
  openaiKey?: string
  mistralKey?: string
  googleAiKey?: string
  perplexityKey?: string
  // OpenRouter single-key option (covers all 5 models via one account)
  openrouterKey?: string
  // Custom role assignments (Pro feature — stored as JSON string, encrypted)
  roleAssignments?: string
  createdAt: Date
  updatedAt: Date
}

const UserApiKeysSchema = new Schema<IUserApiKeys>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    anthropicKey: {
      type: String,
    },
    openaiKey: {
      type: String,
    },
    mistralKey: {
      type: String,
    },
    googleAiKey: {
      type: String,
    },
    perplexityKey: {
      type: String,
    },
    openrouterKey: {
      type: String,
    },
    roleAssignments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const UserApiKeys =
  mongoose.models.UserApiKeys ||
  mongoose.model<IUserApiKeys>('UserApiKeys', UserApiKeysSchema)
