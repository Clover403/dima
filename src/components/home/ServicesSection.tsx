import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    name: 'Estructuración de Deuda',
    image: '/foto/brand-nature.jpg',
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
    image: '/foto/illust-buildings.jpg',
    description:
      'Diseñamos roadmaps financieros alineados a tus objetivos de crecimiento a mediano y largo plazo.',
  },
]

const SCROLL_PER_SLIDE = 100 // vh per slide

export default function ServicesSection() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)

  const outerRef         = useRef<HTMLDivElement>(null)
  const stickyRef        = useRef<HTMLDivElement>(null)
  const imageWrapRef     = useRef<HTMLDivElement>(null)
  const imageParallaxRef = useRef<HTMLDivElement>(null)
  const textWrapRef      = useRef<HTMLDivElement>(null)
  const activeIndexRef   = useRef(0)
  const isLockedRef        = useRef(false)
  const exitIntentRef      = useRef(false)
  const exitIntentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const touchStartYRef     = useRef(0)

  const setActive = (i: number) => {
    activeIndexRef.current = i
    setActiveServiceIndex(i)
  }

  useEffect(() => {
    const getSlideHeight = () => (SCROLL_PER_SLIDE / 100) * window.innerHeight

    const getZoneBounds = () => {
      const outer = outerRef.current
      if (!outer) return null
      const top = outer.offsetTop
      const height = outer.offsetHeight
      return { top, bottom: top + height }
    }

    // Smooth snap for intentional slide change
    const snapToSlide = (idx: number) => {
      const outer = outerRef.current
      if (!outer) return
      const target = outer.offsetTop + idx * getSlideHeight()
      window.scrollTo({ top: target, behavior: 'smooth' })
    }

    // ── Scroll jail — safety net ──────────────────────────────────────────
    // If native scroll fires and moves us off the correct position while locked,
    // we immediately force it back.
    const handleScroll = () => {
      if (!isLockedRef.current) return
      const bounds = getZoneBounds()
      if (!bounds) return
      const scrollY = window.scrollY
      if (scrollY < bounds.top || scrollY > bounds.bottom - window.innerHeight) return

      // We're in zone and locked — force back to current active slide
      const target = outerRef.current!.offsetTop + activeIndexRef.current * getSlideHeight()
      if (Math.abs(scrollY - target) > 3) {
        window.scrollTo({ top: target })
      }
    }

    // ── Wheel handler ─────────────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      const bounds = getZoneBounds()
      if (!bounds) return
      const scrollY = window.scrollY

      // Not in sticky zone at all — let through
      if (scrollY < bounds.top - 10 || scrollY > bounds.bottom - window.innerHeight + 10) return

      // Always block native scroll while in zone
      e.preventDefault()
      if (isLockedRef.current) return

      const dir = e.deltaY > 0 ? 1 : -1
      const next = activeIndexRef.current + dir

      if (next < 0 || next >= services.length) {
        // At boundary — hold position, start exit intent timer
        if (!exitIntentRef.current) {
          exitIntentRef.current = true
          if (exitIntentTimerRef.current) clearTimeout(exitIntentTimerRef.current)
          exitIntentTimerRef.current = setTimeout(() => {
            exitIntentRef.current = false
            // Quietly release lock so next scroll goes through naturally
          }, 700)
        }
        return
      }

      // Cancel exit intent if scrolling back inside
      if (exitIntentTimerRef.current) clearTimeout(exitIntentTimerRef.current)
      exitIntentRef.current = false

      isLockedRef.current = true
      setActive(next)
      snapToSlide(next)
      setTimeout(() => { isLockedRef.current = false }, 1400)
    }

    // ── Touch ─────────────────────────────────────────────────────────────
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const bounds = getZoneBounds()
      if (!bounds) return
      const scrollY = window.scrollY
      if (scrollY < bounds.top - 10 || scrollY > bounds.bottom - window.innerHeight + 10) return

      const diff = touchStartYRef.current - e.changedTouches[0].clientY
      if (Math.abs(diff) < 40) return

      const dir = diff > 0 ? 1 : -1
      const next = activeIndexRef.current + dir
      if (next < 0 || next >= services.length) return
      if (isLockedRef.current) return

      isLockedRef.current = true
      setActive(next)
      const outer = outerRef.current!
      window.scrollTo({ top: outer.offsetTop + next * getSlideHeight(), behavior: 'smooth' })
      setTimeout(() => { isLockedRef.current = false }, 1400)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      if (exitIntentTimerRef.current) clearTimeout(exitIntentTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!outerRef.current) return

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        // ── Intro clip reveal ────────────────────────────────────────────
        gsap.set(imageWrapRef.current, {
          opacity: 0,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        })
        gsap.set(stickyRef.current, { gridTemplateColumns: '0fr 1fr' })

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.2,
          },
        })
        introTl.to(stickyRef.current, {
          gridTemplateColumns: '1fr 1fr',
          duration: 1.2,
          ease: 'power3.inOut',
        })
        introTl.to(imageWrapRef.current, {
          opacity: 1,
          clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
          duration: 1.2,
          ease: 'power3.inOut',
        }, 0)
        introTl.to(textWrapRef.current, {
          duration: 0.6,
          ease: 'power2.out',
          onStart: () => {
            textWrapRef.current?.classList.remove('text-center')
            textWrapRef.current?.classList.add('text-left')
          },
        }, 0.2)

        // ── Parallax ──────────────────────────────────────────────────────
        if (imageParallaxRef.current) {
          gsap.fromTo(imageParallaxRef.current,
            { scale: 1.12, y: 60 },
            {
              scale: 1.0, y: -60, ease: 'none',
              scrollTrigger: {
                trigger: outerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          )
        }
      })

      mm.add('(max-width: 1023px)', () => {
        outerRef.current!.querySelectorAll('.service-row').forEach((item) => {
          gsap.fromTo(item,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 1, ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 88%', scrub: 1 },
            }
          )
        })
      })
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={outerRef}
      className="relative w-full bg-lightgray"
      style={{ height: `${services.length * SCROLL_PER_SLIDE}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
        style={{ gridTemplateColumns: '0fr 1fr' }}
      >

        {/* ── LEFT: Image ──────────────────────────────────────────────── */}
        <div className="relative h-[60vh] lg:h-full overflow-hidden">
          <div ref={imageWrapRef} className="absolute inset-0 overflow-hidden">
            <div
              ref={imageParallaxRef}
              className="absolute inset-0 w-full h-[115%] will-change-transform"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={services[activeServiceIndex].image}
                  src={services[activeServiceIndex].image}
                  alt={`DIMA Finance — ${services[activeServiceIndex].name}`}
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

        {/* ── RIGHT: Text ──────────────────────────────────────────────── */}
        <div
          ref={textWrapRef}
          className="flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-24 lg:py-0 text-center"
        >
          <p className="text-bronze font-body text-xs tracking-[0.3em] uppercase mb-10 service-row">
            SERVICIOS
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-navy leading-tight mb-12 service-row">
            Acompañamiento{' '}
            <em className="text-bronze">estratégico</em>
          </h2>

          {/* Progress indicators */}
          <div className="hidden lg:flex items-center gap-3 mb-10 service-row">
            {services.map((_, i) => (
              <div
                key={i}
                className="h-px transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: activeServiceIndex === i ? '2rem' : '0.75rem',
                  background: activeServiceIndex === i ? '#E5997B' : 'rgba(3,0,53,0.15)',
                }}
              />
            ))}
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-navy/25 ml-1">
              Scroll para explorar
            </span>
          </div>

          <div className="space-y-0">
            {services.map((service, index) => (
              <button
                type="button"
                key={service.number}
                onClick={() => {
                  if (isLockedRef.current) return
                  isLockedRef.current = true
                  setActive(index)
                  const outer = outerRef.current
                  if (outer) {
                    const sh = (SCROLL_PER_SLIDE / 100) * window.innerHeight
                    window.scrollTo({ top: outer.offsetTop + index * sh, behavior: 'smooth' })
                  }
                  setTimeout(() => { isLockedRef.current = false }, 1400)
                }}
                className="service-row group w-full py-8 border-b border-navy/10 flex gap-8 items-start text-left transition-all duration-[1100ms]"
                aria-pressed={activeServiceIndex === index}
              >
                <span
                  className={`font-display text-4xl transition-all duration-[1100ms] shrink-0 leading-none mt-1 ${
                    activeServiceIndex === index
                      ? 'text-bronze/30'
                      : 'text-navy/[0.06] group-hover:text-bronze/20'
                  }`}
                >
                  {service.number}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`font-display text-xl md:text-2xl mb-2 transition-colors duration-[1100ms] ${
                        activeServiceIndex === index
                          ? 'text-bronze'
                          : 'text-navy group-hover:text-bronze'
                      }`}
                    >
                      {service.name}
                    </h3>
                    <div
                      className="h-px shrink-0 transition-all duration-[1100ms]"
                      style={{
                        width: activeServiceIndex === index ? '2rem' : '0px',
                        background: '#E5997B',
                        opacity: activeServiceIndex === index ? 1 : 0,
                      }}
                    />
                  </div>
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: activeServiceIndex === index ? '6rem' : '0px',
                      opacity: activeServiceIndex === index ? 1 : 0,
                      transition: 'max-height 1100ms cubic-bezier(0.22,1,0.36,1), opacity 1100ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                  >
                    <p className="font-body text-lg md:text-base text-navy/50 leading-relaxed pt-1">
                      {service.description}
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