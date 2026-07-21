import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CreditModelSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      // Animasi Slide-Up seragam dari bawah (y: 80) dengan durasi & delay berurutan yang smooth
      gsap.fromTo(
        sectionRef.current.querySelector('.model-eyebrow'),
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelector('.model-headline'),
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          delay: 0.15,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelector('.model-visual'),
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          delay: 0.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelector('.model-description'),
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          delay: 0.35,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%' },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelector('.model-cta'),
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.3,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 35%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#030035] overflow-hidden flex items-center justify-center py-24 px-6 md:px-12 lg:px-20"
    >
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 xl:gap-32 items-center">
          
          {/* === KOLOM KIRI (6 Kolom): Timbangan & Deskripsi === */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            
            {/* Gambar Timbangan */}
            <div className="model-visual w-full flex justify-center lg:justify-start mb-24 lg:mb-36 xl:mb-44">
              <img
                src="/illustration/timbangan1.png"
                alt="Modelo Crediticio DIMA"
                className="w-full max-w-none h-auto object-contain scale-140 lg:scale-150 origin-center lg:origin-left transform -translate-x-[25%] lg:-translate-x-[35%] transition-transform duration-700"
              />
            </div>

            {/* Deskripsi: Digeser agak ke kiri dengan -translate-x-4 lg:-translate-x-8 */}
            <p className="model-description relative z-20 font-body text-[#F4F4F5]/70 text-xl md:text-2xl leading-relaxed max-w-2xl transform -translate-x-4 lg:-translate-x-6">
              La productividad debe crecer más rápido que la deuda. Este principio, extraído del modelo macroeconómico de Ray Dalio, guía cada estructura crediticia que diseñamos. No financiamos — equilibramos.
            </p>

          </div>

          {/* === KOLOM KANAN (6 Kolom): Eyebrow, Judul Ekstrim, & Tombol === */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2 z-20">
            
            <div className="model-eyebrow flex items-center gap-4 mb-4 md:mb-6">
              <div className="w-10 h-px bg-[#E5997B]/50" />
              <p className="text-[#E5997B] font-body text-xs md:text-sm tracking-[0.4em] font-bold uppercase">
                MODELO CREDITICIO
              </p>
              <div className="w-10 h-px bg-[#E5997B]/50 lg:hidden" />
            </div>

            <h2 className="model-headline font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-[#F4F4F5] leading-[1.05] mb-12 lg:mb-16">
              Fundamentado en el equilibrio de Ray Dalio
            </h2>

            <div className="model-cta flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/modelo-crediticio"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#E5997B] text-[#030035] font-body text-xs tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-[#F4F4F5] hover:pl-12 shadow-lg shadow-[#E5997B]/10 hover:shadow-[#F4F4F5]/20"
              >
                <span className="relative z-10">DESCUBRE EL MODELO</span>
                <svg className="absolute left-5 opacity-0 group-hover:opacity-100 transition-all duration-500 w-4 h-4 text-[#030035]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}