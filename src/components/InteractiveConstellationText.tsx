import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ─── constants ─── */
const DEFAULT_FONT_SIZE = 130
const DEFAULT_FONT_FAMILY = "'Playfair Display', serif"
const TRAIL_MAX_AGE = 2200 // Durasi ditambah agar ekor lebih panjang
const FIXED_BRUSH_WIDTH = 110

/* ─── Types ─── */
export interface TextLine { text: string; color?: string; fontStyle?: 'normal' | 'italic'; fontSize?: number; y: number }
type TrailPoint = { x: number; y: number; t: number; w: number }
type Particle = { x: number; y: number; vx: number; vy: number; r: number; tier: 0 | 1 | 2; phase: number; pulseSpeed: number }

interface InteractiveConstellationTextProps {
  lines: TextLine[]
  fontFamily?: string
  defaultFontSize?: number
  enableRGBSplit?: boolean
  className?: string
  containerClassName?: string
}

/* ─── Constellation Canvas ─── */
function ConstellationLayer({ isHovering, cursorX, cursorY, width, height }: { isHovering: boolean; cursorX: number; cursorY: number; width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ isHovering: false, cx: width / 2, cy: height / 2, opacity: 0 })

  useEffect(() => { stateRef.current = { ...stateRef.current, isHovering, cx: cursorX, cy: cursorY } }, [isHovering, cursorX, cursorY])

  const staticDots = useMemo(() => Array.from({ length: 800 }, () => ({
    x: Math.random() * width, y: Math.random() * height, r: 0.3 + Math.random() * 1.2,
    color: Math.random() < 0.5 ? '#E5997B' : '#FFFFFF', baseAlpha: 0.2 + Math.random() * 0.5,
  })), [width, height])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d', { alpha: true })
    if (!ctx || width === 0 || height === 0) return
    const W = width, H = height

    const particles: Particle[] = Array.from({ length: 45 }, (_, i) => {
      const tier = (i < 6 ? 0 : i < 20 ? 1 : 2)
      return {
        x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: tier === 0 ? 1.8 : tier === 1 ? 1.2 : 0.8, tier, phase: Math.random() * Math.PI * 2, pulseSpeed: 0.02 + Math.random() * 0.03,
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

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > 120) continue
          ctx.beginPath()
          ctx.strokeStyle = (a.tier === 0 || b.tier === 0) ? `rgba(229,153,123,${(1 - d / 120) * 0.4 * alpha})` : `rgba(255,255,255,${(1 - d / 120) * 0.12 * alpha})`
          ctx.lineWidth = 0.5
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
        }
      }

      particles.forEach(p => {
        const pAlpha = (Math.sin(t * 4 + p.phase) * 0.3 + 0.7) * alpha
        ctx.shadowBlur = p.tier === 0 ? 10 : 0
        ctx.shadowColor = '#E5997B'
        ctx.beginPath(); ctx.fillStyle = p.tier === 0 ? '#E5997B' : '#FFFFFF'
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
  }, [width, height, staticDots])

  return (
    <foreignObject x="0" y="0" width={width} height={height}>
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-full block" />
    </foreignObject>
  )
}

