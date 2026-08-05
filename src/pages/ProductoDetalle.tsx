import HoverTrailOverlay from '../components/HoverTrailOverlay';
import { useParams, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productsData, PRODUCTOS_CTA_LINK } from '../data/productos'
import { ProductLayerTabs, type LayerKey } from '../components/productos/ProductosShowcase'
import SpotlightGridBackground from '../components/layout/SpotlightGridBackground'
import SharedHeroSection from '../components/layout/SharedHeroSection'
import CTA from '../components/layout/CTA';


function AccentHeading({ heading }: { heading: string }) {
  const words = heading.trim().split(/\s+/)
  return (
    <>
      <span style={{ color: '#F4F4F5' }}>{words[0]}</span>
      {words.length > 1 && <span style={{ color: '#E5997B', fontStyle: 'normal' }}> {words.slice(1).join(' ')}</span>}
    </>
  )
}

export default function ProductoDetalle() {
  const { slug } = useParams<{ slug: string }>()
  const product = productsData.find(p => p.slug === slug)
  const [activeLayer, setActiveLayer] = useState<LayerKey>('solution')

  // Always reset to top when navigating
  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveLayer('solution')
  }, [slug])

  if (!product) {
    return <Navigate to="/productos" replace />
  }

  const displayIndex = parseInt(product.number) - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full min-h-screen overflow-x-hidden bg-[#030035]"
    >
      <SharedHeroSection 
        eyebrowText={product.sector}
        titleTop={product.label}
        titleBottom="DIMA Finance"
        description={product.tagline}
      />

      <div className="relative w-full h-screen overflow-hidden">
        {/* ── GRID & MESH BACKGROUND ── */}
        <SpotlightGridBackground isHighContrast={true} />

        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#030035] via-[#030035]/60 to-[#030035]/20" />

      {/* ── MAIN SPLIT-SCREEN CONTENT ── */}
      <div className="relative z-10 w-full h-full flex pt-28 pb-12">
        
        {/* KOLOM KIRI */}
        <div className="w-full lg:w-[50%] h-full pl-[5vw] md:pl-[8vw] lg:pl-[10vw] pr-6 lg:pr-10 overflow-y-auto no-scrollbar flex items-start lg:items-center pt-8 lg:pt-0">
          <div className="w-full flex flex-col pb-32">

            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[16px] font-extrabold tracking-[0.4em] uppercase text-[#E5997B]">
                {product.number}
              </span>
              <div className="w-10 h-[2px] bg-[#E5997B]/40" />
            </div>

            <h2
              className="text-[2.8rem] sm:text-[3.8rem] md:text-[4.5vw] lg:text-[4.8vw] leading-[1.05] tracking-tight font-normal mb-8 break-words hyphens-auto"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <AccentHeading heading={product.heading} />
            </h2>
            
            <div className="w-full xl:w-[95%] mb-12">
              <ProductLayerTabs
                product={product}
                activeLayer={activeLayer}
                onSelect={setActiveLayer}
              />
            </div>
            
            {/* Show CTA on left column for Mobile (hidden on desktop) */}
            <div className="flex lg:hidden mb-12">
              <Link
                to={PRODUCTOS_CTA_LINK}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#E5997B] text-white font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#F4F4F5] hover:text-[#030035] hover:pl-12 border border-[#E5997B] shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              >
                <span className="relative z-10">Conocer más</span>
                <svg
                  className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 w-4 h-4 text-white group-hover:text-[#030035]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="hidden lg:flex w-[50%] h-full pr-[2vw] md:pr-[4vw] lg:pr-[5vw] items-center justify-end relative">
          <div className="w-full max-w-2xl xl:max-w-4xl h-[75vh] relative rounded-3xl overflow-hidden group cursor-none">

            <AnimatePresence mode="wait">
              <motion.img
                key={displayIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.85, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={['/illustration-compressed/products/bridge.webp', '/illustration-compressed/products/cycle.webp', '/illustration-compressed/products/gear-machine.webp', '/illustration-compressed/products/invoice.webp', '/illustration-compressed/products/menara.webp', '/illustration-compressed/products/tabung.webp'][displayIndex] || '/illustration-compressed/products/bridge.webp'}
                alt="Product Showcase"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            </AnimatePresence>

            {/* Hover Trail Overlay */}
            <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />

            {/* Nomor Kiri Bawah (Di dalam gambar) */}
            <div className="absolute bottom-10 left-8 z-20 pointer-events-none">
              <span className="font-mono text-xs text-[#E5997B] font-bold tracking-widest uppercase shadow-black drop-shadow-md">
                {product.number} // Activating
              </span>
            </div>

            {/* BUTTON CTA Kanan Bawah (Di dalam gambar) */}
            <div className="absolute bottom-6 right-6 z-30 pointer-events-auto">
              <Link
                to={PRODUCTOS_CTA_LINK}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#E5997B] text-white font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#F4F4F5] hover:text-[#030035] hover:pl-12 border border-[#E5997B] shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              >
                <span className="relative z-10">Conocer más</span>
                <svg
                  className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 w-4 h-4 text-white group-hover:text-[#030035]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
      </div>
      <CTA/>
    </motion.div>
  )
}
