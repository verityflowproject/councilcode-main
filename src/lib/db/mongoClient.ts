import { MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let _singletonPromise: Promise<MongoClient> | null = null

function lazyConnect(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const uri = process.env.MONGODB_URI
      if (!uri) throw new Error('Please define MONGODB_URI in .env.local')
      const client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  }

  if (!_singletonPromise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('Please define MONGODB_URI in .env.local')
    const client = new MongoClient(uri)
    _singletonPromise = client.connect()
  }
  return _singletonPromise
}

/**
 * Lazy thenable — defers MongoClient creation to the first time it is awaited.
 * This lets the module be imported during the Next.js build without MONGODB_URI
 * being present in the build environment.
 */
const clientPromise: Promise<MongoClient> = {
  then<T, U>(
    onfulfilled?: ((value: MongoClient) => T | PromiseLike<T>) | null,
    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null,
  ): Promise<T | U> {
    return lazyConnect().then(onfulfilled, onrejected)
  },
  catch<T>(
    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null,
  ): Promise<MongoClient | T> {
    return lazyConnect().catch(onrejected)
  },
  finally(onfinally?: (() => void) | null): Promise<MongoClient> {
    return lazyConnect().finally(onfinally)
  },
  [Symbol.toStringTag]: 'Promise',
} as Promise<MongoClient>

export default clientPromise
