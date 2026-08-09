import { useEffect, useRef, memo } from 'react'

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  opacity: number;
}

type Dir = 'r' | 'l' | 'u' | 'd'

interface Snake {
  col: number; row: number
  t: number; dir: Dir
  speed: number
  baseOpacity: number
  tailLength: number
  points: { x: number; y: number }[]
  turnChance: number
  dead: boolean; deadAge: number
  stepsLeft: number
}

const MagmaCivilized = memo(({
  cellSize = 55,
  color = '229,153,123',
  className = '',
  proximityRadius = 550, 
}: {
  cellSize?: number;
  color?: string;
  className?: string;
  proximityRadius?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseTrail = useRef<TrailPoint[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let frame: number
    let w: number, h: number
    let cols: number, rows: number

    // ── GRID HOVER: lebih cepat hilang ──────────────────────────────────────
    const TRAIL_MAX_AGE = 90        // dari 250 → 90 (3x lebih cepat pudar)
    const TRAIL_MAX_POINTS = 100    // dikurangi sedikit

    // ── Snake constants ─────────────────────────────────────────────────────
    const DIRS: Dir[] = ['r', 'l', 'u', 'd']
    const DX: Record<Dir, number> = { r: 1, l: -1, u: 0,  d: 0  }
    const DY: Record<Dir, number> = { r: 0, l: 0,  u: -1, d: 1  }
    const OPPOSITE: Record<Dir, Dir> = { r: 'l', l: 'r', u: 'd', d: 'u' }

    const snakes: Snake[] = []

    const validDirs = (col: number, row: number, excludeDir?: Dir): Dir[] =>
      DIRS.filter(d => {
        if (d === excludeDir) return false
        return col + DX[d] >= 0 && col + DX[d] <= cols &&
               row + DY[d] >= 0 && row + DY[d] <= rows
      })

    const makeSnake = (col: number, row: number): Snake | null => {
      const dirs = validDirs(col, row)
      if (dirs.length === 0) return null
      const dir = dirs[Math.floor(Math.random() * dirs.length)]
      return {
        col, row, t: 0, dir,
        // ── Intensitas dinaikin: lebih kencang, lebih terang, lebih panjang ─
        speed: 0.008 + Math.random() * 0.008,          // lebih kencang
        baseOpacity: 0.30 + Math.random() * 0.20,      // lebih terang (0.30–0.50)
        tailLength: 3 + Math.floor(Math.random() * 4), // lebih panjang (3–6)
        points: [{ x: col * cellSize, y: row * cellSize }],
        turnChance: 0.35,
        dead: false, deadAge: 0,
        stepsLeft: 4 + Math.floor(Math.random() * 5),  // hidup lebih lama dikit
      }
    }

    const spawnAmbient = () => {
      if (!cols || !rows) return
      const col = Math.round(Math.random() * cols)
      const row = Math.round(Math.random() * rows)
      const s = makeSnake(col, row)
      if (s) snakes.push(s)
    }

    // ── Spawn: lebih sering & lebih banyak ──────────────────────────────────
    const ambientInterval = setInterval(() => {
      if (snakes.filter(s => !s.dead).length < 10) {  // dari 5 → 10
        spawnAmbient()
        if (Math.random() < 0.45) spawnAmbient()       // 45% spawn double
      }
    }, 420)                                           // dari 650 → 420ms

    const drawSmoothPath = (
      points: { x: number; y: number }[],
      baseOpacity: number,
      lineWidth: number,
      fadeDead = 0
    ) => {
      if (points.length < 2) return

      const finalOpacity = baseOpacity * (1 - fadeDead)
      if (finalOpacity < 0.005) return

      const tail = points[0]
      const head = points[points.length - 1]
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
      grad.addColorStop(0,   `rgba(${color},0)`)
      grad.addColorStop(0.3, `rgba(${color},${finalOpacity * 0.20})`)
      grad.addColorStop(0.7, `rgba(${color},${finalOpacity * 0.65})`)
      grad.addColorStop(1,   `rgba(${color},${finalOpacity})`)

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
      ctx.strokeStyle = grad
      ctx.lineWidth   = lineWidth
      ctx.lineJoin    = 'round'
      ctx.lineCap     = 'round'
      ctx.stroke()
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      cols = Math.ceil(w / cellSize)
      rows = Math.ceil(h / cellSize)
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      
      // ── Mouse trail: fade lebih agresif ──────────────────────────────────
      mouseTrail.current.forEach(p => {
        p.age++
        // opacity naik cepat di awal, tapi age max jauh lebih pendek
        if (p.opacity < 1) p.opacity += 0.08 
      })
      mouseTrail.current = mouseTrail.current.filter(p => p.age < TRAIL_MAX_AGE)

      // ═══════════════════════════════════════════════════════════════════
      // GRID LAYER (tetap sama, tapi hover pudar lebih cepat karena age ↓)
      // ═══════════════════════════════════════════════════════════════════
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const gx = i * cellSize
          const gy = j * cellSize
          let maxCore = 0
          let maxMid = 0
          let maxAmbient = 0

          mouseTrail.current.forEach((tp, idx) => {
            const dist = Math.hypot(gx - tp.x, gy - tp.y)
            const lifeRatio = 1 - (tp.age / TRAIL_MAX_AGE)
            const trailProgress = idx / mouseTrail.current.length 
            const currentRadius = proximityRadius * (0.4 + 0.6 * trailProgress)
            
            if (dist < currentRadius) {
              const distRatio = 1 - dist / currentRadius
              const core = Math.pow(distRatio, 20) * lifeRatio
              const mid = Math.pow(distRatio, 3.5) * lifeRatio
              const ambient = Math.pow(distRatio, 1.2) * lifeRatio
              
              if (core > maxCore) maxCore = core
              if (mid > maxMid) maxMid = mid
              if (ambient > maxAmbient) maxAmbient = ambient
            }
          })

          if (maxAmbient > 0.001) {
            const pulse = Math.sin(time * 0.001 + (i + j)) * 0.05 + 0.95
            ctx.lineWidth = 0.2 + (maxMid * 2.8) + (maxCore * 4.5) 
            ctx.strokeStyle = `rgba(${color}, ${maxAmbient * 0.55 * pulse})`
            
            if (i < cols) {
              ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + cellSize, gy); ctx.stroke()
            }
            if (j < rows) {
              ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + cellSize); ctx.stroke()
            }
          }
        }
      }

      // ═══════════════════════════════════════════════════════════════════
      // SNAKE LAYER (intensitas naik)
      // ═══════════════════════════════════════════════════════════════════
      for (let i = snakes.length - 1; i >= 0; i--) {
        const s = snakes[i]

        const hx = (s.col + DX[s.dir] * s.t) * cellSize
        const hy = (s.row + DY[s.dir] * s.t) * cellSize

        if (s.dead) {
          s.deadAge++
          const fadeDead = Math.min(1, s.deadAge / 14)  // fade out lebih cepat
          if (fadeDead >= 1) { snakes.splice(i, 1); continue }
          drawSmoothPath(s.points, s.baseOpacity, 1.0, fadeDead)
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
        drawSmoothPath(drawPoints, s.baseOpacity, 1.0)
      }

      frame = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      
      const lastPoint = mouseTrail.current[mouseTrail.current.length - 1]
      if (!lastPoint || Math.hypot(nx - lastPoint.x, ny - lastPoint.y) > 6) {
        mouseTrail.current.push({ x: nx, y: ny, age: 0, opacity: 0 })
      }
      
      if (mouseTrail.current.length > TRAIL_MAX_POINTS) mouseTrail.current.shift()
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    resize()
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      clearInterval(ambientInterval)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [cellSize, color, proximityRadius])

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu ${className}`}
      style={{ backfaceVisibility: 'hidden' }}
    />
  )
})

export default MagmaCivilized