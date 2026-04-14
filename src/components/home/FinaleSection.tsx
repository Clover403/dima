import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const counters = [
  { target: 500, suffix: 'M', prefix: '+', label: 'Capital estructurado (MXN)' },
  { target: 150, suffix: '', prefix: '+', label: 'Empresas fortalecidas' },
  { target: 98, suffix: '%', prefix: '', label: 'Tasa de cumplimiento' },
  { target: 360, suffix: '°', prefix: '', label: 'Visión integral de riesgo' },
]

function AnimatedCounter({
  target,
  suffix,
  prefix,
  label,
}: {
  target: number
  suffix: string
  prefix: string
  label: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix
          },
        })
      },
    })

    return () => st.kill()
  }, [target, suffix, prefix])

  return (
    <div className="text-center px-4">
      <span
        ref={ref}
        className="font-display text-6xl md:text-7xl lg:text-8xl text-navy block mb-4"
      >
        {prefix}0{suffix}
      </span>
      <div className="w-12 h-px bg-bronze/40 mx-auto mb-4" />
      <p className="font-body text-sm md:text-base text-navy/50 tracking-wide">{label}</p>
    </div>
  )
}

export default function FinaleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex flex-col">
      {/* TOP HALF — Counters on gray */}
      <div className="flex-1 bg-lightgray flex items-center py-24 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            {counters.map((c, i) => (
              <AnimatedCounter key={i} {...c} />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM HALF — CTA on bronze gradient */}
      <div className="bg-lightgray px-8 md:px-16 lg:px-24 py-16">
        <div
          ref={ctaRef}
          className="relative overflow-hidden bg-gradient-to-br from-bronze to-bronze px-8 md:px-16 lg:px-24 py-20 md:py-28"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="xMidYMid slice">
              <path d="M400 0L800 200L400 400L0 200Z" stroke="#030035" strokeWidth="1" />
              <path d="M400 50L750 200L400 350L50 200Z" stroke="#030035" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-tight mb-6">
              ¿Listo para estructurar tu crecimiento?
            </h2>
            <p className="font-body text-navy/70 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Conversemos sobre cómo la ingeniería financiera puede transformar
              la estructura de tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/corporativo-dimafinance/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-navy text-white font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-navy/80"
              >
                AGENDA UNA VIDEOLLAMADA
              </a>
              <Link
                to="/contacto"
                className="inline-block px-8 py-4 border border-navy text-navy font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-navy hover:text-white"
              >
                CONTÁCTANOS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
