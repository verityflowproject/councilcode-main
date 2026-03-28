'use client'

import { useState, useRef, useEffect } from 'react'
import ModelFeed, { type FeedEvent } from './ModelFeed'
import type { ModelRole } from '@/types'

interface SessionPanelProps {
  projectId: string
  projectName: string
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export default function SessionPanel({ projectId, projectName }: SessionPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [finalOutput, setFinalOutput] = useState<string | null>(null)
  const [insufficientCredits, setInsufficientCredits] = useState(false)
  const feedEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const addEvent = (event: FeedEvent) => {
    setEvents((prev) => [...prev, event])
  }

  const handleRun = async () => {
    if (!prompt.trim() || isRunning) return

    const currentPrompt = prompt.trim()
    setPrompt('')
    setIsRunning(true)
    setFinalOutput(null)
    setEvents([])
    setInsufficientCredits(false)

    addEvent({ type: 'system', message: 'Council session started' })

    // Simulate the council process with thinking events
    // while the real API call runs
    const thinkingMessages: { model: ModelRole; message: string }[] = [
      { model: 'perplexity', message: 'Scanning task for external dependencies...' },
      { model: 'claude',     message: 'Analyzing architecture requirements...' },
      { model: 'codestral',  message: 'Preparing implementation context...' },
    ]

    let thinkingIndex = 0
    const thinkingInterval = setInterval(() => {
      if (thinkingIndex < thinkingMessages.length) {
        const tm = thinkingMessages[thinkingIndex]
        addEvent({ type: 'thinking', model: tm.model, message: tm.message })
        thinkingIndex++
      } else {
        clearInterval(thinkingInterval)
      }
    }, 800)

    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          prompt: currentPrompt,
          sessionId,
        }),
      })

      clearInterval(thinkingInterval)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 402) {
          addEvent({
            type: 'error',
            model: 'claude',
            message: data.message ?? 'Not enough credits to run a Council session.',
          })
          setInsufficientCredits(true)
          return
        }
        addEvent({
          type: 'error',
          model: 'claude',
          message: data.error ?? 'Orchestrator failed. Please try again.',
        })
        return
      }

      addEvent({ type: 'system', message: 'Council responses received' })

      // Display firewall results if present
      if (data.responses) {
        const perplexityResponse = data.responses.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (r: any) => r.model === 'perplexity'
        )
        if (perplexityResponse?.output) {
          try {
            const parsed = JSON.parse(perplexityResponse.output)
            addEvent({
              type: 'firewall',
              blocked: false,
              verified: Array.isArray(parsed.verified) ? parsed.verified.length : 0,
              warnings: Array.isArray(parsed.warnings)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? parsed.warnings.map((w: any) => `${w.package}: ${w.issue}`)
                : [],
            })
          } catch {
            // Not JSON
          }
        }
      }

      // Display reviewed outputs
      if (data.reviewedOutputs && Array.isArray(data.reviewedOutputs)) {
        for (const output of data.reviewedOutputs) {
          if (!output.output) continue
          addEvent({
            type: 'output',
            model: output.model as ModelRole,
            output: output.output,
            approved: output.approved,
            patched: output.patched,
          })
          if (!output.approved && output.flaggedIssues?.length > 0) {
            addEvent({
              type: 'review',
              model: output.model as ModelRole,
              approved: false,
              issues: output.flaggedIssues,
            })
          }
        }
      }

      // Display arbitration results
      if (data.arbitrationResults && data.arbitrationResults.length > 0) {
        for (const arb of data.arbitrationResults) {
          addEvent({
            type: 'arbitration',
            winner: arb.winner,
            rationale: arb.rationale,
            patched: arb.patched,
          })
        }
      }

      // Set final output — prefer arbitrated, then first reviewed output
      const bestOutput =
        data.arbitrationResults?.[0]?.finalOutput ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.reviewedOutputs?.find((o: any) => o.output)?.output ??
        null

      if (bestOutput) {
        setFinalOutput(bestOutput)
        addEvent({ type: 'system', message: 'Session complete — output ready' })
      }

      // Credit usage summary
      if ((data.totalCreditCost ?? 0) > 0) {
        addEvent({
          type: 'system',
          message: `Session used ${data.totalCreditCost} credits — add your own keys at Settings to avoid charges`,
        })
      }
      const hasByokCalls = Array.isArray(data.creditBreakdown) &&
        data.creditBreakdown.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e: any) => e.keySource === 'byok-individual' || e.keySource === 'byok-openrouter'
        )
      if (hasByokCalls) {
        addEvent({
          type: 'system',
          message: 'Your keys used — no credits charged for those calls',
        })
      }
    } catch (err: unknown) {
      clearInterval(thinkingInterval)
      const message = err instanceof Error ? err.message : 'Unknown error'
      addEvent({
        type: 'error',
        model: 'claude',
        message: `Request failed: ${message}`,
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleRun()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Insufficient credits banner */}
      {insufficientCredits && (
        <div
          className="flex items-center justify-between rounded-xl border px-4 py-3"
          style={{
            borderColor: 'rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.06)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: '#ef4444' }}>⚡</span>
            <span className="text-sm" style={{ color: '#ef4444' }}>
              Not enough credits to run a Council session.
            </span>
          </div>
          <a
            href="/dashboard/credits"
            className="text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#ef4444' }}
          >
            Top up credits →
          </a>
        </div>
      )}

      {/* Prompt input */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: isRunning ? 'var(--accent)' : 'var(--border)',
          background: 'var(--surface)',
          transition: 'border-color 0.2s',
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            prompt ›
          </span>
          <span
            className="text-xs font-mono truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            {projectName}
          </span>
          {isRunning && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'var(--accent)',
                  animation: 'pulse-dot 1.5s ease-in-out infinite',
                }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--accent)' }}
              >
                council running
              </span>
            </div>
          )}
        </div>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build or what you want the council to work on..."
          disabled={isRunning}
          rows={4}
          className="w-full px-4 py-3 text-sm font-mono outline-none resize-none disabled:opacity-50"
          style={{
            background: 'transparent',
            color: 'var(--text-primary)',
          }}
        />
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            ⌘↵ to run
          </span>
          <button
            onClick={handleRun}
            disabled={isRunning || !prompt.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            {isRunning ? (
              <>
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />
                Running
              </>
            ) : (
              <>
                Brief council
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feed */}
      {(events.length > 0 || isRunning) && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                Council feed
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded border"
                style={{
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)',
                }}
              >
                {sessionId.split('_')[1]}
              </span>
            </div>
            {events.length > 0 && (
              <button
                onClick={() => setEvents([])}
                className="text-xs transition-colors hover:text-text-secondary"
                style={{ color: 'var(--text-muted)' }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-4 max-h-[600px] overflow-y-auto">
            <ModelFeed events={events} isRunning={isRunning} />
            <div ref={feedEndRef} />
          </div>
        </div>
      )}

      {/* Final output */}
      {finalOutput && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            borderColor: 'rgba(16,185,129,0.3)',
            background: 'rgba(16,185,129,0.03)',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(16,185,129,0.2)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#10b981' }}
              />
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: '#10b981' }}
              >
                Final output — reviewed and approved
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(finalOutput)}
              className="text-xs font-mono transition-colors hover:text-text-primary"
              style={{ color: 'var(--text-muted)' }}
            >
              Copy
            </button>
          </div>
          <pre
            className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[400px] overflow-y-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {finalOutput}
          </pre>
        </div>
      )}
    </div>
  )
}
