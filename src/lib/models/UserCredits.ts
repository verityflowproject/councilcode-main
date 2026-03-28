import mongoose, { Document, Schema } from 'mongoose'

// ── UserCredits ───────────────────────────────────────────────────────────────

export interface IUserCredits extends Document {
  userId: mongoose.Types.ObjectId
  balance: number
  lifetimeSpent: number
  lifetimePurchased: number
  updatedAt: Date
}

const UserCreditsSchema = new Schema<IUserCredits>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    lifetimeSpent: {
      type: Number,
      default: 0,
    },
    lifetimePurchased: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export const UserCredits =
  mongoose.models.UserCredits ||
  mongoose.model<IUserCredits>('UserCredits', UserCreditsSchema)

// ── CreditTransaction ─────────────────────────────────────────────────────────

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId
  amount: number
  type: 'purchase' | 'spend' | 'refund' | 'bonus'
  description: string
  sessionId?: string
  modelUsed?: string
  tokensUsed?: number
  creditCostPerCall?: number
  stripePaymentId?: string
  createdAt: Date
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'spend', 'refund', 'bonus'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
    },
    modelUsed: {
      type: String,
    },
    tokensUsed: {
      type: Number,
    },
    creditCostPerCall: {
      type: Number,
    },
    stripePaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const CreditTransaction =
  mongoose.models.CreditTransaction ||
  mongoose.model<ICreditTransaction>('CreditTransaction', CreditTransactionSchema)
