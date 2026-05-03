import { useEffect, useRef } from 'react'

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
}

export default function LongMagmaTrailGrid({
  cellSize = 60,
  color = '229,153,123',
  className = '',
  proximityRadius = 550,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseTrail = useRef<TrailPoint[]>([])
  const mouse = useRef({ x: -1000, y: -1000, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let snakes: Snake[] = []
    let frame: number
    let w: number, h: number
    let cols: number, rows: number

    const TRAIL_MAX_AGE = 80; // Ekor jauh lebih lama (sebelumnya 25)
    const TRAIL_MAX_POINTS = 60; // Titik lebih banyak biar smooth

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
        maxLife: 120 + Math.random() * 60,
        speed: 0.003 + Math.random() * 0.005 // Makin kental bray
      })
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      
      // Update Trail: Aging process
      mouseTrail.current.forEach(p => p.age++)
      mouseTrail.current = mouseTrail.current.filter(p => p.age < TRAIL_MAX_AGE)

      // --- 1. GRID LAYER (Lava Persistence) ---
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const gx = i * cellSize
          const gy = j * cellSize
          
          let maxCore = 0
          let maxAmbient = 0

          // Loop Trail untuk cari intensitas tertinggi di koordinat ini
          mouseTrail.current.forEach((tp) => {
            const dist = Math.hypot(gx - tp.x, gy - tp.y)
            
            // Age factor: 1.0 (baru) -> 0.0 (mati)
            const ageLife = 1 - (tp.age / TRAIL_MAX_AGE)
            // Easing: bikin redupnya lebih smooth (nggak linear)
            const smoothAge = ageLife * ageLife; 

            const currentRadius = proximityRadius * (0.3 + 0.7 * smoothAge)
            
            if (dist < currentRadius) {
              const distRatio = 1 - dist / currentRadius
              // Core tajam, Ambient luas
              const core = Math.pow(distRatio, 6) * smoothAge
              const ambient = Math.pow(distRatio, 2) * smoothAge
              
              if (core > maxCore) maxCore = core
              if (ambient > maxAmbient) maxAmbient = ambient
            }
          })

          if (maxAmbient > 0.001) {
            const pulse = Math.sin(time * 0.001 + (i + j)) * 0.05 + 0.95
            
            // Ultra-thick di kursor, tapered (mengkerucut) ke belakang
            ctx.lineWidth = 0.2 + (maxCore * 7.0) 
            ctx.strokeStyle = `rgba(${color}, ${maxAmbient * 0.9 * pulse})`
            
            if (i < cols) {
              ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + cellSize, gy); ctx.stroke()
            }
            if (j < rows) {
              ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + cellSize); ctx.stroke()
            }
          }
        }
      }

      // --- 2. SNAKE LAYER (Thin Threads) ---
      snakes.forEach((s, idx) => {
        s.t += s.speed
        const curX = (s.col + s.dir.x * s.t) * cellSize
        const curY = (s.row + s.dir.y * s.t) * cellSize

        if (s.t >= 1) {
          s.t = 0; s.col += s.dir.x; s.row += s.dir.y
          s.points.push({ x: s.col * cellSize, y: s.row * cellSize })
          if (s.points.length > 10) s.points.shift()
          if (Math.random() > 0.7) {
            const dirs = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}]
            s.dir = dirs[Math.floor(Math.random() * dirs.length)]
          }
          s.life++
        }

        const alpha = Math.min(1, (1 - s.life / s.maxLife) * 1.5)
        if (alpha <= 0) { snakes.splice(idx, 1); return }

        ctx.beginPath()
        ctx.lineWidth = 1.2 * alpha
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'
        
        const grad = ctx.createLinearGradient(s.points[0].x, s.points[0].y, curX, curY)
        grad.addColorStop(0, `rgba(${color}, 0)`)
        grad.addColorStop(1, `rgba(${color}, ${alpha * 0.6})`)
        
        ctx.strokeStyle = grad
        ctx.moveTo(s.points[0].x, s.points[0].y)
        s.points.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.lineTo(curX, curY)
        ctx.stroke()
      })

      if (snakes.length < 12) createSnake()
      frame = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      
      mouse.current = { x: nx, y: ny, active: true }
      
      // Filter trail: jangan simpan titik jika jarak terlalu dekat (biar hemat memori)
      const lastPoint = mouseTrail.current[mouseTrail.current.length - 1]
      if (!lastPoint || Math.hypot(nx - lastPoint.x, ny - lastPoint.y) > 5) {
        mouseTrail.current.push({ x: nx, y: ny, age: 0 })
      }
      
      if (mouseTrail.current.length > TRAIL_MAX_POINTS) mouseTrail.current.shift()
      if (Math.random() > 0.97) createSnake(nx, ny)
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
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} 
    />
  )
}