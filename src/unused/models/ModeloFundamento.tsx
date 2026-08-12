import { useEffect, useRef } from 'react'
import GeometryParticles from '../GeometryParticles'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloFundamento() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // ── HOOKS MOUSE PARALLAX & 3D TILT ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.5 })

  const textDepth1X = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8])
  const textDepth1Y = useTransform(smoothMouseY, [-0.5, 0.5], [-8, 8])
  const textDepth2X = useTransform(smoothMouseX, [-0.5, 0.5], [-18, 18])
  const textDepth2Y = useTransform(smoothMouseY, [-0.5, 0.5], [-18, 18])
  const textDepth3X = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12])
  const textDepth3Y = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12])

  const tiltX = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12])
  const tiltY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12])
  const imgParallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20])
  const imgParallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    const x = (e.clientX / window.innerWidth) - 0.5
    const y = (e.clientY / window.innerHeight) - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      gsap.fromTo(
        el.querySelector('.section-label'),
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      const headLines = el.querySelectorAll('.head-line')
      gsap.fromTo(
        headLines,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
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
      className="bg-navy py-32 md:py-48 overflow-hidden relative"
      style={{ perspective: 1200 }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GeometryParticles particleCount={250} opacity={0.15} />
      </div>

      {/* Kontainer diperlebar (max-w-[1600px]) agar teks benar-benar geser ke kiri */}
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left — Teks Mepet Kiri & Ukuran Diperbesar */}
        <div className="lg:col-span-6 text-left relative z-10 pointer-events-none">
          <motion.div style={{ x: textDepth1X, y: textDepth1Y }}>
            <p className="section-label text-bronze font-body text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-semibold pointer-events-auto">
              Fundamento Teórico
            </p>
          </motion.div>

          {/* Ukuran Headline Diperbesar hingga 6.5rem */}
          <motion.h2 
            style={{ x: textDepth2X, y: textDepth2Y }} 
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-lightgray leading-[1.05] mb-8 font-normal tracking-tight pointer-events-auto"
          >
            <span className="head-line block">La economía es simple,</span>
            <span className="head-line block">mecánica y predecible.</span>
          </motion.h2>

          {/* Ukuran Body Text Diperbesar hingga 3xl */}
          <motion.div style={{ x: textDepth3X, y: textDepth3Y }}>
            <p className="body-text font-body text-lightgray text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-2xl pointer-events-auto opacity-80">
              La economía puede parecer compleja, pero funciona de manera muy simple
              y mecánica — tan mecánica que es sistemática, y precisamente eso la
              hace predecible. Para entender nuestro modelo, solo necesitas comprender
              tres protagonistas fundamentales que impulsan toda actividad económica.
            </p>
          </motion.div>
        </div>

        {/* Right — Gambar Roda Ekonomi Diperbesar Maksimal */}
        <div className="lg:col-span-6 visual-right flex items-center justify-center lg:justify-end relative z-10">
          <motion.div 
            style={{ 
              rotateX: tiltX, 
              rotateY: tiltY, 
              x: imgParallaxX, 
              y: imgParallaxY,
              transformStyle: "preserve-3d" 
            }} 
            className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-[800px] flex justify-center items-center relative"
          >
            
            {/* Gambar diset w-full dengan batas container yang jauh lebih besar */}
            <img 
              src="/illustration-compressed/home/3rodaekonomi.webp" 
              alt="3 Roda Ekonomi" 
              className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
            />
          </motion.div>
        </div>

      </div>
    </section>
  )
}