import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Premium Engraving-style classical facade with columns — institutional, formal.
 * Hover effect: Blueprint Illumination — strokes glow orange, shadow blazes, scale subtle.
 */
export default function ArchitecturalColumnSVG({
  className = '',
  stroke = '#E5997B',
}: {
  className?: string
  stroke?: string
}) {
  const columnXs = [90, 170, 250, 330, 410]
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const pendingCursorRef = useRef<{ x: number; y: number } | null>(null)
  const frameRequestedRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  // Konfigurasi animasi draw (initial entrance)
  const drawAnim: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (customDelay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2, bounce: 0, delay: customDelay * 0.05 },
        opacity: { duration: 0.1, delay: customDelay * 0.05 }
      }
    })
  }

  let animIndex = 0
  const getIndex = () => animIndex++

  const getGlow = (x: number, y: number, radius: number) => {
    if (!cursor) return 0
    const dx = cursor.x - x
    const dy = cursor.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const normalized = Math.max(0, 1 - distance / radius)
    return normalized * normalized
  }

  const glowFilter = (glow: number) => (glow > 0.08 ? 'drop-shadow(0 0 6px rgba(229,153,123,0.75)) drop-shadow(0 0 16px rgba(229,153,123,0.35))' : 'none')

  // Warna stroke tetap statis; efek hanya muncul di area dekat cursor
  const activeStroke = stroke
  const dimStroke = stroke

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 500
    const y = ((event.clientY - rect.top) / rect.height) * 550
    pendingCursorRef.current = { x, y }

    if (!frameRequestedRef.current) {
      frameRequestedRef.current = true
      rafRef.current = requestAnimationFrame(() => {
        frameRequestedRef.current = false
        if (pendingCursorRef.current) {
          setCursor(pendingCursorRef.current)
        }
      })
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <motion.svg
      className={`${className} cursor-pointer pointer-events-auto`}
      viewBox="0 0 500 550"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        pendingCursorRef.current = null
        setCursor(null)
      }}
    >
      {/* ── 1. Background Wall Hatching ── */}
      {[...Array(15)].map((_, i) => (
        <motion.path
          key={`bg-${i}`}
          d={`M40 ${220 + i * 14} L460 ${220 + i * 14}`}
          stroke={dimStroke}
          strokeWidth="0.3"
          animate={{
            strokeOpacity: 0.3 + getGlow(250, 220 + i * 14, 150) * 0.55,
            strokeWidth: 0.3 + getGlow(250, 220 + i * 14, 150) * 0.35,
            stroke: dimStroke,
            filter: glowFilter(getGlow(250, 220 + i * 14, 150)),
          }}
          transition={{ duration: 0.4, delay: i * 0.01 }}
          variants={drawAnim}
          custom={getIndex()}
        />
      ))}

      {/* ── 2. Pediment ── */}
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M30 150 L250 25 L470 150 Z"
        stroke={activeStroke} strokeWidth="1.5"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.5 + getGlow(250, 110, 160) * 0.5,
          filter: glowFilter(getGlow(250, 110, 160)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M40 150 L250 35 L460 150"
        stroke={activeStroke} strokeWidth="1"
        animate={{ stroke: activeStroke }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M60 145 L250 45 L440 145 Z"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{ stroke: activeStroke }}
        transition={{ duration: 0.3 }}
      />

      {[...Array(12)].map((_, i) => (
        <motion.path
          key={`tym-${i}`}
          d={`M${100 + i * 12} 145 L250 ${65 + i * 6} L${400 - i * 12} 145`}
          stroke={dimStroke}
          strokeWidth="0.4"
          animate={{
            strokeOpacity: 0.6 + getGlow(250, 145, 150) * 0.25,
            strokeWidth: 0.4 + getGlow(250, 145, 150) * 0.15,
            stroke: dimStroke,
            filter: glowFilter(getGlow(250, 145, 150)),
          }}
          transition={{ duration: 0.3, delay: i * 0.015 }}
          variants={drawAnim}
          custom={getIndex()}
        />
      ))}

      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M250 25 L250 10 M240 15 L250 5 L260 15"
        stroke={activeStroke} strokeWidth="1.5"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.5 + getGlow(250, 20, 120) * 0.8,
          filter: glowFilter(getGlow(250, 20, 120)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M30 150 L20 140 L30 135 M470 150 L480 140 L470 135"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{ stroke: activeStroke }}
        transition={{ duration: 0.3 }}
      />

      {/* ── 3. Entablature ── */}
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M35 150 L465 150 L465 158 L35 158 Z"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.2 + getGlow(250, 154, 130) * 0.45,
          filter: glowFilter(getGlow(250, 154, 130)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M40 162 L460 162"
        stroke={activeStroke} strokeWidth="2.5"
        strokeDasharray="4 4"
        animate={{
          stroke: activeStroke,
          strokeWidth: 2.5 + getGlow(250, 162, 125) * 0.6,
          filter: glowFilter(getGlow(250, 162, 125)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M45 166 L455 166 L455 186 L45 186 Z"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.2 + getGlow(250, 176, 130) * 0.35,
          filter: glowFilter(getGlow(250, 176, 130)),
        }}
        transition={{ duration: 0.3 }}
      />

      {[50, 130, 210, 290, 370, 440].map((x, i) => (
        <g key={`tri-${i}`}>
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x} 166 L${x} 186 M${x + 4} 166 L${x + 4} 186 M${x + 8} 166 L${x + 8} 186`}
            stroke={activeStroke} strokeWidth="0.8"
            animate={{
              stroke: activeStroke,
              strokeWidth: 0.8 + getGlow(x + 4, 176, 95) * 0.45,
              filter: glowFilter(getGlow(x + 4, 176, 95)),
            }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          />
          {i < 5 && (
            <motion.circle
              variants={drawAnim} custom={getIndex()}
              cx={x + 40} cy="176" r="4"
              stroke={activeStroke} strokeWidth="0.8"
              animate={{
                stroke: activeStroke,
                r: 4 + getGlow(x + 40, 176, 85) * 0.8,
                strokeWidth: 0.8 + getGlow(x + 40, 176, 85) * 0.45,
                filter: glowFilter(getGlow(x + 40, 176, 85)),
              }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            />
          )}
        </g>
      ))}

      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M45 186 L455 186 L455 200 L45 200 Z"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.2 + getGlow(250, 193, 125) * 0.35,
          filter: glowFilter(getGlow(250, 193, 125)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M45 190 L455 190 M45 195 L455 195"
        stroke={dimStroke} strokeWidth="0.5"
        animate={{
          strokeOpacity: 0.6 + getGlow(250, 193, 125) * 0.3,
          strokeWidth: 0.5 + getGlow(250, 193, 125) * 0.2,
          stroke: dimStroke,
          filter: glowFilter(getGlow(250, 193, 125)),
        }}
        transition={{ duration: 0.3 }}
      />

      {/* ── 4. Columns ── */}
      {columnXs.map((x, i) => (
        <g key={`col-${i}`}>
          {/* Capital top */}
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x - 22} 200 L${x + 22} 200 L${x + 18} 210 L${x - 18} 210 Z`}
            stroke={activeStroke} strokeWidth="1"
            animate={{
              stroke: activeStroke,
              strokeWidth: 1 + getGlow(x, 205, 90) * 0.5,
              filter: glowFilter(getGlow(x, 205, 90)),
            }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          />
          <motion.circle
            variants={drawAnim} custom={getIndex()}
            cx={x - 18} cy="210" r="4.5"
            stroke={activeStroke} strokeWidth="1.2"
            animate={{
              stroke: activeStroke,
              r: 4.5 + getGlow(x - 18, 210, 85) * 0.9,
              strokeWidth: 1.2 + getGlow(x - 18, 210, 85) * 0.5,
              filter: glowFilter(getGlow(x - 18, 210, 85)),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.04 }}
          />
          <motion.circle
            variants={drawAnim} custom={getIndex()}
            cx={x + 18} cy="210" r="4.5"
            stroke={activeStroke} strokeWidth="1.2"
            animate={{
              stroke: activeStroke,
              r: 4.5 + getGlow(x + 18, 210, 85) * 0.9,
              strokeWidth: 1.2 + getGlow(x + 18, 210, 85) * 0.5,
              filter: glowFilter(getGlow(x + 18, 210, 85)),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.04 }}
          />
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x - 14} 210 L${x + 14} 210 M${x - 12} 214 L${x + 12} 214`}
            stroke={activeStroke} strokeWidth="0.8"
            animate={{
              stroke: activeStroke,
              strokeWidth: 0.8 + getGlow(x, 212, 80) * 0.45,
              filter: glowFilter(getGlow(x, 212, 80)),
            }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          />

          {/* Column shaft */}
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x - 15} 215 L${x - 16} 420`}
            stroke={activeStroke} strokeWidth="1.2"
            animate={{
              stroke: activeStroke,
              strokeWidth: 1.2 + getGlow(x - 16, 318, 115) * 0.55,
              filter: glowFilter(getGlow(x - 16, 318, 115)),
            }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x + 15} 215 L${x + 16} 420`}
            stroke={activeStroke} strokeWidth="1.2"
            animate={{
              stroke: activeStroke,
              strokeWidth: 1.2 + getGlow(x + 16, 318, 115) * 0.55,
              filter: glowFilter(getGlow(x + 16, 318, 115)),
            }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />

          {/* Flutes */}
          {[-10, -5, 0, 5, 10].map((offset) => (
            <motion.path
              key={`flute-${offset}`}
              d={`M${x + offset} 215 L${x + (offset * 1.05)} 420`}
              stroke={dimStroke}
              strokeWidth="0.5"
              animate={{
                strokeOpacity: 0.6 + getGlow(x + offset, 318, 105) * 0.25,
                strokeWidth: 0.5 + getGlow(x + offset, 318, 105) * 0.3,
                stroke: dimStroke,
                filter: glowFilter(getGlow(x + offset, 318, 105)),
              }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              variants={drawAnim}
              custom={getIndex()}
            />
          ))}

          {/* Base */}
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x - 18} 420 L${x + 18} 420 L${x + 22} 428 L${x - 22} 428 Z`}
            stroke={activeStroke} strokeWidth="1.2"
            animate={{
              stroke: activeStroke,
              strokeWidth: 1.2 + getGlow(x, 424, 95) * 0.5,
              filter: glowFilter(getGlow(x, 424, 95)),
            }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          />
          <motion.path
            variants={drawAnim} custom={getIndex()}
            d={`M${x - 24} 428 L${x + 24} 428 L${x + 24} 435 L${x - 24} 435 Z`}
            stroke={activeStroke} strokeWidth="1.2"
            animate={{
              stroke: activeStroke,
              strokeWidth: 1.2 + getGlow(x, 431, 95) * 0.5,
              filter: glowFilter(getGlow(x, 431, 95)),
            }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          />
        </g>
      ))}

      {/* ── 5. Stylobate ── */}
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M35 435 L465 435 L465 450 L35 450 Z"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.2 + getGlow(250, 442, 120) * 0.45,
          filter: glowFilter(getGlow(250, 442, 120)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M25 450 L475 450 L475 465 L25 465 Z"
        stroke={activeStroke} strokeWidth="1.2"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.2 + getGlow(250, 458, 120) * 0.45,
          filter: glowFilter(getGlow(250, 458, 120)),
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        variants={drawAnim} custom={getIndex()}
        d="M10 465 L490 465 L490 485 L10 485 Z"
        stroke={activeStroke} strokeWidth="1.5"
        animate={{
          stroke: activeStroke,
          strokeWidth: 1.5 + getGlow(250, 475, 120) * 0.6,
          filter: glowFilter(getGlow(250, 475, 120)),
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Step hatching */}
      {[...Array(30)].map((_, i) => (
        <motion.path
          key={`step1-${i}`}
          variants={drawAnim} custom={getIndex()}
          d={`M${35 + i * 14.5} 435 L${35 + i * 14.5} 450`}
          stroke={dimStroke} strokeWidth="0.4"
          animate={{
            strokeOpacity: 0.4 + getGlow(35 + i * 14.5, 442, 85) * 0.25,
            strokeWidth: 0.4 + getGlow(35 + i * 14.5, 442, 85) * 0.25,
            stroke: dimStroke,
            filter: glowFilter(getGlow(35 + i * 14.5, 442, 85)),
          }}
          transition={{ duration: 0.3, delay: i * 0.005 }}
        />
      ))}
      {[...Array(32)].map((_, i) => (
        <motion.path
          key={`step2-${i}`}
          variants={drawAnim} custom={getIndex()}
          d={`M${25 + i * 14.5} 450 L${25 + i * 14.5} 465`}
          stroke={dimStroke} strokeWidth="0.4"
          animate={{
            strokeOpacity: 0.4 + getGlow(25 + i * 14.5, 458, 85) * 0.25,
            strokeWidth: 0.4 + getGlow(25 + i * 14.5, 458, 85) * 0.25,
            stroke: dimStroke,
            filter: glowFilter(getGlow(25 + i * 14.5, 458, 85)),
          }}
          transition={{ duration: 0.3, delay: i * 0.005 }}
        />
      ))}
      {[...Array(34)].map((_, i) => (
        <motion.path
          key={`step3-${i}`}
          variants={drawAnim} custom={getIndex()}
          d={`M${10 + i * 14.5} 465 L${10 + i * 14.5} 485`}
          stroke={dimStroke} strokeWidth="0.4"
          animate={{
            strokeOpacity: 0.4 + getGlow(10 + i * 14.5, 475, 85) * 0.25,
            strokeWidth: 0.4 + getGlow(10 + i * 14.5, 475, 85) * 0.25,
            stroke: dimStroke,
            filter: glowFilter(getGlow(10 + i * 14.5, 475, 85)),
          }}
          transition={{ duration: 0.3, delay: i * 0.005 }}
        />
      ))}
    </motion.svg>
  )
}