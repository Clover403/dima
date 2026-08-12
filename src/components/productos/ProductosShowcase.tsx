import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductVisual from '../../unused/products/ProductVisual'
import { PRODUCTOS_CTA_LINK, type ProductData } from '../../data/productos'
import HoverTrailOverlay from '../HoverTrailOverlay'

/* ─────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────── */
interface Props {
  products: ProductData[]
}

export type LayerKey = 'solution' | 'instrument' | 'structure'

export const LAYERS: { key: LayerKey; label: string; sublabel: string; connector: string }[] = [
  { key: 'solution',   label: 'Solution',   sublabel: 'Objetivo de negocio',  connector: 'solved via'       },
  { key: 'instrument', label: 'Instrument', sublabel: 'El contrato financiero', connector: 'designed through' },
  { key: 'structure',  label: 'Structure',  sublabel: 'Ingeniería financiera', connector: ''                 },
]

const PRODUCT_IMAGES = [
  '/illustration-compressed/products/bridge.webp', 
  '/illustration-compressed/products/cycle.webp', 
  '/illustration-compressed/products/gear-machine.webp', 
  '/illustration-compressed/products/invoice.webp', 
  '/illustration-compressed/products/menara.webp', 
  '/illustration-compressed/products/tabung.webp'
]

/* ─────────────── HELPERS ─────────────── */
function AccentHeading({ heading }: { heading: string }) {
  const words = heading.trim().split(/\s+/)
  return (
    <>
      <span style={{ color: '#F4F4F5' }}>{words[0]}</span>
      {words.length > 1 && <span style={{ color: '#E5997B', fontStyle: 'normal' }}> {words.slice(1).join(' ')}</span>}
    </>
  )
}

