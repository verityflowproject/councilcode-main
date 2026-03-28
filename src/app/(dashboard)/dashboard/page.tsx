'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ProjectCard from '@/components/dashboard/ProjectCard'
import NewProjectModal from '@/components/dashboard/NewProjectModal'
import UsageWarningBanner from '@/components/dashboard/UsageWarningBanner'
import KeysIncompleteBanner from '@/components/dashboard/KeysIncompleteBanner'
import type { IProject } from '@/lib/models'

type ProjectWithId = IProject & { _id: string }

// ── Demo data shown to unauthenticated visitors ──────────────────────────────
const DEMO_PROJECTS: ProjectWithId[] = [
  {
    _id: 'demo-1',
    name: 'SaaS Billing Platform',
    description: 'Multi-tenant subscription system with Stripe, usage metering, plan enforcement, and a self-serve billing portal.',
    status: 'complete',
    techStack: ['Next.js 14', 'TypeScript', 'MongoDB', 'Stripe', 'Redis'],
    totalSessions: 14,
    lastBuiltAt: new Date('2026-03-20'),
  } as unknown as ProjectWithId,
  {
    _id: 'demo-2',
    name: 'Real-time Collaboration App',
    description: 'Live document editing with operational transforms, presence indicators, and conflict-free offline sync.',
    status: 'building',
    techStack: ['React', 'Node.js', 'Socket.io', 'CRDTs', 'PostgreSQL'],
    totalSessions: 7,
    lastBuiltAt: new Date('2026-03-25'),
  } as unknown as ProjectWithId,
  {
    _id: 'demo-3',
    name: 'AI Code Review Pipeline',
    description: 'Automated PR review with multi-model analysis, inline comment generation, and team-configurable rule sets.',
    status: 'review',
    techStack: ['Python', 'FastAPI', 'GitHub Actions', 'Claude', 'GPT-5.4'],
    totalSessions: 5,
    lastBuiltAt: new Date('2026-03-27'),
  } as unknown as ProjectWithId,
]

