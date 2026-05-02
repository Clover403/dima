import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ─── constants ─── */
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?|[]{}ÑÁÉÍÓÚñáéíóú<>∆∞'
const DEFAULT_VIEWBOX = '0 0 800 440'
const DEFAULT_FONT_SIZE = 130
const DEFAULT_FONT_FAMILY = "'Playfair Display', serif"

/* ─── hooks ─── */
function useScrambleText(original: string, _cursorXNorm: number | null, _active: boolean) {
  // Scramble dinonaktifkan — trail effect sudah cukup, scramble menyebabkan bug visual
  return original
}

function ScrambledTextElement({
  line, index, linesCount, xNorm, isHovering, enableScramble,
  x, fontFamily, defaultFontSize,
}: {
  line: TextLine; index: number; linesCount: number
  xNorm: number | null; isHovering: boolean; enableScramble: boolean
  x: number; fontFamily: string; defaultFontSize: number
}) {
  const scrambled = useScrambleText(line.text, xNorm, isHovering && enableScramble)
  return (
    <text
      key={`fill-${index}`}
      x={x}
      y={line.y}
      textAnchor="middle"
      fontFamily={fontFamily}
      fontStyle={line.fontStyle ?? 'normal'}
      fontSize={line.fontSize ?? defaultFontSize}
      fontWeight="400"
      fill={line.color ?? (index >= linesCount / 2 ? '#E5997B' : '#FFFFFF')}
      fillOpacity="1"
    >
      {scrambled}
    </text>
  )
}

function useWobble() {
  const [time, setTime] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setTime(Date.now()); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return { x: Math.sin(time * 0.002) * 8, y: Math.cos(time * 0.002) * 8 }
}

/* ─── Trail ─── */
type TrailPoint = {
  x: number
  y: number
  t: number   // timestamp ms
  w: number   // stroke width (pressure-sensitive)
}
const TRAIL_MAX_AGE = 3200 // ms — lebih lama

/* ─── Constellation Canvas ─── */
type Particle = {
  x: number; y: number
  vx: number; vy: number
  r: number; tier: 0 | 1 | 2
  phase: number; pulseSpeed: number
}

