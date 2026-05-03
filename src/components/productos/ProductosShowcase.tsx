import { useEffect, useRef, useState } from 'react'
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

interface Product {
  number: string
  label: string
  tagline: string
  heading: string
  description: string[]
  features: string[]
  image: string
  ctaLink: string
}

interface Props {
  products: Product[]
}

/* ─────────────── PRODUCT VISUALS (planet nav icons) ─────────────── */

function ProductVisual({ index, isActive = false }: { index: number; isActive?: boolean }) {
  const stroke = '#E5997B'
  const dim = 'rgba(229,153,123,0.3)'
  const dim2 = 'rgba(244,244,245,0.2)'
  const activeFill = isActive ? 'rgba(229,153,123,0.25)' : 'rgba(229,153,123,0.08)'
  const activeStroke = isActive ? 0.9 : 0.5
  const activeDim = isActive ? 0.5 : 0.2

  const visuals = [
    <svg key="s" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="15" y="70" width="16" height="55" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="15" y="85" width="16" height="40" rx="2" fill={activeFill} />
      <rect x="43" y="45" width="16" height="80" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="43" y="60" width="16" height="65" rx="2" fill={activeFill} />
      <rect x="71" y="25" width="16" height="100" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="71" y="40" width="16" height="85" rx="2" fill={activeFill} />
      <rect x="99" y="55" width="16" height="70" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="99" y="70" width="16" height="55" rx="2" fill={activeFill} />
      <path d="M23 65 L51 40 L79 20 L107 50" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="107" cy="50" r="4" fill={stroke} />
    </svg>,

    <svg key="b" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="18" y="75" width="22" height="55" rx="1" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="18" y="95" width="22" height="35" fill={activeFill} />
      <rect x="100" y="55" width="22" height="75" rx="1" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <path d="M40 75 Q70 15 100 55" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="40" y1="75" x2="40" y2="130" stroke={stroke} strokeOpacity={activeDim} strokeDasharray="3 4" />
      <line x1="100" y1="55" x2="100" y2="130" stroke={dim2} strokeOpacity={activeDim} strokeDasharray="3 4" />
      <text x="29" y="68" fill={stroke} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>COST</text>
      <text x="111" y="48" fill="#F4F4F5" fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeDim}>REV</text>
    </svg>,

    <svg key="c" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="35" y="20" width="70" height="100" rx="2" stroke={stroke} strokeWidth="2" strokeOpacity={activeStroke} />
      <rect x="35" y="65" width="70" height="55" fill={activeFill} />
      <path d="M35 65 Q52 58 70 65 T105 65" stroke={stroke} strokeWidth="2" fill="none" />
      <line x1="112" y1="35" x2="125" y2="35" stroke={stroke} strokeOpacity={activeStroke} />
      <polygon points="122,30 130,35 122,40" fill={stroke} fillOpacity={activeStroke} />
      <text x="28" y="90" fill={stroke} fontSize="7" textAnchor="end" fontFamily="monospace">LIQ</text>
      <text x="28" y="40" fill="#F4F4F5" fontSize="7" textAnchor="end" fontFamily="monospace" opacity={activeDim}>USE</text>
    </svg>,

    <svg key="a" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <circle cx="105" cy="30" r="14" fill={activeFill} stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <line x1="70" y1="125" x2="70" y2="55" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M70 85 Q50 72 42 50" stroke={stroke} strokeWidth="2" fill="none" />
      <path d="M70 75 Q90 62 98 40" stroke={stroke} strokeWidth="2" fill="none" />
      <ellipse cx="42" cy="45" rx="7" ry="14" fill={activeFill} stroke={stroke} strokeWidth="1" strokeOpacity={activeStroke} />
      <ellipse cx="98" cy="35" rx="7" ry="14" fill={activeFill} stroke={stroke} strokeWidth="1" strokeOpacity={activeStroke} />
      <circle cx="35" cy="125" r="3" fill={stroke} fillOpacity={activeStroke} />
      <circle cx="70" cy="125" r="3" fill={stroke} fillOpacity={activeStroke} />
      <circle cx="105" cy="125" r="3" fill={stroke} fillOpacity={activeStroke} />
    </svg>,

    <svg key="f" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="12" y="42" width="34" height="48" rx="3" stroke={dim2} strokeWidth="1.5" strokeOpacity={activeDim} />
      <line x1="20" y1="58" x2="38" y2="58" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <line x1="20" y1="68" x2="34" y2="68" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <line x1="20" y1="78" x2="30" y2="78" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <path d="M55 66 L85 66" stroke={stroke} strokeWidth="2.5" strokeDasharray="4 4" />
      <polygon points="80,60 92,66 80,72" fill={stroke} />
      <circle cx="115" cy="66" r="18" stroke={stroke} strokeWidth="2" fill={activeFill} />
      <text x="115" y="70" fill={stroke} fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">$</text>
      <text x="115" y="108" fill={stroke} fontSize="6" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>EFECTIVO</text>
    </svg>,

    <svg key="l" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="40" y="22" width="60" height="42" rx="4" stroke={stroke} strokeWidth="1.5" fill={activeFill} strokeOpacity={activeStroke} />
      <rect x="48" y="30" width="18" height="12" fill={dim} />
      <rect x="74" y="30" width="18" height="12" fill={dim} />
      <circle cx="55" cy="72" r="6" stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <circle cx="85" cy="72" r="6" stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <rect x="15" y="92" width="110" height="10" rx="5" fill={dim2} fillOpacity={0.12} stroke={dim2} strokeWidth="0.5" />
      <rect x="15" y="92" width="78" height="10" rx="5" fill={stroke} fillOpacity={activeStroke} />
      <text x="70" y="120" fill={stroke} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>PROPIEDAD PROGRESIVA</text>
    </svg>,
  ]

  return visuals[index] ?? null
}