// ── Locked demo card (read-only — no link, hover shows sign-up prompt) ───────
function DemoProjectCard({ project }: { project: ProjectWithId }) {
  const [hovered, setHovered] = useState(false)

  const STATUS_CONFIG = {
    draft:    { label: 'Draft',      color: 'var(--text-muted)', bg: 'transparent',           border: 'var(--border)' },
    building: { label: 'Building',   color: '#f59e0b',           bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
    review:   { label: 'In review',  color: 'var(--accent)',     bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.3)' },
    complete: { label: 'Complete',   color: '#10b981',           bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)' },
    error:    { label: 'Error',      color: '#ef4444',           bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.3)' },
  }
  const s = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft
  const isActive = project.status === 'building' || project.status === 'review'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl border p-6 transition-all duration-200 relative overflow-hidden"
      style={{
        borderColor: hovered ? 'rgba(67,97,238,0.4)' : 'var(--border)',
        background: 'var(--surface)',
        cursor: 'default',
      }}
    >
      {/* Hover overlay — nudge to sign up */}
      {hovered && (
        <Link
          href="/register"
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(9,9,11,0.72)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            textDecoration: 'none',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-muted)', letterSpacing: '0.06em',
          }}>
            Sign up to open
          </span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '14px',
            fontWeight: 700, color: 'var(--accent-blue)',
          }}>
            Create your account →
          </span>
        </Link>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-semibold truncate mb-1"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {project.name}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
          )}
          <span
            className="text-xs font-mono px-2 py-1 rounded-full border whitespace-nowrap"
            style={{ color: s.color, background: s.bg, borderColor: s.border }}
          >
            {s.label}
          </span>
        </div>
      </div>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono px-2 py-0.5 rounded border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {project.totalSessions} session{project.totalSessions !== 1 ? 's' : ''}
          </span>
          {project.lastBuiltAt && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Last built {new Date(project.lastBuiltAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const isGuest = status === 'unauthenticated'
  const sessionLoading = status === 'loading'

  const [projects, setProjects] = useState<ProjectWithId[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [missingKeyCount, setMissingKeyCount] = useState(0)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/project')
      const data = await res.json()
      if (res.ok) setProjects(data.projects)
    } catch {
      // fail silently
    } finally {
      setProjectsLoading(false)
    }
  }

  const fetchKeyStatus = async () => {
    try {
      const res = await fetch('/api/user/api-keys')
      if (!res.ok) return
      const data = await res.json()
      const fields = ['anthropicKey', 'openaiKey', 'mistralKey', 'googleAiKey', 'perplexityKey']
      const missing = fields.filter((f) => !data[f]).length
      setMissingKeyCount(missing)
    } catch {
      // fail silently
    }
  }

  useEffect(() => {
    if (isGuest) {
      setProjectsLoading(false)
      return
    }
    if (status === 'authenticated') {
      fetchProjects()
      fetchKeyStatus()
    }
  }, [status, isGuest])

  const handleDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== id))
    try {
      await fetch(`/api/project?projectId=${id}`, { method: 'DELETE' })
    } catch {
      fetchProjects()
    }
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'
  const loading = sessionLoading || (status === 'authenticated' && projectsLoading)

  return (
    <div className="space-y-8">

      {/* ── Guest banner ── */}
      {isGuest && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: 'rgba(67,97,238,0.07)',
            border: '1px solid rgba(67,97,238,0.22)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              color: 'var(--accent-blue)',
              background: 'rgba(67,97,238,0.12)',
              border: '1px solid rgba(67,97,238,0.28)',
              borderRadius: '4px',
              padding: '2px 7px',
            }}>
              Preview
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              You&apos;re viewing a live demo of FlowDash. Sign up to start building with the council.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link
              href="/login"
              style={{
                textDecoration: 'none', fontSize: '12px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                padding: '5px 12px', borderRadius: '7px',
                border: '1px solid var(--border-subtle)',
                transition: 'color 0.15s',
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              style={{
                textDecoration: 'none', fontSize: '12px', fontWeight: 600,
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                background: 'var(--accent-blue)',
                padding: '5px 14px', borderRadius: '7px',
                transition: 'opacity 0.15s',
              }}
            >
              Get started free →
            </Link>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {isGuest ? 'Your workspace' : `Hey, ${firstName}`}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isGuest
              ? '3 example projects — sign up to brief the council on yours.'
              : loading
              ? 'Loading your projects...'
              : projects.length === 0
              ? 'Start your first project — brief the council.'
              : `${projects.length} project${projects.length !== 1 ? 's' : ''} in your workspace`}
          </p>
        </div>

        {isGuest ? (
          <Link
            href="/register"
            className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg font-semibold flex-shrink-0"
            style={{ background: 'var(--accent-blue)', color: '#fff', textDecoration: 'none' }}
          >
            <span>+</span>
            New project
          </Link>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 flex-shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span>+</span>
            New project
          </button>
        )}
      </div>

      {/* ── Authenticated-only banners ── */}
      {!isGuest && <KeysIncompleteBanner missingCount={missingKeyCount} />}

      {!isGuest && session?.user && (
        <UsageWarningBanner
          used={session.user.modelCallsUsed ?? 0}
          limit={session.user.modelCallsLimit ?? 50}
        />
      )}

      {!isGuest && session?.user && (
        <div
          className="rounded-xl border px-5 py-4 flex items-center justify-between gap-6"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {session.user.plan ?? 'free'}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {session.user.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {projects.length} / {session.user.plan === 'pro' ? '∞' : '3'} projects
            </span>
            {session.user.plan === 'free' && (
              <a
                href="/dashboard/pricing"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Upgrade
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-6 animate-pulse"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <div className="h-4 rounded mb-3 w-2/3" style={{ background: 'var(--border)' }} />
              <div className="h-3 rounded mb-2 w-full" style={{ background: 'var(--border)' }} />
              <div className="h-3 rounded w-4/5" style={{ background: 'var(--border)' }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Guest: demo project grid ── */}
      {isGuest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_PROJECTS.map((project) => (
            <DemoProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {/* ── Authenticated: empty state ── */}
      {!isGuest && !loading && projects.length === 0 && (
        <div
          className="rounded-xl border p-16 text-center"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="text-4xl mb-4" style={{ opacity: 0.3 }}>⬡</div>
          <h3
            className="text-base font-semibold mb-2"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            No projects yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Brief the council on what you&apos;re building and they&apos;ll get started.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm px-5 py-2.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Start your first project
          </button>
        </div>
      )}

      {/* ── Authenticated: projects grid ── */}
      {!isGuest && !loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* ── New project modal ── */}
      {showModal && (
        <NewProjectModal
          onClose={() => {
            setShowModal(false)
            fetchProjects()
          }}
        />
      )}
    </div>
  )
}
