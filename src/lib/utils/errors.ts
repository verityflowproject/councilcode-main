export class CouncilCodeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message)
    this.name = 'CouncilCodeError'
  }
}

export class ModelAdapterError extends CouncilCodeError {
  constructor(
    message: string,
    public readonly model: string,
    public readonly originalError?: unknown
  ) {
    super(message, 'MODEL_ADAPTER_ERROR', 502)
    this.name = 'ModelAdapterError'
  }
}

export class RateLimitError extends CouncilCodeError {
  constructor(public readonly model: string) {
    super(`Rate limit exceeded for model: ${model}`, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

export class UsageLimitError extends CouncilCodeError {
  constructor() {
    super('Monthly usage limit reached. Please upgrade your plan.', 'USAGE_LIMIT_ERROR', 403)
    this.name = 'UsageLimitError'
  }
}

export class ProjectStateError extends CouncilCodeError {
  constructor(message: string) {
    super(message, 'PROJECT_STATE_ERROR', 500)
    this.name = 'ProjectStateError'
  }
}

export class FirewallBlockError extends CouncilCodeError {
  constructor(public readonly reason: string) {
    super(`Request blocked by hallucination firewall: ${reason}`, 'FIREWALL_BLOCK_ERROR', 422)
    this.name = 'FirewallBlockError'
  }
}

export function serializeError(err: unknown): {
  message: string
  code: string
  statusCode: number
} {
  if (err instanceof CouncilCodeError) {
    return {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
    }
  }
  if (err instanceof Error) {
    return {
      message: err.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    }
  }
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }
}

export function isRateLimitError(err: unknown): boolean {
  if (err instanceof RateLimitError) return true
  if (!err || typeof err !== 'object') return false
  const e = err as Record<string, unknown>
  if (e.status === 429 || e.statusCode === 429) return true
  const msg = (e.message as string) ?? ''
  return msg.toLowerCase().includes('rate limit')
}
