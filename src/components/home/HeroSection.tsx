import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import AnimatedGrid from '../AnimatedGrid'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const rawMouseRef = useRef({ x: -9999, y: -9999 })
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 })

  // Mask lebih besar + sharp biar hover keliatan jelas
  const maskWebkit = useTransform([springX, springY], ([x, y]) => 
    `radial-gradient(900px at ${x}px ${y}px, white 0%, white 30%, transparent 75%)`
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseX.set(x)
      mouseY.set(y)
      rawMouseRef.current = { x, y }
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 40, opacity: 0, duration: 1.4, stagger: 0.15, ease: "expo.out", delay: 0.5
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      style={{ backgroundColor: '#E8E8EB' }}
      className="relative w-full h-screen overflow-hidden"
    >

      {/* ── STATIC GRID — diagonal fade ke kanan ── */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #030035 1px, transparent 1px), linear-gradient(to bottom, #030035 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.08,
          WebkitMaskImage: 'linear-gradient(115deg, black 35%, transparent 65%)',
          maskImage: 'linear-gradient(115deg, black 35%, transparent 65%)',
        }}
      />

      {/* ── LAYER 2: Spotlight bronze — opacity tinggi biar keliatan ── */}
      <motion.div
        className="absolute z-[2] pointer-events-none"
        style={{
          WebkitMaskImage: maskWebkit,
          maskImage: maskWebkit,
          opacity: 1,
          top: 0, bottom: 0, left: 0, width: '200%',
        }}
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      {/* ── LAYER 3: Spline ── */}
      <div className="absolute inset-y-0 right-0 w-[65%] z-[3] pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8E8EB] via-[#E8E8EB]/40 to-transparent z-10" />
        <div
          className="w-full h-full opacity-90"
          style={{ transform: 'scale(1.8) translateX(3%)', transformOrigin: 'center center' }}
        >
          <Spline
            scene="https://prod.spline.design/AarxTLMO0jtCFWeQ/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* ── LAYER 5: Bronze di atas Spline juga ── */}
      <motion.div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ WebkitMaskImage: maskWebkit, maskImage: maskWebkit, opacity: 0.8 }}
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      {/* ── UI Layout ── */}
      <div className="relative z-[10] w-full h-full flex flex-col justify-between p-10 md:p-16 lg:p-24 pointer-events-none">
        
        <div className="invisible flex flex-col gap-1">
          <span className="font-mono text-[9px]">x</span>
          <span className="font-mono text-[8px]">x</span>
        </div>

        {/* Headline */}
        <div className="max-w-4xl select-none">
          <div className="reveal-item overflow-hidden mb-8">
            <p className="text-[#E5997B] font-mono text-[11px] tracking-[1em] uppercase flex items-center gap-6">
              <span className="w-16 h-[1px] bg-[#E5997B]/50" />
              Ingeniería de Capital
            </p>
          </div>
          
          <div className="space-y-2">
            <h1 className="reveal-item font-display text-[12vw] lg:text-[8.5vw] text-[#030035] leading-[0.85] tracking-tighter">
              DEUDA QUE
            </h1>
            <h1 className="reveal-item font-display text-[12vw] lg:text-[8.5vw] text-[#E5997B] italic leading-[0.85] tracking-tighter">
              GENERA VALOR.
            </h1>
          </div>

          <div className="reveal-item mt-14 flex items-start gap-10">
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#E5997B] to-transparent opacity-40" />
            <p className="text-[#030035]/50 font-body text-base lg:text-lg max-w-[380px] leading-relaxed">
              Diseñamos arquitecturas financieras que transforman el balance corporativo en una plataforma de crecimiento estratégico.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="reveal-item hidden md:block">
            <div className="flex flex-col gap-1 opacity-40">
              <span className="font-mono text-[8px] text-[#030035] tracking-[0.8em] uppercase">Crédito Empresarial</span>
              <span className="font-mono text-[10px] text-[#030035] tracking-[0.2em]">Todos los sectores · Todas las escalas</span>
            </div>
          </div>

          <div className="reveal-item flex items-center gap-6 w-full md:w-auto pointer-events-auto">
            <Link to="/contacto" className="flex-1 md:flex-none text-center px-8 py-5 font-mono text-[10px] tracking-[0.5em] uppercase text-[#030035]/40 hover:text-[#030035] transition-all border border-transparent hover:border-[#030035]/10">
              Contacto
            </Link>
            <Link to="/modelo-crediticio" className="group relative flex-1 md:flex-none flex items-center justify-center gap-6 px-12 py-5 bg-[#030035] border border-[#030035] overflow-hidden">
              <div className="absolute inset-0 bg-[#E5997B] translate-y-full group-hover:translate-y-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]" />
              <span className="relative z-10 font-body text-[10px] tracking-[0.6em] uppercase text-white group-hover:text-white transition-colors duration-[900ms] font-bold">Ver Modelo</span>
              <svg className="relative z-10 w-4 h-4 text-white group-hover:text-white transition-all duration-[900ms] group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute inset-10 pointer-events-none opacity-10 z-[20]">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#030035]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#030035]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#030035]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#030035]" />
      </div>

    </section>
  )
}