/* ─── Main Component ─── */
export default function InteractiveConstellationText({
  lines, fontFamily = DEFAULT_FONT_FAMILY, defaultFontSize = DEFAULT_FONT_SIZE,
  enableRGBSplit = true, className = '', containerClassName = ''
}: InteractiveConstellationTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [showEffects, setShowEffects] = useState(false)

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
      setContainerRect(containerRef.current!.getBoundingClientRect())
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
    if (!containerRect) return
    const x = e.clientX - containerRect.left
    const y = e.clientY - containerRect.top
    targetPos.current = { x, y }
    springX.set(x); springY.set(y)
    trailRef.current.push({ x, y, t: Date.now(), w: FIXED_BRUSH_WIDTH })
    
    if (trailRef.current.length > 120) trailRef.current.shift()
  }, [containerRect, springX, springY])

  const TextLayer = ({ lines, baseProps }: { lines: TextLine[], baseProps?: any }) => (
    <>
      {lines.map((line, i) => (
        <text key={i} x="50%" y={line.y} textAnchor="middle" fontFamily={fontFamily}
          fontStyle={line.fontStyle ?? 'normal'} fontSize={line.fontSize ?? defaultFontSize} fontWeight="400"
          fill={line.color ?? (i >= lines.length / 2 ? '#E5997B' : '#FFFFFF')} {...baseProps}>
          {line.text}
        </text>
      ))}
    </>
  )

  const tip = trail[trail.length - 1]

  return (
    <div
      ref={containerRef} onMouseMove={handleMouseMove}
      onMouseEnter={() => { setIsHovering(true); setShowEffects(true) }}
      onMouseLeave={() => { setIsHovering(false); targetPos.current = null; setTimeout(() => setShowEffects(false), TRAIL_MAX_AGE + 200) }}
      className={`relative w-full h-full ${containerClassName}`} style={{ cursor: isHovering ? 'none' : 'crosshair' }}
    >
      {isHovering && (
        <motion.div className="absolute pointer-events-none z-30" style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ width: 44, height: 44, borderRadius: '45%', border: '1px dashed #E5997B66' }} />
        </motion.div>
      )}

      <svg width="100%" height="100%" className={className} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="gooey"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" /></filter>
          
          <g id="trail-lines" filter="url(#gooey)">
            {trail.slice(0, -1).map((pt, i) => {
              const ageFrac = Math.max(0, Math.min(1, (Date.now() - pt.t) / TRAIL_MAX_AGE))
              let widthFrac = 1.0
              
              if (ageFrac < 0.05) {
                // Kepala: membesar cepat
                widthFrac = 0.05 + (ageFrac / 0.05) * 0.95
              } else if (ageFrac > 0.4) {
                // Ekor: mulai mengecil dengan tambahan tekstur putus-putus
                const shrink = Math.max(0, 1 - ((ageFrac - 0.4) / 0.6))
                // Fungsi gelombang untuk memecah/memutus garis
                // pt.t membuat polanya permanen di jejak tersebut
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

          <mask id="text-mask"><rect x="-5000" y="-5000" width="10000" height="10000" fill="white" /><use href="#trail-lines" color="black" /></mask>
          <mask id="const-mask"><rect x="-5000" y="-5000" width="10000" height="10000" fill="black" /><use href="#trail-lines" color="white" /></mask>
          
          {showEffects && tip && (
            <radialGradient id="fill-grad" cx={tip.x} cy={tip.y} r={tip.w * 0.75} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.05" /><stop offset="60%" stopColor="white" stopOpacity="0.4" />
              <stop offset="85%" stopColor="white" stopOpacity="0.88" /><stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
          )}
          <mask id="fill-trans"><rect x="-5000" y="-5000" width="10000" height="10000" fill={showEffects && tip ? 'url(#fill-grad)' : 'white'} /></mask>
        </defs>

        <g mask="url(#const-mask)">
          <ConstellationLayer isHovering={isHovering} cursorX={smoothPos?.x ?? -999} cursorY={smoothPos?.y ?? -999} width={size.w} height={size.h} />
        </g>

        {showEffects && enableRGBSplit && <g mask="url(#text-mask)" style={{ mixBlendMode: 'screen' }} opacity="0.45"><TextLayer lines={lines} baseProps={{ fill: 'none', stroke: "#ff3300", strokeWidth: "0.6", transform: `translate(4, -2)` }} /></g>}
        {showEffects && enableRGBSplit && <g mask="url(#text-mask)" style={{ mixBlendMode: 'screen' }} opacity="0.3"><TextLayer lines={lines} baseProps={{ fill: 'none', stroke: "#0044ff", strokeWidth: "0.6", transform: `translate(-4, 2)` }} /></g>}

        <g mask="url(#fill-trans)"><g mask="url(#text-mask)">
          <TextLayer lines={lines} />
        </g></g>
      </svg>
    </div>
  )
}