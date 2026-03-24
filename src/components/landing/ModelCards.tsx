'use client'

import { useEffect, useRef } from 'react'

const MODELS = [
  { name: 'Claude',     model: 'Opus 4.6',  role: 'Architect',             color: '#9580FF' },
  { name: 'GPT',        model: '5.4',        role: 'Generalist & Reviewer', color: '#34D399' },
  { name: 'Codestral',  model: 'Latest',     role: 'Implementer',           color: '#FBBF24' },
  { name: 'Gemini',     model: '3.1 Pro',    role: 'Refactor Specialist',   color: '#60A5FA' },
  { name: 'Perplexity', model: 'Sonar Pro',  role: 'Researcher',            color: '#C084FC' },
]

interface Particle {
  modelIdx: number
  t: number       // 0..1 along the arc toward center
  speed: number
  size: number
  opacity: number
}

export default function ModelCards() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return
    const c: CanvasRenderingContext2D = ctx

    // Hi-DPI
    const dpr = window.devicePixelRatio || 1
    const W = 640
    const H = 520
    canvas.width  = W * dpr
    canvas.height = H * dpr
    c.scale(dpr, dpr)

    // State
    let rotation = 0
    const ORBIT_R   = 170
    const NODE_R    = 22
    const CENTER_X  = W / 2
    const CENTER_Y  = H / 2

    // Initialise particles
    const particles: Particle[] = []
    for (let m = 0; m < MODELS.length; m++) {
      for (let p = 0; p < 10; p++) {
        particles.push({
          modelIdx: m,
          t: Math.random(),
          speed: 0.0008 + Math.random() * 0.0006,
          size: 1.2 + Math.random() * 1.8,
          opacity: 0.3 + Math.random() * 0.5,
        })
      }
    }

    // Cubic bezier point helper
    function cubicPoint(
      t: number,
      x0: number, y0: number,
      x1: number, y1: number,
      x2: number, y2: number,
      x3: number, y3: number
    ): [number, number] {
      const mt = 1 - t
      const x = mt*mt*mt*x0 + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*x3
      const y = mt*mt*mt*y0 + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*y3
      return [x, y]
    }

    // Control points for a gentle S-curve from node to center
    function getControlPoints(nx: number, ny: number): [number, number, number, number] {
      const cx = CENTER_X, cy = CENTER_Y
      const dx = cx - nx, dy = cy - ny
      const perp = 0.28
      return [
        nx + dx * 0.35 - dy * perp,
        ny + dy * 0.35 + dx * perp,
        nx + dx * 0.65 + dy * perp,
        ny + dy * 0.65 - dx * perp,
      ]
    }

    let time = 0

    function draw() {
      c.clearRect(0, 0, W, H)
      time += 0.012
      rotation += 0.0018

      // ── 1. Background halo ──────────────────────────────────────
      const halo = c.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, 240)
      halo.addColorStop(0,   'rgba(67,97,238,0.07)')
      halo.addColorStop(0.4, 'rgba(149,128,255,0.04)')
      halo.addColorStop(1,   'rgba(0,0,0,0)')
      c.fillStyle = halo
      c.fillRect(0, 0, W, H)

      // Compute node positions
      const nodePositions = MODELS.map((_, i) => {
        const angle = rotation + (i / MODELS.length) * Math.PI * 2 - Math.PI / 2
        return {
          x: CENTER_X + Math.cos(angle) * ORBIT_R,
          y: CENTER_Y + Math.sin(angle) * ORBIT_R,
        }
      })

      // ── 2. Orbit track (faint ring) ──────────────────────────────
      c.beginPath()
      c.arc(CENTER_X, CENTER_Y, ORBIT_R, 0, Math.PI * 2)
      c.strokeStyle = 'rgba(255,255,255,0.04)'
      c.lineWidth = 1
      c.stroke()

      // ── 3. Light stream bezier arcs (node → center) ─────────────
      MODELS.forEach((model, i) => {
        const { x: nx, y: ny } = nodePositions[i]
        const [cp1x, cp1y, cp2x, cp2y] = getControlPoints(nx, ny)

        // Animated dash: flows inward
        const dashLen = 28
        const gapLen  = 18
        const dashOffset = -(time * 60) % (dashLen + gapLen)

        c.save()
        c.beginPath()
        c.moveTo(nx, ny)
        c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, CENTER_X, CENTER_Y)

        // Gradient along the stroke
        const grad = c.createLinearGradient(nx, ny, CENTER_X, CENTER_Y)
        grad.addColorStop(0,   model.color + '55')
        grad.addColorStop(0.5, model.color + '88')
        grad.addColorStop(1,   model.color + 'BB')

        c.strokeStyle = grad
        c.lineWidth = 1.5
        c.setLineDash([dashLen, gapLen])
        c.lineDashOffset = dashOffset
        c.stroke()

        // Solid thin underlay for the arc
        c.beginPath()
        c.moveTo(nx, ny)
        c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, CENTER_X, CENTER_Y)
        c.setLineDash([])
        c.strokeStyle = model.color + '18'
        c.lineWidth = 1
        c.stroke()
        c.restore()
      })

      // ── 4. Particles drifting inward ─────────────────────────────
      particles.forEach((p) => {
        p.t += p.speed
        if (p.t > 1) p.t = 0

        const { x: nx, y: ny } = nodePositions[p.modelIdx]
        const [cp1x, cp1y, cp2x, cp2y] = getControlPoints(nx, ny)
        const [px, py] = cubicPoint(p.t, nx, ny, cp1x, cp1y, cp2x, cp2y, CENTER_X, CENTER_Y)

        // Fade in/out: visible in mid-arc
        const fade = Math.sin(p.t * Math.PI)
        const alpha = p.opacity * fade

        c.beginPath()
        c.arc(px, py, p.size, 0, Math.PI * 2)
        c.fillStyle = MODELS[p.modelIdx].color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        c.fill()
      })

      // ── 5. Center orb ────────────────────────────────────────────
      const pulse = 0.85 + Math.sin(time * 1.4) * 0.15
      const orbR  = 36 * pulse

      // Outer soft glow
      const outerGlow = c.createRadialGradient(CENTER_X, CENTER_Y, orbR * 0.5, CENTER_X, CENTER_Y, orbR * 3.2)
      outerGlow.addColorStop(0,   'rgba(67,97,238,0.22)')
      outerGlow.addColorStop(0.4, 'rgba(67,97,238,0.08)')
      outerGlow.addColorStop(1,   'rgba(0,0,0,0)')
      c.beginPath()
      c.arc(CENTER_X, CENTER_Y, orbR * 3.2, 0, Math.PI * 2)
      c.fillStyle = outerGlow
      c.fill()

      // Orb fill
      const orbFill = c.createRadialGradient(CENTER_X - orbR * 0.3, CENTER_Y - orbR * 0.3, 0, CENTER_X, CENTER_Y, orbR)
      orbFill.addColorStop(0,   '#FFFFFF')
      orbFill.addColorStop(0.35, '#A5B4FC')
      orbFill.addColorStop(0.7,  '#4361EE')
      orbFill.addColorStop(1,    '#1a1f3a')
      c.beginPath()
      c.arc(CENTER_X, CENTER_Y, orbR, 0, Math.PI * 2)
      c.fillStyle = orbFill
      c.fill()

      // Orb border
      c.beginPath()
      c.arc(CENTER_X, CENTER_Y, orbR, 0, Math.PI * 2)
      c.strokeStyle = 'rgba(255,255,255,0.25)'
      c.lineWidth = 1
      c.stroke()

      // "VF" monogram
      c.font = `700 ${Math.round(orbR * 0.65)}px 'Syne', sans-serif`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillStyle = 'rgba(255,255,255,0.92)'
      c.fillText('VF', CENTER_X, CENTER_Y)

      // ── 6. Model node circles ────────────────────────────────────
      MODELS.forEach((model, i) => {
        const { x: nx, y: ny } = nodePositions[i]

        // Outer glow halo
        const glowR = NODE_R * 2.4
        const glow = c.createRadialGradient(nx, ny, NODE_R * 0.5, nx, ny, glowR)
        glow.addColorStop(0,   model.color + '44')
        glow.addColorStop(0.5, model.color + '18')
        glow.addColorStop(1,   'rgba(0,0,0,0)')
        c.beginPath()
        c.arc(nx, ny, glowR, 0, Math.PI * 2)
        c.fillStyle = glow
        c.fill()

        // Node fill
        const nodeFill = c.createRadialGradient(nx - NODE_R * 0.3, ny - NODE_R * 0.3, 0, nx, ny, NODE_R)
        nodeFill.addColorStop(0,   '#FFFFFF')
        nodeFill.addColorStop(0.3,  model.color + 'EE')
        nodeFill.addColorStop(1,    model.color + '88')
        c.beginPath()
        c.arc(nx, ny, NODE_R, 0, Math.PI * 2)
        c.fillStyle = nodeFill
        c.fill()

        // Node border
        c.beginPath()
        c.arc(nx, ny, NODE_R, 0, Math.PI * 2)
        c.strokeStyle = model.color + 'CC'
        c.lineWidth = 1.5
        c.stroke()

        // ── 7. Node labels ─────────────────────────────────────────
        // Place label outside the orbit ring, always radially outward
        const angle = rotation + (i / MODELS.length) * Math.PI * 2 - Math.PI / 2
        const sinA = Math.sin(angle)
        const labelOffsetY = sinA >= 0 ? NODE_R + 14 : -(NODE_R + 4)
        const nameY  = ny + labelOffsetY + (sinA >= 0 ? 0 : -14)
        const roleY  = nameY + (sinA >= 0 ? 14 : -14)

        // Name
        c.font = `600 12px 'Inter', sans-serif`
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.fillStyle = 'rgba(234,238,244,0.95)'
        c.fillText(model.name, nx, nameY)

        // Role tag
        c.font = `400 10px 'JetBrains Mono', monospace`
        c.fillStyle = model.color + 'AA'
        c.fillText(model.role, nx, roleY)
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section
      id="council"
      className="fade-up"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '64px 40px',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '8px',
          }}
        >
          Powered by the council
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '40px',
          }}
        >
          Five specialists.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #4361EE 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            One shared mission.
          </span>
        </p>

        {/* Canvas */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '640px',
              height: '520px',
              maxWidth: '100%',
              display: 'block',
            }}
          />
        </div>
      </div>
    </section>
  )
}
