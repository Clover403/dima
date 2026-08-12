// AnimatedGrid.tsx
import { useEffect, useRef } from 'react'

interface AnimatedGridProps {
  cellSize?: number
  color?: string
  className?: string
  ambientOnly?: boolean
}

export default function AnimatedGrid({
  cellSize = 60,
  color = '229,153,123',
  className = '',
  ambientOnly = false,
}: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let cols = 0
    let rows = 0

    // Mouse dalam koordinat canvas
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.floor(canvas.width  / cellSize)
      rows = Math.floor(canvas.height / cellSize)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMouseMove = (e: MouseEvent) => {
      if (ambientOnly) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    document.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    type Dir = 'r' | 'l' | 'u' | 'd'
    const DIRS: Dir[] = ['r', 'l', 'u', 'd']
    const DX: Record<Dir, number> = { r: 1, l: -1, u: 0,  d: 0  }
    const DY: Record<Dir, number> = { r: 0, l: 0,  u: -1, d: 1  }
    const OPPOSITE: Record<Dir, Dir> = { r: 'l', l: 'r', u: 'd', d: 'u' }

    const validDirs = (col: number, row: number, excludeDir?: Dir): Dir[] =>
      DIRS.filter(d => {
        if (d === excludeDir) return false
        return col + DX[d] >= 0 && col + DX[d] <= cols &&
               row + DY[d] >= 0 && row + DY[d] <= rows
      })

    interface Snake {
      col: number; row: number
      t: number; dir: Dir
      speed: number
      baseOpacity: number   // opacity dasar snake ini
      fromHover: boolean
      tailLength: number
      points: { x: number; y: number }[]
      turnChance: number
      dead: boolean; deadAge: number
      stepsLeft: number
    }

    const snakes: Snake[] = []

    const makeSnake = (fromHover: boolean, col: number, row: number): Snake | null => {
      const dirs = validDirs(col, row)
      if (dirs.length === 0) return null
      const dir = dirs[Math.floor(Math.random() * dirs.length)]
      return {
        col, row, t: 0, dir,
        speed: fromHover
          ? 0.014 + Math.random() * 0.008
          : 0.007 + Math.random() * 0.005,
        baseOpacity: fromHover
          ? 0.55 + Math.random() * 0.15   // hover snake: medium, proximity yang boost
          : 0.30 + Math.random() * 0.15,  // ambient: redup, proximity yang boost
        fromHover,
        tailLength: fromHover
          ? 4 + Math.floor(Math.random() * 3)
          : 3 + Math.floor(Math.random() * 3),
        points: [{ x: col * cellSize, y: row * cellSize }],
        turnChance: 0.35,
        dead: false, deadAge: 0,
        stepsLeft: fromHover
          ? 4 + Math.floor(Math.random() * 4)
          : 4 + Math.floor(Math.random() * 6),
      }
    }

    const spawnAmbient = () => {
      if (!cols || !rows) return
      const col = Math.round(Math.random() * cols)
      const row = Math.round(Math.random() * rows)
      const s = makeSnake(false, col, row)
      if (s) snakes.push(s)
    }

    const spawnHover = () => {
      if (ambientOnly) return
      if (mouse.x < 0 || mouse.x > canvas.width) return
      const nearCol = Math.round(mouse.x / cellSize)
      const nearRow = Math.round(mouse.y / cellSize)
      const col = Math.max(0, Math.min(cols, nearCol + Math.round((Math.random() - 0.5) * 3)))
      const row = Math.max(0, Math.min(rows, nearRow + Math.round((Math.random() - 0.5) * 3)))
      const s = makeSnake(true, col, row)
      if (s) snakes.push(s)
    }

    const ambientInterval = setInterval(() => {
      if (snakes.filter(s => !s.fromHover && !s.dead).length < 14) {
        spawnAmbient()
        if (Math.random() < 0.5) spawnAmbient()
      }
    }, 380)

    const hoverInterval = setInterval(() => {
      if (ambientOnly) return
      if (mouse.x > 0 && mouse.x < canvas.width && mouse.y > 0 && mouse.y < canvas.height) {
        spawnHover()
        if (Math.random() < 0.35) spawnHover()
      }
    }, 160)

    // ── Proximity: hitung boost opacity berdasar jarak head snake ke mouse
    // radius = jarak dimana efek mulai terasa (px)
    const PROXIMITY_RADIUS = 280
    const PROXIMITY_BOOST  = 0.65  // maksimum tambahan opacity saat tepat di kursor

    const getProximityBoost = (headX: number, headY: number): number => {
      if (mouse.x < 0) return 0
      const dx   = headX - mouse.x
      const dy   = headY - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist >= PROXIMITY_RADIUS) return 0
      // Smooth falloff: makin deket makin boost, pake easing
      const t = 1 - dist / PROXIMITY_RADIUS
      return PROXIMITY_BOOST * (t * t * (3 - 2 * t)) // smoothstep
    }

    const drawSmoothPath = (
      points: { x: number; y: number }[],
      baseOpacity: number,
      lineWidth: number,
      proximityBoost: number,
      fadeDead = 0
    ) => {
      if (points.length < 2) return

      const finalOpacity = Math.min(1, baseOpacity + proximityBoost) * (1 - fadeDead)
      if (finalOpacity < 0.005) return

      // Linewidth juga ikut boost saat deket kursor — makin glowing
      const finalWidth = lineWidth + proximityBoost * 1.2

      const tail = points[0]
      const head = points[points.length - 1]
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
      grad.addColorStop(0,   `rgba(${color},0)`)
      grad.addColorStop(0.3, `rgba(${color},${finalOpacity * 0.18})`)
      grad.addColorStop(0.7, `rgba(${color},${finalOpacity * 0.60})`)
      grad.addColorStop(1,   `rgba(${color},${finalOpacity})`)

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
      ctx.strokeStyle = grad
      ctx.lineWidth   = finalWidth
      ctx.lineJoin    = 'round'
      ctx.lineCap     = 'round'
      ctx.stroke()

      // ── Glow pass: gambar ulang lebih lebar + transparan buat efek cahaya
      if (proximityBoost > 0.05) {
        const glowOpacity = proximityBoost * 0.25
        const glowGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
        glowGrad.addColorStop(0,   `rgba(${color},0)`)
        glowGrad.addColorStop(0.5, `rgba(${color},${glowOpacity})`)
        glowGrad.addColorStop(1,   `rgba(${color},${glowOpacity * 1.5})`)

        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
        ctx.strokeStyle = glowGrad
        ctx.lineWidth   = finalWidth + 4 + proximityBoost * 6
        ctx.lineJoin    = 'round'
        ctx.lineCap     = 'round'
        ctx.stroke()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = snakes.length - 1; i >= 0; i--) {
        const s = snakes[i]

        // Head position saat ini (interpolated)
        const hx = (s.col + DX[s.dir] * s.t) * cellSize
        const hy = (s.row + DY[s.dir] * s.t) * cellSize
        const boost = getProximityBoost(hx, hy)

        if (s.dead) {
          s.deadAge++
          const fadeDead = Math.min(1, s.deadAge / 18)
          if (fadeDead >= 1) { snakes.splice(i, 1); continue }
          drawSmoothPath(s.points, s.baseOpacity, s.fromHover ? 1.3 : 0.9, boost * 0.5, fadeDead)
          continue
        }

        s.t += s.speed

        if (s.t >= 1) {
          s.t = 0
          const nextCol = s.col + DX[s.dir]
          const nextRow = s.row + DY[s.dir]
          s.points.push({ x: nextCol * cellSize, y: nextRow * cellSize })
          while (s.points.length > s.tailLength + 1) s.points.shift()
          s.col = nextCol
          s.row = nextRow
          s.stepsLeft--
          if (s.stepsLeft <= 0) { s.dead = true; continue }

          const available = validDirs(s.col, s.row, OPPOSITE[s.dir])
          if (available.length === 0) { s.dead = true; continue }

          if (Math.random() < s.turnChance) {
            const perp = available.filter(d => d !== s.dir)
            s.dir = perp.length > 0
              ? perp[Math.floor(Math.random() * perp.length)]
              : available[Math.floor(Math.random() * available.length)]
          } else if (!available.includes(s.dir)) {
            s.dir = available[Math.floor(Math.random() * available.length)]
          }
        }

        const drawPoints = [...s.points, { x: hx, y: hy }]
        drawSmoothPath(drawPoints, s.baseOpacity, s.fromHover ? 1.3 : 0.9, boost)
      }

      animId = requestAnimationFrame(draw)
    }

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { if (!animId) draw() }
        else { cancelAnimationFrame(animId); animId = 0 }
      },
      { threshold: 0 }
    )
    visObserver.observe(canvas)
    draw()

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(ambientInterval)
      clearInterval(hoverInterval)
      ro.disconnect()
      document.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [cellSize, color, ambientOnly])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}