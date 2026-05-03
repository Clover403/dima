import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// ─── Helper: dynamic script loader ───
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/* ─── Service-specific SVG icons ─── */
function Icon01() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M18 32C18 22 26 14 36 14" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M46 32C46 42 38 50 28 50" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 9L36 14L32 19" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 55L28 50L32 45" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 27L37 32L32 37L27 32Z" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

function Icon02() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M8 32C14 32 16 18 22 18S30 46 36 46 44 18 50 18S56 32 56 32" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="50" x2="56" y2="50" stroke="#E5997B" strokeWidth="0.6" opacity="0.4" />
      <circle cx="56" cy="18" r="2.5" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

function Icon03() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M32 10L54 32L32 54L10 32Z" stroke="#E5997B" strokeWidth="1.2" />
      <path d="M22 32L42 32" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M36 26L42 32L36 38" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="4" stroke="#E5997B" strokeWidth="0.8" />
    </svg>
  )
}

function Icon04() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <line x1="32" y1="12" x2="32" y2="52" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="52" x2="44" y2="52" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="14" y2="30" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="50" y2="30" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 30L14 36H18L14 30Z" stroke="#E5997B" strokeWidth="1" />
      <path d="M46 30L50 36H54L50 30Z" stroke="#E5997B" strokeWidth="1" />
      <circle cx="32" cy="14" r="3" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

function Icon05() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <rect x="10" y="36" width="44" height="16" rx="1" stroke="#E5997B" strokeWidth="1.2" />
      <rect x="22" y="24" width="20" height="12" rx="1" stroke="#E5997B" strokeWidth="1.2" />
      <line x1="32" y1="12" x2="32" y2="24" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="10" r="3" stroke="#E5997B" strokeWidth="1" />
      <line x1="18" y1="44" x2="18" y2="52" stroke="#E5997B" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="44" x2="32" y2="52" stroke="#E5997B" strokeWidth="1" strokeLinecap="round" />
      <line x1="46" y1="44" x2="46" y2="52" stroke="#E5997B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function Icon06() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M32 6L58 32L32 58L6 32Z" stroke="#E5997B" strokeWidth="1.2" />
      <path d="M32 18L46 32L32 46L18 32Z" stroke="#E5997B" strokeWidth="1" opacity="0.6" />
      <path d="M32 28L36 32L32 36L28 32Z" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

const serviceItems = [
  { number: '01', name: 'Reingeniería de Deuda', descriptor: 'Estructura óptima de capital', Icon: Icon01 },
  { number: '02', name: 'Estrategia Financiera Cíclica', descriptor: 'Anticipación de ciclos económicos', Icon: Icon02 },
  { number: '03', name: 'Tesorería Avanzada', descriptor: 'Maximización de liquidez operativa', Icon: Icon03 },
  { number: '04', name: 'Valuación Estratégica', descriptor: 'Determinación del valor real', Icon: Icon04 },
  { number: '05', name: 'Auditoría de CapEx', descriptor: 'Rentabilidad de inversión productiva', Icon: Icon05 },
  { number: '06', name: 'Gobernanza Financiera', descriptor: 'Institucionalización de decisiones', Icon: Icon06 },
]

