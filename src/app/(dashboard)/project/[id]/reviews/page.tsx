import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db/mongoose'
import { Project } from '@/lib/models/Project'
import ReviewLog from '@/components/council/ReviewLog'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

export default async function ReviewsPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectDB()
  const project = await Project.findOne({
    _id: params.id,
    userId: session.user.id,
  }).lean()

  if (!project) notFound()

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
        <Link
          href={`/project/${params.id}`}
          className="transition-colors hover:text-text-primary"
          style={{ color: 'var(--text-muted)' }}
        >
          {project.name}
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Review log</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Review log
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every council decision, review outcome, and arbitration rationale
            for{' '}
            <span style={{ color: 'var(--text-primary)' }}>
              {project.name}
            </span>
          </p>
        </div>
        <Link
          href={`/project/${params.id}`}
          className="flex-shrink-0 text-sm px-4 py-2 rounded-lg border transition-all duration-150 hover:border-accent"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          ← Back to session
        </Link>
      </div>

      {/* Full review log with stats + filters */}
      <ReviewLog projectId={params.id} />
    </div>
  )
}
