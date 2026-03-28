'use client'

import { useEffect, useState } from 'react'
import ApiKeyCard from '@/components/dashboard/ApiKeyCard'

interface MaskedKeys {
  anthropicKey: string | null
  openaiKey: string | null
  mistralKey: string | null
  googleAiKey: string | null
  perplexityKey: string | null
  openrouterKey: string | null
  hasAnyKey: boolean
}

const MODEL_CONFIGS = [
  {
    keyType: 'anthropic' as const,
    modelName: 'Claude',
    roleBadge: 'Architect',
    providerName: 'Anthropic Console',
    providerUrl: 'https://console.anthropic.com/settings/keys',
    field: 'anthropicKey' as keyof MaskedKeys,
    accentColor: 'var(--claude)',
  },
  {
    keyType: 'openai' as const,
    modelName: 'GPT-5.4',
    roleBadge: 'Generalist',
    providerName: 'OpenAI Platform',
    providerUrl: 'https://platform.openai.com/api-keys',
    field: 'openaiKey' as keyof MaskedKeys,
    accentColor: 'var(--gpt4o)',
  },
  {
    keyType: 'mistral' as const,
    modelName: 'Codestral',
    roleBadge: 'Implementer',
    providerName: 'Mistral Console',
    providerUrl: 'https://console.mistral.ai/api-keys',
    field: 'mistralKey' as keyof MaskedKeys,
    accentColor: 'var(--codestral)',
  },
  {
    keyType: 'googleAi' as const,
    modelName: 'Gemini',
    roleBadge: 'Refactor',
    providerName: 'Google AI Studio',
    providerUrl: 'https://aistudio.google.com/app/apikey',
    field: 'googleAiKey' as keyof MaskedKeys,
    accentColor: 'var(--gemini)',
  },
  {
    keyType: 'perplexity' as const,
    modelName: 'Perplexity Sonar',
    roleBadge: 'Researcher',
    providerName: 'Perplexity API',
    providerUrl: 'https://www.perplexity.ai/settings/api',
    field: 'perplexityKey' as keyof MaskedKeys,
    accentColor: 'var(--perplexity)',
  },
]

const ALL_KEY_TYPES = [
  'anthropic',
  'openai',
  'mistral',
  'googleAi',
  'perplexity',
  'openrouter',
] as const

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState<MaskedKeys | null>(null)
  const [loading, setLoading] = useState(true)
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [removingAll, setRemovingAll] = useState(false)

  const fetchKeys = () => {
    fetch('/api/user/api-keys')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setKeys(data))
      .catch(() => setKeys(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleRemoveAll = async () => {
    if (
      !window.confirm(
        'Remove all saved API keys? VerityFlow will fall back to platform keys and deduct credits.'
      )
    )
      return
    setRemovingAll(true)
    try {
      for (const keyType of ALL_KEY_TYPES) {
        await fetch('/api/user/api-keys', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyType }),
        })
      }
      fetchKeys()
    } catch {
      // silently ignore
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
            style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}
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
              Other AI tools charge you their margin on top of API costs. With BYOK, you pay
              Anthropic, OpenAI, and others directly at cost. VerityFlow charges only for the
              orchestration layer — the Council architecture, routing logic, and cross-model
              review system.
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
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
        <div className="space-y-6">
          {/* ── Recommended: OpenRouter ──────────────────────────────── */}
          <div>
            <div
              className="rounded-xl border-2 p-5 space-y-3"
              style={{
                borderColor: 'rgba(99,102,241,0.35)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, var(--surface) 100%)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-sm font-bold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                    >
                      Recommended: One key for everything
                    </span>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-full border"
                      style={{
                        color: 'var(--accent)',
                        borderColor: 'rgba(99,102,241,0.4)',
                        background: 'rgba(99,102,241,0.1)',
                      }}
                    >
                      OpenRouter
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    OpenRouter gives you access to all 5 Council models with a single account and
                    key. Pay providers directly at cost — no markup.{' '}
                    <a
                      href="https://openrouter.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline transition-colors hover:opacity-80"
                      style={{ color: 'var(--accent)' }}
                    >
                      Get your OpenRouter key ↗
                    </a>
                  </p>
                </div>
              </div>

              {/* OpenRouter ApiKeyCard */}
              <ApiKeyCard
                keyType="openrouter"
                modelName="OpenRouter"
                roleBadge="All 5 models"
                providerName="openrouter.ai"
                providerUrl="https://openrouter.ai/keys"
                initialMasked={keys?.openrouterKey ?? null}
              />

              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                A single OpenRouter key powers your entire AI Council. VerityFlow routes each role
                to the right model automatically.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              or use individual provider keys
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* ── Individual provider cards ──────────────────────────────── */}
          <div className="space-y-3">
            {MODEL_CONFIGS.map((config) => (
              <ApiKeyCard
                key={config.keyType}
                keyType={config.keyType}
                modelName={config.modelName}
                roleBadge={config.roleBadge}
                providerName={config.providerName}
                providerUrl={config.providerUrl}
                initialMasked={keys?.[config.field] as string | null ?? null}
                accentColor={config.accentColor}
              />
            ))}
          </div>
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
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          {removingAll ? 'Removing...' : 'Remove all keys'}
        </button>
      </div>
    </div>
  )
}
