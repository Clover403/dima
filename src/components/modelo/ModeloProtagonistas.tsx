import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const protagonists = [
  {
    num: '01',
    title: 'La Transacción',
    body: 'Una transacción ocurre simplemente cuando un comprador intercambia dinero o crédito por bienes, servicios o activos financieros con un vendedor. Es decir, cuando alguien gasta y alguien más recibe.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 transition-transform duration-500 group-hover:scale-110">
        <path d="M8 32h20M36 32h20" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 24l8 8-8 8" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 24l-8 8 8 8" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'El Gasto',
    body: 'El gasto es la fuerza motriz de la economía. Cuando una persona gasta más, otra persona gana más — y al ganar más, tiene más para gastar. Este ciclo es el que impulsa todo el sistema económico.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 transition-transform duration-500 group-hover:scale-110">
        <path d="M12 48L28 20l12 16 12-28" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="52" cy="8" r="4" stroke="#E5997B" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'El Crédito',
    body: 'Cuando el ingreso de alguien aumenta, obtiene capacidad de pago. Un mayor ingreso permite endeudarse, y endeudarse permite gastar más — y más gasto significa más ingreso. El crédito es el eslabón que amplifica la economía.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 transition-transform duration-500 group-hover:scale-110">
        <circle cx="32" cy="32" r="20" stroke="#E5997B" strokeWidth="1.5" />
        <path d="M32 12a20 20 0 0 1 0 40" stroke="#E5997B" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M26 28l6 4-6 4" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 28l-6 4 6 4" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

// Komponen Card Terpisah untuk Logika Hover 3D
function ProtagonistCard({ p }: { p: any }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !glowRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Hitung derajat rotasi (Maksimal 10-15 derajat agar tidak pusing)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -12 // Negatif agar terasa ditekan
    const rotateY = ((x - centerX) / centerX) * 12

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    })

    // Efek Cahaya (Glow)
    gsap.to(glowRef.current, {
      opacity: 1,
      x: x - 250, // 250 adalah setengah dari lebar glow
      y: y - 250,
      duration: 0.3
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return
    
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })

    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.5
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group protagonist-card shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[55vh] min-h-[450px] flex flex-col justify-center px-10 md:px-20 mr-12 bg-white/50 backdrop-blur-md border border-[#030035]/5 relative overflow-hidden transition-colors duration-500 hover:border-[#E5997B]/40 shadow-sm"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Efek Cahaya / Spotlight */}
      <div 
        ref={glowRef}
        className="absolute pointer-events-none opacity-0 w-[500px] h-[500px] rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(229,153,123,0.15) 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* Watermark Angka */}
      <span 
        className="absolute -bottom-4 -right-4 font-display text-[15rem] md:text-[22rem] text-[#030035]/[0.03] leading-none select-none pointer-events-none group-hover:text-[#E5997B]/[0.07] transition-all duration-700"
        style={{ transform: 'translateZ(20px)' }} // Parallax effect
      >
        {p.num}
      </span>

      <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
        <div className="mb-10 p-4 w-fit rounded-2xl bg-white shadow-md border border-[#030035]/5 group-hover:shadow-[#E5997B]/20 transition-all">
          {p.icon}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-[2px] bg-[#E5997B] group-hover:h-12 transition-all duration-500" />
          <h3 className="font-display text-4xl md:text-5xl text-[#030035] tracking-tight">
            {p.title}
          </h3>
        </div>

        <p className="font-body text-[#030035]/60 text-lg md:text-xl leading-relaxed max-w-md">
          {p.body}
        </p>
      </div>
    </div>
  )
}

function TitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 900 40"
      preserveAspectRatio="xMinYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible' }}
    >
      <text x="0" y="32" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="62" fontWeight="400" fill="none" stroke="#030035" strokeWidth="0.5" data-stroke-line="0">Las fuerzas que mueven la economía</text>
      <text x="0" y="32" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="62" fontWeight="400" fill="#030035" fillOpacity="0" data-fill-line="0">Las fuerzas que mueven la economía</text>
    </svg>
  )
}

export default function ModeloProtagonistas() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleSvgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const section = sectionRef.current

    /* ── SVG stroke animation ── */
    document.fonts.ready.then(() => {
      const svg = titleSvgRef.current
      if (!svg) return
      const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
      const fillLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))
      const lengths = strokeLines.map(line => line.getComputedTextLength() || 800)

      strokeLines.forEach((line, i) => {
        line.style.strokeDasharray = `${lengths[i]}`
        line.style.strokeDashoffset = `${lengths[i]}`
        line.style.opacity = '1'
      })

      const tl = gsap.timeline({ paused: true })
      tl.to(strokeLines, { strokeDashoffset: 0, duration: 1.6, stagger: 0.2, ease: 'power2.inOut' }, 0)
        .to(fillLines, { fillOpacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, 1.2)
        .to(strokeLines, { opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power1.in' }, 1.8)

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => tl.play(0),
      })
    })

    /* ── Horizontal scroll logic ── */
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const totalScroll = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1.2
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#F4F4F5] overflow-hidden min-h-screen flex flex-col">
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(3,0,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(3,0,53,0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        }}
      />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 pt-32 pb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-[#E5997B]" />
          <p className="text-[#E5997B] font-mono text-[10px] tracking-[0.5em] uppercase font-bold">
            Los 3 Protagonistas
          </p>
        </div>
        <div className="max-w-4xl">
          <TitleSVG svgRef={titleSvgRef} />
        </div>
      </div>

      <div ref={trackRef} className="flex-1 flex items-center gap-0 pl-6 md:pl-12 lg:pl-24 xl:pl-32 pb-20">
        {protagonists.map((p) => (
          <ProtagonistCard key={p.num} p={p} />
        ))}
        <div className="shrink-0 w-[30vw]" />
      </div>
    </section>
  )
}