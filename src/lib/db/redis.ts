import Redis from 'ioredis'

declare global {
  var _redisInstance: Redis | undefined
}

/**
 * Lazy singleton — defers Redis client creation to the first property access.
 * This lets the module be imported during the Next.js build without REDIS_URL
 * being present in the build environment.
 */
function getInstance(): Redis {
  if (global._redisInstance) return global._redisInstance
  const url = process.env.REDIS_URL
  if (!url) throw new Error('Please define REDIS_URL in .env.local')
  global._redisInstance = new Redis(url, { keyPrefix: 'cc:', lazyConnect: true })
  return global._redisInstance
}

const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export default redis
