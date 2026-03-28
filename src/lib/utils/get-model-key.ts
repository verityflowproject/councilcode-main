import { connectDB } from '@/lib/db/mongoose'
import { UserApiKeys, type IUserApiKeys } from '@/lib/models/UserApiKeys'
import { decrypt } from '@/lib/utils/encryption'

export type ProviderName =
  | 'anthropic'
  | 'openai'
  | 'mistral'
  | 'google'
  | 'perplexity'
  | 'openrouter'

export interface ResolvedKey {
  apiKey: string
  source: 'byok-individual' | 'byok-openrouter' | 'platform'
  shouldDeductCredits: boolean
}

// Maps provider name to the field on UserApiKeys that stores the individual key
const PROVIDER_KEY_FIELD: Record<ProviderName, keyof IUserApiKeys> = {
  anthropic:  'anthropicKey',
  openai:     'openaiKey',
  mistral:    'mistralKey',
  google:     'googleAiKey',
  perplexity: 'perplexityKey',
  openrouter: 'openrouterKey',
}

// Maps provider name to the platform env var name
const PLATFORM_ENV_VAR: Record<ProviderName, string> = {
  anthropic:  'PLATFORM_ANTHROPIC_KEY',
  openai:     'PLATFORM_OPENAI_KEY',
  mistral:    'PLATFORM_MISTRAL_KEY',
  google:     'PLATFORM_GOOGLE_AI_KEY',
  perplexity: 'PLATFORM_PERPLEXITY_KEY',
  openrouter: '', // no platform OpenRouter key
}

// OpenRouter model prefix map for routing to the correct underlying model
export const OPENROUTER_MODEL_MAP: Record<ProviderName, string> = {
  anthropic:  'anthropic/claude-opus-4-6',
  openai:     'openai/gpt-4o', // use gpt-4o as gpt-5.4 may not be on OpenRouter
  mistral:    'mistral/codestral-latest',
  google:     'google/gemini-pro-1.5',
  perplexity: 'perplexity/sonar-pro',
  openrouter: '',
}

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

/**
 * Resolves the API key for a given provider in priority order:
 * 1. User's individual BYOK key for this provider
 * 2. User's OpenRouter key (covers all providers via a single account)
 * 3. Platform key from environment variables
 *
 * Throws if no key is available from any source.
 */
export async function resolveApiKey(
  userId: string,
  provider: ProviderName
): Promise<ResolvedKey> {
  await connectDB()

  const userKeys = await UserApiKeys.findOne({ userId }).lean()

  // 1. Individual BYOK key for this provider
  if (userKeys) {
    const fieldName = PROVIDER_KEY_FIELD[provider]
    const encryptedKey = userKeys[fieldName] as string | undefined
    if (encryptedKey) {
      return {
        apiKey: decrypt(encryptedKey),
        source: 'byok-individual',
        shouldDeductCredits: false,
      }
    }

    // 2. OpenRouter single-key fallback
    if (userKeys.openrouterKey) {
      return {
        apiKey: decrypt(userKeys.openrouterKey),
        source: 'byok-openrouter',
        shouldDeductCredits: false,
      }
    }
  }

  // 3. Platform key from environment
  const envVarName = PLATFORM_ENV_VAR[provider]
  if (envVarName) {
    const platformKey = process.env[envVarName]
    if (platformKey) {
      return {
        apiKey: platformKey,
        source: 'platform',
        shouldDeductCredits: true,
      }
    }
  }

  throw new Error(
    `No API key available for provider: ${provider}. Add your own key at /dashboard/settings/api-keys`
  )
}

/**
 * Returns true if the user has no individual BYOK keys and no OpenRouter key,
 * meaning all 5 providers will fall back to platform keys.
 */
export async function isUsingPlatformKeys(userId: string): Promise<boolean> {
  await connectDB()

  const userKeys = await UserApiKeys.findOne({ userId }).lean()
  if (!userKeys) return true

  const hasOpenRouter = !!userKeys.openrouterKey
  if (hasOpenRouter) return false

  const hasAnyIndividual =
    !!userKeys.anthropicKey ||
    !!userKeys.openaiKey ||
    !!userKeys.mistralKey ||
    !!userKeys.googleAiKey ||
    !!userKeys.perplexityKey

  return !hasAnyIndividual
}
