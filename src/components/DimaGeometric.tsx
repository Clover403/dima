import { useEffect, useRef } from 'react'

export default function GeometricLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let t = 0

    const resize = () => {
      const parent = canvas.parentElement
      const size = Math.min(parent?.offsetWidth ?? 500, parent?.offsetHeight ?? 500)
      const dpr = window.devicePixelRatio || 1
      canvas.width  = size * dpr
      canvas.height = size * dpr
      canvas.style.width  = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const C = 'rgba(229,153,123,'

    // Line dengan glow
    const line = (x1: number, y1: number, x2: number, y2: number, alpha: number, w: number, glow = false) => {
      ctx.save()
      if (glow) {
        ctx.shadowBlur  = 8
        ctx.shadowColor = `rgba(229,153,123,0.6)`
      }
      ctx.strokeStyle = `${C}${alpha})`
      ctx.lineWidth   = w
      ctx.lineCap     = 'round'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.restore()
    }

    // Star/constellation dot — titik dengan efek bintang
    const star = (x: number, y: number, r: number, alpha: number, pulse: number) => {
      const pr = r * (1 + pulse * 0.4)

      // Outer glow halo (lapis 1 — paling luar, sangat transparan)
      ctx.save()
      const halo = ctx.createRadialGradient(x, y, 0, x, y, pr * 5)
      halo.addColorStop(0,   `rgba(229,153,123,${alpha * 0.15})`)
      halo.addColorStop(0.3, `rgba(229,153,123,${alpha * 0.06})`)
      halo.addColorStop(1,   'rgba(229,153,123,0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(x, y, pr * 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Medium glow (lapis 2)
      ctx.save()
      const mid = ctx.createRadialGradient(x, y, 0, x, y, pr * 2.5)
      mid.addColorStop(0,   `rgba(229,153,123,${alpha * 0.55})`)
      mid.addColorStop(0.5, `rgba(229,153,123,${alpha * 0.2})`)
      mid.addColorStop(1,   'rgba(229,153,123,0)')
      ctx.fillStyle = mid
      ctx.beginPath()
      ctx.arc(x, y, pr * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Core dot (lapis 3 — paling terang)
      ctx.save()
      ctx.shadowBlur  = 14 + pulse * 10
      ctx.shadowColor = `rgba(255,200,160,${alpha})`
      const core = ctx.createRadialGradient(x, y, 0, x, y, pr)
      core.addColorStop(0,   `rgba(255,220,180,${alpha})`)
      core.addColorStop(0.5, `rgba(229,153,123,${alpha * 0.9})`)
      core.addColorStop(1,   `rgba(229,153,123,0)`)
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(x, y, pr, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 4-ray star spike (cross flare)
      ctx.save()
      ctx.globalAlpha = alpha * (0.3 + pulse * 0.4)
      ctx.strokeStyle = `rgba(255,220,180,0.9)`
      ctx.lineWidth   = 0.6
      ctx.shadowBlur  = 6
      ctx.shadowColor = 'rgba(229,153,123,0.8)'
      const spikeLen = pr * (3.5 + pulse * 2)
      // Horizontal spike
      ctx.beginPath(); ctx.moveTo(x - spikeLen, y); ctx.lineTo(x + spikeLen, y); ctx.stroke()
      // Vertical spike
      ctx.beginPath(); ctx.moveTo(x, y - spikeLen); ctx.lineTo(x, y + spikeLen); ctx.stroke()
      // Diagonal spikes (shorter)
      const dLen = spikeLen * 0.5
      ctx.globalAlpha = alpha * (0.15 + pulse * 0.2)
      ctx.beginPath(); ctx.moveTo(x - dLen, y - dLen); ctx.lineTo(x + dLen, y + dLen); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x + dLen, y - dLen); ctx.lineTo(x - dLen, y + dLen); ctx.stroke()
      ctx.restore()
    }

    const draw = () => {
      t += 0.008
      const W  = canvas.width  / (window.devicePixelRatio || 1)
      const H  = canvas.height / (window.devicePixelRatio || 1)
      const cx = W / 2
      const cy = H / 2
      const R  = W * 0.38

      ctx.clearRect(0, 0, W, H)

      const rot = t * 0.15

      // ── HEXAGON ───────────────────────────────────────────────────────
      const hex: [number, number][] = []
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6 + rot
        hex.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
      }

      ctx.save()
      ctx.shadowBlur  = 6
      ctx.shadowColor = 'rgba(229,153,123,0.4)'
      ctx.strokeStyle = `${C}0.9)`
      ctx.lineWidth   = 2.5
      ctx.beginPath()
      hex.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // ── MIDDLE SQUARE ─────────────────────────────────────────────────
      const sqR = R * 0.58
      const sq: [number, number][] = []
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4 + rot * 0.6
        sq.push([cx + sqR * Math.cos(a), cy + sqR * Math.sin(a)])
      }

      ctx.save()
      ctx.shadowBlur  = 5
      ctx.shadowColor = 'rgba(229,153,123,0.35)'
      ctx.strokeStyle = `${C}0.85)`
      ctx.lineWidth   = 2.2
      ctx.beginPath()
      sq.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // ── INNER SQUARE ──────────────────────────────────────────────────
      const sq2R = R * 0.32
      const sq2: [number, number][] = []
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4 + rot * 0.3
        sq2.push([cx + sq2R * Math.cos(a), cy + sq2R * Math.sin(a)])
      }

      ctx.save()
      ctx.shadowBlur  = 4
      ctx.shadowColor = 'rgba(229,153,123,0.3)'
      ctx.strokeStyle = `${C}0.8)`
      ctx.lineWidth   = 2.0
      ctx.beginPath()
      sq2.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // ── CONNECTIONS ───────────────────────────────────────────────────
      const hexToSq = [
        [0,0],[0,1],[1,1],[1,2],[2,2],[2,3],
        [3,3],[3,0],[4,0],[4,3],[5,0],[5,1],
      ]
      hexToSq.forEach(([hi, si]) => {
        line(hex[hi][0], hex[hi][1], sq[si][0], sq[si][1], 0.55, 1.8)
      })

      line(hex[5][0], hex[5][1], hex[1][0], hex[1][1], 0.6, 1.8, true)
      line(hex[0][0], hex[0][1], sq2[2][0], sq2[2][1], 0.5, 1.5)
      line(hex[2][0], hex[2][1], hex[4][0], hex[4][1], 0.6, 1.8, true)
      line(hex[3][0], hex[3][1], sq2[0][0], sq2[0][1], 0.5, 1.5)

      line(sq[0][0], sq[0][1], sq[2][0], sq[2][1], 0.55, 1.8)
      line(sq[1][0], sq[1][1], sq[3][0], sq[3][1], 0.55, 1.8)

      sq2.forEach(([x, y]) => line(x, y, cx, cy, 0.45, 1.5))

      const hexMids: [number, number][] = []
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6
        hexMids.push([
          (hex[i][0] + hex[next][0]) / 2,
          (hex[i][1] + hex[next][1]) / 2,
        ])
      }
      line(hexMids[2][0], hexMids[2][1], hexMids[5][0], hexMids[5][1], 0.5, 1.8)
      line(hexMids[0][0], hexMids[0][1], hexMids[3][0], hexMids[3][1], 0.5, 1.8)

      // ── STAR DOTS — hex corners ───────────────────────────────────────
      hex.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i * 1.1)
        star(x, y, 4, 0.95, pulse)
      })

      // ── STAR DOTS — square corners ────────────────────────────────────
      sq.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.8 + i * 0.8 + 1.2)
        star(x, y, 3.5, 0.9, pulse)
      })

      // ── STAR DOTS — inner square corners ─────────────────────────────
      sq2.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.0 + i * 0.9 + 2.4)
        star(x, y, 2.8, 0.75, pulse)
      })

      // ── CENTER STAR ───────────────────────────────────────────────────
      const centerPulse = 0.5 + 0.5 * Math.sin(t * 2.5)
      star(cx, cy, 4.5, 1.0, centerPulse)

      raf = requestAnimationFrame(draw)
    }

    draw()

    const visObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!raf) draw()
      } else {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }, { threshold: 0 })
    visObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      visObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block', background: 'transparent' }}
    />
  )
}