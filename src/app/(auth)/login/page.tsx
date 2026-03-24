import { signIn } from '@/lib/auth'
import Link from 'next/link'

const MODELS = [
  { name: 'Claude',      role: 'Architect',             color: '#9580FF' },
  { name: 'GPT-5.4',    role: 'Generalist & Reviewer', color: '#34D399' },
  { name: 'Codestral',  role: 'Implementer',            color: '#FBBF24' },
  { name: 'Gemini',     role: 'Refactor Specialist',    color: '#60A5FA' },
  { name: 'Perplexity', role: 'Researcher',             color: '#C084FC' },
]

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Global ambient glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 800px 600px at 20% 50%, rgba(67,97,238,0.07), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: '460px',
          flexShrink: 0,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }}
        />
        {/* Accent glow — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '360px',
            height: '360px',
            background:
              'radial-gradient(ellipse at bottom left, rgba(67,97,238,0.16), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div style={{ position: 'relative' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '20px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
          </Link>
        </div>

        {/* Testimonial + model list */}
        <div style={{ position: 'relative' }}>
          <blockquote style={{ marginBottom: '28px' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1.25,
                marginBottom: '14px',
              }}
            >
              &ldquo;Other tools forget.
              <br />
              <span
                style={{
                  background:
                    'linear-gradient(90deg, #4361EE 0%, #06B6D4 50%, #9580FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                VerityFlow remembers.&rdquo;
              </span>
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              Five specialized models share a living project memory —
              every architectural decision, verified dependency, and
              convention persists across your entire build.
            </p>
          </blockquote>

          {/* Model list card */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              The council
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MODELS.map((m) => (
                <div
                  key={m.name}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: m.color,
                      boxShadow: `0 0 6px ${m.color}80`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: m.color,
                      minWidth: '90px',
                    }}
                  >
                    {m.name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            position: 'relative',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          © {new Date().getFullYear()} VerityFlow
        </p>
      </div>

      {/* ── RIGHT PANEL — FORM ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="animate-fade-up"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: '32px' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '20px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                textDecoration: 'none',
              }}
            >
              Verity<span style={{ color: 'var(--accent-blue)' }}>Flow</span>
            </Link>
          </div>

          {/* Heading block */}
          <div style={{ marginBottom: '28px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-blue)',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Welcome back
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '30px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                lineHeight: 1.15,
              }}
            >
              Sign in to VerityFlow
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your AI engineering firm is waiting.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Google sign-in */}
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/dashboard' })
              }}
              style={{ marginBottom: '20px' }}
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
                <svg width="16" height="16" viewBox="0 0 24 24">
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
                marginBottom: '20px',
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
              <button
                type="submit"
                className="auth-btn-primary"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(67,97,238,0.4)',
                  background: 'var(--accent-blue)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  boxShadow: '0 0 0 1px rgba(67,97,238,0.4), var(--shadow-glow-blue)',
                }}
              >
                Continue with email
              </button>
            </form>
          </div>

          {/* Register link */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginTop: '20px',
            }}
          >
            No account?{' '}
            <Link
              href="/register"
              style={{
                color: 'var(--accent-blue)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