function ConstellationLayer({
  isHovering,
  cursorX,
  cursorY,
  width,
  height,
}: {
  isHovering: boolean
  cursorX: number
  cursorY: number
  width: number
  height: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ isHovering: false, cx: width / 2, cy: height / 2, opacity: 0 })

  useEffect(() => { stateRef.current.isHovering = isHovering }, [isHovering])
  useEffect(() => { stateRef.current.cx = cursorX; stateRef.current.cy = cursorY }, [cursorX, cursorY])

  const staticDots = useMemo(() => {
    const arr = []
    for (let i = 0; i < 800; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.3 + Math.random() * 1.2,
        color: Math.random() < 0.5 ? '#E5997B' : '#FFFFFF',
        baseAlpha: 0.2 + Math.random() * 0.5,
      })
    }
    return arr
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    const W = width, H = height

    const particles: Particle[] = Array.from({ length: 45 }, (_, i) => {
      const tier = (i < 6 ? 0 : i < 20 ? 1 : 2) as 0 | 1 | 2
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: tier === 0 ? 1.8 : tier === 1 ? 1.2 : 0.8,
        tier, phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      }
    })

    let t = 0, raf = 0
    const draw = () => {
      t += 0.016
      const { isHovering: hov, cx, cy } = stateRef.current
      stateRef.current.opacity = hov
        ? Math.min(1, stateRef.current.opacity + 0.06)
        : Math.max(0, stateRef.current.opacity - 0.015)
      const alpha = stateRef.current.opacity
      ctx.clearRect(0, 0, W, H)
      if (alpha <= 0) { raf = requestAnimationFrame(draw); return }

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (hov) {
          const dx = cx - p.x, dy = cy - p.y
          const dist = Math.hypot(dx, dy)
          if (dist < 180 && dist > 0) {
            const force = (180 - dist) / 180
            p.x -= (dx / dist) * force * 1.5
            p.y -= (dy / dist) * force * 1.5
          }
        }
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        p.x = Math.max(0, Math.min(W, p.x))
        p.y = Math.max(0, Math.min(H, p.y))
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > 120) continue
          ctx.beginPath()
          const bright = a.tier === 0 || b.tier === 0
          ctx.strokeStyle = bright
            ? `rgba(229,153,123,${(1 - d / 120) * 0.4 * alpha})`
            : `rgba(255,255,255,${(1 - d / 120) * 0.12 * alpha})`
          ctx.lineWidth = 0.5
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          if (a.tier === 0 && hov && Math.random() > 0.992) {
            const fp = ((t * 2) % 1)
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(a.x + (b.x - a.x) * fp, a.y + (b.y - a.y) * fp, 1.3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      particles.forEach(p => {
        const pulse = Math.sin(t * 4 + p.phase) * 0.3 + 0.7
        const pAlpha = pulse * alpha
        ctx.shadowBlur = p.tier === 0 ? 10 : 0
        ctx.shadowColor = '#E5997B'
        if (p.tier === 0) {
          const s = Math.sin(t * 4 + p.phase) * 2 + 6
          ctx.strokeStyle = `rgba(229,153,123,${pAlpha * 0.5})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s)
          ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y)
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.fillStyle = p.tier === 0 ? '#E5997B' : '#FFFFFF'
        ctx.globalAlpha = pAlpha
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      })

      staticDots.forEach(dot => {
        ctx.beginPath()
        ctx.fillStyle = dot.color
        ctx.globalAlpha = alpha * dot.baseAlpha
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [width, height, staticDots])

  return (
    <foreignObject x="0" y="0" width={width} height={height}>
      <div style={{ width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} width={width} height={height}
          style={{ display: 'block' }} />
      </div>
    </foreignObject>
  )
}

/* ─── Blob circles ─── */
const defaultBlobOffsets = [
  { cx: 0,    cy: 0,    r: 95  },
  { cx: 30,   cy: -25,  r: 65  },
  { cx: -36,  cy: 18,   r: 55  },
  { cx: 12,   cy: 36,   r: 68  },
  { cx: -25,  cy: -33,  r: 42  },
  { cx: 49,   cy: 8,    r: 48  },
  { cx: -55,  cy: 12,   r: 36  },
  { cx: 18,   cy: -49,  r: 39  },
  { cx: -42,  cy: -14,  r: 31  },
  { cx: 39,   cy: -38,  r: 46  },
  { cx: -65,  cy: -8,   r: 27  },
  { cx: 62,   cy: -21,  r: 34  },
]

/* ─── Main Component ─── */
export interface TextLine {
  text: string
  color?: string
  fontStyle?: 'normal' | 'italic'
  fontSize?: number
  y: number
}

interface InteractiveConstellationTextProps {
  lines: TextLine[]
  viewBox?: string
  fontFamily?: string
  defaultFontSize?: number
  enableScramble?: boolean
  enableRGBSplit?: boolean
  enableStrokeGlow?: boolean
  className?: string
  containerClassName?: string
  blobOffsets?: Array<{ cx: number; cy: number; r: number }>
}

export default function InteractiveConstellationText({
  lines,
  viewBox = DEFAULT_VIEWBOX,
  fontFamily = DEFAULT_FONT_FAMILY,
  defaultFontSize = DEFAULT_FONT_SIZE,
  enableScramble = true,
  enableRGBSplit = true,
  enableStrokeGlow = true,
  className = '',
  containerClassName = '',
  blobOffsets = defaultBlobOffsets,
}: InteractiveConstellationTextProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null)
  const [smoothPos, setSmoothPos] = useState<{ x: number; y: number } | null>(null)
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [showEffects, setShowEffects] = useState(false)

  // Trail brush — ref untuk performa, state untuk trigger render
  const trailRef = useRef<TrailPoint[]>([])
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const [trail, setTrail] = useState<TrailPoint[]>([])

  const springX = useMotionValue(0)
  const springY = useMotionValue(0)
  const sx = useSpring(springX, { stiffness: 200, damping: 22 })
  const sy = useSpring(springY, { stiffness: 200, damping: 22 })

  const [viewBoxW, viewBoxH] = viewBox.split(' ').slice(2).map(Number)

  // ─── Bulir pinggiran blob — pertengahan: cukup untuk terlihat, tidak flooding teks
  const textBorderDots = useMemo(() => {
    const dots: Array<{ dx: number; dy: number; r: number; color: string; opacity: number; layer: number }> = []

    // Lapisan utama — dot medium di ring 82–105px (tepat di seam blob r≈95)
    for (let i = 0; i < 950; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 82 + Math.random() * 23
      dots.push({
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        r: 0.5 + Math.random() * 1.3,
        color: Math.random() < 0.45 ? '#E5997B' : '#FFFFFF',
        opacity: 0.5 + Math.random() * 0.4,
        layer: 0,
      })
    }

    // Ekor luar — fade ke fill text, 105–122px
    for (let i = 0; i < 280; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 105 + Math.random() * 17
      dots.push({
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        r: 0.4 + Math.random() * 0.9,
        color: Math.random() < 0.4 ? '#E5997B' : '#FFFFFF',
        opacity: 0.25 + Math.random() * 0.3,
        layer: 1,
      })
    }

    return dots
  }, [])

  // Smooth cursor
  useEffect(() => {
    if (!targetPos) { setSmoothPos(null); return }
    let raf: number
    const run = () => {
      setSmoothPos(prev => {
        if (!prev) return targetPos
        return { x: prev.x + (targetPos.x - prev.x) * 0.1, y: prev.y + (targetPos.y - prev.y) * 0.1 }
      })
      raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [targetPos])

  // Trail rolling fade — prune titik tua, trigger re-render
  useEffect(() => {
    let raf: number
    const tick = () => {
      const now = Date.now()
      const pruned = trailRef.current.filter(p => now - p.t < TRAIL_MAX_AGE)
      trailRef.current = pruned
      setTrail([...pruned])
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerRect(containerRef.current.getBoundingClientRect())
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRect) return
    const x = ((e.clientX - containerRect.left) / containerRect.width) * viewBoxW
    const y = ((e.clientY - containerRect.top) / containerRect.height) * viewBoxH
    setTargetPos({ x, y })
    springX.set(e.clientX - containerRect.left)
    springY.set(e.clientY - containerRect.top)

    // Width tetap (tidak pressure-sensitive), aging di trailSegments yang handle shrink
    const FIXED_BRUSH_WIDTH = 110
    lastPosRef.current = { x, y }

    trailRef.current.push({ x, y, t: Date.now(), w: FIXED_BRUSH_WIDTH })
    // Batasi jumlah titik agar tidak overflow
    if (trailRef.current.length > 150) trailRef.current.shift()
  }, [containerRect, viewBoxW, viewBoxH, springX, springY])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    setShowEffects(true)
    if (ghostTimeout.current) clearTimeout(ghostTimeout.current)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setTargetPos(null)
    lastPosRef.current = null
    // Biarkan showEffects hidup sampai trail selesai fade (TRAIL_MAX_AGE + buffer)
    ghostTimeout.current = setTimeout(() => setShowEffects(false), TRAIL_MAX_AGE + 200)
  }, [])

  useEffect(() => () => {
    if (ghostTimeout.current) clearTimeout(ghostTimeout.current)
  }, [])

  const { x: wobX, y: wobY } = useWobble()
  const cx = (smoothPos?.x ?? -999) + wobX
  const cy = (smoothPos?.y ?? -999) + wobY

  // xNorm dari targetPos (hanya update saat mouse gerak), bukan smoothPos (update tiap RAF)
  // Ini yang fix scramble bug — smoothPos terus berubah tiap frame → scramble restart terus
  const xNorm = isHovering && targetPos ? targetPos.x / viewBoxW : null

  // Trail segments untuk mask — menggantikan blobCircles
  // Rolling fade: tua → pudar duluan (Opsi B)
  // Pressure-sensitive: w dihitung dari kecepatan saat mousemove
  const trailSegments = (fill: string) => {
    if (trail.length < 2) return null
    const now = Date.now()
    return (
      <>
        {trail.slice(0, -1).map((pt, i) => {
          const next = trail[i + 1]
          const age = now - pt.t
          const ageFrac = Math.max(0, Math.min(1, age / TRAIL_MAX_AGE))

          // Rolling fade — tua pudar duluan
          const opacity = Math.max(0, 1 - Math.pow(ageFrac, 0.5))

          // Width curve: kepala KECIL → body besar → ekor menghilang
          let widthFrac: number
          if (ageFrac < 0.04) {
            // Kepala: jarum tipis, ramp sangat cepat 2%→100%
            widthFrac = 0.02 + (ageFrac / 0.04) * 0.98
          } else if (ageFrac < 0.68) {
            // Body: penuh
            widthFrac = 1.0
          } else {
            // Ekor: shrink ke 0
            widthFrac = Math.max(0, 1 - ((ageFrac - 0.68) / 0.32))
          }

          const w = pt.w * widthFrac
          if (w < 0.5 || opacity < 0.01) return null
          return (
            <line
              key={`trail-${i}-${pt.t}`}
              x1={pt.x} y1={pt.y}
              x2={next.x} y2={next.y}
              stroke={fill}
              strokeWidth={w}
              strokeOpacity={opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        })}
      </>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${containerClassName}`}
      style={{ cursor: isHovering ? 'none' : 'crosshair' }}
    >
      {/* Custom cursor */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none z-30"
          style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 44, height: 44, borderRadius: '45%',
              border: '1px dashed #E5997B66',
            }}
          />
        </motion.div>
      )}

      {/* SVG Layer */}
      <svg ref={svgRef} viewBox={viewBox} preserveAspectRatio="xMidYMid meet"
        className={`w-full h-auto ${className}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="gooey-ict" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
          </filter>
          {enableStrokeGlow && (
            <filter id="glow-stroke-ict" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
          {/* Di dalam <defs> — ubah 3 rect ini saja */}

{/* mask text-mask-ict */}
<mask id="text-mask-ict">
  <rect x="-1000" y="-200" width={viewBoxW + 2000} height={viewBoxH + 400} fill="white" />
  <g filter="url(#gooey-ict)">{trailSegments('black')}</g>
</mask>

{/* mask const-mask-ict */}
<mask id="const-mask-ict">
  <rect x="-1000" y="-200" width={viewBoxW + 2000} height={viewBoxH + 400} fill="black" />
  <g filter="url(#gooey-ict)">{trailSegments('white')}</g>
</mask>

{/* mask fill-trans-mask-ict */}
<mask id="fill-trans-mask-ict">
  <rect
    x="-1000" y="-200" width={viewBoxW + 2000} height={viewBoxH + 400}
    fill={showEffects ? 'url(#fill-trans-grad-ict)' : 'white'}
  />
</mask>

          {/* Filter glow ringan untuk bulir pinggiran */}
          <filter id="dot-glow-ict" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="text-clip">
            {lines.map((line, i) => (
              <text
                key={`clip-${i}`}
                x={viewBoxW / 2}
                y={line.y}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontStyle={line.fontStyle ?? 'normal'}
                fontSize={line.fontSize ?? defaultFontSize}
                fontWeight="400"
                fill="white"
              >
                {line.text}
              </text>
            ))}
          </clipPath>

          {/*
            ─── FIX 2: Radial gradient untuk transisi fill → stroke ───
            Gradient dinamis terpusat di kursor:
            - Tengah blob (dalam ~70%): transparan  → filled text memudar
            - Tepi blob (70–100%): opaque            → filled text fully visible
            - Luar blob: selalu opaque               → normal fill text
            Effect: saat blob melewati teks, fill text smooth fade ke stroke+constellation
          */}
          {showEffects && trail.length > 0 && (() => {
            // Ambil lebar kuas di ujung terdepan (titik terbaru) untuk radius gradient
            const tipW = trail[trail.length - 1]?.w ?? 60
            const gradR = tipW * 0.75
            const tipX = trail[trail.length - 1]?.x ?? cx
            const tipY = trail[trail.length - 1]?.y ?? cy
            return (
              <radialGradient
                id="fill-trans-grad-ict"
                cx={tipX}
                cy={tipY}
                r={gradR}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor="white" stopOpacity="0.05" />
                <stop offset="60%"  stopColor="white" stopOpacity="0.4" />
                <stop offset="85%"  stopColor="white" stopOpacity="0.88" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </radialGradient>
            )
          })()}
          {/*
            fill-trans-mask-ict:
            - Saat showEffects=false  → semua putih → fill text terlihat penuh (normal)
            - Saat showEffects=true   → gradient di atas → fill text fade di sekitar kursor
          */}
          <mask id="fill-trans-mask-ict">
            <rect
              x="0" y="0" width={viewBoxW} height={viewBoxH}
              fill={showEffects ? 'url(#fill-trans-grad-ict)' : 'white'}
            />
          </mask>
        </defs>

        {/* LAYER 0: Constellation + bulir tengah (dalam blob) */}
        <g mask="url(#const-mask-ict)">
          <ConstellationLayer
            isHovering={isHovering}
            cursorX={smoothPos?.x ?? -999}
            cursorY={smoothPos?.y ?? -999}
            width={viewBoxW}
            height={viewBoxH}
          />
        </g>

        {/* LAYER 1: Stroke tipis glowing (ghosted, dalam blob) */}
        {showEffects && enableStrokeGlow && (
          <g mask="url(#const-mask-ict)">
            {lines.map((line, i) => (
              <text
                key={`glow-${i}`}
                x={viewBoxW / 2}
                y={line.y}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontStyle={line.fontStyle ?? 'normal'}
                fontSize={line.fontSize ?? defaultFontSize}
                fontWeight="400"
                fill="none"
                stroke={line.color ?? (i >= lines.length / 2 ? '#E5997B' : '#FFFFFF')}
                strokeWidth="1.5"
                strokeOpacity="0.95"
                filter="url(#glow-stroke-ict)"
              >
                {line.text}
              </text>
            ))}
          </g>
        )}

        {/* LAYER 2: Stroke outlines baseline — only during hover/trail activity */}
        {showEffects && lines.map((line, i) => (
          <text
            key={`stroke-${i}`}
            x={viewBoxW / 2}
            y={line.y}
            textAnchor="middle"
            fontFamily={fontFamily}
            fontStyle={line.fontStyle ?? 'normal'}
            fontSize={line.fontSize ?? defaultFontSize}
            fontWeight="400"
            fill="none"
            stroke={line.color ?? (i >= lines.length / 2 ? '#E5997B' : '#FFFFFF')}
            strokeWidth="1"
          >
            {line.text}
          </text>
        ))}

        {/* LAYER 3: RGB split RED */}
        {showEffects && enableRGBSplit && (
          <g mask="url(#text-mask-ict)" style={{ mixBlendMode: 'screen' }} opacity="0.45">
            {lines.map((line, i) => (
              <text
                key={`rgb-red-${i}`}
                x={viewBoxW / 2 + 4}
                y={line.y - 2}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontStyle={line.fontStyle ?? 'normal'}
                fontSize={line.fontSize ?? defaultFontSize}
                fontWeight="400"
                fill="none"
                stroke="#ff3300"
                strokeWidth="0.6"
              >
                {line.text}
              </text>
            ))}
          </g>
        )}

        {/* LAYER 4: RGB split BLUE */}
        {showEffects && enableRGBSplit && (
          <g mask="url(#text-mask-ict)" style={{ mixBlendMode: 'screen' }} opacity="0.3">
            {lines.map((line, i) => (
              <text
                key={`rgb-blue-${i}`}
                x={viewBoxW / 2 - 4}
                y={line.y + 2}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontStyle={line.fontStyle ?? 'normal'}
                fontSize={line.fontSize ?? defaultFontSize}
                fontWeight="400"
                fill="none"
                stroke="#0044ff"
                strokeWidth="0.6"
              >
                {line.text}
              </text>
            ))}
          </g>
        )}

        {/*
          LAYER 5: Fill teks (scrambled) — dengan transition mask
          ─────────────────────────────────────────────────────────
          Dua mask digabung:
          1. fill-trans-mask-ict  → fade fill text mendekati kursor (transisi ke stroke)
          2. text-mask-ict        → sembunyikan fill text di dalam blob (existing)
          Hasilnya: filled text smooth fade OUT saat blob mendekati → transisi halus ke stroke
        */}
        <g mask="url(#fill-trans-mask-ict)">
          <g mask="url(#text-mask-ict)">
            {lines.map((line, i) => (
              <ScrambledTextElement
                key={`fill-${i}`}
                line={line}
                index={i}
                linesCount={lines.length}
                xNorm={xNorm}
                isHovering={isHovering}
                enableScramble={enableScramble}
                x={viewBoxW / 2}
                fontFamily={fontFamily}
                defaultFontSize={defaultFontSize}
              />
            ))}
          </g>
        </g>

        {/*
          LAYER 6: BULIR PINGGIRAN — sparkle di seam kuas
          Ikut ujung terdepan trail (titik terbaru) bukan wobble cursor
        */}
        {showEffects && trail.length > 0 && (() => {
          const tip = trail[trail.length - 1]
          const tipW = tip.w
          // Sesuaikan radius ring dot dengan lebar kuas di ujung
          const ringInner = tipW * 0.88
          const ringOuter = tipW * 1.22
          return (
            <g clipPath="url(#text-clip)" pointerEvents="none" filter="url(#dot-glow-ict)">
              {textBorderDots.map((dot, idx) => {
                // Skalakan dx/dy ke radius ring kuas saat ini
                const scale = (ringInner + (dot.layer === 1 ? ringOuter - ringInner : 0)) / 82
                return (
                  <circle
                    key={`bd-${idx}`}
                    cx={tip.x + dot.dx * scale}
                    cy={tip.y + dot.dy * scale}
                    r={dot.r}
                    fill={dot.color}
                    opacity={dot.layer === 1 ? dot.opacity * 0.55 : dot.opacity}
                  />
                )
              })}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}