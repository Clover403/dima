import { useEffect, useRef } from 'react'

interface AnimatedGridEdgeProps {
  cellSize?: number
  color?: string
  className?: string
}

export default function AnimatedGridEdge({
  cellSize = 60,
  color = '229,153,123',
  className = '',
}: AnimatedGridEdgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = 0
    let cols = 0
    let rows = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.floor(canvas.width / cellSize)
      rows = Math.floor(canvas.height / cellSize)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

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
      tailLength: number
      points: { x: number; y: number }[]
      turnChance: number
      dead: boolean
      deadAge: number
      stepsLeft: number
    }

    const snakes: Snake[] = []

    const makeSnake = (col: number, row: number): Snake | null => {
      const dirs = validDirs(col, row)
      if (dirs.length === 0) return null
      const dir = dirs[Math.floor(Math.random() * dirs.length)]
      return {
        col, row, t: 0, dir,
        speed: 0.007 + Math.random() * 0.005,
        opacity: 0.45 + Math.random() * 0.25,
        tailLength: 4 + Math.floor(Math.random() * 4),
        points: [{ x: col * cellSize, y: row * cellSize }],
        turnChance: 0.35,
        dead: false,
        deadAge: 0,
        stepsLeft: 5 + Math.floor(Math.random() * 8),
      }
    }

    const spawnEdge = () => {
      if (!cols || !rows) return
      const perimeterH = cols + 1
      const perimeterV = rows + 1
      const total = (perimeterH + perimeterV) * 2
      const rand = Math.random() * total
      let col: number, row: number
      if (rand < perimeterH) {
        col = Math.floor(Math.random() * (cols + 1)); row = 0
      } else if (rand < perimeterH * 2) {
        col = Math.floor(Math.random() * (cols + 1)); row = rows
      } else if (rand < perimeterH * 2 + perimeterV) {
        col = 0; row = Math.floor(Math.random() * (rows + 1))
      } else {
        col = cols; row = Math.floor(Math.random() * (rows + 1))
      }
      const s = makeSnake(col, row)
      if (s) snakes.push(s)
    }

    const spawnInterval = setInterval(() => {
      if (snakes.filter(s => !s.dead).length < 14) {
        spawnEdge()
        if (Math.random() < 0.7) spawnEdge()
        if (Math.random() < 0.4) spawnEdge()
      }
    }, 250)

    const drawSmoothPath = (
      points: { x: number; y: number }[],
      opacity: number,
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
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.strokeStyle = grad
      ctx.lineWidth = 0.75
      ctx.lineJoin = 'miter'
      ctx.lineCap = 'square'
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
          drawSmoothPath(s.points, s.opacity, fadeDead)
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
        drawSmoothPath([...s.points, { x: hx, y: hy }], s.opacity)
      }

      animId = requestAnimationFrame(draw)
    }

    // Stop rAF when off-screen, resume when visible — laptop fan fix
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
      clearInterval(spawnInterval)
      ro.disconnect()
      visObserver.disconnect()
    }
  }, [cellSize, color])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}