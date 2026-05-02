import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import InteractiveConstellationText from '../InteractiveConstellationText'

gsap.registerPlugin(ScrollTrigger)

export default function ServiciosHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      if (bgRef.current)
        gsap.fromTo(bgRef.current, { y: 0, scale: 1.12 }, { y: -60, scale: 1.05, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } })

      el.querySelectorAll('.geo-line').forEach(line => {
        const len = (line as SVGPathElement).getTotalLength?.() || 200
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(line, { strokeDashoffset: 0, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', scrub: 1, invalidateOnRefresh: true } })
      })

      gsap.to(el.querySelector('.hero-content'), { y: -50, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: '40% top', end: '80% top', scrub: 1, invalidateOnRefresh: true } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img ref={bgRef} src="/foto/illust-shipping.jpg" alt=""
          className="w-full h-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 900"
          fill="none" preserveAspectRatio="xMidYMid slice">
          <path className="geo-line" d="M1100 100 L1200 200 L1100 300 L1000 200 Z" stroke="#E5997B" strokeWidth="0.5" opacity="0.3" />
          <line className="geo-line" x1="100" y1="750" x2="500" y2="750" stroke="#E5997B" strokeWidth="0.5" opacity="0.2" />
          <path className="geo-line" d="M200 650 L280 650 L240 720 L280 790 L200 790 L240 720 Z" stroke="#E5997B" strokeWidth="0.5" opacity="0.25" />
          <line className="geo-line" x1="1300" y1="400" x2="1300" y2="700" stroke="#E5997B" strokeWidth="0.5" opacity="0.15" />
        </svg>
      </div>

      {/* Hero content */}
      <div className="hero-content relative z-10 text-center w-full max-w-7xl px-8">
        <motion.p
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Servicios
        </motion.p>

        <InteractiveConstellationText
          lines={[
            { text: 'Acompañamiento', y: 110, color: '#FFFFFF' },
            { text: 'estratégico', y: 225, fontStyle: 'italic', color: '#E5997B' },
          ]}
          viewBox="0 0 1400 335"
          defaultFontSize={110}
          fontFamily="'Playfair Display', serif"
          containerClassName="pointer-events-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white/55 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Más allá de los productos, ofrecemos un ecosistema de servicios diseñados para fortalecer la
          estructura financiera de nuestros clientes.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-lightgray/30 text-xs tracking-widest uppercase font-body">Scroll</span>
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
