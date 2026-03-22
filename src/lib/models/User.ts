import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  image?: string
  plan: 'free' | 'pro' | 'teams'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  modelCallsUsed: number
  modelCallsLimit: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'teams'],
      default: 'free',
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    modelCallsUsed: {
      type: Number,
      default: 0,
    },
    modelCallsLimit: {
      type: Number,
      default: 50, // free tier default
    },
  },
  {
    timestamps: true,
  }
)

export const User =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
