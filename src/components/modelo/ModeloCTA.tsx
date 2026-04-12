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
    <section ref={sectionRef} className="relative isolate bg-navy py-32 md:py-48 section-padding overflow-hidden">
      {/* 1. Base Image */}
      <img
        src="/foto/brand-corporate.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* 2. Navy Overlay - Ini yang memberikan warna navy di atas foto */}
      <div className="absolute inset-0 bg-navy/85 z-0" />

      {/* 3. Content - Menggunakan z-10 agar berada di atas overlay */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <h2 className="reveal font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          ¿Listo para estructurar
          <br />
          <span className="text-bronze italic">su crecimiento?</span>
        </h2>

        <p className="reveal font-body text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-12">
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

      {/* Optional: Geometric background element if needed */}
      <div className="geo-bg absolute -bottom-20 -right-20 w-96 h-96 bg-bronze/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}