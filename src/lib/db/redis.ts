import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL!

if (!REDIS_URL) {
  throw new Error('Please define REDIS_URL in .env.local')
}

declare global {
  var redis: Redis | undefined
}

const redis: Redis = global.redis ?? new Redis(REDIS_URL, {
  keyPrefix: 'cc:',
  lazyConnect: true,
})

global.redis = redis

export default redis
