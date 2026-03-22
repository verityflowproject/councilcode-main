import { signIn } from '@/lib/auth'
import Link from 'next/link'

const PLAN_FEATURES = [
  'Access to all 5 AI models',
  '50 council sessions included',
  'ProjectState memory system',
  'Full review log access',
  'Hallucination firewall',
]

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--background)' }}
    >
      {/* Left panel — value prop */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12 border-r relative overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
                              linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top right, var(--accent) 0%, transparent 70%)',
          }}
        />
        <div className="relative">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Council<span style={{ color: 'var(--accent)' }}>Code</span>
          </Link>
        </div>
        <div className="relative space-y-8">
          <div className="space-y-4">
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--accent)' }}
            >
              Free plan includes
            </span>
            <h2
              className="text-2xl font-bold leading-snug"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Everything you need
              <br />
              to ship your first project.
            </h2>
          </div>
          <ul className="space-y-3">
            {PLAN_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                  style={{
                    background: 'rgba(99,102,241,0.15)',
                    color: 'var(--accent)',
                  }}
                >
                  ✓
                </span>
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          {/* Plan badge */}
          <div
            className="inline-flex items-center gap-3 px-4 py-3 rounded-lg border"
            style={{
              borderColor: 'rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.05)',
            }}
          >
            <div className="space-y-0.5">
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Free forever
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                No credit card required
              </p>
            </div>
          </div>
        </div>
        <p
          className="relative text-xs font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} CouncilCode
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8 animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Council<span style={{ color: 'var(--accent)' }}>Code</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1
              className="text-2xl font-bold"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Create your account
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Start building with your AI engineering firm
            </p>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/dashboard' })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150 hover:border-accent"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div
                className="flex-1 h-px"
                style={{ background: 'var(--border)' }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                or
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: 'var(--border)' }}
              />
            </div>

            {/* Email */}
            <form
              action={async (formData: FormData) => {
                'use server'
                const email = formData.get('email') as string
                await signIn('email', { email, redirectTo: '/dashboard' })
              }}
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-mono"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-150 focus:border-accent font-mono"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                }}
              >
                Create free account
              </button>
            </form>
          </div>

          {/* Terms */}
          <p
            className="text-center text-xs leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            By creating an account you agree to our{' '}
            <span style={{ color: 'var(--text-secondary)' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>
          </p>
          <p
            className="text-center text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="transition-colors hover:text-accent"
              style={{ color: 'var(--text-secondary)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
