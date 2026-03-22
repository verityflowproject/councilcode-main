'use client'

import { useState } from 'react'
import { PLANS } from '@/lib/stripe'
import type { PlanId } from '@/lib/stripe'

interface UpgradeButtonProps {
  currentPlan: string
  targetPlan: PlanId
  className?: string
}

export default function UpgradeButton({
  currentPlan,
  targetPlan,
  className,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    if (loading) return
    setLoading(true)
    try {
      // If already on a paid plan, open billing portal
      if (currentPlan !== 'free') {
        const res = await fetch('/api/billing/portal', { method: 'POST' })
        const data = await res.json()
        if (data.url) window.location.href = data.url
        return
      }
      // Otherwise start checkout
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: targetPlan }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Checkout failed:', data.error)
        return
      }
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Upgrade error:', err)
    } finally {
      setLoading(false)
    }
  }

  const plan = PLANS[targetPlan]

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
      style={{
        background: 'var(--accent)',
        color: '#fff',
      }}
    >
      {loading ? (
        <>
          <span
            className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
          Loading...
        </>
      ) : currentPlan !== 'free' ? (
        'Manage billing'
      ) : (
        `Upgrade to ${plan.name}`
      )}
    </button>
  )
}
