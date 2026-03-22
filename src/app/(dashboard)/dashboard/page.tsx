'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ProjectCard from '@/components/dashboard/ProjectCard'
import NewProjectModal from '@/components/dashboard/NewProjectModal'
import UsageWarningBanner from '@/components/dashboard/UsageWarningBanner'
import type { IProject } from '@/lib/models'

type ProjectWithId = IProject & { _id: string }

export default function DashboardPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<ProjectWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/project')
      const data = await res.json()
      if (res.ok) setProjects(data.projects)
    } catch {
      // fail silently — empty state will show
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== id))
    try {
      await fetch(`/api/project?projectId=${id}`, { method: 'DELETE' })
    } catch {
      // re-fetch to restore state if delete failed
      fetchProjects()
    }
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Hey, {firstName}
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {loading
              ? 'Loading your projects...'
              : projects.length === 0
              ? 'Start your first project — brief the council.'
              : `${projects.length} project${projects.length !== 1 ? 's' : ''} in your workspace`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 flex-shrink-0"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          <span>+</span>
          New project
        </button>
      </div>

      {/* Usage warning banner */}
      {session?.user && (
        <UsageWarningBanner
          used={session.user.modelCallsUsed ?? 0}
          limit={session.user.modelCallsLimit ?? 50}
        />
      )}

      {/* Usage bar (plan info) */}
      {session?.user && (
        <div
          className="rounded-xl border px-5 py-4 flex items-center justify-between gap-6"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {session.user.plan ?? 'free'}
            </span>
            <span
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {session.user.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              {projects.length} / {session.user.plan === 'pro' ? '∞' : '3'} projects
            </span>
            {session.user.plan === 'free' && (
              <a
                href="/dashboard/pricing"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                }}
              >
                Upgrade
              </a>
            )}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-6 animate-pulse"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface)',
              }}
            >
              <div
                className="h-4 rounded mb-3 w-2/3"
                style={{ background: 'var(--border)' }}
              />
              <div
                className="h-3 rounded mb-2 w-full"
                style={{ background: 'var(--border)' }}
              />
              <div
                className="h-3 rounded w-4/5"
                style={{ background: 'var(--border)' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div
          className="rounded-xl border p-16 text-center"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div
            className="text-4xl mb-4"
            style={{ opacity: 0.3 }}
          >
            ⬡
          </div>
          <h3
            className="text-base font-semibold mb-2"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            No projects yet
          </h3>
          <p
            className="text-sm mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Brief the council on what you&apos;re building and they&apos;ll get started.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm px-5 py-2.5 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            Start your first project
          </button>
        </div>
      )}

      {/* Projects grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* New project modal */}
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
