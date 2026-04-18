import { useEffect, useRef } from 'react'

interface AnimatedGridProps {
  cellSize?: number
  color?: string
  className?: string
}

export default function AnimatedGrid({
  cellSize = 60,
  color = '229,153,123',
  className = '',
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
    canvas.addEventListener('mousemove', onMouseMove)
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
      // All visited intersection points (pixel coords)
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
          ? 0.012 + Math.random() * 0.008
          : 0.008 + Math.random() * 0.005,
        opacity: fromHover
          ? 0.65 + Math.random() * 0.20
          : 0.50 + Math.random() * 0.20,
        fromHover,
        tailLength: fromHover
          ? 4 + Math.floor(Math.random() * 3)
          : 4 + Math.floor(Math.random() * 4),
        points: [{ x: col * cellSize, y: row * cellSize }],
        turnChance: 0.35,
        dead: false,
        deadAge: 0,
        stepsLeft: fromHover
          ? 3 + Math.floor(Math.random() * 4)
          : 5 + Math.floor(Math.random() * 7),
      }
    }

    // Spawn in a wider ring around center — not too centered
    const spawnAmbient = () => {
      if (!cols || !rows) return
      const centerCol = cols / 2
      const centerRow = rows / 2
      const minR = 3.0
      const maxR = 7.5
      const angle = Math.random() * Math.PI * 2
      const radius = minR + Math.random() * (maxR - minR)
      const col = Math.round(Math.max(0, Math.min(cols, centerCol + Math.cos(angle) * radius)))
      const row = Math.round(Math.max(0, Math.min(rows, centerRow + Math.sin(angle) * radius)))
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

    const ambientInterval = setInterval(() => {
      if (snakes.filter(s => !s.fromHover && !s.dead).length < 14) {
        spawnAmbient()
        if (Math.random() < 0.7) spawnAmbient()
        if (Math.random() < 0.4) spawnAmbient()
      }
    }, 250)

    const hoverInterval = setInterval(() => {
      if (mouse.x > 0 && mouse.x < canvas.width && mouse.y > 0 && mouse.y < canvas.height) {
        spawnHover()
        if (Math.random() < 0.5) spawnHover()
      }
    }, 150)

    // Draw a smooth bezier path through a list of points
    // Rounds all corners with quadratic curves
    const drawSmoothPath = (
      points: { x: number; y: number }[],
      opacity: number,
      lineWidth: number,
      fadeDead = 0 // 0 = alive, >0 = fading (0→1)
    ) => {
      if (points.length < 2) return

      const finalOpacity = opacity * (1 - fadeDead)
      if (finalOpacity < 0.005) return

      // Gradient from tail (transparent) to head (full opacity)
      const tail = points[0]
      const head = points[points.length - 1]
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
      grad.addColorStop(0,   `rgba(${color},0)`)
      grad.addColorStop(0.3, `rgba(${color},${finalOpacity * 0.25})`)
      grad.addColorStop(0.7, `rgba(${color},${finalOpacity * 0.7})`)
      grad.addColorStop(1,   `rgba(${color},${finalOpacity})`)

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }

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
          const fadeDead = Math.min(1, s.deadAge / 40)
          if (fadeDead >= 1) { snakes.splice(i, 1); continue }
          drawSmoothPath(s.points, s.opacity, s.fromHover ? 0.9 : 0.75, fadeDead)
          continue
        }

        s.t += s.speed

        if (s.t >= 1) {
          s.t = 0
          const nextCol = s.col + DX[s.dir]
          const nextRow = s.row + DY[s.dir]

          // Add new intersection point
          s.points.push({ x: nextCol * cellSize, y: nextRow * cellSize })
          // Trim tail
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

        // Build points array including current interpolated head position
        const hx = (s.col + DX[s.dir] * s.t) * cellSize
        const hy = (s.row + DY[s.dir] * s.t) * cellSize
        const drawPoints = [...s.points, { x: hx, y: hy }]

        drawSmoothPath(drawPoints, s.opacity, s.fromHover ? 0.9 : 0.75)
      }

      animId = requestAnimationFrame(draw)
    }

    // Pause rAF completely when off-screen — laptop fan fix
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animId) draw()  // resume
        } else {
          cancelAnimationFrame(animId)
          animId = 0           // stop completely
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
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [cellSize, color])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}