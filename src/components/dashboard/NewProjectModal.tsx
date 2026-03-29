'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TECH_STACK_OPTIONS = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Node.js', 'Express', 'PostgreSQL', 'MongoDB',
  'Redis', 'Prisma', 'Stripe', 'NextAuth',
  'Vercel', 'Supabase', 'tRPC', 'GraphQL',
]

interface NewProjectModalProps {
  onClose: () => void
}

export default function NewProjectModal({ onClose }: NewProjectModalProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedStack, setSelectedStack] = useState<string[]>([])
  const [customStack, setCustomStack] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleTech = (tech: string) => {
    setSelectedStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  const addCustom = () => {
    const trimmed = customStack.trim()
    if (trimmed && !selectedStack.includes(trimmed)) {
      setSelectedStack((prev) => [...prev, trimmed])
      setCustomStack('')
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Project name and description are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          techStack: selectedStack,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create project.')
        return
      }
      router.push(`/project/${data.project._id}`)
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div
        className="w-full max-w-lg rounded-xl border overflow-hidden animate-fade-up"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <h2
              className="text-lg font-bold"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              New project
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              The council will be briefed when you start a session
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-border"
            style={{ color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              Project name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SaaS dashboard with auth and billing"
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-150"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              What are you building?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project in plain language. The council will use this to plan the architecture and assign tasks."
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all duration-150 resize-none"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
            <p
              className="text-xs font-mono text-right"
              style={{ color: 'var(--text-muted)' }}
            >
              {description.length}/1000
            </p>
          </div>

          {/* Tech stack */}
          <div className="space-y-2">
            <label
              className="text-xs font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              Tech stack{' '}
              <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_OPTIONS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className="text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-all duration-150"
                  style={{
                    borderColor: selectedStack.includes(tech)
                      ? 'var(--accent)'
                      : 'var(--border)',
                    background: selectedStack.includes(tech)
                      ? 'rgba(67,97,238,0.1)'
                      : 'transparent',
                    color: selectedStack.includes(tech)
                      ? 'var(--accent-blue)'
                      : 'var(--text-muted)',
                  }}
                >
                  {tech}
                </button>
              ))}
            </div>
            {/* Custom tech input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customStack}
                onChange={(e) => setCustomStack(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
                placeholder="Add custom technology..."
                className="flex-1 px-3 py-2 rounded-lg border text-xs font-mono outline-none transition-all duration-150"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
              <button
                type="button"
                onClick={addCustom}
                className="px-3 py-2 rounded-lg border text-xs font-mono transition-all duration-150 hover:border-accent"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-xs px-3 py-2 rounded-lg border"
              style={{
                color: 'var(--accent-red)',
              borderColor: 'rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.05)',
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border transition-all duration-150 hover:border-accent"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !description.trim()}
            className="text-sm px-5 py-2 rounded-lg font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            {loading ? (
              <>
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                Brief the council
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
