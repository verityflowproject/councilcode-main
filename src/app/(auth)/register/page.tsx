import { signIn } from '@/lib/auth'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Background — exact match to Hero section ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(ellipse 900px 600px at 50% -100px, rgba(67,97,238,0.18), transparent 70%),
            radial-gradient(ellipse 400px 300px at 80% 20%, rgba(6,182,212,0.06), transparent 60%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Top bar — mirrors Navbar without the nav links ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(5,5,8,0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid var(--border-subtle)',
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '18px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
          }}
        >
          Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
        </Link>
        <Link
          href="/"
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
        >
          ← Back to home
        </Link>
      </div>

      {/* ── Page content ── */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 24px 48px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="animate-fade-up"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* Pill eyebrow badge — matches Hero eyebrow style exactly */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-default)',
                borderRadius: '100px',
                padding: '6px 16px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}
            >
              Free plan
              <span style={{ color: 'var(--accent-blue)' }}>·</span>
              50 sessions/month
              <span style={{ color: 'var(--accent-blue)' }}>·</span>
              No credit card
            </span>
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '10px',
                lineHeight: 1.1,
              }}
            >
              Create your account
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
              Deploy your AI engineering firm in seconds.
            </p>
          </div>

          {/* Form card — matches landing card pattern */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              boxShadow: 'var(--shadow-card), var(--shadow-glow-blue)',
              marginBottom: '16px',
            }}
          >
            {/* Google */}
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/dashboard' })
              }}
              style={{ marginBottom: '16px' }}
            >
              <button
                type="submit"
                className="auth-btn-ghost"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '13px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                or continue with email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {/* Email form */}
            <form
              action={async (formData: FormData) => {
                'use server'
                const email = formData.get('email') as string
                await signIn('email', { email, redirectTo: '/dashboard' })
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="auth-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {/* Primary CTA — exact same pattern as landing page buttons */}
              <button
                type="submit"
                className="auth-btn-primary"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(67,97,238,0.4)',
                  background: 'var(--accent-blue)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  boxShadow: '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)',
                }}
              >
                Start building free →
              </button>
            </form>
          </div>

          {/* Terms */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '12px',
            }}
          >
            By continuing you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Terms
            </Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </p>

          {/* Sign-in link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}
            >
              Sign in
            </Link>
          </p>

          {/* Trust signals — matches Hero trust signals */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '28px',
            }}
          >
            {['Zero hallucinations', 'Context never drifts', 'Every line reviewed'].map((signal) => (
              <span
                key={signal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: 'var(--accent-green)' }}>✓</span>
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
