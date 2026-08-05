import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Engraving-style diamond/hourglass figure with:
 * — Layered counter-rotation at different speeds (CSS keyframes, no restart on hover)
 * — Hover: 3D tilt via Framer Motion, brightness pop, glow on ticks
 * — draw-path class preserved for parent GSAP stroke-draw timeline
 */
export default function DiamondGeometricSVG({
  className = '',
  stroke = '#E5997B',
}: {
  className?: string
  stroke?: string
}) {
  const [hovered, setHovered] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // ── 3D TILT ON HOVER ──────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), { stiffness: 80, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 80, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return
    const { left, top, width, height } = wrapRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width - 0.5)
    mouseY.set((e.clientY - top)  / height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }
  // ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/*
       * CSS keyframe strategy:
       * — Rotation is defined once, never interrupted → no jump on hover
       * — Speed is baked into each class independently
       * — Hover state only adds glow / scale on top via separate properties
       * — `animation-play-state` is NOT toggled, so timing is preserved
       */}
      <style>{`
        @keyframes dg-cw   { to { transform: rotate(360deg);  } }
        @keyframes dg-ccw  { to { transform: rotate(-360deg); } }
        @keyframes dg-pulse {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.55; }
        }

        /* Layer 1 — Outer diamond: slow CW */
        .dg-outer {
          transform-origin: 300px 300px;
          animation: dg-cw 28s linear infinite;
          transition: filter 0.6s ease;
        }
        /* Layer 2 — Inner diamond: faster CCW */
        .dg-inner {
          transform-origin: 300px 300px;
          animation: dg-ccw 16s linear infinite;
          transition: filter 0.6s ease;
        }
        /* Layer 3 — Cross lines: very slow CCW */
        .dg-cross {
          transform-origin: 300px 300px;
          animation: dg-ccw 55s linear infinite;
        }
        /* Layer 4 — Hourglass triangles: medium CW */
        .dg-hourglass {
          transform-origin: 300px 300px;
          animation: dg-cw 20s linear infinite;
          transition: filter 0.6s ease;
        }
        /* Layer 5 — Concentric circles: breathe only, no rotation */
        .dg-circles {
          animation: dg-pulse 4s ease-in-out infinite;
          transition: opacity 0.4s;
        }
        /* Layer 6 — Corner ticks: fixed (HUD crosshair feel) */
        .dg-ticks {
          transition: filter 0.5s ease, opacity 0.5s ease;
        }

        /* ── HOVER STATE ── */
        .dg-wrap-hovered .dg-outer {
          filter: drop-shadow(0 0 6px var(--dg-stroke));
        }
        .dg-wrap-hovered .dg-inner {
          filter: drop-shadow(0 0 4px var(--dg-stroke));
        }
        .dg-wrap-hovered .dg-hourglass {
          filter: drop-shadow(0 0 3px var(--dg-stroke));
        }
        .dg-wrap-hovered .dg-ticks {
          filter: drop-shadow(0 0 6px var(--dg-stroke)) brightness(1.6);
          opacity: 1;
        }
        .dg-wrap-hovered .dg-circles {
          opacity: 0.7;
        }
      `}</style>

      {/* 3D perspective wrapper */}
      <div
        ref={wrapRef}
        className={`${className} ${hovered ? 'dg-wrap-hovered' : ''}`}
        style={{
          perspective: 900,
          // CSS custom prop consumed by hover glow rules above
          ['--dg-stroke' as string]: stroke,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
      >
        <motion.div
          style={{
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* ── Layer 6: Ticks (static — HUD crosshair) ── */}
            <g className="dg-ticks" opacity="0.6">
              <path className="draw-path" d="M300 30 L300 60"  stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
              <path className="draw-path" d="M300 540 L300 570" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
              <path className="draw-path" d="M30 300 L60 300"  stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
              <path className="draw-path" d="M540 300 L570 300" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* ── Layer 5: Circles (breathe) ── */}
            <g className="dg-circles">
              <circle className="draw-path" cx="300" cy="300" r="180" stroke={stroke} strokeWidth="0.4" strokeOpacity="0.45" />
              <circle className="draw-path" cx="300" cy="300" r="90"  stroke={stroke} strokeWidth="0.4" strokeOpacity="0.45" />
            </g>

            {/* ── Layer 3: Cross (very slow CCW) ── */}
            <g className="dg-cross">
              <path className="draw-path" d="M40 300 L560 300"  stroke={stroke} strokeWidth="0.5" strokeOpacity="0.4" />
              <path className="draw-path" d="M300 40 L300 560"  stroke={stroke} strokeWidth="0.5" strokeOpacity="0.4" />
            </g>

            {/* ── Layer 4: Hourglass triangles (medium CW) ── */}
            <g className="dg-hourglass">
              <path className="draw-path" d="M180 180 L420 180 L300 300 Z" stroke={stroke} strokeWidth="0.7" strokeOpacity="0.6" />
              <path className="draw-path" d="M180 420 L420 420 L300 300 Z" stroke={stroke} strokeWidth="0.7" strokeOpacity="0.6" />
            </g>

            {/* ── Layer 2: Inner diamond (faster CCW) ── */}
            <g className="dg-inner">
              <path
                className="draw-path"
                d="M300 120 L480 300 L300 480 L120 300 Z"
                stroke={stroke}
                strokeWidth="0.9"
                strokeOpacity="0.75"
              />
            </g>

            {/* ── Layer 1: Outer diamond (slow CW) — rendered last = on top ── */}
            <g className="dg-outer">
              <path
                className="draw-path"
                d="M300 40 L560 300 L300 560 L40 300 Z"
                stroke={stroke}
                strokeWidth="1.2"
              />
            </g>
          </svg>
        </motion.div>
      </div>
    </>
  )
}