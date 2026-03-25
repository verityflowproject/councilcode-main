import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

/**
 * Resolves and validates the encryption key lazily (at call time, not module load time).
 * This allows the module to be imported during the Next.js build without crashing,
 * even when ENCRYPTION_KEY is not set in the build environment.
 */
function getKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY
  if (!rawKey) {
    throw new Error(
      '[encryption] ENCRYPTION_KEY is not set. Generate one with: openssl rand -hex 32'
    )
  }
  if (rawKey.length !== 64) {
    throw new Error(
      '[encryption] ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Generate one with: openssl rand -hex 32'
    )
  }
  return Buffer.from(rawKey, 'hex')
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string: iv (12B) + authTag (16B) + ciphertext.
 */
export function encrypt(text: string): string {
  const KEY = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

/**
 * Decrypts a base64-encoded ciphertext produced by encrypt().
 * Returns the original plaintext string.
 */
export function decrypt(encoded: string): string {
  const KEY = getKey()
  const buf = Buffer.from(encoded, 'base64')

  const iv = buf.subarray(0, IV_LENGTH)
  const authTag = buf.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const ciphertext = buf.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8')
}