export default function ServiciosNav() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // ── Vanta BIRDS init ──────────────────────────────────────
  useEffect(() => {
    let destroyed = false

    async function initVanta() {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js')
        
        if (destroyed || !sectionRef.current) return
        if (!(window as any).VANTA?.BIRDS) {
          console.error('Vanta BIRDS not available after load')
          return
        }

        vantaRef.current = (window as any).VANTA.BIRDS({
          el: sectionRef.current,
          THREE: (window as any).THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 600.0,
          minWidth: 600.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xF5F5F5,
          color1: 0x1a1a4e,
          color2: 0xE5997B,
          colorMode: 'lerp',
          birdSize: 1.2,
          wingSpan: 18,
          speedLimit: 3,
          separation: 35,
          alignment: 40,
          cohesion: 50,
          quantity: 4,
        })
      } catch (err) {
        console.error('Vanta BIRDS init failed:', err)
      }
    }

    initVanta()

    return () => {
      destroyed = true
      vantaRef.current?.destroy()
    }
  }, [])

  // ── GSAP animations ─────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* ── Heading reveal ── */
      gsap.fromTo(
        el.querySelector('.section-heading'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      /* ── Cards clip-path reveal (stagger from bottom) ── */
      const cards = el.querySelectorAll('.service-card')
      gsap.fromTo(
        cards,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 72%' },
        }
      )

      /* ── Background number parallax ── */
      const bgNums = el.querySelectorAll('.card-bg-num')
      bgNums.forEach((num) => {
        gsap.fromTo(
          num,
          { y: 20 },
          {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: num.closest('.service-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

      /* ── Connection path draw-in ── */
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: el, start: 'top 60%' },
        })
      }

      /* ── Floating ornament gentle scroll drift ── */
      const floats = el.querySelectorAll('.ornament-drift')
      floats.forEach((f, i) => {
        gsap.to(f, {
          y: i % 2 === 0 ? -50 : 40,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleClick = () => {
    const target = document.getElementById('servicios')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="relative bg-[#F5F5F5] overflow-hidden py-24 md:py-32 section-padding">

      {/* ══════════════════════════════════
          BACKGROUND DECORATIONS
      ══════════════════════════════════ */}

      {/* Large faded diamond — center background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 900 900" fill="none" className="w-[900px] h-[900px] opacity-[0.035]">
          <path d="M450 40L860 450L450 860L40 450Z" stroke="#1A2540" strokeWidth="0.6" />
          <path d="M450 160L740 450L450 740L160 450Z" stroke="#1A2540" strokeWidth="0.4" />
          <line x1="450" y1="40" x2="450" y2="860" stroke="#1A2540" strokeWidth="0.2" />
          <line x1="40" y1="450" x2="860" y2="450" stroke="#1A2540" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 14 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 64 + 32} cy={row * 64 + 32} r="1.5" fill="#1A2540" />
            ))
          )}
        </svg>
      </div>

      {/* Bronze connection path between cards (decorative) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet" fill="none">
          <path
            ref={pathRef}
            d="M200 220 L600 220 L1000 220 M200 500 L600 500 L1000 500 M200 220 L200 500 M600 220 L600 500 M1000 220 L1000 500"
            stroke="#E5997B"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Floating diamond ornaments */}
      <motion.div
        animate={{ y: [-12, 12, -12], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="ornament-drift absolute top-12 right-[8%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 70 70" fill="none" className="w-14 h-14 opacity-[0.07]">
          <path d="M35 4L66 35L35 66L4 35Z" stroke="#1A2540" strokeWidth="0.7" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="ornament-drift absolute bottom-16 left-[6%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 50 50" fill="none" className="w-10 h-10 opacity-[0.06]">
          <path d="M25 3L47 25L25 47L3 25Z" stroke="#1A2540" strokeWidth="0.6" />
          <path d="M25 11L39 25L25 39L11 25Z" stroke="#1A2540" strokeWidth="0.4" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="ornament-drift absolute top-1/2 right-[4%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 opacity-[0.05]">
          <path d="M20 2L38 20L20 38L2 20Z" stroke="#E5997B" strokeWidth="0.6" />
        </svg>
      </motion.div>

      {/* ══════════════════════════════════
          SECTION HEADER
      ══════════════════════════════════ */}
      <div className="section-heading relative z-10 text-center mb-20 md:mb-24 max-w-7xl mx-auto">
        <p className="text-bronze font-body text-xs tracking-[0.35em] uppercase mb-5">
          Ecosistema de Servicios
        </p>

        {/* Bronze line + diamond ornament */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex-1 max-w-[120px] h-px bg-navy/10" />
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 opacity-30">
            <path d="M10 1L19 10L10 19L1 10Z" stroke="#1A2540" strokeWidth="0.8" />
          </svg>
          <div className="flex-1 max-w-[120px] h-px bg-navy/10" />
        </div>

        <h2 className="font-display text-navy text-4xl md:text-5xl lg:text-6xl leading-tight">
          Seis pilares de la
          <br />
          <em className="text-bronze italic">ingeniería financiera</em>
        </h2>
      </div>

     {/* ══════════════════════════════════
    SERVICE CARDS GRID (3D Tactile Glass Version)
══════════════════════════════════ */}
<div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
  {serviceItems.map(({ number, name, descriptor, Icon }) => (
    <motion.div 
      key={number} 
      className="group perspective-1000"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.97 }}
    >
      <button
        onClick={handleClick}
        className="service-card relative w-full text-left 
                   bg-white/30 backdrop-blur-md border border-white/40 
                   rounded-2xl overflow-hidden transition-all duration-300 ease-out
                   shadow-[0_8px_32px_rgba(0,0,0,0.05)]
                   hover:bg-white/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                   active:shadow-inner active:bg-white/20"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        onMouseMove={(e) => {
          const card = e.currentTarget
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = ((y - centerY) / centerY) * -4
          const rotateY = ((x - centerX) / centerX) * 4
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
        }}
      >
        {/* Konten dengan TranslateZ agar terasa berlapis */}
        <div 
          className="relative p-8 md:p-10 h-full min-h-[260px] flex flex-col gap-5"
          style={{ transform: 'translateZ(40px)' }}
        >
          
          {/* Background Number (Paling Dalam) */}
          <span
            className="card-bg-num absolute -bottom-4 -right-2 font-display leading-none select-none pointer-events-none 
                       text-navy/[0.02] group-hover:text-navy/[0.07] transition-all duration-700"
            style={{ 
                fontSize: 'clamp(5rem, 10vw, 9rem)',
                transform: 'translateZ(-20px)' 
            }}
          >
            {number}
          </span>

          {/* Top row: icon + number (Paling Depan) */}
          <div className="flex items-start justify-between" style={{ transform: 'translateZ(20px)' }}>
            <div className="p-3 rounded-xl bg-white/60 shadow-[4px_4px_10px_rgba(0,0,0,0.05)] transition-all duration-500 
                            group-hover:scale-110 group-hover:rotate-6 group-hover:bg-bronze/10">
              <Icon />
            </div>
            <span className="font-display text-xs tracking-[0.4em] text-bronze/60 group-hover:text-bronze transition-colors">
              {number}
            </span>
          </div>

          {/* Name + descriptor */}
          <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
            <h3 className="font-display text-navy text-xl md:text-2xl leading-snug mb-2 transition-transform duration-300">
              {name}
            </h3>
            <p className="font-body text-navy/60 text-sm leading-relaxed group-hover:text-navy/80 transition-colors">
              {descriptor}
            </p>
          </div>

          {/* Bottom row: arrow reveal */}
          <div className="flex items-center gap-3 mt-auto" style={{ transform: 'translateZ(15px)' }}>
            <span className="font-body text-bronze text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              Ver servicio
            </span>
            <div className="w-8 h-px bg-bronze/40 group-hover:w-12 transition-all duration-500" />
          </div>

          {/* Gloss Light Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />
        </div>

        {/* Inner shadow saat ditekan */}
        <div className="absolute inset-0 opacity-0 active:opacity-100 shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] rounded-2xl pointer-events-none transition-opacity" />
        
        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-bronze/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
      </button>
    </motion.div>
  ))}
</div>

      {/* ── Subtle bottom divider ── */}
      <div className="relative z-10 flex items-center justify-center gap-6 mt-20">
        <div className="flex-1 max-w-[200px] h-px bg-navy/10" />
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 opacity-20"
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M12 1L23 12L12 23L1 12Z" stroke="#1A2540" strokeWidth="0.7" />
        </motion.svg>
        <div className="flex-1 max-w-[200px] h-px bg-navy/10" />
      </div>
    </section>
  )
}