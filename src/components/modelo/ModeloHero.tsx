import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloHero() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Pin hero for extra scroll distance */
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=50%',
        pin: true,
        pinSpacing: true,
      })

      /* Fade-out content as user scrolls past */
      gsap.to(el.querySelector('.hero-inner'), {
        y: -60,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=50%',
          scrub: 1,
        },
      })

      /* Parallax on geometric decorations */
      gsap.to(el.querySelector('.geo-deco'), {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=50%',
          scrub: 2,
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
      className="relative h-screen flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* Decorative geometric SVG */}
      <div className="geo-deco absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04]"
          viewBox="0 0 800 800"
          fill="none"
        >
          {/* Outer diamond */}
          <path d="M400 40L760 400L400 760L40 400Z" stroke="#E5997B" strokeWidth="1" />
          {/* Inner diamond */}
          <path d="M400 160L640 400L400 640L160 400Z" stroke="#E5997B" strokeWidth="0.5" />
          {/* Cross */}
          <line x1="400" y1="40" x2="400" y2="760" stroke="#E5997B" strokeWidth="0.3" />
          <line x1="40" y1="400" x2="760" y2="400" stroke="#E5997B" strokeWidth="0.3" />
          {/* DIMA-inspired shapes — top-left arrow down */}
          <path d="M200 200L320 200L320 260L260 340L200 260Z" stroke="#E5997B" strokeWidth="0.5" />
          {/* Top-right arrow down */}
          <path d="M480 200L600 200L600 260L540 340L480 260Z" stroke="#E5997B" strokeWidth="0.5" />
          {/* Bottom-left arrow up */}
          <path d="M200 600L320 600L320 540L260 460L200 540Z" stroke="#E5997B" strokeWidth="0.5" />
          {/* Bottom-right arrow up */}
          <path d="M480 600L600 600L600 540L540 460L480 540Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="hero-inner relative z-10 text-center max-w-4xl section-padding">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Modelo Crediticio
        </motion.p>

        {/* Title with word stagger */}
        <motion.h1
          variants={wordStagger}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-8"
        >
          <motion.span variants={wordChild} className="inline-block text-white">
            Equilibrio&nbsp;
          </motion.span>
          <motion.span variants={wordChild} className="inline-block text-white">
            como
          </motion.span>
          <br />
          <motion.span variants={wordChild} className="inline-block text-bronze italic">
            principio&nbsp;
          </motion.span>
          <motion.span variants={wordChild} className="inline-block text-bronze italic">
            rector
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-white/60 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Nuestro modelo crediticio se fundamenta en los principios macroeconómicos
          de Ray Dalio, adaptados al contexto financiero mexicano. Estructuramos
          cada producto para mantener el equilibrio entre productividad y deuda.
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
