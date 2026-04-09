import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      // Pin hero
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=60%',
        pin: true,
        pinSpacing: true,
      })

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: -80,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '60% top',
            scrub: 1.5,
          },
        })
      }

      // Parallax yang sudah disesuaikan dengan rotasi 90 derajat
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          // Karena foto di-rotate 90deg, sumbu X lokal foto sekarang adalah sumbu Y layar
          { x: -60 }, 
          {
            x: 60,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-navy">
      
      {/* Container untuk rotasi foto agar tidak pecah */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          ref={photoRef}
          src="/foto/brand-stationery.jpg"
          alt=""
          className="w-[120vh] h-[125vw] rotate-90 object-cover will-change-transform shrink-0"
          /* EXPLANATION:
             - rotate-90: Memutar foto portrait jadi landscape.
             - w-[120vh]: Lebar elemen (yang jadi tinggi layar) dilebihkan untuk parallax.
             - h-[125vw]: Tinggi elemen (yang jadi lebar layar) memastikan menutupi seluruh lebar banner.
          */
          loading="eager"
        />
      </div>

      {/* Dark navy overlay */}
      <div className="absolute inset-0 bg-navy/85 z-[1]" />

      {/* Subtle grid dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.035] z-[2]">
        <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 16 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 50 + 25} cy={row * 50 + 25} r="1" fill="#E5997B" />
            ))
          )}
        </svg>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 will-change-transform"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-bronze font-body text-xs tracking-[0.3em] uppercase mb-8 md:mb-10"
        >
          DIMA FINANCE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5 }}
          className="font-display text-6xl md:text-5xl lg:text-5xl xl:text-8xl text-white leading-[0.93] mb-8 md:mb-10"
        >
          Ingeniería
          <br />
          Financiera para el
          <br />
          <em className="text-bronze not-italic">Crecimiento Real</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-white/50 font-body text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
        >
          Estructuramos soluciones crediticias basadas en equilibrio macroeconómico.
          Donde otros ven deuda, nosotros diseñamos productividad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Link to="/modelo-crediticio" className="btn-bronze">
            CONOCE NUESTRO MODELO
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/25 text-xs tracking-widest uppercase font-body">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-bronze/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}