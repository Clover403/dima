import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ServiciosCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Background parallax */
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { y: 30, scale: 1.1 },
          {
            y: -30,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      /* Text reveals */
      const textEls = el.querySelectorAll('.cta-reveal')
      gsap.fromTo(
        textEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
          },
        }
      )

      /* Buttons delayed entrance */
      const buttons = el.querySelectorAll('.cta-button')
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          delay: 0.3,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background photo with navy overlay */}
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

      {/* Floating decorative shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-[15%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 opacity-[0.08]">
          <path d="M40 5L75 40L40 75L5 40Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M40 15L65 40L40 65L15 40Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8], rotate: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-24 right-[10%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-14 h-14 opacity-[0.06]">
          <path d="M30 2L58 30L30 58L2 30Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl section-padding py-24 md:py-32">
        <h2 className="cta-reveal font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
          <span className="text-white">Transforme su estructura</span>
          <br />
          <span className="text-bronze italic">financiera hoy</span>
        </h2>

        <p className="cta-reveal font-body text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          Agende una consulta con nuestro equipo de ingeniería financiera y descubra
          cómo nuestros servicios pueden fortalecer la viabilidad y competitividad de su empresa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contacto" className="cta-button btn-bronze-fill">
            Agendar Consulta
          </Link>
          <Link to="/productos" className="cta-button btn-bronze">
            Ver Productos
          </Link>
        </div>
      </div>
    </section>
  )
}
