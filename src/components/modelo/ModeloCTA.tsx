import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Text + buttons reveal */
      gsap.fromTo(
        el.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      /* Geometric background — gentle continuous float */
      const geo = el.querySelector('.geo-bg')
      if (geo) {
        gsap.to(geo, {
          y: -12,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-navy py-32 md:py-48 section-padding relative overflow-hidden">
      {/* Geometric background decoration */}
      <div className="geo-bg absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <svg
          viewBox="0 0 600 600"
          fill="none"
          className="w-[500px] h-[500px] opacity-[0.03]"
        >
          <path d="M300 50L550 300L300 550L50 300Z" stroke="#E5997B" strokeWidth="1" />
          <path d="M300 120L480 300L300 480L120 300Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M300 190L410 300L300 410L190 300Z" stroke="#E5997B" strokeWidth="0.5" />
          {/* DIMA logo shapes */}
          <path d="M220 180L300 180L300 210L260 260L220 210Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M300 180L380 180L380 210L340 260L300 210Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M220 420L300 420L300 390L260 340L220 390Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M300 420L380 420L380 390L340 340L300 390Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="reveal font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          ¿Listo para estructurar
          <br />
          <span className="text-bronze italic">su crecimiento?</span>
        </h2>

        <p className="reveal font-body text-white/50 text-lg leading-relaxed max-w-xl mx-auto mb-12">
          Descubra cómo nuestro modelo puede transformar la deuda en un motor
          de productividad para su empresa.
        </p>

        <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
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
