import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const statements = [
  {
    quote: 'No reaccionamos al mercado — lo anticipamos',
    subtext:
      'Nuestros servicios se fundamentan en la comprensión de ciclos económicos, no en tendencias pasajeras.',
  },
  {
    quote: 'Ingeniería, no intuición',
    subtext:
      'Cada recomendación se respalda con modelos matemáticos y análisis cuantitativo riguroso.',
  },
  {
    quote: 'Arquitectos de su estructura financiera',
    subtext:
      'No ofrecemos soluciones genéricas — diseñamos a medida para su realidad operativa y ciclo de negocio.',
  },
  {
    quote: 'Visión de largo plazo, acción inmediata',
    subtext:
      'Sincronizamos decisiones estratégicas con la ejecución operativa para resultados medibles.',
  },
]

export default function ServiciosValues() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)

  // ── Vanta Birds init ──────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || !(window as any).VANTA) return

    vantaRef.current = (window as any).VANTA.BIRDS({
      el: sectionRef.current,
      THREE: (window as any).THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 600.0,
      minWidth: 600.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0xF5F5F5,   // lightgray (sama dengan bg section)
      color1: 0x1a1a4e,              // navy soft
      color2: 0xE5997B,              // bronze
      colorMode: 'lerp',
      birdSize: 1.5,
      wingSpan: 20,
      speedLimit: 2.5,
      separation: 8,
      alignment: 80,
      cohesion: 80,
      quantity: 4,                   // 2^3 = 8 burung
    })

    return () => {
      vantaRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!
      const statementsEls = el.querySelectorAll('.value-statement')
      const dots = el.querySelectorAll('.progress-dot')
      const lines = el.querySelectorAll('.bronze-divider')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          pinSpacing: true,
        },
      })

      /* First statement is visible by default */
      statementsEls.forEach((statement, i) => {
        if (i === 0) return

        /* Fade out current */
        tl.to(statementsEls[i - 1], {
          opacity: 0,
          y: -40,
          duration: 0.4,
        })

        /* Activate dot */
        if (dots[i]) {
          tl.to(dots[i], { scale: 1.5, backgroundColor: '#E5997B', duration: 0.1 }, '<')
          tl.to(dots[i - 1], { scale: 1, backgroundColor: 'rgba(229,153,123,0.3)', duration: 0.1 }, '<')
        }

        /* Animate bronze line between */
        if (lines[i - 1]) {
          tl.fromTo(
            lines[i - 1],
            { scaleX: 0 },
            { scaleX: 1, duration: 0.2, ease: 'power2.out' },
            '<'
          )
        }

        /* Fade in next */
        tl.fromTo(
          statement,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.15'
        )

        /* Hold */
        tl.to({}, { duration: 0.3 })
      })

      /* Section heading reveal */
      const heading = el.querySelector('.section-heading')
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-lightgray min-h-screen flex items-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Vanta Birds canvas akan render di background */}
      
      {/* Content di atas canvas */}
      <div className="relative z-10 section-padding w-full">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="section-heading text-center mb-16 md:mb-24">
            <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-4">
              ¿Por qué nuestros servicios?
            </p>
            <div className="w-12 h-px bg-bronze mx-auto" />
          </div>

          {/* Statements container */}
          <div className="relative min-h-[280px] md:min-h-[320px] flex items-center justify-center">
            {statements.map((s, i) => (
              <div
                key={i}
                className={`value-statement absolute inset-0 flex flex-col items-center justify-center text-center will-change-transform ${
                  i === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <h3 className="font-display text-3xl md:text-5xl lg:text-6xl text-navy leading-tight mb-8 max-w-4xl">
                  &ldquo;{s.quote}&rdquo;
                </h3>
                <p className="font-body text-navy text-base md:text-lg max-w-2xl leading-relaxed">
                  {s.subtext}
                </p>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-3 mt-16">
            {statements.map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`progress-dot w-2.5 h-2.5 rounded-full transition-colors will-change-transform ${
                    i === 0 ? 'bg-bronze scale-150' : 'bg-bronze/30'
                  }`}
                />
                {i < statements.length - 1 && (
                  <div className="bronze-divider w-8 md:w-12 h-px bg-bronze origin-left scale-x-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-20 pointer-events-none hidden lg:block z-10"
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-12 h-12 opacity-10">
          <path d="M30 5L55 30L30 55L5 30Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-32 left-16 pointer-events-none hidden lg:block z-10"
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 opacity-10">
          <path d="M20 2L38 20L20 38L2 20Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </section>
  )
}