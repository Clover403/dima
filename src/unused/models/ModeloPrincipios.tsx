import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    num: '01',
    quote: 'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.',
    subtitle: 'Causalidad Productiva',
    explanation: 'El crédito se considera legítimo únicamente cuando la productividad futura generada es suficiente para amortizar el pasivo de forma independiente.',
  },
  {
    num: '02',
    quote: 'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tiempo perderás competitividad.',
    subtitle: 'Eficiencia Operativa',
    explanation: 'El modelo evalúa la Productividad del Capital más allá del crecimiento nominal de ingresos. Un aumento de ingresos derivado únicamente de indexación de precios erosionan la competitividad.',
  },
  {
    num: '03',
    quote: 'Haz todo lo posible por aumentar tu productividad, porque, a largo plazo, eso es lo que más importa.',
    subtitle: 'Financiamiento "Tractor"',
    explanation: 'La asignación de recursos se canaliza hacia la productividad — activos que optimizan procesos — y no hacia consumo improductivo.',
  },
]

// ── HEADING CON STROKE ───────────────────────────────────────────────────
function HeadingStroke() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = svgRef.current
    const strokeTspans = Array.from(svg.querySelectorAll<SVGTSpanElement>('[data-stroke]'))
    const fillTspans   = Array.from(svg.querySelectorAll<SVGTSpanElement>('[data-fill]'))

    const lengths = strokeTspans.map(el => {
      let len = el.getComputedTextLength()
      if (!len || len < 10) len = 400
      el.style.strokeDasharray  = `${len}`
      el.style.strokeDashoffset = `${len}`
      return len
    })

    gsap.set(strokeTspans, { strokeDashoffset: (i) => lengths[i] })
    gsap.set(fillTspans,   { fillOpacity: 0 })

    const tl = gsap.timeline({ paused: true })
    tl
      .to(strokeTspans, { strokeDashoffset: 0, duration: 1.4, stagger: 0.2, ease: 'power2.inOut' }, 0)
      .to(fillTspans,   { fillOpacity: 1,      duration: 0.7, stagger: 0.1, ease: 'power2.out' },   1.1)

    ScrollTrigger.create({
      trigger: svg,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play reverse play reverse',
      onToggle: (self) => {
        if (self.isActive) tl.play()
        else tl.reverse()
      },
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.2 }}>
      <svg
        ref={svgRef}
        width="100%"
        height="auto"
        viewBox="0 0 900 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <text
          x="0" y="1em"
          textAnchor="start"
          fontSize="1em"
          fontWeight="400"
          fontFamily="'Playfair Display', serif"
          fill="none"
          stroke="none"
        >
          <tspan data-stroke fill="none" stroke="#FFFFFF" strokeWidth="0.02em" fillOpacity="0">
            Tres principios,{' '}
          </tspan>
          <tspan data-stroke fill="none" stroke="#E5997B" strokeWidth="0.02em" fontStyle="italic" fillOpacity="0">
            una arquitectura
          </tspan>
        </text>
        <text
          x="0" y="1em"
          textAnchor="start"
          fontSize="1em"
          fontWeight="400"
          fontFamily="'Playfair Display', serif"
          fill="none"
          stroke="none"
        >
          <tspan data-fill fill="#FFFFFF" fillOpacity="0">Tres principios,{' '}</tspan>
          <tspan data-fill fill="#E5997B" fontStyle="italic" fillOpacity="0">una arquitectura</tspan>
        </text>
      </svg>
    </div>
  )
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────
export default function ModeloPrincipios() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)
  const wrapRef     = useRef<HTMLDivElement>(null)
  const dotRefs     = useRef<(HTMLDivElement | null)[]>([])
  const innerRefs   = useRef<(HTMLDivElement | null)[]>([])
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)

  // ── MOUSE PARALLAX HOOKS ────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25, mass: 0.5 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25, mass: 0.5 })

  // Depth 1 — Canvas BG (paling belakang, gerak berlawanan)
  const blobX = useTransform(smoothX, [-0.5, 0.5], [15, -15])
  const blobY = useTransform(smoothY, [-0.5, 0.5], [15, -15])

  // Depth 2 — Heading (lambat)
  const headX = useTransform(smoothX, [-0.5, 0.5], [-8, 8])
  const headY = useTransform(smoothY, [-0.5, 0.5], [-8, 8])

  // Depth 3 — Principles wrap (sedang)
  const wrapX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const wrapY = useTransform(smoothY, [-0.5, 0.5], [-14, 14])

  // Depth 4 — CTA (paling depan, paling cepat)
  const ctaX = useTransform(smoothX, [-0.5, 0.5], [-22, 22])
  const ctaY = useTransform(smoothY, [-0.5, 0.5], [-22, 22])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    mouseX.set((e.clientX / window.innerWidth)  - 0.5)
    mouseY.set((e.clientY / window.innerHeight) - 0.5)
  }
  // ───────────────────────────────────────────────────────────────────

  // ── CANVAS TRIANGLE GRID (sama persis seperti AboutStatsSection) ──
  useLayoutEffect(() => {
    const bgCanvas = bgCanvasRef.current
    if (!bgCanvas) return

    const drawBackground = () => {
      bgCanvas.width  = bgCanvas.offsetWidth
      bgCanvas.height = bgCanvas.offsetHeight
      const ctx2d = bgCanvas.getContext('2d')
      if (!ctx2d) return

      const cols = 28
      const rows = 18
      const cX   = bgCanvas.width  / cols
      const cY   = bgCanvas.height / rows
      let seed    = 42
      const rand  = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }

      const pts: [number, number][][] = []
      for (let r = 0; r <= rows; r++) {
        pts[r] = []
        for (let c = 0; c <= cols; c++) {
          pts[r][c] = [
            c * cX + ((c === 0 || c === cols) ? 0 : (rand() - 0.5) * cX * 0.40),
            r * cY + ((r === 0 || r === rows) ? 0 : (rand() - 0.5) * cY * 0.40),
          ]
        }
      }

      const triangles: [number, number][][] = []
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          triangles.push([pts[r][c], pts[r][c + 1], pts[r + 1][c]])
          triangles.push([pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]])
        }

      ctx2d.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
      ctx2d.fillStyle = '#030035'
      ctx2d.fillRect(0, 0, bgCanvas.width, bgCanvas.height)

      triangles.forEach((tri) => {
        const cx    = (tri[0][0] + tri[1][0] + tri[2][0]) / 3
        const cy    = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
        const shade = 0.92 + Math.random() * 0.08
        ctx2d.save()
        ctx2d.translate(cx, cy)
        ctx2d.scale(0.97, 0.97)
        ctx2d.translate(-cx, -cy)
        ctx2d.beginPath()
        ctx2d.moveTo(tri[0][0], tri[0][1])
        ctx2d.lineTo(tri[1][0], tri[1][1])
        ctx2d.lineTo(tri[2][0], tri[2][1])
        ctx2d.closePath()
        ctx2d.fillStyle = `rgb(${Math.round(3 * shade)},0,${Math.round(53 * shade)})`
        ctx2d.fill()
        ctx2d.strokeStyle = 'rgba(0,0,10,0.65)'
        ctx2d.lineWidth   = 0.7
        ctx2d.stroke()
        ctx2d.restore()
      })
    }

    drawBackground()
    window.addEventListener('resize', drawBackground)
    return () => window.removeEventListener('resize', drawBackground)
  }, [])
  // ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!sectionRef.current || !wrapRef.current || !lineRef.current) return

    const ctx = gsap.context(() => {
      const wrap   = wrapRef.current!
      const line   = lineRef.current!
      const blocks = Array.from(sectionRef.current!.querySelectorAll<HTMLElement>('.principle'))

      // Content reveal per block
      innerRefs.current.forEach((inner) => {
        if (!inner) return
        gsap.from(inner, {
          y: 48, opacity: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: inner, start: 'top 82%' },
        })
      })

      // Line draw + dot sync
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top 20%',
        end: 'bottom 80%',
        scrub: 2,
        onUpdate: (self) => {
          const prog  = self.progress
          const wrapH = wrap.offsetHeight
          const lineH = wrapH * prog
          line.style.transform = `scaleY(${prog})`

          dotRefs.current.forEach((dot, i) => {
            if (!dot) return
            const block     = blocks[i]
            const dotOffset = block.offsetTop + 8
            const reached   = lineH >= dotOffset
            const inner     = dot.querySelector<HTMLElement>('.dot-inner')

            if (reached) {
              dot.style.background  = '#E5997B'
              dot.style.borderColor = '#E5997B'
              dot.style.transform   = 'scale(1.25)'
              dot.style.boxShadow   = '0 0 20px rgba(229,153,123,0.6)'
              if (inner) inner.style.background = '#030035'
            } else {
              dot.style.background  = '#030035'
              dot.style.borderColor = 'rgba(255,255,255,0.2)'
              dot.style.transform   = 'scale(1)'
              dot.style.boxShadow   = 'none'
              if (inner) inner.style.background = 'rgba(255,255,255,0.2)'
            }
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#030035] overflow-hidden py-32 md:py-56 px-6 lg:px-24"
    >
      {/* ── Depth 1: Triangle Grid Canvas BG ── */}
      <motion.div
        style={{ x: blobX, y: blobY }}
        className="absolute inset-[-5%] pointer-events-none z-0"
      >
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.9 }}
        />
      </motion.div>

      {/* ── Depth 2: Heading ── */}
      <motion.div
        style={{ x: headX, y: headY }}
        className="max-w-7xl mx-auto mb-32 relative z-10"
      >
        <HeadingStroke />
      </motion.div>

      {/* ── Depth 3: Principles wrap ── */}
      {/* NOTE: motion.div wraps a plain div (wrapRef) supaya GSAP refs-nya tetap stabil */}
      <motion.div style={{ x: wrapX, y: wrapY }} className="relative z-10">
        <div ref={wrapRef} className="principles-wrap relative max-w-6xl mx-auto">

          {/* Vertical line track */}
          <div className="absolute left-[15px] md:left-[40px] top-0 bottom-0 w-[2px] bg-white/10">
            <div
              ref={lineRef}
              className="absolute top-0 left-0 w-full h-full bg-bronze"
              style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
            />
          </div>

          <div className="space-y-48">
            {principles.map((p, i) => (
              <div key={i} className="principle relative pl-16 md:pl-24">

                {/* Dot */}
                <div className="absolute left-[-11px] md:left-[14px] top-2 z-20">
                  <div
                    ref={(el) => { dotRefs.current[i] = el }}
                    className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                    style={{
                      background:  '#030035',
                      borderColor: 'rgba(255,255,255,0.2)',
                      transition:  'background 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                    }}
                  >
                    <div
                      className="dot-inner w-1.5 h-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div
                  ref={(el) => { innerRefs.current[i] = el }}
                  className="content-inner grid lg:grid-cols-[1fr_2fr] gap-8"
                >
                  <div className="relative">
                    <span className="font-display text-8xl text-white/[0.03] leading-none absolute -top-10 -left-10 select-none">
                      {p.num}
                    </span>
                    <p className="relative z-10 text-bronze font-body text-xs tracking-[0.4em] uppercase font-bold pt-4">
                      {p.subtitle}
                    </p>
                  </div>

                  <div className="max-w-2xl">
                    <blockquote className="font-display text-2xl md:text-4xl text-white/90 leading-tight mb-8 italic">
                      "{p.quote}"
                    </blockquote>
                    <p className="font-body text-white/30 text-base md:text-lg leading-relaxed font-light">
                      {p.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Depth 4: CTA (paling depan) ── */}
      <motion.div style={{ x: ctaX, y: ctaY }} className="relative z-10">
        <PremiumCTA />
      </motion.div>
    </section>
  )
}

// ── Premium CTA ──────────────────────────────────────────────────────────
function PremiumCTA() {
  const cardRef   = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const { left, top } = cardRef.current.getBoundingClientRect()
    setCoords({ x: e.clientX - left, y: e.clientY - top })

    if (buttonRef.current) {
      const btn  = buttonRef.current.getBoundingClientRect()
      const btnX = e.clientX - (btn.left + btn.width  / 2)
      const btnY = e.clientY - (btn.top  + btn.height / 2)
      const dist = Math.sqrt(btnX * btnX + btnY * btnY)

      if (dist < 150) {
        gsap.to(buttonRef.current, { x: btnX * 0.35, y: btnY * 0.35, duration: 0.4, ease: 'power2.out' })
      } else {
        gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-48 mb-20 px-6">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.6 })}
        className="group relative overflow-hidden rounded-[2rem] border border-navy/10 bg-[#F4F4F5] transition-all duration-500 hover:border-navy/40"
      >
        {/* Spotlight radial */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(59,130,246,0.15), transparent 50%)` }}
        />

        {/* Abstract flowing lines */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[60%] flex items-center justify-end opacity-[0.22] group-hover:opacity-[0.42] transition-opacity duration-700 z-[1]">
          <svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[520px] h-auto">
            <path d="M -20 380 C 80 320, 160 80, 300 60 C 420 42, 480 180, 580 140" stroke="#030035" strokeWidth="1.2" strokeOpacity="0.7" fill="none"/>
            <path d="M -20 340 C 100 290, 180 100, 320 85 C 440 68, 490 200, 580 165" stroke="#030035" strokeWidth="0.6" strokeOpacity="0.4" fill="none"/>
            <path d="M -20 300 C 120 260, 200 120, 340 110 C 460 95, 500 220, 580 190" stroke="#030035" strokeWidth="0.3" strokeOpacity="0.25" fill="none"/>
            <path d="M -20 40 C 80 100, 200 340, 340 350 C 460 358, 510 240, 580 280" stroke="#030035" strokeWidth="1" strokeOpacity="0.6" fill="none"/>
            <path d="M -20 70 C 100 120, 210 340, 350 352 C 470 362, 515 250, 580 295" stroke="#030035" strokeWidth="0.5" strokeOpacity="0.35" fill="none"/>
            <path d="M -20 100 C 110 140, 220 340, 360 354 C 480 364, 520 260, 580 310" stroke="#030035" strokeWidth="0.25" strokeOpacity="0.2" fill="none"/>
            <path d="M -20 210 C 140 210, 200 80, 340 200 C 460 300, 500 160, 580 210" stroke="#030035" strokeWidth="1.4" strokeOpacity="0.8" fill="none"/>
            <path d="M -20 225 C 140 225, 200 95, 340 215 C 460 315, 500 175, 580 225" stroke="#030035" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
            <path d="M 60 420 C 120 340, 240 120, 380 80 C 480 50, 530 160, 580 120" stroke="#E5997B" strokeWidth="1.5" strokeOpacity="0.9" fill="none"/>
            <path d="M 80 420 C 140 350, 250 130, 390 90 C 490 60, 535 170, 580 130" stroke="#E5997B" strokeWidth="0.6" strokeOpacity="0.5" fill="none"/>
            <path d="M 40 0 C 100 80, 220 300, 360 330 C 470 352, 520 230, 580 265" stroke="#E5997B" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
            <path d="M 60 0 C 115 85, 230 305, 370 335 C 478 356, 524 236, 580 272" stroke="#E5997B" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>
            {[0, 6, 12, 18, 24].map((offset) => (
              <path key={offset} d={`M -20 ${195 + offset} C 140 ${195 + offset}, 200 ${65 + offset}, 340 ${185 + offset} C 460 ${285 + offset}, 500 ${145 + offset}, 580 ${195 + offset}`} stroke="#030035" strokeWidth="0.2" strokeOpacity="0.15" fill="none"/>
            ))}
          </svg>
        </div>

        <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl md:text-4xl text-navy leading-tight mb-3">
              Ready to architect{' '}
              <span className="text-bronze italic">growth?</span>
            </h3>
            <p className="text-navy/40 font-body text-[10px] tracking-[0.35em] uppercase">
              Request structural diagnostics
            </p>
          </div>
          <button
            ref={buttonRef}
            className="group/btn relative px-8 py-4 bg-bronze text-navy font-black text-[10px] uppercase tracking-[0.25em] overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(3,0,53,0.2)] flex-shrink-0"
          >
            <span className="relative z-10">Request Diagnostics</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-bronze/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 z-10" />
      </div>
    </div>
  )
}