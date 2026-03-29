'use client'

import Link from 'next/link'
import type { IProject } from '@/lib/models'

const STATUS_CONFIG = {
  draft:    { label: 'Draft',     color: 'var(--text-muted)',   bg: 'transparent',           border: 'var(--border)' },
  building: { label: 'Building',  color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
  review:   { label: 'In review', color: 'var(--accent-blue)',  bg: 'rgba(67,97,238,0.08)',  border: 'rgba(67,97,238,0.3)' },
  complete: { label: 'Complete',  color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)' },
  error:    { label: 'Error',     color: 'var(--accent-red)',   bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.3)' },
}

interface ProjectCardProps {
  project: IProject & { _id: string }
  onDelete: (id: string) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft
  const isActive = project.status === 'building' || project.status === 'review'

  return (
    <Link
      href={`/project/${project._id}`}
      className="block rounded-xl border p-6 transition-all duration-200 hover:border-accent hover:translate-y-[-2px] group"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-semibold truncate mb-1 group-hover:text-accent transition-colors"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {project.name}
          </h3>
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.description}
          </p>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isActive && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: status.color,
                animation: 'pulse-dot 1.5s ease-in-out infinite',
              }}
            />
          )}
          <span
            className="text-xs font-mono px-2 py-1 rounded-full border whitespace-nowrap"
            style={{
              color: status.color,
              background: status.bg,
              borderColor: status.border,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Tech stack */}
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
          {project.techStack.length > 5 && (
            <span
              className="text-xs font-mono px-2 py-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              +{project.techStack.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-4 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
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
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(project._id)
          }}
          className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-red)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)' }}
        >
          Delete
        </button>
      </div>
    </Link>
  )
}
