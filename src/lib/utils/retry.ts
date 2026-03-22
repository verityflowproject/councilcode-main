interface RetryOptions {
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
  shouldRetry?: (err: unknown) => boolean
}

function defaultShouldRetry(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as Record<string, unknown>
  // Retry on rate limits and server errors
  if (typeof e.status === 'number') {
    return e.status === 429 || e.status >= 500
  }
  if (typeof e.statusCode === 'number') {
    return e.statusCode === 429 || e.statusCode >= 500
  }
  // Retry on network errors
  const msg = (e.message as string) ?? ''
  return (
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('fetch failed') ||
    msg.includes('network')
  )
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 15000,
    shouldRetry = defaultShouldRetry,
  } = options

  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt === maxAttempts || !shouldRetry(err)) {
        throw err
      }
      const delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

export const MODEL_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 2000,
  maxDelayMs: 15000,
}

export const FAST_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 2,
  baseDelayMs: 500,
  maxDelayMs: 3000,
}