function ScrollDots({ total, active, onSelect }: { total: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-[8px]">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onSelect(i)} className="focus:outline-none" aria-label={`Product ${i + 1}`}>
          <motion.div
            animate={{ height: active === i ? 20 : 6, opacity: active === i ? 1 : 0.3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`w-[3px] rounded-full transition-colors ${active === i ? 'bg-[#E5997B]' : 'bg-[#F4F4F5]/50 hover:bg-[#E5997B]'}`}
          />
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   LAYER TABS COMPONENT
───────────────────────────────────────────── */
export function ProductLayerTabs({
  product,
  activeLayer,
  onSelect,
}: {
  product: ProductData
  activeLayer: LayerKey
  onSelect: (k: LayerKey) => void
}) {
  const current = product[activeLayer]

  return (
    <div className="flex flex-col w-full h-full justify-center">
      {/* Container diubah jadi flex-wrap untuk mobile agar rapi */}
      <div className="self-start md:inline-flex flex-wrap items-center justify-center p-1 rounded-3xl md:rounded-full bg-[#F4F4F5]/5 border border-[#F4F4F5]/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] mb-4 md:mb-6">
        {LAYERS.map(({ key, label }) => {
          const isActive = activeLayer === key
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`
                relative px-3 py-1.5 md:px-6 md:py-2 rounded-full font-mono text-[9px] md:text-[10px] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase transition-colors duration-300 focus:outline-none select-none flex-1 md:flex-none text-center
                ${isActive ? 'text-white' : 'text-[#F4F4F5]/70 hover:text-[#F4F4F5]'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLayerNavbarPill"
                  className="absolute inset-0 bg-[#E5997B] rounded-full shadow-[0_4px_15px_rgba(229,153,123,0.4)]"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`layer-${activeLayer}`}
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: -10, filter: 'blur(3px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col gap-4 md:gap-5 lg:gap-6"
        >
          <div className="py-1 text-[#F4F4F5]/90">
            {/* Teks di mobile lebih kecil */}
            <p className="font-body text-base md:text-xl lg:text-2xl leading-relaxed font-light">
              {current.content}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mt-1 md:mt-2">
            {current.details.map((d, i) => (
              <div 
                key={i} 
                className="group flex items-start md:items-center gap-3 md:gap-4 lg:gap-5 transition-all duration-300 text-[#F4F4F5]/70 hover:text-[#F4F4F5]"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#E5997B] border border-[#E5997B] flex items-center justify-center shrink-0 shadow-sm mt-0.5 md:mt-0">
                  <span className="font-mono text-[10px] md:text-xs lg:text-sm font-bold tracking-tighter text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                {/* Teks bullet di mobile lebih kecil */}
                <span className="font-body text-sm md:text-base lg:text-xl leading-snug font-light">
                  {d}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ProductosShowcase({ products }: Props) {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(0)
  const [activeLayer, setActiveLayer] = useState<LayerKey>('solution')
  const [isDetailView, setIsDetailView] = useState(false)
  const [autoIndex, setAutoIndex] = useState(0)

  const dir = active >= prev ? 1 : -1

  useEffect(() => {
    setActiveLayer('solution')
  }, [active])

  useEffect(() => {
    if (isDetailView) return
    const interval = setInterval(() => {
      setAutoIndex((current) => (current + 1) % products.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isDetailView, products.length])

  const scrollToProduct = useCallback((index: number) => {
    setIsDetailView(true)
    setActive(cur => {
      if (cur !== index) setPrev(cur)
      return index
    })
  }, [])

  const handleLayerSelect = useCallback((key: LayerKey) => {
    setActiveLayer(key)
  }, [])

  const p = products[active]
  const displayIndex = isDetailView ? active : autoIndex

  return (
    <div className="relative w-full h-[100dvh] md:h-screen overflow-hidden bg-[#030035]">
      
      {/* ── GRID & MESH BACKGROUND ── */}
      {/* <SpotlightGridBackground isHighContrast={true} /> */}

      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#030035] via-[#030035]/60 to-[#030035]/20" />

      {isDetailView && (
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
          <ScrollDots total={products.length} active={active} onSelect={scrollToProduct} />
        </div>
      )}

      {/* ── MAIN SPLIT-SCREEN CONTENT ── */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center pt-24 md:pt-14 lg:pt-12 pb-6 lg:pb-24">
        
        {/* KOLOM KIRI (Disesuaikan padding untuk mobile) */}
        <div className="w-full lg:w-[50%] h-full px-5 md:pl-[6vw] lg:pl-[8vw] lg:pr-8 flex items-center">
          <AnimatePresence mode="wait">
            {!isDetailView ? (
              // ── TAMPILAN CARDS ──
             <motion.div
                key="cards-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-[calc(100dvh-120px)] lg:h-[70vh] overflow-y-auto pb-32 lg:pb-0 grid grid-cols-2 gap-3 lg:gap-5 hide-scrollbar pt-2"
              >
                <style>{`
                  /* Hide scrollbar for Chrome, Safari and Opera */
                  .hide-scrollbar::-webkit-scrollbar { display: none; }
                  /* Hide scrollbar for IE, Edge and Firefox */
                  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                {products.map((prod, i) => (
                  <button
                    key={prod.number}
                    onClick={() => scrollToProduct(i)}
                    className="group text-left p-4 lg:p-5 flex flex-col justify-between w-full h-full min-h-[130px] lg:min-h-[160px] bg-[#F4F4F5]/5 border border-[#F4F4F5]/10 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(229,153,123,0.15)] rounded-2xl transition-all duration-500 transform hover:-translate-y-1 hover:border-[#E5997B]/30"
                  >
                    <div className="flex justify-between items-start mb-2 lg:mb-3">
                      <span className="font-mono text-[9px] lg:text-sm font-extrabold text-[#E5997B] bg-[#E5997B]/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-md">{prod.number}</span>
                      {/* hidden dihapus, ukuran disesuaikan jadi w-8 h-8 untuk mobile */}
                     <div className="block w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 origin-top-right">
                        <ProductVisual index={i} isActive={true} inverted={true} />
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="font-display font-semibold text-[#F4F4F5] text-base sm:text-lg lg:text-[1.75rem] mb-1 lg:mb-2 leading-tight group-hover:text-[#E5997B] transition-colors">{prod.label}</h3>
                      <p className="hidden md:block font-body text-[#F4F4F5]/70 text-sm lg:text-xl line-clamp-2 lg:line-clamp-3 leading-snug">{prod.tagline}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              // ── TAMPILAN DETAIL PRODUK ──
              <motion.div
                key={`content-${active}`}
                custom={dir}
                variants={{
                  enter:  (d) => ({ opacity: 0, y: d * 20, filter: 'blur(6px)' }),
                  center:       ({ opacity: 1, y: 0,        filter: 'blur(0px)' }),
                  exit:   (d) => ({ opacity: 0, y: d * -14, filter: 'blur(3px)' }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                // Overflow-y auto untuk mobile jika konten terlalu panjang
                className="w-full h-full max-h-[85vh] md:h-[70vh] flex flex-col justify-start md:justify-center overflow-y-auto overflow-x-hidden hide-scrollbar pb-10 md:pb-0"
              >
                <button 
                  onClick={() => setIsDetailView(false)}
                  className="mb-4 md:mb-6 self-start flex items-center gap-2 font-mono font-bold text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#F4F4F5]/70 hover:text-[#E5997B] transition-colors bg-[#F4F4F5]/5 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-[#F4F4F5]/10 hover:border-[#E5997B]/30"
                >
                  <span>←</span> Volver a tarjetas
                </button>

                {/* GAMBAR KHUSUS MOBILE DI ATAS */}
                <div className="block lg:hidden w-full h-[25vh] min-h-[160px] rounded-2xl overflow-hidden mb-5 relative shrink-0 cursor-none">
                  <img src={PRODUCT_IMAGES[displayIndex]} alt="Product" className="absolute inset-0 w-full h-full object-cover bg-white" />
                  <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />
                  <div className="absolute bottom-3 left-3 bg-white/60 px-2 py-1 backdrop-blur-sm rounded-md z-30">
                    <span className="font-mono text-[9px] text-[#030035] font-bold tracking-widest uppercase">
                      {p.number}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-30">
                    <Link
                      to={PRODUCTOS_CTA_LINK}
                      className="inline-flex items-center justify-center px-3 py-1.5 bg-[#E5997B] text-white font-body font-bold text-[9px] tracking-[0.2em] uppercase rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-md"
                    >
                      Conocer más
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2 md:mb-4">
                  <span className="font-mono text-[11px] md:text-[14px] font-extrabold tracking-[0.3em] uppercase text-[#E5997B]">
                    {p.number}
                  </span>
                  <div className="w-6 md:w-8 h-[2px] bg-[#E5997B]/40" />
                </div>

                <h2
                  className="text-[2rem] sm:text-[2.5rem] md:text-[3.8vw] lg:text-[4vw] leading-[1.05] tracking-tight font-normal mb-4 md:mb-6 break-words hyphens-auto"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <AccentHeading heading={p.heading} />
                </h2>
                
                <div className="w-full xl:w-[95%]">
                  <ProductLayerTabs
                    product={p}
                    activeLayer={activeLayer}
                    onSelect={handleLayerSelect}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* KOLOM KANAN (TIDAK DIUBAH UNTUK DESKTOP) */}
        <div className="hidden lg:flex w-[50%] h-full pr-[2vw] md:pr-[4vw] lg:pr-[5vw] items-center justify-end relative">
          <div className="w-full max-w-xl xl:max-w-3xl h-[70vh] relative rounded-3xl overflow-hidden group shadow-2xl bg-white cursor-none">
            
            {PRODUCT_IMAGES.map((img, idx) => (
              <motion.img
                key={img}
                src={img}
                alt="Product Showcase"
                initial={false}
                animate={{
                  opacity: displayIndex === idx ? 1 : 0,
                  scale: displayIndex === idx ? 1.05 : 1,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            ))}

            {/* Hover Trail Overlay */}
            <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />
            
            <div className="absolute bottom-8 left-6 z-20 bg-white/60 px-2.5 py-1 backdrop-blur-sm rounded-md">
              <span className="font-mono text-[11px] text-[#030035] font-bold tracking-widest uppercase">
                {products[displayIndex]?.number}
              </span>
            </div>

            {isDetailView && (
              <div className="absolute bottom-5 right-5 z-30">
                <Link
                  to={PRODUCTOS_CTA_LINK}
                  className="group relative inline-flex items-center justify-center px-6 py-3 bg-[#E5997B] text-white font-body font-medium text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#F4F4F5] hover:text-[#030035] hover:pl-10 border border-[#E5997B] shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md pointer-events-auto"
                >
                  <span className="relative z-10">Conocer más</span>
                  <svg
                    className="absolute left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 w-3.5 h-3.5 text-white group-hover:text-[#030035]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM PLANET NAV (TIDAK DIUBAH UNTUK DESKTOP) ── */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-30 border-t border-[#F4F4F5]/10 bg-[#030035]/80 backdrop-blur-xl">
        <div className="flex justify-center items-center gap-5 md:gap-10 mx-auto max-w-4xl px-4">
          {products.map((prod, i) => (
            <button
              key={prod.number}
              onClick={() => scrollToProduct(i)}
              className="group relative flex flex-col items-center gap-1.5 py-4 px-3 focus:outline-none hover:bg-[#E5997B]/10 rounded-xl transition-colors duration-300"
            >
              <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 drop-shadow-md contrast-125 brightness-110 ${isDetailView && active === i ? 'w-14 h-14 -translate-y-2' : 'w-10 h-10'}`}>
                <div className="relative w-full h-full">
                  <AnimatePresence>
                    {isDetailView && active === i && (
                      <motion.div
                        key={`glow-${i}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-[-12px] bg-[#E5997B]/60 blur-2xl rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <ProductVisual index={i} isActive={isDetailView && active === i} inverted={true} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 mt-1">
                <span className="font-display font-semibold text-[10px] md:text-[12px] leading-tight text-center transition-colors duration-300 whitespace-nowrap" style={{ color: isDetailView && active === i ? '#F4F4F5' : 'rgba(244,244,245,0.75)' }}>
                  {prod.label}
                </span>
              </div>

              {isDetailView && active === i && (
                <motion.div layoutId="activePlanetDot" className="absolute bottom-1 w-1 h-1 bg-[#E5997B] rounded-full" transition={{ duration: 0.35 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}