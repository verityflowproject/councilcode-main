import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div
          className="text-6xl font-mono font-bold"
          style={{ color: 'var(--accent)', opacity: 0.4 }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Page not found
        </h1>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          The council couldn&apos;t find what you were looking for. It may have been moved or deleted.
        </p>
        <Link
          href="/dashboard"
          className="inline-block text-sm px-5 py-2.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
