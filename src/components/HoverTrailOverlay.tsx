import { useEffect, useRef, useState, useCallback, useMemo, useId } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ─── constants ─── */
const TRAIL_MAX_AGE = 2200
const FIXED_BRUSH_WIDTH = 120 

/* ─── Types ─── */
type TrailPoint = { x: number; y: number; t: number; w: number }
type Particle = { x: number; y: number; vx: number; vy: number; r: number; tier: 0 | 1 | 2; phase: number; pulseSpeed: number }

/* ─── Constellation Canvas ─── */
function ConstellationLayer({ 
  isHovering, cursorX, cursorY, width, height, theme 
}: { 
  isHovering: boolean; cursorX: number; cursorY: number; width: number; height: number; theme: 'navy' | 'lightgray' | 'white' 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ isHovering: false, cx: width / 2, cy: height / 2, opacity: 0 })

  const isNavy = theme === 'navy'
  const cPrimary = isNavy ? '#E5997B' : '#030035'
  const cSecondary = isNavy ? '#FFFFFF' : '#E5997B'
  const rgbPrimary = isNavy ? '229,153,123' : '3,0,53'
  const rgbSecondary = isNavy ? '255,255,255' : '229,153,123'

  // Penyesuaian Ekstra agar Lightgray Jauh Lebih Terlihat & Elegan
  const lineWeight = isNavy ? 0.5 : 1.2 // Garis jauh lebih tebal
  const maxLineAlphaPri = isNavy ? 0.4 : 0.95 // Sangat pekat
  const maxLineAlphaSec = isNavy ? 0.12 : 0.6 

  useEffect(() => { stateRef.current = { ...stateRef.current, isHovering, cx: cursorX, cy: cursorY } }, [isHovering, cursorX, cursorY])

  const staticDots = useMemo(() => Array.from({ length: isNavy ? 800 : 700 }, () => ({
    x: Math.random() * width, y: Math.random() * height, 
    // Titik debu statis lebih besar
    r: (isNavy ? 0.3 : 0.8) + Math.random() * (isNavy ? 1.2 : 1.8),
    color: Math.random() < (isNavy ? 0.5 : 0.7) ? cPrimary : cSecondary, 
    // Jauh lebih opaque di versi terang
    baseAlpha: (isNavy ? 0.2 : 0.5) + Math.random() * 0.5,
  })), [width, height, cPrimary, cSecondary, isNavy])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d', { alpha: true })
    if (!ctx || width === 0 || height === 0) return
    const W = width, H = height

    // Partikel utama ditambah drastis dari 65 ke 90
    const particles: Particle[] = Array.from({ length: 90 }, (_, i) => {
      const tier = (i < 12 ? 0 : i < 35 ? 1 : 2)
      return {
        x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        // Ukuran core dots dibesarkan maksimal
        r: tier === 0 ? (isNavy ? 1.8 : 3.0) : tier === 1 ? (isNavy ? 1.2 : 2.2) : (isNavy ? 0.8 : 1.5), 
        tier, phase: Math.random() * Math.PI * 2, pulseSpeed: 0.02 + Math.random() * 0.03,
      }
    })

    let t = 0, raf = 0
    const draw = () => {
      t += 0.016
      const { isHovering: hov, cx, cy } = stateRef.current
      stateRef.current.opacity = hov ? Math.min(1, stateRef.current.opacity + 0.06) : Math.max(0, stateRef.current.opacity - 0.015)
      const alpha = stateRef.current.opacity
      
      ctx.clearRect(0, 0, W, H)
      if (alpha <= 0) { raf = requestAnimationFrame(draw); return }

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (hov) {
          const dx = cx - p.x, dy = cy - p.y, dist = Math.hypot(dx, dy)
          if (dist < 180 && dist > 0) {
            const force = (180 - dist) / 180
            p.x -= (dx / dist) * force * 1.5; p.y -= (dy / dist) * force * 1.5
          }
        }
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        p.x = Math.max(0, Math.min(W, p.x)); p.y = Math.max(0, Math.min(H, p.y))
      })

      // Menggambar jaring rasi bintang
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          // Jarak maksimal garis diperlebar agar jaring nyambung makin jauh (150px)
          if (d > 150) continue
          ctx.beginPath()
          const bright = a.tier === 0 || b.tier === 0
          
          ctx.strokeStyle = bright 
            ? `rgba(${rgbPrimary},${(1 - d / 150) * maxLineAlphaPri * alpha})` 
            : `rgba(${rgbSecondary},${(1 - d / 150) * maxLineAlphaSec * alpha})`
          
          ctx.lineWidth = lineWeight
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
        }
      }

      // Menggambar titik benderang rasi bintang
      particles.forEach(p => {
        const pAlpha = (Math.sin(t * 4 + p.phase) * 0.3 + 0.7) * alpha
        ctx.shadowBlur = p.tier === 0 ? (isNavy ? 10 : 5) : 0
        ctx.shadowColor = cPrimary
        ctx.beginPath(); ctx.fillStyle = p.tier === 0 ? cPrimary : cSecondary
        ctx.globalAlpha = pAlpha; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
      })

      staticDots.forEach(dot => {
        ctx.beginPath(); ctx.fillStyle = dot.color; ctx.globalAlpha = alpha * dot.baseAlpha
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2); ctx.fill()
      })

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [width, height, staticDots, rgbPrimary, rgbSecondary, cPrimary, cSecondary, isNavy, maxLineAlphaPri, maxLineAlphaSec, lineWeight])

  return (
    <foreignObject x="0" y="0" width={width} height={height}>
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-full block" />
    </foreignObject>
  )
}

