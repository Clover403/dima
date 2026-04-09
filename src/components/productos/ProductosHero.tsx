import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ProductosHero() {
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
          { y: 0, scale: 1.1 },
          {
            y: -80,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      /* Fade out on scroll */
      gsap.to(el.querySelector('.hero-content'), {
        y: -60,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: '40% top',
          end: '80% top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const wordStagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  }

  const wordChild = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background photo with dark overlay */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="/foto/brand-stationery.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-navy/65" />
        {/* Extra gradient for depth */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/90" /> */}
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 text-center max-w-4xl section-padding">
        <motion.p
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Productos
        </motion.p>

        <motion.h1
          variants={wordStagger}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-8"
        >
          <motion.span variants={wordChild} className="inline-block text-white">
            Soluciones&nbsp;
          </motion.span>
          <motion.span variants={wordChild} className="inline-block text-white">
            que
          </motion.span>
          <br />
          <motion.span variants={wordChild} className="inline-block text-bronze italic">
            construyen
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-white/55 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Cada producto está diseñado como una pieza de ingeniería financiera.
          No vendemos créditos — estructuramos crecimiento.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-lightgray/30 text-xs tracking-widest uppercase font-body">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
