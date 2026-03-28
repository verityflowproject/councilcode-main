'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CREDIT_PACKAGES } from '@/lib/utils/credit-costs'

interface Transaction {
  _id: string
  amount: number
  type: 'purchase' | 'spend' | 'refund' | 'bonus'
  description: string
  modelUsed?: string
  createdAt: string
}

export default function CreditsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [balance, setBalance] = useState<number | null>(null)
  const [estimatedSessions, setEstimatedSessions] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [cancelMessage, setCancelMessage] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [balRes, histRes] = await Promise.all([
        fetch('/api/credits/balance'),
        fetch('/api/credits/history'),
      ])
      if (balRes.ok) {
        const d = await balRes.json()
        setBalance(d.balance)
        setEstimatedSessions(d.estimatedSessions)
      }
      if (histRes.ok) {
        const d = await histRes.json()
        setTransactions(d.transactions ?? [])
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Payment successful — your credits have been added.')
      router.replace('/dashboard/credits')
    }
    if (searchParams.get('cancelled') === 'true') {
      setCancelMessage('Payment cancelled. No charges were made.')
      router.replace('/dashboard/credits')
    }
  }, [fetchData, router, searchParams])

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId)
    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      // silently ignore
    } finally {
      setPurchasing(null)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Credits
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Purchase credits to run Council sessions when using platform API keys.
        </p>
      </div>

      {/* Success / cancel banners */}
      {successMessage && (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: 'rgba(16,185,129,0.4)',
            background: 'rgba(16,185,129,0.06)',
            color: '#10b981',
          }}
        >
          {successMessage}
        </div>
      )}
      {cancelMessage && (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: 'rgba(245,158,11,0.4)',
            background: 'rgba(245,158,11,0.06)',
            color: '#f59e0b',
          }}
        >
          {cancelMessage}
        </div>
      )}

      {/* Balance card */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        {loading ? (
          <div className="space-y-2">
            <div className="h-10 rounded w-32 animate-pulse" style={{ background: 'var(--border)' }} />
            <div className="h-4 rounded w-48 animate-pulse" style={{ background: 'var(--border)' }} />
          </div>
        ) : (
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                Current balance
              </p>
              <p
                className="text-5xl font-bold"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
              >
                {(balance ?? 0).toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                ≈ {estimatedSessions} Council sessions remaining
              </p>
            </div>
            <div className="mb-1">
              <span
                className="text-xs font-mono px-2 py-1 rounded-lg border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                1 credit = $0.01
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Package grid */}
      <div>
        <h2
          className="text-base font-semibold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Buy credits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CREDIT_PACKAGES.map((pkg) => {
            const isBestValue = 'bestValue' in pkg && pkg.bestValue
            const bonusCredits = 'bonusCredits' in pkg ? pkg.bonusCredits : undefined
            return (
              <div
                key={pkg.id}
                className="rounded-xl border p-5 flex flex-col gap-3 relative"
                style={{
                  borderColor: isBestValue ? 'var(--accent)' : 'var(--border)',
                  background: isBestValue
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, var(--surface) 100%)'
                    : 'var(--surface)',
                }}
              >
                {isBestValue && (
                  <span
                    className="absolute top-3 right-3 text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(99,102,241,0.3)',
                    }}
                  >
                    Best value
                  </span>
                )}

                <div>
                  <p
                    className="text-xs font-mono uppercase tracking-wider mb-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {pkg.label}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    {pkg.credits.toLocaleString()}
                    <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                      credits
                    </span>
                  </p>
                  {bonusCredits && (
                    <p className="text-xs mt-0.5" style={{ color: '#10b981' }}>
                      +{bonusCredits.toLocaleString()} bonus credits
                    </p>
                  )}
                </div>

                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {pkg.approxSessions}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    ${(pkg.priceCents / 100).toFixed(0)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing !== null}
                    className="text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {purchasing === pkg.id ? 'Redirecting...' : 'Buy'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h2
          className="text-base font-semibold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Transaction history
        </h2>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 rounded animate-pulse"
                  style={{ background: 'var(--border)' }}
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No transactions yet — your credit history will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {['Date', 'Description', 'Model', 'Credits'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0
                  return (
                    <tr
                      key={tx._id}
                      className="border-b last:border-0"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td
                        className="px-4 py-3 text-xs font-mono whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {formatDate(tx.createdAt)}
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {tx.description}
                      </td>
                      <td
                        className="px-4 py-3 text-xs font-mono"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {tx.modelUsed ?? '—'}
                      </td>
                      <td
                        className="px-4 py-3 text-xs font-mono font-semibold whitespace-nowrap"
                        style={{ color: isPositive ? '#10b981' : 'var(--text-muted)' }}
                      >
                        {isPositive ? '+' : ''}{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