/* ─── Main Overlay Component ─── */
export default function HoverTrailOverlay({ 
  className = '', 
  theme = 'navy' 
}: { 
  className?: string; 
  theme?: 'navy' | 'lightgray' | 'white'
}) {
  const rawId = useId()
  const uId = rawId.replace(/:/g, '') 

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const targetPos = useRef<{ x: number; y: number } | null>(null)
  const [smoothPos, setSmoothPos] = useState<{ x: number; y: number } | null>(null)
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const trailRef = useRef<TrailPoint[]>([])

  const springX = useMotionValue(0); const springY = useMotionValue(0)
  const sx = useSpring(springX, { stiffness: 200, damping: 22 }); const sy = useSpring(springY, { stiffness: 200, damping: 22 })

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setSize({ w: width, h: height })
    })
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    let raf: number; let t = 0
    const tick = () => {
      t = Date.now()
      setSmoothPos(prev => {
        if (!targetPos.current) return prev
        const wobX = Math.sin(t * 0.002) * 8; const wobY = Math.cos(t * 0.002) * 8
        const base = prev || targetPos.current
        return { x: base.x + (targetPos.current.x - base.x) * 0.1 + wobX * 0.1, y: base.y + (targetPos.current.y - base.y) * 0.1 + wobY * 0.1 }
      })
      const pruned = trailRef.current.filter(p => t - p.t < TRAIL_MAX_AGE)
      if (pruned.length !== trailRef.current.length || pruned.length > 0) {
        trailRef.current = pruned; setTrail([...pruned])
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    targetPos.current = { x, y }
    springX.set(x); springY.set(y)
    trailRef.current.push({ x, y, t: Date.now(), w: FIXED_BRUSH_WIDTH })
    
    if (trailRef.current.length > 120) trailRef.current.shift()
  }, [springX, springY])

  return (
    <div
      ref={containerRef} onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); targetPos.current = null; }}
      className={`pointer-events-auto ${className}`} style={{ cursor: isHovering ? 'none' : 'default' }}
    >
      {isHovering && (
        <motion.div className="absolute pointer-events-none z-30" style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ 
              width: 44, height: 44, borderRadius: '45%', 
              border: `1px dashed ${theme === 'navy' ? '#E5997B66' : '#03003566'}`
            }} />
        </motion.div>
      )}

      <svg width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id={`gooey-${uId}`}><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" /></filter>
          
          <g id={`trail-lines-${uId}`} filter={`url(#gooey-${uId})`}>
            {trail.slice(0, -1).map((pt, i) => {
              const ageFrac = Math.max(0, Math.min(1, (Date.now() - pt.t) / TRAIL_MAX_AGE))
              let widthFrac = 1.0
              
              if (ageFrac < 0.05) {
                widthFrac = 0.05 + (ageFrac / 0.05) * 0.95
              } else if (ageFrac > 0.4) {
                const shrink = Math.max(0, 1 - ((ageFrac - 0.4) / 0.6))
                const brokenEffect = Math.sin(pt.t * 0.05) * 0.6 + 0.4
                widthFrac = shrink * brokenEffect
              }
              
              const opacity = Math.max(0, 1 - Math.pow(ageFrac, 0.7))
              if (pt.w * widthFrac < 0.5) return null

              return (
                <line key={i} x1={pt.x} y1={pt.y} x2={trail[i + 1].x} y2={trail[i + 1].y} 
                  stroke="currentColor" strokeWidth={pt.w * widthFrac} strokeOpacity={opacity} 
                  strokeLinecap="round" strokeLinejoin="round" 
                />
              )
            })}
          </g>

          <mask id={`portal-mask-${uId}`}>
            <rect x="-5000" y="-5000" width="10000" height="10000" fill="black" />
            <use href={`#trail-lines-${uId}`} color="white" />
          </mask>
        </defs>

        <g mask={`url(#portal-mask-${uId})`}>
          <rect x="-5000" y="-5000" width="10000" height="10000" fill={theme === 'navy' ? '#030035' : '#F4F4F5'} />
          <ConstellationLayer isHovering={isHovering} cursorX={smoothPos?.x ?? -999} cursorY={smoothPos?.y ?? -999} width={size.w} height={size.h} theme={theme} />
        </g>
      </svg>
    </div>
  )
}