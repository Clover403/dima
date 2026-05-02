import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    name: 'Estructuración de Deuda',
    image: '/foto/brand-corporate.jpg',
    description:
      'Rediseñamos la arquitectura financiera de tu empresa para maximizar la productividad y minimizar el costo de capital.',
  },
  {
    number: '02',
    name: 'Análisis de Riesgo Crediticio',
    image: '/foto/brand-stationery.jpg',
    description:
      'Evaluación profunda basada en modelos macroeconómicos y análisis sectorial del contexto mexicano.',
  },
  {
    number: '03',
    name: 'Planeación Financiera Estratégica',
    image: '/foto/brand-nature.jpg',
    description:
      'Diseñamos roadmaps financieros alineados a tus objetivos de crecimiento a mediano y largo plazo.',
  },
]

//
// ── STEP MODEL ───────────────────────────────────────────────────────────────
//  -1  : not yet entered (or reset)
//   0  : service 1 active
//   1  : service 2 active
//   2  : service 3 active
//   3  : outro complete (image closed, free scroll allowed)
//
//  Transitions enforced by animRef:
//  while animRef.current === true → every wheel event is ignored (hard block)
//  animRef is released only by the GSAP onComplete / onReverseComplete callback
//  or by the setTimeout for service-switch (1100 ms = CSS transition duration).
//
//  This guarantees: ONE step per scroll, no matter how fast.
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_SLIDES = services.length + 3   // 6 × 100vh — room for intro + outro tail
const HEADING_FONT_FAMILY = "'Playfair Display', serif"
const HEADING_FONT_WEIGHT = '400'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function HeadingStrokeSVG({ svgRef }: { svgRef: RefObject<SVGSVGElement | null> }) {
  const lines = [
    { text: 'Acompañamiento', color: '#030035', y: 138, italic: false },
    { text: 'estratégico', color: '#E5997B', y: 276, italic: true },
  ]

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1600 340"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible' }}
      aria-label="Acompañamiento estratégico"
    >
      {lines.map((line, idx) => (
        <g key={idx}>
          <text
            x="800"
            y={line.y}
            textAnchor="middle"
            fontFamily={HEADING_FONT_FAMILY}
            fontStyle={line.italic ? 'italic' : 'normal'}
            fontSize="124"
            fontWeight={HEADING_FONT_WEIGHT}
            letterSpacing="0"
            fill="none"
            stroke={line.color}
            strokeWidth="0.9"
            data-stroke-line={idx}
          >
            {line.text}
          </text>
          <text
            x="800"
            y={line.y}
            textAnchor="middle"
            fontFamily={HEADING_FONT_FAMILY}
            fontStyle={line.italic ? 'italic' : 'normal'}
            fontSize="124"
            fontWeight={HEADING_FONT_WEIGHT}
            letterSpacing="0"
            fill={line.color}
            stroke="none"
            fillOpacity="0"
            data-fill-line={idx}
          >
            {line.text}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0)

  // ── DOM ─────────────────────────────────────────────────────────────
  const outerRef   = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const imgParRef  = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headingStrokeWrapperRef = useRef<HTMLDivElement>(null)
  const headingStrokeRef = useRef<HTMLDivElement>(null)
  const headingStrokeSvgRef = useRef<SVGSVGElement>(null)

  // ── State refs ───────────────────────────────────────────────────────
  const stepRef    = useRef(-1)    // current step
  const animRef    = useRef(false) // hard lock while animating
  const touchY     = useRef(0)
  const vantaRef   = useRef<any>(null)

  // ── GSAP action refs ─────────────────────────────────────────────────
  const outroPlayRef    = useRef<() => void>(() => {})
  const outroReverseRef = useRef<() => void>(() => {})

  // ── Vanta Birds setup ───────────────────────────────────────────────────
  useEffect(() => {
    let destroyed = false

    async function initVanta() {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js')
      if (destroyed || !outerRef.current) return

      vantaRef.current = (window as any).VANTA.BIRDS({
        el: outerRef.current,
        THREE: (window as any).THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 600.0,
        minWidth: 600.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0xF5F5F5,
        color1: 0x1a1a4e,
        color2: 0xE5997B,
        colorMode: 'lerp',
        birdSize: 1.2,
        wingSpan: 18,
        speedLimit: 3,
        separation: 35,
        alignment: 40,
        cohesion: 50,
        quantity: 4,
      })
    }

    initVanta()

    return () => {
      destroyed = true
      vantaRef.current?.destroy()
    }
  }, [])

  // ── GSAP setup ───────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!outerRef.current) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const tw   = textRef.current!
        const lbl  = tw.querySelector('p')
        const prog = tw.querySelector('.lg\\:flex')
        const btns = Array.from(tw.querySelectorAll('button'))
        const cta  = tw.querySelector('.mt-10')
        const h2   = headingRef.current!
        const strokeWrapper = headingStrokeWrapperRef.current!
        const strokeWrap = headingStrokeRef.current!
        const strokeSvg  = headingStrokeSvgRef.current!

        const strokeLines = Array.from(strokeSvg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
        const fillLines   = Array.from(strokeSvg.querySelectorAll<SVGTextElement>('[data-fill-line]'))
        const LINE_LENGTH = 2200

        strokeLines.forEach((el) => {
          el.style.strokeDasharray = `${LINE_LENGTH}`
          el.style.strokeDashoffset = `${LINE_LENGTH}`
        })

        const getHeadingMetrics = () => {
          const targetRect = h2.getBoundingClientRect()
          const headingFontPx = parseFloat(window.getComputedStyle(h2).fontSize) || 64
          const baseW = Math.max(strokeWrap.offsetWidth, 1)
          const baseH = Math.max(strokeWrap.offsetHeight, 1)
          const targetX = targetRect.left + targetRect.width / 2 - window.innerWidth / 2
          const targetY = targetRect.top + targetRect.height / 2 - window.innerHeight / 2
          const fontScale = headingFontPx / 124
          const widthScale = targetRect.width / baseW
          const heightScale = targetRect.height / baseH
          const targetScale = Math.max(
            0.35,
            Math.min(1.35, Math.min(1, fontScale, widthScale, heightScale) * 1.37)
          )
          return { targetX, targetY, targetScale }
        }

        const getHeadingShiftX = () => {
          const measured = getHeadingMetrics().targetX
          const minimumRightShift = window.innerWidth * 0.25
          return Math.max(measured, minimumRightShift)
        }

        // Initial state — everything hidden
        gsap.set(h2, { opacity: 0 })
        gsap.set(strokeWrapper, { opacity: 0 })
        gsap.set(strokeWrap, {
          x: 0,
          y: 0,
          scale: 1.22,
          transformOrigin: 'center center',
        })
        gsap.set(strokeLines, { strokeDashoffset: LINE_LENGTH, opacity: 1 })
        gsap.set(fillLines,   { fillOpacity: 0 })
        gsap.set([lbl, prog, ...btns, cta], { opacity: 0, y: 16 })
        gsap.set(imgWrapRef.current, {
          opacity: 0,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        })
        gsap.set(stickyRef.current, { gridTemplateColumns: '0fr 1fr' })

        // ── INTRO — scroll-driven ──────────────────────────────────────
        // Completely independent of the step system.
        // 0–30 %: heading alone fades up
        // 30–100%: image unfolds + items stagger in
        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top top',
            end:   'top -140%',
            scrub: 2,
            invalidateOnRefresh: true,
          },
        })
        introTl.to(strokeWrapper, {
          opacity: 1,
          duration: 0.08,
          ease: 'none',
        }, 0)
        introTl.to(strokeLines, {
          strokeDashoffset: 0,
          duration: 6.5,
          stagger: 0.45,
          ease: 'power2.inOut',
        }, 0.08)
        introTl.to(fillLines, {
          fillOpacity: 1,
          duration: 1.4,
          stagger: 0.16,
          ease: 'power2.out',
        }, 2.20)
        introTl.to(strokeLines, {
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power1.in',
        }, 2.80)
        introTl.to(strokeWrap, {
          x: () => getHeadingShiftX(),
          y: () => getHeadingMetrics().targetY,
          scale: () => getHeadingMetrics().targetScale,
          duration: 1.16,
          ease: 'power3.inOut',
        }, 3.60)
        introTl.to(stickyRef.current, {
          gridTemplateColumns: '1fr 1fr', duration: 0.70, ease: 'power3.inOut',
        }, 4.90)
        introTl.to(imgWrapRef.current, {
          opacity: 1,
          clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
          duration: 0.55, ease: 'power3.inOut',
        }, 4.90)
        introTl.to([lbl, prog, ...btns, cta], {
          opacity: 1, y: 0, duration: 0.40, stagger: 0.04, ease: 'power2.out',
        }, 5.22)
        introTl.to(h2, {
          opacity: 1,
          duration: 0.16,
          ease: 'none',
        }, 5.46)
        introTl.to(strokeWrapper, {
          opacity: 0,
          duration: 0.16,
          ease: 'none',
        }, 5.46)

        // ── OUTRO — paused GSAP timeline (NOT scroll-driven) ──────────
        // Fired programmatically from the step machine.
        // onComplete / onReverseComplete release animRef — this is the
        // ONLY way the lock is released for outro. Guarantees 1 step at a time.
        const outroTl = gsap.timeline({
          paused: true,
          onComplete:        () => { animRef.current = false },
          onReverseComplete: () => { animRef.current = false },
        })
        outroTl.to([lbl, prog, ...btns, cta], {
          opacity: 0, y: 14, duration: 0.50, stagger: 0.06, ease: 'power2.in',
        }, 0)
        outroTl.to(imgWrapRef.current, {
          opacity: 0,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          duration: 0.80, ease: 'power3.inOut',
        }, 0.25)
        outroTl.to(stickyRef.current, {
          gridTemplateColumns: '0fr 1fr', duration: 0.90, ease: 'power3.inOut',
        }, 0.25)
        outroTl.to(strokeWrapper, {
          opacity: 1,
          duration: 0.06,
          ease: 'none',
        }, 0)
        outroTl.to(h2, {
          opacity: 0,
          duration: 0.06,
          ease: 'none',
        }, 0)
        outroTl.to(strokeWrap, {
          x: 0,
          y: () => getHeadingMetrics().targetY,
          scale: () => {
            const s = getHeadingMetrics().targetScale
            return Math.min(1, Math.max(s + 0.08, s * 1.12))
          },
          duration: 0.50,
          ease: 'power2.inOut',
        }, 0.30)
        outroTl.to(strokeWrap, {
          x: 0,
          y: 0,
          scale: 1.22,
          duration: 0.42,
          ease: 'power3.inOut',
        }, 0.82)
        outroTl.to(fillLines, {
          fillOpacity: 0,
          duration: 0.36,
          stagger: 0.06,
          ease: 'power1.out',
        }, 0.78)
        outroTl.to(strokeLines, {
          opacity: 1,
          duration: 0.20,
          ease: 'none',
        }, 0.90)
        outroTl.to(strokeLines, {
          strokeDashoffset: LINE_LENGTH,
          duration: 1.45,
          stagger: 0.14,
          ease: 'power2.inOut',
        }, 0.96)
        outroTl.to(strokeWrapper, {
          opacity: 0,
          duration: 0.20,
          ease: 'power1.out',
        }, 2.12)

        outroPlayRef.current    = () => outroTl.timeScale(1).play(0)
        outroReverseRef.current = () => outroTl.timeScale(1.5).reverse()

        // ── Parallax ──────────────────────────────────────────────────
        if (imgParRef.current) {
          gsap.fromTo(imgParRef.current,
            { scale: 1.12, y: 60 },
            {
              scale: 1.0, y: -60, ease: 'none',
              scrollTrigger: {
                trigger: outerRef.current,
                start: 'top bottom', end: 'bottom top',
                scrub: 2,
              },
            }
          )
        }
      })

      mm.add('(max-width: 1023px)', () => {
        outerRef.current!.querySelectorAll('.service-row').forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 50 }, {
            opacity: 1, y: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', scrub: 1.5 },
          })
        })
      })
    }, outerRef)

    return () => ctx.revert()
  }, [])

  // ── Step machine + wheel handler ─────────────────────────────────────
  useEffect(() => {
    // Transition to a step.
    // For service steps: lock for 1100 ms (= CSS transition duration).
    // For outro step  : lock released by GSAP onComplete.
    const go = (next: number) => {
      animRef.current = true
      stepRef.current = next

      if (next >= 0 && next < services.length) {
        // Service switch — CSS transition handles visual
        setActiveIdx(next)
        setTimeout(() => { animRef.current = false }, 1100)
      } else if (next === services.length) {
        // Outro forward
        outroPlayRef.current()
        // animRef released by outroTl.onComplete
      }
    }

    // Reverse outro (step services.length → services.length - 1)
    const reverseOutro = () => {
      animRef.current = true
      stepRef.current = services.length - 1
      setActiveIdx(services.length - 1)
      outroReverseRef.current()
      // animRef released by outroTl.onReverseComplete
    }

    const onWheel = (e: WheelEvent) => {
      const outer = outerRef.current
      if (!outer) return

      const sy        = window.scrollY
      const VH        = window.innerHeight
      const secTop    = outer.getBoundingClientRect().top + sy
      const secBot    = secTop + outer.offsetHeight
      // Active zone starts just after the intro ScrollTrigger finishes
      // intro end = 'top -80%' = secTop + 0.8*VH
      const activeStart = secTop + 0.9 * VH

      // ── Truly outside section — don't touch ─────────────────────
      if (sy > secBot - VH + 50) {
        // Below section: if step was active, keep state but free scroll
        return
      }
      if (sy < secTop - 50) {
        // Above section: reset step
        if (stepRef.current !== -1) {
          stepRef.current = -1
          animRef.current = false
        }
        return
      }

      // ── In intro zone — let scroll happen naturally ──────────────
      if (sy < activeStart) {
        // If coming back up and step is set, reset
        if (e.deltaY < 0 && stepRef.current !== -1) {
          stepRef.current = -1
          animRef.current = false
        }
        return
      }

      // ── ACTIVE ZONE — intercept all wheel ───────────────────────
      // Always preventDefault here so browser never scrolls while in active zone
      e.preventDefault()

      const dir = e.deltaY > 0 ? 1 : -1

      // Outro complete: downward = free scroll (release), upward = reverse
      if (stepRef.current === services.length) {
        if (dir > 0) {
          // Let browser scroll by releasing — do nothing (no preventDefault was called above... wait we already called it)
          // We need to manually scroll the page forward
          window.scrollBy(0, VH * 0.3)
          return
        }
        // Scrolling up: reverse outro
        if (!animRef.current) reverseOutro()
        return
      }

      // Hard block while animating (service switch or outro)
      if (animRef.current) return

      // ── First entry into active zone ─────────────────────────────
      if (stepRef.current === -1) {
        if (dir > 0) go(0)
        // dir < 0: scrolling up past active zone — do nothing, let intro handle
        return
      }

      // ── Normal step advance ──────────────────────────────────────
      const next = stepRef.current + dir

      if (next < 0) {
        // Exit upward: release to intro zone
        stepRef.current = -1
        return
      }
      if (next > services.length) return // shouldn't happen

      go(next)
    }

    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      const diff = touchY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) < 40) return
      // Simulate a wheel event with the touch direction
      const fakeWheel = new WheelEvent('wheel', {
        deltaY:     diff,
        cancelable: true,
        bubbles:    true,
      })
      onWheel(fakeWheel)
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: false })

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className="relative w-full bg-lightgray"
      style={{ height: `${TOTAL_SLIDES * 100}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen grid overflow-hidden"
        style={{ gridTemplateColumns: '0fr 1fr' }}
      >
        <div
          ref={headingStrokeWrapperRef}
          className="pointer-events-none absolute inset-0 z-50 hidden lg:flex items-center justify-center"
          aria-hidden="true"
        >
          <div
            ref={headingStrokeRef}
            className="will-change-transform"
            style={{ width: 'clamp(680px, 64vw, 1160px)' }}
          >
            <HeadingStrokeSVG svgRef={headingStrokeSvgRef} />
          </div>
        </div>

        {/* ── LEFT: Image ──────────────────────────────────────────── */}
        <div className="relative h-[60vh] lg:h-full overflow-hidden">
          <div ref={imgWrapRef} className="absolute inset-0 overflow-hidden">
            <div
              ref={imgParRef}
              className="absolute inset-0 w-full h-[115%] will-change-transform"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={services[activeIdx].image}
                  src={services[activeIdx].image}
                  alt={`DIMA Finance — ${services[activeIdx].name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.04, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
                  exit={{    opacity: 0, scale: 0.985, filter: 'blur(2px)' }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>
            <div
              className="absolute inset-y-0 right-0 w-[36%] hidden lg:block"
              style={{
                clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
                background:
                  'linear-gradient(100deg, rgba(244,244,245,0) 0%, rgba(244,244,245,0.55) 55%, rgba(244,244,245,1) 100%)',
              }}
            />
          </div>
        </div>

        {/* ── RIGHT: Text ──────────────────────────────────────────── */}
        <div
          ref={textRef}
          className="flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-24 lg:py-0 text-center"
        >
          <p className="text-bronze font-body text-xs tracking-[0.3em] uppercase mb-10 service-row">
            SERVICIOS
          </p>

          {/* Heading — first in, always visible */}
          <h2
            ref={headingRef}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-navy leading-tight mb-12 service-row"
          >
            Acompañamiento<br />
            <em className="text-bronze">estratégico</em>
          </h2>

          {/* Progress dots */}
          <div className="hidden lg:flex items-center gap-3 mb-10 service-row">
            {services.map((_, i) => (
              <div
                key={i}
                className="h-px transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width:      activeIdx === i ? '2rem' : '0.75rem',
                  background: activeIdx === i ? '#E5997B' : 'rgba(3,0,53,0.15)',
                }}
              />
            ))}
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-navy/25 ml-1">
              Scroll para explorar
            </span>
          </div>

          {/* Service list */}
          <div className="space-y-0">
            {services.map((svc, i) => (
              <button
                type="button"
                key={svc.number}
                onClick={() => {
                  // Click just switches active index — no scroll, no lock
                  if (!animRef.current) {
                    setActiveIdx(i)
                    stepRef.current = i
                  }
                }}
                className="service-row group w-full py-8 border-b border-navy/10 flex gap-8 items-start text-left transition-all duration-[1100ms]"
                aria-pressed={activeIdx === i}
              >
                <span
                  className={`font-display text-4xl transition-all duration-[1100ms] shrink-0 leading-none mt-1 ${
                    activeIdx === i
                      ? 'text-bronze/30'
                      : 'text-navy/[0.06] group-hover:text-bronze/20'
                  }`}
                >
                  {svc.number}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`font-display text-xl md:text-2xl mb-2 transition-colors duration-[1100ms] ${
                        activeIdx === i
                          ? 'text-bronze'
                          : 'text-navy group-hover:text-bronze'
                      }`}
                    >
                      {svc.name}
                    </h3>
                    <div
                      className="h-px shrink-0 transition-all duration-[1100ms]"
                      style={{
                        width:      activeIdx === i ? '2rem' : '0px',
                        background: '#E5997B',
                        opacity:    activeIdx === i ? 1 : 0,
                      }}
                    />
                  </div>
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight:  activeIdx === i ? '6rem' : '0px',
                      opacity:    activeIdx === i ? 1 : 0,
                      transition: 'max-height 1100ms cubic-bezier(0.22,1,0.36,1), opacity 1100ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                  >
                    <p className="font-body text-base text-navy/50 leading-relaxed pt-1">
                      {svc.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 service-row">
            <Link to="/servicios" className="btn-bronze">
              EXPLORAR SERVICIOS
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}