import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProductosCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { y: 0, scale: 1.1 },
          {
            y: -60, scale: 1.05, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      }

      gsap.fromTo(el.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 75%' },
        }
      )

      const geo = el.querySelector('.geo-float')
      if (geo) gsap.to(geo, { y: -10, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy"  /* ← bg-navy prevents any gap */
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="/foto/brand-corporate.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/60 to-navy/90" />
      </div>

      {/* Geometric decoration */}
      <div className="geo-float absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <svg viewBox="0 0 600 600" fill="none" className="w-[500px] h-[500px] opacity-[0.03]">
          <path d="M300 50L550 300L300 550L50 300Z" stroke="#E5997B" strokeWidth="1"/>
          <path d="M300 140L460 300L300 460L140 300Z" stroke="#E5997B" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Content — no extra bottom padding so it sits flush with footer */}
      <div className="relative z-10 section-padding text-center max-w-3xl mx-auto py-24 md:py-32">
        <h2 className="reveal font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          ¿Cuál es la solución
          <br />
          <span className="text-bronze italic">para su empresa?</span>
        </h2>
        <p className="reveal font-body text-white/50 text-lg leading-relaxed max-w-xl mx-auto mb-12">
          Nuestro equipo de ingeniería financiera diseñará la estructura
          crediticia óptima para su empresa.
        </p>
        <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contacto" className="btn-bronze-fill">
            Agendar Consulta
          </Link>
          <Link to="/modelo-crediticio" className="btn-bronze">
            Conocer Nuestro Modelo
          </Link>
        </div>
      </div>
    </section>
  )
}