import { useEffect, useRef } from 'react'

interface AnimatedGridProps {
  cellSize?: number
  color?: string
  className?: string
  mousePos?: { x: number; y: number } | null
  ambientOnly?: boolean
}

export default function AnimatedGrid({
  cellSize = 60,
  color = '229,153,123',
  className = '',
  mousePos,
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
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.floor(canvas.width / cellSize)
      rows = Math.floor(canvas.height / cellSize)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    document.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    type Dir = 'r' | 'l' | 'u' | 'd'
    const DIRS: Dir[] = ['r', 'l', 'u', 'd']
    const DX: Record<Dir, number> = { r: 1, l: -1, u: 0, d: 0 }
    const DY: Record<Dir, number> = { r: 0, l: 0, u: -1, d: 1 }
    const OPPOSITE: Record<Dir, Dir> = { r: 'l', l: 'r', u: 'd', d: 'u' }

    const validDirs = (col: number, row: number, excludeDir?: Dir): Dir[] =>
      DIRS.filter(d => {
        if (d === excludeDir) return false
        return col + DX[d] >= 0 && col + DX[d] <= cols &&
               row + DY[d] >= 0 && row + DY[d] <= rows
      })

    interface Snake {
      col: number; row: number
      t: number
      dir: Dir
      speed: number
      opacity: number
      fromHover: boolean
      tailLength: number
      points: { x: number; y: number }[]
      turnChance: number
      dead: boolean
      deadAge: number
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
          : 0.008 + Math.random() * 0.005,
        opacity: fromHover
          ? 0.70 + Math.random() * 0.15
          : 0.65 + Math.random() * 0.20,
        fromHover,
        tailLength: fromHover
          ? 5 + Math.floor(Math.random() * 3)
          : 4 + Math.floor(Math.random() * 4),
        points: [{ x: col * cellSize, y: row * cellSize }],
        turnChance: 0.35,
        dead: false,
        deadAge: 0,
        stepsLeft: fromHover
          ? 4 + Math.floor(Math.random() * 5)
          : 5 + Math.floor(Math.random() * 7),
      }
    }

    const spawnAmbient = () => {
      if (!cols || !rows) return
      // ── Spawn tersebar di seluruh grid, bukan hanya di tengah ──
      const col = Math.round(Math.random() * cols)
      const row = Math.round(Math.random() * rows)
      const s = makeSnake(false, col, row)
      if (s) snakes.push(s)
    }

    const spawnHover = () => {
      if (mouse.x < 0 || mouse.x > canvas.width) return
      const nearCol = Math.round(mouse.x / cellSize)
      const nearRow = Math.round(mouse.y / cellSize)
      const col = Math.max(0, Math.min(cols, nearCol + Math.round((Math.random() - 0.5) * 3)))
      const row = Math.max(0, Math.min(rows, nearRow + Math.round((Math.random() - 0.5) * 3)))
      const s = makeSnake(true, col, row)
      if (s) snakes.push(s)
    }

    // ── Interval lebih cepat (150ms → dari 250ms) ──
    const ambientInterval = setInterval(() => {
      // ── Batas naik dari 14 → 40 ──
      if (snakes.filter(s => !s.fromHover && !s.dead).length < 40) {
        spawnAmbient()
        // ── Selalu spawn 2-4 sekaligus ──
        spawnAmbient()
        if (Math.random() < 0.85) spawnAmbient()
        if (Math.random() < 0.60) spawnAmbient()
        if (Math.random() < 0.35) spawnAmbient()
      }
    }, 150)

    const hoverInterval = setInterval(() => {
      if (ambientOnly) return
      if (mouse.x > 0 && mouse.x < canvas.width && mouse.y > 0 && mouse.y < canvas.height) {
        spawnHover()
        if (Math.random() < 0.4) spawnHover()
      }
    }, 90)

    const drawSmoothPath = (
      points: { x: number; y: number }[],
      opacity: number,
      lineWidth: number,
      fadeDead = 0
    ) => {
      if (points.length < 2) return

      const finalOpacity = opacity * (1 - fadeDead)
      if (finalOpacity < 0.005) return

      const tail = points[0]
      const head = points[points.length - 1]
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
      grad.addColorStop(0,   `rgba(${color},0)`)
      grad.addColorStop(0.3, `rgba(${color},${finalOpacity * 0.25})`)
      grad.addColorStop(0.7, `rgba(${color},${finalOpacity * 0.7})`)
      grad.addColorStop(1,   `rgba(${color},${finalOpacity})`)

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
      ctx.strokeStyle = grad
      ctx.lineWidth = lineWidth
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = snakes.length - 1; i >= 0; i--) {
        const s = snakes[i]

        if (s.dead) {
          s.deadAge++
          const fadeDead = Math.min(1, s.deadAge / 15)
          if (fadeDead >= 1) { snakes.splice(i, 1); continue }
          drawSmoothPath(s.points, s.opacity, s.fromHover ? 1.2 : 0.85, fadeDead)
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

        const hx = (s.col + DX[s.dir] * s.t) * cellSize
        const hy = (s.row + DY[s.dir] * s.t) * cellSize
        const drawPoints = [...s.points, { x: hx, y: hy }]
        drawSmoothPath(drawPoints, s.opacity, s.fromHover ? 1.2 : 0.85)
      }

      animId = requestAnimationFrame(draw)
    }

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animId) draw()
        } else {
          cancelAnimationFrame(animId)
          animId = 0
        }
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
  }, [cellSize, color, mousePos])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}