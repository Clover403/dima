import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProcessCTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { y: 30, scale: 1.1 },
          {
            y: -30, scale: 1.05, ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', end: 'bottom top', scrub: true,
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
      className="relative py-24 md:py-32 overflow-hidden border-t border-lightgray/5"
    >
      {/* ── Background photo ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="/foto/brand-nature.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/60 to-navy/90" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
        <h2 className="cta-reveal font-display text-3xl md:text-4xl lg:text-5xl text-lightgray leading-tight mb-6">
          ¿Listo para estructurar
          <span className="text-bronze italic"> su crecimiento?</span>
        </h2>
        <p className="cta-reveal font-body text-lightgray/55 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Iniciemos con un diagnóstico estructural. Cada conversación es el
          primer nodo del proceso.
        </p>
        <div className="cta-reveal flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contacto" className="btn-bronze-fill">
            Agendar Consulta
          </Link>
          <Link to="/productos" className="btn-bronze">
            Ver Productos
          </Link>
        </div>
      </div>
    </section>
  )
}