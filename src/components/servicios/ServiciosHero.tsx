import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ServiciosHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Pin hero for extra scroll distance */
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=40%',
        pin: true,
        pinSpacing: true,
      })

      /* Background photo slow parallax */
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { y: 0, scale: 1.12 },
          {
            y: -60,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: '+=140%',
              scrub: true,
            },
          }
        )
      }

      /* Decorative bronze lines — stroke-dashoffset reveal */
      const geoLines = el.querySelectorAll('.geo-line')
      geoLines.forEach((line) => {
        const length = (line as SVGPathElement).getTotalLength?.() || 200
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=40%',
            scrub: 1,
          },
        })
      })

      /* Fade hero out on scroll past pin */
      gsap.to(el.querySelector('.hero-content'), {
        y: -50,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: '60% top',
          end: '100% top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const wordStagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.14, delayChildren: 0.3 },
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
      {/* Background photo with navy overlay */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="/foto/illust-shipping.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Decorative geometric SVG lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Diamond shape - top right */}
          <path
            className="geo-line"
            d="M1100 100 L1200 200 L1100 300 L1000 200 Z"
            stroke="#E5997B"
            strokeWidth="0.5"
            opacity="0.3"
          />
          {/* Thin horizontal line */}
          <line
            className="geo-line"
            x1="100" y1="750" x2="500" y2="750"
            stroke="#E5997B"
            strokeWidth="0.5"
            opacity="0.2"
          />
          {/* Hourglass shape - bottom left */}
          <path
            className="geo-line"
            d="M200 650 L280 650 L240 720 L280 790 L200 790 L240 720 Z"
            stroke="#E5997B"
            strokeWidth="0.5"
            opacity="0.25"
          />
          {/* Vertical accent line */}
          <line
            className="geo-line"
            x1="1300" y1="400" x2="1300" y2="700"
            stroke="#E5997B"
            strokeWidth="0.5"
            opacity="0.15"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 text-center max-w-4xl section-padding">
        <motion.p
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Servicios
        </motion.p>

        <motion.h1
          variants={wordStagger}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-8"
        >
          <motion.span variants={wordChild} className="inline-block text-white">
            Acompañamiento
          </motion.span>
          <br />
          <motion.span variants={wordChild} className="inline-block text-bronze italic">
            estratégico
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-white/55 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Más allá de los productos, ofrecemos un ecosistema de servicios
          diseñados para fortalecer la estructura financiera de nuestros clientes.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-lightgray/30 text-xs tracking-widest uppercase font-body">
            Scroll
          </span>
          <motion.div
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent origin-top"
          />
        </div>
      </motion.div>
    </section>
  )
}
