import { useEffect, useRef } from 'react'
import GeometryParticles from '../GeometryParticles'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloFundamento() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // small background particle layer

  // ── HOOKS MOUSE PARALLAX & 3D TILT ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 25, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 25, mass: 0.5 })

  // Parallax untuk sisi Teks (3 Kedalaman berbeda)
  const textDepth1X = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]) // Paling lambat
  const textDepth1Y = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10])
  const textDepth2X = useTransform(smoothMouseX, [-0.5, 0.5], [-25, 25]) // Paling cepat (maju)
  const textDepth2Y = useTransform(smoothMouseY, [-0.5, 0.5], [-25, 25])
  const textDepth3X = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]) // Tengah

  const textDepth3Y = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15])

  // 3D Tilt untuk kontainer SVG
  const tiltX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15])
  const tiltY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15])

  // Parallax internal DI DALAM SVG agar bentuk geometrisnya terpecah jadi 3D
  const svgBgX = useTransform(smoothMouseX, [-0.5, 0.5], [15, -15])
  const svgBgY = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15])
  const svgMidX = useTransform(smoothMouseX, [-0.5, 0.5], [5, -5])
  const svgMidY = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5])
  const svgFrontX = useTransform(smoothMouseX, [-0.5, 0.5], [-25, 25])
  const svgFrontY = useTransform(smoothMouseY, [-0.5, 0.5], [-25, 25])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    const x = (e.clientX / window.innerWidth) - 0.5
    const y = (e.clientY / window.innerHeight) - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }
  // ────────────────────────────────────

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      gsap.fromTo(
        el.querySelector('.section-label'),
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      const headLines = el.querySelectorAll('.head-line')
      gsap.fromTo(
        headLines,
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
            end: 'top 40%',
            scrub: 1,
          },
        }
      )

      gsap.fromTo(
        el.querySelector('.body-text'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el.querySelector('.body-text'), start: 'top 85%' },
        }
      )

      gsap.fromTo(
        el.querySelector('.visual-right'),
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      className="bg-lightgray py-32 md:py-48 section-padding overflow-hidden relative"
      style={{ perspective: 1200 }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GeometryParticles particleCount={250} opacity={0.35} />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left — Text */}
        <div className="relative z-10 pointer-events-none">
          <motion.div style={{ x: textDepth1X, y: textDepth1Y }}>
            <p className="section-label text-bronze font-body text-sm md:text-base tracking-[0.3em] uppercase mb-8 pointer-events-auto">
              Fundamento Teórico
            </p>
          </motion.div>

          {/* Wrapper motion untuk memisahkan GSAP (.head-line) dari efek parallax */}
          <motion.h2 style={{ x: textDepth2X, y: textDepth2Y }} className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-navy leading-[1.05] mb-10 pointer-events-auto">
            <span className="head-line block">La economía es simple,</span>
            <span className="head-line block text-bronze italic">
              mecánica y predecible
            </span>
          </motion.h2>

          <motion.div style={{ x: textDepth3X, y: textDepth3Y }}>
            <p className="body-text font-body text-navy/60 text-xl md:text-2xl leading-relaxed max-w-xl pointer-events-auto">
              La economía puede parecer compleja, pero funciona de manera muy simple
              y mecánica — tan mecánica que es sistemática, y precisamente eso la
              hace predecible. Para entender nuestro modelo, solo necesitas comprender
              tres protagonistas fundamentales que impulsan toda actividad económica.
            </p>
          </motion.div>
        </div>

        {/* Right — Abstract geometric visual */}
        {/* .visual-right tetap di div statis agar GSAP (scale/opacity) tidak bentrok dengan Framer Motion */}
        <div className="visual-right flex items-center justify-center relative z-10" style={{ perspective: 1200 }}>
          
          {/* Layer Tilt & Rotasi Utama */}
          <motion.div 
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }} 
            className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl flex justify-center items-center"
          >
            <svg
              viewBox="0 0 500 500"
              fill="none"
              className="w-full overflow-visible"
            >
              {/* Kedalaman Belakang: Bingkai Berlian (Mundur) */}
              <motion.g style={{ x: svgBgX, y: svgBgY }}>
                <path d="M250 40L460 250L250 460L40 250Z" stroke="#E5997B" strokeWidth="0.5" opacity="0.2" />
              </motion.g>

              {/* Kedalaman Tengah: Lingkaran & Garis Penghubung (Sedikit Mundur) */}
              <motion.g style={{ x: svgMidX, y: svgMidY }}>
                <circle cx="250" cy="160" r="100" stroke="#E5997B" strokeWidth="1.5" opacity="0.4" />
                <circle cx="160" cy="340" r="100" stroke="#E5997B" strokeWidth="1.5" opacity="0.4" />
                <circle cx="340" cy="340" r="100" stroke="#E5997B" strokeWidth="1.5" opacity="0.4" />

                <line x1="250" y1="260" x2="190" y2="290" stroke="#E5997B" strokeWidth="0.8" strokeDasharray="4 4" />
                <line x1="250" y1="260" x2="310" y2="290" stroke="#E5997B" strokeWidth="0.8" strokeDasharray="4 4" />
                <line x1="200" y1="340" x2="300" y2="340" stroke="#E5997B" strokeWidth="0.8" strokeDasharray="4 4" />
              </motion.g>

              {/* Kedalaman Depan: Segitiga Tengah & Teks (Maju melompat) */}
              <motion.g style={{ x: svgFrontX, y: svgFrontY }}>
                <path d="M250 220L290 270L250 320L210 270Z" stroke="#D97E5A" strokeWidth="2" fill="#D97E5A" fillOpacity="0.08" />
                <text x="250" y="130" textAnchor="middle" className="font-display" fill="#030035" fontSize="20" opacity="0.6">
                  Transacción
                </text>
                <text x="130" y="370" textAnchor="middle" className="font-display" fill="#030035" fontSize="20" opacity="0.6">
                  Gasto
                </text>
                <text x="370" y="370" textAnchor="middle" className="font-display" fill="#030035" fontSize="20" opacity="0.6">
                  Crédito
                </text>
              </motion.g>
            </svg>
          </motion.div>

        </div>
      </div>
    </section>
  )
}