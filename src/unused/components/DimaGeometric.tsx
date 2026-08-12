import { useEffect, useRef } from 'react'

export default function GeometricLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    let t = 0

    const logoImg = new Image()
    logoImg.src = '/logo/Imagen 1.png'
    let logoLoaded = false
    logoImg.onload = () => { logoLoaded = true }

    const resize = () => {
      const parent = canvas.parentElement
      const size = Math.min(parent?.offsetWidth ?? 500, parent?.offsetHeight ?? 500)
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const BRONZE = 'rgba(229,153,123,'
    const GOLD = 'rgba(255,220,200,'

    const glowLine = (x1: number, y1: number, x2: number, y2: number, alpha: number, w: number) => {
      ctx.save()
      ctx.shadowBlur = 15
      ctx.shadowColor = `${BRONZE}0.4)`
      ctx.strokeStyle = `${BRONZE}${alpha})`
      ctx.lineWidth = w
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.restore()
    }

    const node = (x: number, y: number, r: number, alpha: number, pulse: number) => {
      const pr = r * (1 + pulse * 0.2)

      ctx.save()
      const outer = ctx.createRadialGradient(x, y, 0, x, y, pr * 6)
      outer.addColorStop(0, `${BRONZE}${alpha * 0.25})`)
      outer.addColorStop(0.5, `${BRONZE}${alpha * 0.08})`)
      outer.addColorStop(1, `${BRONZE}0)`)
      ctx.fillStyle = outer
      ctx.beginPath()
      ctx.arc(x, y, pr * 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      const mid = ctx.createRadialGradient(x, y, 0, x, y, pr * 2.5)
      mid.addColorStop(0, `${GOLD}${alpha * 0.6})`)
      mid.addColorStop(1, `${BRONZE}0)`)
      ctx.fillStyle = mid
      ctx.beginPath()
      ctx.arc(x, y, pr * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.shadowBlur = 8 + pulse * 6
      ctx.shadowColor = `${GOLD}${alpha * 0.6})`
      ctx.fillStyle = `${GOLD}${alpha * 0.9})`
      ctx.beginPath()
      ctx.arc(x, y, pr * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const draw = () => {
      t += 0.008  // ← lebih cepat
      const W = canvas.width / (window.devicePixelRatio || 1)
      const H = canvas.height / (window.devicePixelRatio || 1)
      const cx = W / 2
      const cy = H / 2
      const R = W * 0.38

      ctx.clearRect(0, 0, W, H)

      const rot = t * 0.19  // ← lebih cepat (dari 0.06)

      // ── OUTER HEXAGON ───────────────────────────────────────────────
      const hex: [number, number][] = []
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6 + rot
        hex.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
      }

      ctx.save()
      ctx.strokeStyle = `${BRONZE}0.9)`
      ctx.lineWidth = 3.5
      ctx.shadowBlur = 15
      ctx.shadowColor = `${BRONZE}0.35)`
      ctx.beginPath()
      hex.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // ── MIDDLE SQUARE ───────────────────────────────────────────────
      const sqR = R * 0.58
      const sq: [number, number][] = []
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4 + rot * 0.4
        sq.push([cx + sqR * Math.cos(a), cy + sqR * Math.sin(a)])
      }

      ctx.save()
      ctx.strokeStyle = `${BRONZE}0.85)`
      ctx.lineWidth = 3
      ctx.shadowBlur = 12
      ctx.shadowColor = `${BRONZE}0.3)`
      ctx.beginPath()
      sq.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // ── INNER SQUARE ────────────────────────────────────────────────
      const sq2R = R * 0.32
      const sq2: [number, number][] = []
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4 - rot * 0.25
        sq2.push([cx + sq2R * Math.cos(a), cy + sq2R * Math.sin(a)])
      }

      ctx.save()
      ctx.strokeStyle = `${BRONZE}0.9)`
      ctx.lineWidth = 3.5
      ctx.shadowBlur = 15
      ctx.shadowColor = `${BRONZE}0.4)`
      ctx.beginPath()
      sq2.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      // ── CONNECTIONS: Hex → Square ───────────────────────────────────
      for (let i = 0; i < 6; i++) {
        const sqIdx1 = i % 4
        const sqIdx2 = (i + 1) % 4
        glowLine(hex[i][0], hex[i][1], sq[sqIdx1][0], sq[sqIdx1][1], 0.45, 2)
        glowLine(hex[i][0], hex[i][1], sq[sqIdx2][0], sq[sqIdx2][1], 0.45, 2)
      }

      // ── CONNECTIONS: Square → Inner Square ──────────────────────────
      for (let i = 0; i < 4; i++) {
        glowLine(sq[i][0], sq[i][1], sq2[i][0], sq2[i][1], 0.55, 2.2)
        glowLine(sq[i][0], sq[i][1], sq2[(i + 1) % 4][0], sq2[(i + 1) % 4][1], 0.45, 1.8)
      }

      // ── INNER DIAGONALS (X) ─────────────────────────────────────────
      glowLine(sq2[0][0], sq2[0][1], sq2[2][0], sq2[2][1], 0.5, 2)
      glowLine(sq2[1][0], sq2[1][1], sq2[3][0], sq2[3][1], 0.5, 2)

      // ── MIDDLE CROSS (+) ────────────────────────────────────────────
      glowLine(sq[0][0], sq[0][1], sq[2][0], sq[2][1], 0.4, 1.8)
      glowLine(sq[1][0], sq[1][1], sq[3][0], sq[3][1], 0.4, 1.8)

      // ── HEXAGON CROSS ───────────────────────────────────────────────
      glowLine(hex[0][0], hex[0][1], hex[3][0], hex[3][1], 0.35, 1.5)
      glowLine(hex[1][0], hex[1][1], hex[4][0], hex[4][1], 0.35, 1.5)
      glowLine(hex[2][0], hex[2][1], hex[5][0], hex[5][1], 0.35, 1.5)

      // ── NODES ───────────────────────────────────────────────────────
      hex.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 1.0)  // ← lebih cepat
        node(x, y, 4, 0.85, pulse)
      })

      sq.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 0.8 + 1.5)  // ← lebih cepat
        node(x, y, 3.2, 0.8, pulse)
      })

      sq2.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 1.0 + 3)  // ← lebih cepat
        node(x, y, 2.8, 0.75, pulse)
      })

      // ── CENTER LOGO ─────────────────────────────────────────────────
      if (logoLoaded) {
        const logoSize = R * 0.20
        ctx.save()
        ctx.globalAlpha = 1.0
        const aspect = logoImg.width / logoImg.height
        const drawW = logoSize
        const drawH = logoSize / aspect
        ctx.drawImage(logoImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH)
        ctx.restore()
      }

      // ── CENTER SOFT GLOW ────────────────────────────────────────────
      const centerPulse = 0.5 + 0.5 * Math.sin(t * 2.0)  // ← lebih cepat
      ctx.save()
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.15)
      cg.addColorStop(0, `${BRONZE}${0.25 + centerPulse * 0.15})`)
      cg.addColorStop(1, `${BRONZE}0)`)
      ctx.fillStyle = cg
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.15, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

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