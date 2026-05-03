import { useEffect, useRef, memo } from 'react'

interface Snake {
  col: number; row: number;
  t: number; 
  dir: { x: number; y: number };
  points: { x: number; y: number }[];
  life: number;
  maxLife: number;
  speed: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  opacity: number;
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

    let snakes: Snake[] = []
    let frame: number
    let w: number, h: number
    let cols: number, rows: number

    const TRAIL_MAX_AGE = 250; 
    const TRAIL_MAX_POINTS = 140; 

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

    const createSnake = (x?: number, y?: number) => {
      const col = x !== undefined ? Math.round(x / cellSize) : Math.floor(Math.random() * cols)
      const row = y !== undefined ? Math.round(y / cellSize) : Math.floor(Math.random() * rows)
      const dirs = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}]
      snakes.push({
        col, row, t: 0, dir: dirs[Math.floor(Math.random() * dirs.length)],
        points: [{ x: col * cellSize, y: row * cellSize }],
        life: 0,
        maxLife: 150 + Math.random() * 100, 
        speed: 0.002
      })
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      
      mouseTrail.current.forEach(p => {
        p.age++
        if (p.opacity < 1) p.opacity += 0.05 
      })
      mouseTrail.current = mouseTrail.current.filter(p => p.age < TRAIL_MAX_AGE)

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

      // --- SNAKE LAYER (GUE FIX BIAR MUNCUL LAGI) ---
      snakes.forEach((s, idx) => {
        s.t += s.speed
        const curX = (s.col + s.dir.x * s.t) * cellSize
        const curY = (s.row + s.dir.y * s.t) * cellSize

        if (s.t >= 1) {
          s.t = 0; s.col += s.dir.x; s.row += s.dir.y
          s.points.push({ x: s.col * cellSize, y: s.row * cellSize })
          if (s.points.length > 8) s.points.shift()
          s.life++
        }

        const alpha = Math.min(1, (1 - s.life / s.maxLife) * 1.5)
        if (alpha <= 0) { snakes.splice(idx, 1); return }

        ctx.beginPath()
        ctx.lineWidth = 1.0 * alpha // Ditebelin dikit
        const grad = ctx.createLinearGradient(s.points[0].x, s.points[0].y, curX, curY)
        grad.addColorStop(0, `rgba(${color}, 0)`)
        grad.addColorStop(1, `rgba(${color}, ${alpha * 0.4})`) // Opacity dinaikin biar kelihatan bray
        ctx.strokeStyle = grad
        ctx.moveTo(s.points[0].x, s.points[0].y)
        s.points.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.lineTo(curX, curY)
        ctx.stroke()

        // Tambah titik terang di kepala biar gak "hilang"
        ctx.beginPath()
        ctx.arc(curX, curY, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.8})`
        ctx.fill()
      })

      if (snakes.length < 6) createSnake() // Ditambah dikit biar gak sepi
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