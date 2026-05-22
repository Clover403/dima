import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────── CDN SCRIPT LOADER ─────────────── */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ProductLayer {
  content: string
  details: string[]
}

interface Product {
  number: string
  label: string
  tagline: string
  heading: string
  sector: string
  solution: ProductLayer
  instrument: ProductLayer
  structure: ProductLayer
  ctaLink: string
}

interface Props {
  products: Product[]
}

type LayerKey = 'solution' | 'instrument' | 'structure'

/* ─────────────────────────────────────────────
   LAYER CONFIG
───────────────────────────────────────────── */
const LAYERS: { key: LayerKey; label: string; sublabel: string; connector: string }[] = [
  { key: 'solution',   label: 'Solution',   sublabel: 'Objetivo de negocio',  connector: 'solved via'       },
  { key: 'instrument', label: 'Instrument', sublabel: 'El contrato financiero', connector: 'designed through' },
  { key: 'structure',  label: 'Structure',  sublabel: 'Ingeniería financiera', connector: ''                 },
]

/* ─────────────────────────────────────────────
   PRODUCT VISUALS
───────────────────────────────────────────── */
function ProductVisual({ index, isActive = false }: { index: number; isActive?: boolean }) {
  const stroke = '#030035'
  const dim2 = 'rgba(229,153,123,0.7)'
  const activeFill = isActive ? 'rgba(3,0,53,0.1)' : 'rgba(3,0,53,0.03)'
  const activeStroke = isActive ? 1 : 0.4
  const activeDim = isActive ? 0.9 : 0.5
  const textColorDim = '#E5997B'

  const visuals = [
    // 01
    <svg key="s" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="15" y="70" width="16" height="55" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="15" y="85" width="16" height="40" rx="2" fill={activeFill} />
      <rect x="43" y="45" width="16" height="80" rx="2" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <rect x="43" y="60" width="16" height="65" rx="2" fill={activeFill} />
      <rect x="71" y="25" width="16" height="100" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="71" y="40" width="16" height="85" rx="2" fill={activeFill} />
      <rect x="99" y="55" width="16" height="70" rx="2" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <rect x="99" y="70" width="16" height="55" rx="2" fill={activeFill} />
      <path d="M23 65 L51 40 L79 20 L107 50" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="107" cy="50" r="4" fill={textColorDim} />
    </svg>,

    // 02
    <svg key="b" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="18" y="75" width="22" height="55" rx="1" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="18" y="95" width="22" height="35" fill={activeFill} />
      <rect x="100" y="55" width="22" height="75" rx="1" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <path d="M40 75 Q70 15 100 55" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="40" y1="75" x2="40" y2="130" stroke={stroke} strokeOpacity={activeDim} strokeDasharray="3 4" />
      <line x1="100" y1="55" x2="100" y2="130" stroke={dim2} strokeOpacity={activeDim} strokeDasharray="3 4" />
      <text x="29" y="68" fill={stroke} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>COST</text>
      <text x="111" y="48" fill={textColorDim} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeDim}>REV</text>
    </svg>,

    // 03
    <svg key="c" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="35" y="20" width="70" height="100" rx="2" stroke={stroke} strokeWidth="2" strokeOpacity={activeStroke} />
      <rect x="35" y="65" width="70" height="55" fill={activeFill} />
      <path d="M35 65 Q52 58 70 65 T105 65" stroke={dim2} strokeWidth="2" fill="none" />
      <line x1="112" y1="35" x2="125" y2="35" stroke={stroke} strokeOpacity={activeStroke} />
      <polygon points="122,30 130,35 122,40" fill={textColorDim} fillOpacity={activeDim} />
      <text x="28" y="90" fill={stroke} fontSize="7" textAnchor="end" fontFamily="monospace">LIQ</text>
      <text x="28" y="40" fill={textColorDim} fontSize="7" textAnchor="end" fontFamily="monospace" opacity={activeDim}>USE</text>
    </svg>,

    // 04
    <svg key="a" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <circle cx="105" cy="30" r="14" fill={activeFill} stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <line x1="70" y1="125" x2="70" y2="55" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M70 85 Q50 72 42 50" stroke={dim2} strokeWidth="2" fill="none" />
      <path d="M70 75 Q90 62 98 40" stroke={dim2} strokeWidth="2" fill="none" />
      <ellipse cx="42" cy="45" rx="7" ry="14" fill={activeFill} stroke={stroke} strokeWidth="1" strokeOpacity={activeStroke} />
      <ellipse cx="98" cy="35" rx="7" ry="14" fill={activeFill} stroke={stroke} strokeWidth="1" strokeOpacity={activeStroke} />
      <circle cx="35" cy="125" r="3" fill={textColorDim} fillOpacity={activeDim} />
      <circle cx="70" cy="125" r="3" fill={stroke} fillOpacity={activeStroke} />
      <circle cx="105" cy="125" r="3" fill={textColorDim} fillOpacity={activeDim} />
    </svg>,

    // 05
    <svg key="f" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="12" y="42" width="34" height="48" rx="3" stroke={dim2} strokeWidth="1.5" strokeOpacity={activeDim} />
      <line x1="20" y1="58" x2="38" y2="58" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <line x1="20" y1="68" x2="34" y2="68" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <line x1="20" y1="78" x2="30" y2="78" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <path d="M55 66 L85 66" stroke={stroke} strokeWidth="2.5" strokeDasharray="4 4" />
      <polygon points="80,60 92,66 80,72" fill={textColorDim} />
      <circle cx="115" cy="66" r="18" stroke={stroke} strokeWidth="2" fill={activeFill} />
      <text x="115" y="70" fill={stroke} fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">$</text>
      <text x="115" y="108" fill={textColorDim} fontSize="6" textAnchor="middle" fontFamily="monospace" opacity={activeDim}>ACTIVO</text>
    </svg>,

    // 06
    <svg key="l" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="40" y="22" width="60" height="42" rx="4" stroke={stroke} strokeWidth="1.5" fill={activeFill} strokeOpacity={activeStroke} />
      <rect x="48" y="30" width="18" height="12" fill={dim2} opacity={activeDim} />
      <rect x="74" y="30" width="18" height="12" fill={dim2} opacity={activeDim} />
      <circle cx="55" cy="72" r="6" stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <circle cx="85" cy="72" r="6" stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <rect x="15" y="92" width="110" height="10" rx="5" fill={stroke} fillOpacity={0.05} stroke={dim2} strokeWidth="0.5" />
      <rect x="15" y="92" width="78" height="10" rx="5" fill={textColorDim} fillOpacity={activeDim} />
      <text x="70" y="120" fill={stroke} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>LIQUIDEZ INMEDIATA</text>
    </svg>,
  ]

  return visuals[index] ?? null
}

