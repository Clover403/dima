import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import InteractiveConstellationText from '../InteractiveConstellationText'

gsap.registerPlugin(ScrollTrigger)

export default function ProductosHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 18, mass: 0.4 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 18, mass: 0.4 })
  const bgX = useTransform(smoothMouseX, [-0.5, 0.5], [24, -24])
  const bgY = useTransform(smoothMouseY, [-0.5, 0.5], [18, -18])
  const contentX = useTransform(smoothMouseX, [-0.5, 0.5], [10, -10])
  const contentY = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* 1. Background parallax */
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
              invalidateOnRefresh: true,
            },
          }
        )
      }

      /* 2. Fade out seluruh konten saat scroll */
      gsap.to(el.querySelector('.hero-content'), {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: '40% top',
          end: '80% top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background photo with dark overlay */}
      <div className="absolute inset-0">
        <motion.img
          ref={bgRef}
          src="/foto/brand-stationery.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
          style={{ x: bgX, y: bgY }}
        />
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      {/* Content */}
      <motion.div className="hero-content relative z-10 text-center max-w-5xl section-padding" style={{ x: contentX, y: contentY }}>
        <motion.p
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Productos
        </motion.p>

        <InteractiveConstellationText
          lines={[
            { text: 'Soluciones que', y: 150, color: '#FFFFFF' },
            { text: 'construyen', y: 285, fontStyle: 'italic', color: '#E5997B' }
          ]}
          defaultFontSize={120}
          fontFamily="'Playfair Display', serif"
          containerClassName="pointer-events-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-white/55 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Cada producto está diseñado como una pieza de ingeniería financiera.
          No vendemos créditos — estructuramos crecimiento.
        </motion.p>
      </motion.div>

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