/* ─────────────── HELPERS ─────────────── */

function AccentHeading({ heading }: { heading: string }) {
  const words = heading.trim().split(/\s+/)
  return (
    <>
      <span className="text-[#E5997B]">{words[0]}</span>
      {words.length > 1 && <> {words.slice(1).join(' ')}</>}
    </>
  )
}

function ScrollDots({
  total,
  active,
  onSelect,
}: {
  total: number
  active: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="focus:outline-none"
          aria-label={`Product ${i + 1}`}
        >
          <motion.div
            animate={{ height: active === i ? 22 : 6, opacity: active === i ? 1 : 0.28 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-[2px] rounded-full bg-[#E5997B] hover:opacity-60"
          />
        </button>
      ))}
    </div>
  )
}

/* ─────────────── MAIN COMPONENT ─────────────── */

export default function ProductosShowcase({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef   = useRef<any>(null)
  const [active, setActive] = useState(0)
  const [prev,   setPrev]   = useState(0)
  const [vantaReady, setVantaReady] = useState(false)

  const dir = active >= prev ? 1 : -1

  /* ── GSAP ScrollTrigger pin ── */
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'productScroll',
        trigger: sectionRef.current!,
        start: 'top top',
        // ✅ 1000vh per produk — scroll terasa jauh lebih pelan & terkontrol
        end: `+=${products.length * 1000}vh`,
        pin: true,
        scrub: 4, // ✅ lebih tinggi = transisi smooth, tidak langsung loncat antar produk
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * products.length),
            products.length - 1,
          )
          setActive(cur => {
            if (cur !== idx) setPrev(cur)
            return idx
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [products.length])

  /* ── Click nav → scroll to that product's position ── */
  const scrollToProduct = (index: number) => {
    const st = ScrollTrigger.getById('productScroll')
    if (!st) return
    const scrollRange = st.end - st.start
    const target = st.start + (index / Math.max(products.length - 1, 1)) * scrollRange
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  /* ── Vanta Globe ── */
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
              scale: 1,
              scaleMobile: 1,
              color: 0xE5997B,
              color2: 0xE5997B,
              backgroundColor: 0x030035,
              size: 1.1,
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

  const wordCount = p.heading.split(' ').length
  const headingSize =
    wordCount > 5 ? 'clamp(3rem, 5.5vw, 6rem)' :
    wordCount > 3 ? 'clamp(3.5rem, 6.5vw, 7rem)' :
                    'clamp(4rem, 8.5vw, 8.5rem)'

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#030035]"
    >
      {!vantaReady && <div className="absolute inset-0 bg-[#030035] z-0" />}

      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#030035]/92 via-[#030035]/45 to-[#030035]/10" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-[#030035]/80 via-transparent to-[#030035]/40" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 border-b border-[#F4F4F5]/[0.05] px-8 md:px-14 py-5 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.5em] uppercase text-[#F4F4F5]/20">
          DIMA Finance — Portafolio
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5997B] animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#F4F4F5]/20">
            {String(active + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Right dot nav */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-30">
        <ScrollDots total={products.length} active={active} onSelect={scrollToProduct} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 h-full flex items-center pt-12 pb-28">
        <div className="pl-[5vw] md:pl-[8vw] lg:pl-[10vw] pr-16 md:pr-24 w-full max-w-[min(1200px,85vw)]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`content-${active}`}
              custom={dir}
              variants={{
                enter:  (d) => ({ opacity: 0, y: d * 24, filter: 'blur(6px)' }),
                center:      ({ opacity: 1, y: 0,        filter: 'blur(0px)' }),
                exit:   (d) => ({ opacity: 0, y: d * -16, filter: 'blur(3px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[13px] tracking-[0.5em] uppercase text-[#E5997B]/80">
                  {p.number}
                </span>
                <div className="w-8 h-px bg-[#E5997B]/40" />
                <span className="font-mono text-[13px] tracking-[0.4em] uppercase text-[#F4F4F5]/55">
                  {p.tagline}
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-display font-light text-[#F4F4F5] leading-[1.02] tracking-tight mb-7"
                style={{ fontSize: headingSize }}
              >
                <AccentHeading heading={p.heading} />
              </h2>

              {/* Ornament */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-px bg-[#E5997B]/35" />
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M4 0L8 4L4 8L0 4Z" fill="#E5997B" opacity="0.5" />
                </svg>
                <div className="flex-1 h-px bg-[#F4F4F5]/[0.12] max-w-[100px]" />
              </div>

              {/* Description */}
              <p className="font-body text-[#F4F4F5]/85 text-[20px] md:text-[22px] leading-[1.88] mb-3 border-l-2 border-[#E5997B]/50 pl-5 max-w-[min(720px,65vw)]">
                {p.description[0]}
              </p>
              {p.description[1] && (
                <p className="font-body text-[#F4F4F5]/60 text-[18px] md:text-[20px] leading-[1.82] mb-8 pl-5 max-w-[min(680px,61vw)]">
                  {p.description[1]}
                </p>
              )}

              {/* Features */}
              <div className="mb-9 pl-1">
                <p className="font-mono text-[11px] tracking-[0.5em] uppercase text-[#E5997B]/60 mb-4">
                  Características
                </p>
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 max-w-[min(680px,60vw)]">
                  {p.features.map((f, fi) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className="font-mono text-[#E5997B]/55 text-[12px] mt-0.5 shrink-0">
                        {String(fi + 1).padStart(2, '0')}
                      </span>
                      <span className="font-body text-[#F4F4F5]/80 text-[16px] leading-relaxed">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link to={p.ctaLink} className="group inline-flex items-center self-start">
                <div className="relative overflow-hidden rounded-l-sm">
                  <div className="absolute inset-0 bg-[#E5997B] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <div className="relative border border-[#E5997B]/50 group-hover:border-[#E5997B] px-9 py-4 flex items-center transition-colors duration-300">
                    <span className="font-mono text-[12px] tracking-[0.4em] uppercase text-[#E5997B] group-hover:text-[#030035] transition-colors duration-300">
                      Conocer más
                    </span>
                  </div>
                </div>
                <div className="border border-l-0 border-[#E5997B]/25 group-hover:border-[#E5997B]/60 px-4 py-4 flex items-center transition-colors duration-300 rounded-r-sm">
                  <svg
                    className="w-4 h-4 text-[#E5997B]/50 group-hover:text-[#E5997B] group-hover:translate-x-0.5 transition-all duration-300"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM PLANET NAV ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-[#F4F4F5]/[0.05]">
        <div className="flex">
          {products.map((prod, i) => (
            <button
              key={prod.number}
              onClick={() => scrollToProduct(i)}
              className="group relative flex-1 flex flex-col items-center gap-2 py-3.5 px-2 focus:outline-none hover:bg-[#F4F4F5]/[0.025] transition-colors duration-300"
            >
              <div
                className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  active === i
                    ? 'w-11 h-11 -translate-y-1.5'
                    : 'w-7 h-7 opacity-40 group-hover:opacity-75'
                }`}
              >
                <div className="relative w-full h-full drop-shadow-[0_0_8px_rgba(229,153,123,0.25)]">
                  <AnimatePresence>
                    {active === i && (
                      <motion.div
                        key={`glow-${i}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-[-10px] bg-[#E5997B]/15 blur-xl rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <ProductVisual index={i} isActive={active === i} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="font-mono text-[8px] tracking-[0.4em] uppercase transition-colors duration-300"
                  style={{ color: active === i ? '#E5997B' : 'rgba(244,244,245,0.2)' }}
                >
                  {prod.number}
                </span>
                <span
                  className="font-display text-[10px] md:text-[12px] leading-tight truncate w-full text-center transition-colors duration-300"
                  style={{ color: active === i ? 'rgba(244,244,245,0.88)' : 'rgba(244,244,245,0.2)' }}
                >
                  {prod.label}
                </span>
              </div>

              {active === i && (
                <motion.div
                  layoutId="activePlanetDot"
                  className="absolute bottom-1 w-1 h-1 bg-[#E5997B] rounded-full"
                  transition={{ duration: 0.35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}