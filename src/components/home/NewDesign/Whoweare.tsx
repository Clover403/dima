import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAreSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const topPathRef = useRef<SVGPathElement>(null)
  const contentRef = useRef<HTMLDivElement>(null) // Ref baru untuk konten

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animasi Fade-in hanya pada KONTEN, bukan pada background
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

      // 2. Animasi Cekungan
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
      // 1. HAPUS h-screen dari sini, biarkan tingginya menyesuaikan isi di dalamnya
      className="relative w-full font-sans -mt-24 md:-mt-32"
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BACKGROUND & CEKUNGAN BOLONG (Akan otomatis memanjang ke bawah) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className="w-full h-24 md:h-32 text-[#030035]">
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* KONTEN SECTION */}
      {/* 2. TAMBAHKAN h-screen di sini agar layout teks & gambar tetap sama persis */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div ref={contentRef} className="relative z-10 w-full h-screen flex flex-col justify-center overflow-hidden opacity-0">
        
        {/* CONTAINER GAMBAR */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12 pointer-events-none z-0">
          <div className="relative w-full max-w-xl md:max-w-4xl lg:max-w-6xl aspect-square flex items-center justify-center transform translate-y-24 md:translate-y-32">
            <img
              src="/illustration-compressed/home/jembatan3.webp"
              alt="DIMA Finance Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* TEKS KIRI ATAS */}
        <div className="absolute top-28 left-6 right-6 text-left md:top-40 md:left-12 lg:left-20 md:right-auto max-w-xl md:max-w-4xl lg:max-w-5xl z-10">
          <p className="text-[#F4F4F5]/70 text-xs md:text-sm tracking-[0.2em] uppercase mb-2 md:mb-6">
            QUIÉNES SOMOS
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#F4F4F5] leading-[1.1] font-medium tracking-tight">
            No somos un banco.<br />
            Somos arquitectos<br />
            de equilibrio.
          </h2>
        </div>

        {/* TEKS KANAN BAWAH */}
        <div className="absolute bottom-16 left-6 right-6 text-left md:bottom-39 md:right-12 lg:right-20 md:left-auto max-w-md md:max-w-xl lg:max-w-3xl z-10 md:text-right">
          <p className="font-body font-light text-[#F4F4F5]/80 text-2xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug md:leading-tight">
            Transformamos la deuda en productividad. Cada decisión crediticia en DIMA Finance se fundamenta en principios de ingeniería financiera y equilibrio macroeconómico — no otorgamos créditos, diseñamos estructuras que generan valor.
          </p>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. RUANG KOSONG TAMBAHAN DI BAWAH (Spacer) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Silakan ubah h-24 (96px) atau h-40 (160px) sesuai seberapa jauh jarak yang kamu mau */}
      <div className="relative z-10 w-full h-24 md:h-40" />

    </section>
 )
}