/* ─────────────── HELPERS ─────────────── */
function AccentHeading({ heading }: { heading: string }) {
  const words = heading.trim().split(/\s+/)
  return (
    <>
      <span className="text-[#030035]">{words[0]}</span>
      {words.length > 1 && <span className="text-[#E5997B]"> {words.slice(1).join(' ')}</span>}
    </>
  )
}

function ScrollDots({ total, active, onSelect }: { total: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onSelect(i)} className="focus:outline-none" aria-label={`Product ${i + 1}`}>
          <motion.div
            animate={{ height: active === i ? 24 : 8, opacity: active === i ? 1 : 0.3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`w-[3px] rounded-full transition-colors ${active === i ? 'bg-[#E5997B]' : 'bg-[#030035] hover:bg-[#E5997B]'}`}
          />
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   LAYER TABS
───────────────────────────────────────────── */
function LayerTabs({
  product,
  activeLayer,
  onSelect,
}: {
  product: Product
  activeLayer: LayerKey
  onSelect: (k: LayerKey) => void
}) {
  const current = product[activeLayer]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex gap-0 border-b border-[#030035]/15">
        {LAYERS.map(({ key, label, sublabel }, i) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              relative flex-1 flex flex-col items-center gap-1.5 py-5 px-3
              transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${i < LAYERS.length - 1 ? 'border-r border-[#030035]/10' : ''}
              ${activeLayer === key ? 'bg-[#E5997B]/10' : 'hover:bg-[#030035]/5'}
            `}
          >
            {activeLayer === key && (
              <motion.div layoutId="layerTabBar" className="absolute top-0 left-0 right-0 h-[2px] bg-[#E5997B]" transition={{ duration: 0.3 }} />
            )}
            <span className={`font-mono text-[11px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 ${activeLayer === key ? 'text-[#030035]' : 'text-[#030035]/50'}`}>
              {label}
            </span>
            <span className={`font-body text-[12px] leading-tight text-center transition-colors duration-300 ${activeLayer === key ? 'text-[#030035]/90' : 'text-[#030035]/40'}`}>
              {sublabel}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-2">
        {LAYERS.map(({ key, connector }, i) => (
          <div key={key} className="flex items-center gap-2 flex-1">
            <div className={`h-[2px] flex-1 transition-colors duration-400 ${activeLayer === key ? 'bg-[#E5997B]/60' : 'bg-[#030035]/10'}`} />
            {i < LAYERS.length - 1 && (
              <>
                <span className="font-mono font-bold text-[9px] tracking-[0.35em] uppercase text-[#030035]/40 whitespace-nowrap">
                  {connector}
                </span>
                <svg viewBox="0 0 8 8" fill="none" className="w-2 h-2 opacity-60 shrink-0">
                  <path d="M4 0L8 4L4 8L0 4Z" fill="#E5997B" />
                </svg>
              </>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`layer-${activeLayer}`}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: -10, filter: 'blur(2px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-6"
        >
          <p className="font-body text-[#030035]/95 text-[22px] md:text-[26px] leading-[1.7] mb-8 border-l-4 border-[#E5997B] pl-4 md:pl-6">
            {current.content}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pl-4 md:pl-6">
            {current.details.map((d, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="font-mono text-white bg-[#E5997B] px-2 py-1 rounded text-[13px] mt-0.5 shrink-0 font-bold shadow-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-body text-[#030035]/85 text-[17px] md:text-[19px] leading-relaxed">
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
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef   = useRef<any>(null)

  const [active,      setActive]      = useState(0)
  const [prev,        setPrev]        = useState(0)
  const [activeLayer, setActiveLayer] = useState<LayerKey>('solution')
  const [vantaReady,  setVantaReady]  = useState(false)
  
  const [isDetailView, setIsDetailView] = useState(false)

  const dir = active >= prev ? 1 : -1

  useEffect(() => {
    setActiveLayer('solution')
  }, [active])

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

  useEffect(() => {
    let mounted = true
    let attempts = 0

    async function init() {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js')

        const check = () => {
          if (!mounted) return
          attempts++
          if ((window as any).VANTA?.GLOBE && sectionRef.current) {
            vantaRef.current?.destroy?.()
            vantaRef.current = (window as any).VANTA.GLOBE({
              el: sectionRef.current,
              THREE: (window as any).THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 0.8,
              scaleMobile: 0.6,
              color: 0x030035,
              color2: 0xE5997B,
              backgroundColor: 0xF4F4F5, 
              size: 0.85,
              points: 10,
              maxDistance: 25,
              spacing: 18,
            })
            setVantaReady(true)
          } else if (attempts < 50) setTimeout(check, 100)
        }
        check()
      } catch (e) { console.warn('Vanta failed:', e) }
    }

    init()
    return () => { mounted = false; vantaRef.current?.destroy?.() }
  }, [])

  const p = products[active]

  const wordCount = p?.heading?.split(' ').length || 0
  const headingSize =
    wordCount > 5 ? 'clamp(2.5rem, 4.5vw, 5rem)' :
    wordCount > 3 ? 'clamp(3rem,   5.5vw, 6rem)'  :
                    'clamp(3.5rem,  7vw,   7.5rem)'

  return (
    <div ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#F4F4F5]">
      {!vantaReady && <div className="absolute inset-0 bg-[#F4F4F5] z-0" />}

      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#F4F4F5] via-[#F4F4F5]/60 to-transparent" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-[#F4F4F5] via-transparent to-transparent" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 border-b border-[#030035]/10 px-8 md:px-14 py-5 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold tracking-[0.5em] uppercase text-[#030035]/60">
          DIMA Finance — Portafolio
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E5997B] animate-pulse" />
          <span className="font-mono text-[11px] font-bold tracking-[0.4em] uppercase text-[#030035]/60">
            {isDetailView ? `${String(active + 1).padStart(2, '0')} / ${String(products.length).padStart(2, '0')}` : 'OVERVIEW'}
          </span>
        </div>
      </div>

      {isDetailView && (
        <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-30">
          <ScrollDots total={products.length} active={active} onSelect={scrollToProduct} />
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 h-full flex items-center pt-14 pb-28">
        <div className="pl-[5vw] md:pl-[8vw] lg:pl-[10vw] pr-12 md:pr-20 w-full max-w-[min(1400px,92vw)]">
          <AnimatePresence mode="wait">
            {!isDetailView ? (
              // ── TAMPILAN CARDS ──
              <motion.div
                key="cards-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                {products.map((prod, i) => (
                  <button
                    key={prod.number}
                    onClick={() => scrollToProduct(i)}
                    className="group text-left p-10 bg-white shadow-[0_8px_30px_rgba(3,0,53,0.06)] hover:shadow-[0_20px_50px_rgba(229,153,123,0.15)] rounded-3xl transition-all duration-500 transform hover:-translate-y-1 border border-transparent hover:border-[#E5997B]/30"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-mono text-[18px] font-extrabold text-[#E5997B] bg-[#E5997B]/10 px-3 py-1 rounded-lg">{prod.number}</span>
                      <div className="w-24 h-24 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 origin-top-right">
                        <ProductVisual index={i} isActive={true} />
                      </div>
                    </div>
                    <h3 className="font-display font-semibold text-[#030035] text-3xl mb-3 leading-tight group-hover:text-[#E5997B] transition-colors">{prod.label}</h3>
                    <p className="font-body text-[#030035]/60 text-base line-clamp-2 leading-relaxed">{prod.tagline}</p>
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
                className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-x-16 xl:gap-x-24 gap-y-10 items-start"
              >
                <div className="flex flex-col w-full pr-6">
                  <button 
                    onClick={() => setIsDetailView(false)}
                    className="mb-10 self-start flex items-center gap-3 font-mono font-bold text-[11px] tracking-[0.2em] uppercase text-[#030035]/50 hover:text-[#E5997B] transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-[#030035]/5 hover:border-[#E5997B]/30"
                  >
                    <span>←</span> Volver a tarjetas
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-[16px] font-extrabold tracking-[0.4em] uppercase text-[#E5997B]">
                      {p.number}
                    </span>
                    <div className="w-10 h-[2px] bg-[#E5997B]/40" />
                    <span className="font-mono text-[13px] font-bold tracking-[0.3em] uppercase text-[#030035]/60">
                      {p.tagline}
                    </span>
                  </div>

                  <h2
                    className="font-display font-semibold text-[#030035] leading-[1.05] tracking-tight mb-5 break-words hyphens-auto"
                    style={{ fontSize: headingSize }}
                  >
                    <AccentHeading heading={p.heading} />
                  </h2>

                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-4 h-[2px] bg-[#E5997B]/60" />
                    <p className="font-mono text-[12px] font-bold tracking-[0.35em] uppercase text-[#030035]/50">
                      {p.sector}
                    </p>
                  </div>

                  {/* Tombol CTA Baru */}
                  <Link
                    to={p.ctaLink}
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#E5997B] text-white font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#030035] hover:pl-12 border border-[#E5997B] mt-4 self-start"
                  >
                    <span className="relative z-10">Conocer más</span>
                    <svg
                      className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>

                </div>

                <div className="w-full mt-8 lg:mt-0">
                  <LayerTabs
                    product={p}
                    activeLayer={activeLayer}
                    onSelect={handleLayerSelect}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM PLANET NAV ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-[#030035]/10 bg-white/40 backdrop-blur-md">
        <div className="flex">
          {products.map((prod, i) => (
            <button
              key={prod.number}
              onClick={() => scrollToProduct(i)}
              className="group relative flex-1 flex flex-col items-center gap-2 py-4 px-2 focus:outline-none hover:bg-[#E5997B]/5 transition-colors duration-300"
            >
              <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDetailView && active === i ? 'w-12 h-12 -translate-y-2' : 'w-8 h-8 opacity-50 group-hover:opacity-100'}`}>
                <div className="relative w-full h-full drop-shadow-[0_0_8px_rgba(229,153,123,0.2)]">
                  <AnimatePresence>
                    {isDetailView && active === i && (
                      <motion.div
                        key={`glow-${i}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-[-12px] bg-[#E5997B]/20 blur-xl rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <ProductVisual index={i} isActive={isDetailView && active === i} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-mono font-bold text-[10px] tracking-[0.4em] uppercase transition-colors duration-300" style={{ color: isDetailView && active === i ? '#E5997B' : 'rgba(3,0,53,0.4)' }}>
                  {prod.number}
                </span>
                <span className="font-display font-semibold text-[11px] md:text-[13px] leading-tight truncate w-full text-center transition-colors duration-300" style={{ color: isDetailView && active === i ? '#030035' : 'rgba(3,0,53,0.4)' }}>
                  {prod.label}
                </span>
              </div>

              {isDetailView && active === i && (
                <motion.div layoutId="activePlanetDot" className="absolute bottom-1 w-1.5 h-1.5 bg-[#E5997B] rounded-full" transition={{ duration: 0.35 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}