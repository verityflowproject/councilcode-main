import { connectDB } from '@/lib/db/mongoose'
import { UserApiKeys } from '@/lib/models/UserApiKeys'
import { decrypt } from '@/lib/encryption'

export interface UserKeySet {
  anthropicKey: string | null
  openaiKey: string | null
  mistralKey: string | null
  googleAiKey: string | null
  perplexityKey: string | null
}

/**
 * Returns decrypted API keys for a given user, ready for use in AI Council calls.
 *
 * All values are null if the user has not saved a key for that provider.
 *
 * TODO (Chunk 2): Fall back to process.env platform keys for paid-tier users
 * who have platform credits included in their plan.
 */
export async function getUserApiKeys(userId: string): Promise<UserKeySet> {
  await connectDB()

  const doc = await UserApiKeys.findOne({ userId }).lean()

  return {
    anthropicKey: doc?.anthropicKey ? decrypt(doc.anthropicKey) : null,
    openaiKey: doc?.openaiKey ? decrypt(doc.openaiKey) : null,
    mistralKey: doc?.mistralKey ? decrypt(doc.mistralKey) : null,
    googleAiKey: doc?.googleAiKey ? decrypt(doc.googleAiKey) : null,
    perplexityKey: doc?.perplexityKey ? decrypt(doc.perplexityKey) : null,
  }
}
