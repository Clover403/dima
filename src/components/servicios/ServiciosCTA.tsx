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
      // min-h-[80vh] dihapus, menggunakan padding agar tinggi bg lebih pendek
      className="relative py-24 lg:py-32 flex items-center justify-center overflow-hidden"
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
      <div className="relative z-10 text-center w-full max-w-[1200px] px-8 md:px-12">
        {/* Teks diperbesar */}
        <h2 className="cta-reveal font-display text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] mb-10 tracking-tight">
          <span className="text-white">Transforme su estructura</span>
          <br />
          <span className="text-bronze italic">financiera hoy</span>
        </h2>

        {/* Deskripsi diperbesar dan dibuat lebih lebar (max-w-5xl) */}
        <p className="cta-reveal font-body text-white/70 text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto leading-relaxed mb-14">
          Agende una consulta con nuestro equipo de ingeniería financiera y descubra
          cómo nuestros servicios pueden fortalecer la viabilidad y competitividad de su empresa.
        </p>

        {/* Tombol kembali ke desain asli */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contacto"
            className="cta-button group relative inline-flex items-center justify-center px-8 py-4 bg-bronze text-white font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-navy hover:pl-12 border border-bronze"
          >
            <span className="relative z-10">Agendar Consulta</span>
            <svg
              className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            to="/productos"
            className="cta-button group relative inline-flex items-center justify-center px-8 py-4 bg-transparent text-bronze font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-bronze hover:text-white hover:pl-12 border border-bronze"
          >
            <span className="relative z-10">Ver Productos</span>
            <svg
              className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}