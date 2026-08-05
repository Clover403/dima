import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HoverTrailOverlay from '../../HoverTrailOverlay';

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAreSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const topPathRef = useRef<SVGPathElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )

      gsap.to({}, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 5%',
          scrub: 1,
          onUpdate: (self) => {
            if (!topPathRef.current) return
            const maxCurve = 90
            const y = gsap.utils.interpolate(maxCurve, 0, self.progress)
            topPathRef.current.setAttribute(
              'd',
              `M0,0 L0,120 L1440,120 L1440,0 C1100,0 950,${y} 720,${y} C490,${y} 340,0 0,0 Z`
            )
          },
        },
      })
    })
    
    return () => ctx.revert()
  }, [])

 return (
    <section 
      ref={sectionRef}
      className="relative w-full font-sans -mt-20 md:-mt-28" 
    >
      {/* BACKGROUND & CEKUNGAN */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className="w-full h-20 md:h-28 text-[#030035]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              ref={topPathRef}
              d="M0,0 L0,120 L1440,120 L1440,0 C1100,0 950,90 720,90 C490,90 340,0 0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="w-full flex-1 bg-[#030035]" />
      </div>

      {/* KONTEN SECTION */}
      <div ref={contentRef} className="relative z-10 w-full h-screen flex flex-col justify-center overflow-hidden opacity-0">
        
        {/* CONTAINER GAMBAR */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none z-0 cursor-none">
          <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-5xl aspect-square flex items-center justify-center transform translate-y-16 md:translate-y-24 pointer-events-auto cursor-none">
            <img
              src="/illustration-compressed/home/jembatan3.webp"
              alt="DIMA Finance Illustration"
              className="w-full h-full object-contain"
            />
            <HoverTrailOverlay theme="navy" className="absolute inset-0 z-20 w-full h-full" />
          </div>
        </div>

        {/* TEKS KIRI ATAS */}
        <div className="absolute top-20 left-6 right-6 text-left md:top-32 md:left-12 lg:left-20 md:right-auto max-w-lg md:max-w-3xl lg:max-w-4xl z-10">
          <p className="text-[#F4F4F5]/70 text-xs tracking-[0.2em] uppercase mb-2 md:mb-4">
            QUIÉNES SOMOS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#F4F4F5] leading-[1.1] font-medium tracking-tight">
            No somos un banco.<br />
            Somos arquitectos<br />
            de equilibrio.
          </h2>
        </div>

        {/* TEKS KANAN BAWAH */}
        <div className="absolute bottom-12 left-6 right-6 text-left md:bottom-28 md:right-12 lg:right-20 md:left-auto max-w-sm md:max-w-lg lg:max-w-2xl z-10 md:text-right">
          <p className="font-body font-light text-[#F4F4F5]/80 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug md:leading-tight">
            Transformamos la deuda en productividad. Cada decisión crediticia en DIMA Finance se fundamenta en principios de ingeniería financiera y equilibrio macroeconómico — no otorgamos créditos, diseñamos estructuras que generan valor.
          </p>
        </div>

      </div>

      {/* RUANG KOSONG TAMBAHAN DI BAWAH */}
      <div className="relative z-10 w-full h-16 md:h-28" />

    </section>
 )
}