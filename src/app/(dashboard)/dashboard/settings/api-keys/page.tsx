'use client'

import { useEffect, useState } from 'react'
import ApiKeyCard from '@/components/dashboard/ApiKeyCard'

interface MaskedKeys {
  anthropicKey: string | null
  openaiKey: string | null
  mistralKey: string | null
  googleAiKey: string | null
  perplexityKey: string | null
}

const MODEL_CONFIGS = [
  {
    keyType: 'anthropic' as const,
    modelName: 'Claude',
    roleBadge: 'Architect',
    providerName: 'Anthropic Console',
    providerUrl: 'https://console.anthropic.com/settings/keys',
    field: 'anthropicKey' as keyof MaskedKeys,
  },
  {
    keyType: 'openai' as const,
    modelName: 'GPT-5.4',
    roleBadge: 'Generalist',
    providerName: 'OpenAI Platform',
    providerUrl: 'https://platform.openai.com/api-keys',
    field: 'openaiKey' as keyof MaskedKeys,
  },
  {
    keyType: 'mistral' as const,
    modelName: 'Codestral',
    roleBadge: 'Implementer',
    providerName: 'Mistral Console',
    providerUrl: 'https://console.mistral.ai/api-keys',
    field: 'mistralKey' as keyof MaskedKeys,
  },
  {
    keyType: 'googleAi' as const,
    modelName: 'Gemini',
    roleBadge: 'Refactor',
    providerName: 'Google AI Studio',
    providerUrl: 'https://aistudio.google.com/app/apikey',
    field: 'googleAiKey' as keyof MaskedKeys,
  },
  {
    keyType: 'perplexity' as const,
    modelName: 'Perplexity Sonar',
    roleBadge: 'Researcher',
    providerName: 'Perplexity API',
    providerUrl: 'https://www.perplexity.ai/settings/api',
    field: 'perplexityKey' as keyof MaskedKeys,
  },
]

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState<MaskedKeys | null>(null)
  const [loading, setLoading] = useState(true)
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [removingAll, setRemovingAll] = useState(false)

  useEffect(() => {
    fetch('/api/user/api-keys')
      .then((res) => res.json())
      .then((data) => setKeys(data))
      .catch(() => setKeys(null))
      .finally(() => setLoading(false))
  }, [])

  const handleRemoveAll = async () => {
    if (!window.confirm('Remove all saved API keys? This cannot be undone.')) return
    setRemovingAll(true)
    try {
      await Promise.all(
        MODEL_CONFIGS.map((m) =>
          fetch('/api/user/api-keys', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyType: m.keyType }),
          })
        )
      )
      setKeys({
        anthropicKey: null,
        openaiKey: null,
        mistralKey: null,
        googleAiKey: null,
        perplexityKey: null,
      })
    } catch {
      // silently ignore — individual cards still show their state
    } finally {
      setRemovingAll(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Your API Keys
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          VerityFlow uses your keys directly — we never mark up API costs. Your keys are
          encrypted with AES-256-GCM and never logged or exposed.
        </p>

        {/* Why BYOK accordion */}
        <div
          className="mt-4 rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            type="button"
            onClick={() => setExplainerOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
            style={{
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
            }}
          >
            <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
              Why BYOK?
            </span>
            <span
              className="text-xs font-mono transition-transform duration-200"
              style={{
                color: 'var(--text-muted)',
                transform: explainerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block',
              }}
            >
              ▾
            </span>
          </button>
          {explainerOpen && (
            <div
              className="px-4 pb-4 pt-1 text-sm leading-relaxed border-t"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
              }}
            >
              Other AI tools charge you their margin on top of API costs. With BYOK, you
              pay Anthropic, OpenAI, and others directly at cost. VerityFlow charges only
              for the orchestration layer — the Council architecture, routing logic, and
              cross-model review system.
            </div>
          )}
        </div>
      </div>

      {/* Key cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-5 animate-pulse"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <div className="h-4 rounded w-1/3" style={{ background: 'var(--border)' }} />
              <div className="h-8 rounded mt-3" style={{ background: 'var(--border)' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {MODEL_CONFIGS.map((config) => (
            <ApiKeyCard
              key={config.keyType}
              keyType={config.keyType}
              modelName={config.modelName}
              roleBadge={config.roleBadge}
              providerName={config.providerName}
              providerUrl={config.providerUrl}
              initialMasked={keys?.[config.field] ?? null}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        className="rounded-xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          All keys encrypted at rest with AES-256-GCM. Deleted instantly on request.
        </p>
        <button
          type="button"
          onClick={handleRemoveAll}
          disabled={removingAll}
          className="text-xs px-4 py-2 rounded-lg border transition-all duration-150 hover:border-red-400 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          {removingAll ? 'Removing...' : 'Remove all keys'}
        </button>
      </div>
    </div>
  )
}
