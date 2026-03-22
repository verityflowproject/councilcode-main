import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db/mongoose'
import { Project } from '@/lib/models/Project'
import SessionPanel from '@/components/council/SessionPanel'
import ReviewLog from '@/components/council/ReviewLog'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectDB()
  const project = await Project.findOne({
    _id: params.id,
    userId: session.user.id,
  }).lean()

  if (!project) notFound()

  const STATUS_COLORS = {
    draft:    'var(--text-muted)',
    building: '#f59e0b',
    review:   'var(--accent)',
    complete: '#10b981',
    error:    '#ef4444',
  }

  const statusColor =
    STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] ??
    'var(--text-muted)'

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="transition-colors hover:text-text-primary"
          style={{ color: 'var(--text-muted)' }}
        >
          Projects
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          {project.name}
        </span>
      </div>

      {/* Project header */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {project.name}
            </h1>
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full border"
              style={{
                color: statusColor,
                borderColor: `${statusColor}40`,
              }}
            >
              {project.status}
            </span>
          </div>
          <p
            className="text-sm leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.description}
          </p>
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2 py-0.5 rounded border"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex-shrink-0 text-right space-y-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <p className="text-xs font-mono">
            {project.totalSessions} session{project.totalSessions !== 1 ? 's' : ''}
          </p>
          {project.lastBuiltAt && (
            <p className="text-xs">
              Last built {new Date(project.lastBuiltAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session panel — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <h2
            className="text-sm font-semibold"
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Council session
          </h2>
          <SessionPanel
            projectId={params.id}
            projectName={project.name}
          />
        </div>
        {/* Review log — 1/3 width */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-sm font-semibold"
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Review log
            </h2>
            <Link
              href={`/project/${params.id}/reviews`}
              className="text-xs font-mono transition-colors hover:text-accent"
              style={{ color: 'var(--text-muted)' }}
            >
              View all →
            </Link>
          </div>
          <ReviewLog projectId={params.id} compact={true} />
        </div>
      </div>
    </div>
  )
}
