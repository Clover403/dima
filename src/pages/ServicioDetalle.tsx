import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import SharedHeroSection from '../components/layout/SharedHeroSection'
import { servicesData } from '../data/servicios'
import RippleGrid from '../components/RippleGrid'
import CTA from '../components/layout/CTA';

// import Footer from '../components/layout/Footer'

function DiamondIcon({ size = 16, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={{ width: size, height: size, flexShrink: 0 }} aria-hidden>
      <path d="M10 1L19 10L10 19L1 10Z" stroke="#F4F4F5" strokeWidth="1.5" opacity={opacity} />
    </svg>
  )
}

export default function ServicioDetalle() {
  const { slug } = useParams<{ slug: string }>()
  const service = servicesData.find(s => s.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!service) {
    return <Navigate to="/servicios" replace />
  }

  // Split title into two lines if it contains multiple words, for styling consistency
  const words = service.name.split(' ')
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ')
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ')

  return (
    <PageTransition>
      <SharedHeroSection
        eyebrowText="Servicios"
        titleTop="Arquitectura"
        titleBottom="financiera"
        description={service.description}
      />

      <section className="relative w-full overflow-hidden bg-[#030035] min-h-screen pt-24 pb-32">
        <RippleGrid baseColor="rgba(244, 244, 245, 0.04)" accentColor="rgba(244, 244, 245, 0.15)" />
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full">
            <div className="mb-16 lg:mb-24">
              <div className="flex items-center gap-5 mb-6">
                <DiamondIcon size={20} opacity={1} />
                <span className="font-body text-[#F4F4F5] uppercase text-[0.65rem] md:text-xs lg:text-sm font-bold tracking-[0.3em]">
                  {service.id} — Servicio Detalle
                </span>
              </div>
              <h3 className="font-display text-[#F4F4F5] leading-[0.95] text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight">
                {firstLine}
                {secondLine && (
                  <>
                    <br />
                    <em className="italic text-[#E5997B]">{secondLine}</em>
                  </>
                )}
              </h3>
            </div>

            <div className="flex flex-col gap-24 lg:gap-32">
              {/* Top Section: Text Left, Image Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <p className="font-body text-[#F4F4F5] uppercase mb-6 text-sm md:text-base lg:text-lg font-bold tracking-[0.3em]">
                    {service.short}
                  </p>
                  <p className="font-body leading-relaxed text-[#F4F4F5]/80 text-xl md:text-2xl lg:text-[1.75rem] mb-10">
                    {service.description}
                  </p>
                  
                  <div className="space-y-6">
                    {service.deliverables.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-5">
                        <DiamondIcon size={16} opacity={0.8} />
                        <span className="font-body text-lg md:text-xl lg:text-2xl text-[#F4F4F5] font-semibold">
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-5 flex items-start justify-center lg:-mt-12">
                  <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl">
                    <img 
                      src={service.image1} 
                      alt={service.name} 
                      className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#030035]/10 mix-blend-multiply" />
                  </div>
                </div>
              </div>

              {/* Bottom Section: Image Left, Text Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center">
                  <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl">
                    <img 
                      src={service.image2} 
                      alt={service.name} 
                      className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#030035]/10 mix-blend-multiply" />
                  </div>
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-16 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-8">
                    <DiamondIcon size={18} opacity={1} />
                    <span className="font-body uppercase text-[#F4F4F5] text-sm md:text-base lg:text-lg font-bold tracking-widest">
                      Por qué es posible
                    </span>
                  </div>
                  <p className="font-body italic leading-relaxed text-[#F4F4F5]/70 text-lg md:text-xl lg:text-2xl mb-12">
                    {service.connection}
                  </p>

                  <div className="flex items-center gap-6 pt-8 border-t-2 border-[#F4F4F5]/10">
                    <div className="w-16 h-16 flex items-center justify-center border-2 border-[#F4F4F5]/30 rounded-md shrink-0">
                      <svg viewBox="0 0 20 20" fill="none" style={{ width: 24, height: 24 }}>
                        <path d="M10 2L18 10L10 18L2 10Z" stroke="#F4F4F5" strokeWidth="1.5" />
                        <circle cx="10" cy="10" r="3" fill="#F4F4F5" opacity="0.8" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body uppercase mb-2 text-[#F4F4F5]/60 text-xs md:text-sm font-bold tracking-widest">
                        Habilitado por
                      </p>
                      <p className="font-display text-[#F4F4F5] text-xl md:text-2xl font-bold">
                        Correduría Financiera
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <CTA />
    </PageTransition>
  )
}
