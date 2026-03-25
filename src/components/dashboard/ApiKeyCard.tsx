'use client'

import { useState } from 'react'

interface ApiKeyCardProps {
  keyType: 'anthropic' | 'openai' | 'mistral' | 'googleAi' | 'perplexity'
  modelName: string
  roleBadge: string
  providerName: string
  providerUrl: string
  initialMasked: string | null
}

export default function ApiKeyCard({
  keyType,
  modelName,
  roleBadge,
  providerName,
  providerUrl,
  initialMasked,
}: ApiKeyCardProps) {
  const [inputValue, setInputValue] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [masked, setMasked] = useState<string | null>(initialMasked)

  const isActive = masked !== null

  const handleSave = async () => {
    if (!inputValue.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyType, value: inputValue.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError('This key appears to be invalid or has no credits. Please check and try again.')
        return
      }
      if (data.success) {
        // Re-fetch to get the newly masked value
        const getRes = await fetch('/api/user/api-keys')
        if (getRes.ok) {
          const keys = await getRes.json()
          const fieldMap: Record<string, string> = {
            anthropic: 'anthropicKey',
            openai: 'openaiKey',
            mistral: 'mistralKey',
            googleAi: 'googleAiKey',
            perplexity: 'perplexityKey',
          }
          setMasked(keys[fieldMap[keyType]] ?? null)
        }
        setInputValue('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyType }),
      })
      if (res.ok) {
        setMasked(null)
        setInputValue('')
      }
    } catch {
      setError('Failed to remove key. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-xl border p-5 transition-all duration-150"
      style={{
        borderColor: isActive ? 'rgba(16,185,129,0.25)' : 'var(--border)',
        background: 'var(--surface)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="font-semibold text-sm"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {modelName}
          </span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full border"
            style={{
              color: 'var(--accent)',
              borderColor: 'rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.08)',
            }}
          >
            {roleBadge}
          </span>
          <a
            href={providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            {providerName} ↗
          </a>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: isActive ? '#10b981' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 6px rgba(16,185,129,0.5)' : 'none',
            }}
          />
          <span
            className="text-xs font-mono"
            style={{ color: isActive ? '#10b981' : 'var(--text-muted)' }}
          >
            {isActive ? 'Active' : 'Missing'}
          </span>
        </div>
      </div>

      {/* Current masked key */}
      {isActive && (
        <div
          className="text-xs font-mono px-3 py-2 rounded-lg border mb-3"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--background)',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          {masked}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
            placeholder={isActive ? 'Enter new key to replace...' : 'Paste your API key...'}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full px-3 py-2.5 rounded-lg border text-xs font-mono outline-none transition-all duration-150"
            style={{
              borderColor: error ? 'rgba(239,68,68,0.5)' : 'var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              paddingRight: '36px',
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
          {/* Show/hide toggle */}
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
            tabIndex={-1}
          >
            {showKey ? '🙈' : '👁'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !inputValue.trim()}
          className="px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
        >
          {loading ? '...' : isActive ? 'Replace' : 'Save'}
        </button>

        {isActive && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-150 hover:border-red-400 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            Remove
          </button>
        )}
      </div>

      {/* Inline error */}
      {error && (
        <p
          className="text-xs mt-2 px-3 py-2 rounded-lg border"
          style={{
            color: '#ef4444',
            borderColor: 'rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.05)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
