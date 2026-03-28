import mongoose from 'mongoose'
import { connectDB } from '@/lib/db/mongoose'
import { UserCredits, CreditTransaction, type ICreditTransaction } from '@/lib/models/UserCredits'
import { User } from '@/lib/models/User'
import { CREDIT_COSTS_PER_1K_TOKENS } from '@/lib/utils/credit-costs'

export async function getUserBalance(userId: string): Promise<number> {
  try {
    await connectDB()
    const record = await UserCredits.findOne({ userId }).lean()
    return record?.balance ?? 0
  } catch {
    return 0
  }
}

export async function checkSufficientCredits(
  userId: string,
  estimatedCost: number
): Promise<boolean> {
  const balance = await getUserBalance(userId)
  return balance >= estimatedCost
}

export async function deductCredits(
  userId: string,
  params: {
    amount: number
    description: string
    sessionId?: string
    modelUsed?: string
    tokensUsed?: number
    creditCostPerCall?: number
  }
): Promise<void> {
  await connectDB()
  const session = await mongoose.connection.startSession()
  try {
    await session.withTransaction(async () => {
      const record = await UserCredits.findOne({ userId }).session(session)
      const currentBalance = record?.balance ?? 0

      if (currentBalance < params.amount) {
        throw new Error('Insufficient credits')
      }

      if (record) {
        record.balance -= params.amount
        record.lifetimeSpent += params.amount
        await record.save({ session })
      } else {
        await UserCredits.create(
          [
            {
              userId,
              balance: 0 - params.amount,
              lifetimeSpent: params.amount,
              lifetimePurchased: 0,
            },
          ],
          { session }
        )
      }

      await User.findByIdAndUpdate(
        userId,
        { creditBalance: Math.max(0, currentBalance - params.amount) },
        { session }
      )

      await CreditTransaction.create(
        [
          {
            userId,
            amount: -params.amount,
            type: 'spend',
            description: params.description,
            sessionId: params.sessionId,
            modelUsed: params.modelUsed,
            tokensUsed: params.tokensUsed,
            creditCostPerCall: params.creditCostPerCall,
          },
        ],
        { session }
      )
    })
  } finally {
    await session.endSession()
  }
}

export async function addCredits(
  userId: string,
  params: {
    amount: number
    type: 'purchase' | 'bonus' | 'refund'
    description: string
    stripePaymentId?: string
  }
): Promise<void> {
  await connectDB()

  const isPurchase = params.type === 'purchase'

  const updated = await UserCredits.findOneAndUpdate(
    { userId },
    {
      $inc: {
        balance: params.amount,
        lifetimeSpent: 0,
        lifetimePurchased: isPurchase ? params.amount : 0,
      },
    },
    { upsert: true, new: true }
  )

  await User.findByIdAndUpdate(userId, { creditBalance: updated.balance })

  await CreditTransaction.create({
    userId,
    amount: params.amount,
    type: params.type,
    description: params.description,
    stripePaymentId: params.stripePaymentId,
  })
}

/**
 * Rough pre-flight estimate before a council session.
 * Assumes ~500 input + 1000 output tokens per role call.
 * Uses the average cost across the 5 full models.
 */
export function estimateSessionCost(roleCount = 5): number {
  const fullModels = [
    'claude-opus-4-6',
    'gpt-5.4',
    'codestral-latest',
    'gemini-3.1-pro-preview',
    'sonar-pro',
  ]

  const INPUT_TOKENS = 500
  const OUTPUT_TOKENS = 1000

  const totalPerRole =
    fullModels.reduce((sum, model) => {
      const costs = CREDIT_COSTS_PER_1K_TOKENS[model]
      if (!costs) return sum
      return (
        sum +
        (INPUT_TOKENS / 1000) * costs.input +
        (OUTPUT_TOKENS / 1000) * costs.output
      )
    }, 0) / fullModels.length

  return Math.ceil(totalPerRole * roleCount)
}

export async function getTransactionHistory(
  userId: string,
  limit = 20
): Promise<ICreditTransaction[]> {
  try {
    await connectDB()
    return await CreditTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
  } catch {
    return []
  }
}
