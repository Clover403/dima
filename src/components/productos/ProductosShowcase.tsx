import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const THEME = {
  navy: '#0f172a',
  bronze: '#E5997B',
  lightGray: '#F1F5F9',
}

interface Product {
  number: string; label: string; tagline: string; heading: string;
  description: string[]; features: string[]; image: string; ctaLink: string;
}

interface Props { products: Product[] }

export default function ProductosShowcase({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeProduct, setActiveProduct] = useState(0)
  
  // Fungsi untuk handle klik navigasi agar scroll menuju posisi yang tepat
  const scrollToProduct = (index: number) => {
    if (!sectionRef.current) return
    const st = ScrollTrigger.getById('productScroll')
    if (st) {
      const totalScroll = st.end - st.start
      const targetScroll = st.start + (index / (products.length - 1)) * totalScroll
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const el = sectionRef.current!
      
      // 1. KINETIC TEXT (Sama seperti Principles Section)
      gsap.to(".marquee-part", {
        xPercent: -100,
        repeat: -1,
        duration: 50,
        ease: "none",
      })

      // 2. MAIN SCROLL TRIGGER
      ScrollTrigger.create({
        id: 'productScroll',
        trigger: el,
        start: 'top top',
        end: `+=${products.length * 150}%`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * products.length), 
            products.length - 1
          )
          setActiveProduct(idx)
        },
      })

      // 3. MOVING GRID
      gsap.to(".bg-grid", {
        backgroundPosition: "0 120px",
        scrollTrigger: {
          trigger: el,
          scrub: true
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [products.length])

  return (
    <div ref={sectionRef} className="relative h-screen bg-[#F1F5F9] overflow-hidden">
      
      {/* --- BACKGROUND LAYERS (Jiwa dari Section Principles) --- */}
      <div 
        className="bg-grid absolute inset-0 opacity-[0.12]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
          backgroundSize: '80px 80px' 
        }}
      />

      <div className="absolute top-[10%] left-0 flex whitespace-nowrap opacity-[0.03] select-none pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="marquee-part font-display text-[18vw] leading-none uppercase pr-20 text-navy">
            Dima Solutions • Strategic Products • Engineering •
          </span>
        ))}
      </div>

      {/* --- SIDE COUNTER (Sync dengan activeProduct) --- */}
      <div className="hidden lg:flex absolute left-12 bottom-12 z-30 items-center gap-6">
        <div className="overflow-hidden h-[120px] w-[180px]">
          <motion.div 
            animate={{ y: -activeProduct * 120 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="flex flex-col"
          >
            {products.map((p, i) => (
              <span key={i} className="block font-display text-9xl text-bronze/30 leading-[120px]">
                {p.number}
              </span>
            ))}
          </motion.div>
        </div>
        <p className="text-navy/40 font-body text-[10px] tracking-[0.5em] uppercase [writing-mode:vertical-lr]">
          Soluciones 2026
        </p>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        
        {/* LEFT: NAVIGATOR (Lebih "Niat", Bersih, Interaktif) */}
        <div className="lg:w-[40%] h-full flex flex-col justify-center px-12 xl:px-24">
          <div className="mb-12">
            <p className="text-bronze text-[10px] tracking-[0.6em] uppercase mb-4">Portfolio</p>
            <h2 className="text-5xl font-display text-navy leading-none">
              PRODUCTOS<br/><span className="italic">ESTRATÉGICOS</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {products.map((product, i) => (
              <button
                key={product.number}
                onClick={() => scrollToProduct(i)}
                className="group relative flex items-center gap-6 text-left py-2 outline-none"
              >
                <span className={`font-display text-xl transition-colors duration-500 ${
                  activeProduct === i ? 'text-bronze' : 'text-navy/20 group-hover:text-navy/40'
                }`}>
                  {product.number}
                </span>
                
                <span className={`text-2xl xl:text-3xl font-display transition-all duration-500 ${
                  activeProduct === i ? 'text-navy translate-x-2' : 'text-navy/40 group-hover:text-navy/60'
                }`}>
                  {product.label}
                </span>

                {activeProduct === i && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute -left-6 w-1 h-8 bg-bronze rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-16 flex items-center gap-4">
             <div className="h-px flex-1 bg-navy/10 relative">
                <motion.div 
                  className="absolute inset-0 bg-bronze origin-left"
                  animate={{ scaleX: (activeProduct + 1) / products.length }}
                />
             </div>
             <span className="text-[10px] text-navy/30 tracking-widest">
                {activeProduct + 1} / {products.length}
             </span>
          </div>
        </div>

        {/* RIGHT: IMMERSIVE IMAGE & DESCRIPTION */}
        <div className="lg:w-[60%] h-full relative bg-navy">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {/* Image with Dark Overlay */}
              <img 
                src={products[activeProduct].image} 
                className="w-full h-full object-cover opacity-50 mix-blend-luminosity" 
                alt="" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/40 to-transparent" />

              {/* Float Description Card */}
              <div className="absolute inset-0 flex flex-col justify-center px-16 xl:px-24">
                <div className="max-w-xl">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-bronze text-xs tracking-[0.4em] uppercase mb-6 block">
                      {products[activeProduct].tagline}
                    </span>
                    <h3 className="text-4xl xl:text-6xl font-display text-white leading-tight mb-8">
                      {products[activeProduct].heading}
                    </h3>
                    
                    <div className="w-16 h-[2px] bg-bronze mb-8" />
                    
                    <p className="text-white/60 font-body text-lg leading-relaxed italic mb-10 border-l-2 border-white/10 pl-8">
                      "{products[activeProduct].description[0]}"
                    </p>

                    <div className="flex flex-wrap gap-3 mb-12">
                      {products[activeProduct].features.map(f => (
                        <span key={f} className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-[10px] tracking-widest uppercase rounded-lg backdrop-blur-md">
                          {f}
                        </span>
                      ))}
                    </div>

                    <Link 
                      to={products[activeProduct].ctaLink}
                      className="inline-flex items-center gap-6 bg-bronze text-navy px-10 py-5 group hover:bg-white transition-all"
                    >
                      <span className="text-xs uppercase tracking-[0.2em]">Más Información</span>
                      <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Decorative Corner Label */}
          <div className="absolute top-12 right-12 text-white/10 font-display text-8xl pointer-events-none">
            {products[activeProduct].number}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 right-12 flex flex-col items-center gap-4">
         <div className="h-20 w-[1px] bg-white/20 relative">
            <motion.div 
              className="absolute top-0 w-full bg-bronze" 
              animate={{ height: `${((activeProduct + 1) / products.length) * 100}%` }}
            />
         </div>
         <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] [writing-mode:vertical-lr]">Slide</span>
      </div>
    </div>
  )
}