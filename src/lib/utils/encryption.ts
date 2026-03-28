import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw) {
    throw new Error(
      'ENCRYPTION_KEY env variable is required. Generate with: openssl rand -hex 32'
    )
  }
  const buf = Buffer.from(raw, 'hex')
  if (buf.length !== 32) {
    throw new Error(
      'ENCRYPTION_KEY must be 32 bytes (64 hex chars). Generate with: openssl rand -hex 32'
    )
  }
  return buf
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a colon-joined hex string: iv:authTag:ciphertext
 */
export function encrypt(text: string): string {
  const key = getKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [iv.toString('hex'), authTag.toString('hex'), ciphertext.toString('hex')].join(':')
}

/**
 * Decrypts a string produced by encrypt().
 * Expects colon-joined hex: iv:authTag:ciphertext
 */
export function decrypt(encrypted: string): string {
  const key = getKey()
  const [ivHex, authTagHex, ciphertextHex] = encrypted.split(':')
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, 'hex')),
    decipher.final(),
  ]).toString('utf8')
}
