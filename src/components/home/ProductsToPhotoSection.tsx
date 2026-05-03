/**
 * ProductsToPhotoSection.tsx — v4.4 (FIX FINAL: gambar 100% stabil)
 *
 * KUNCI: Image di-render sebagai FIXED background-nya inner card,
 * bukan sebagai child yang ikut transform. Jadi meski parent di-rotate/scale,
 * image stay flat dan ga "nge-hentak".
 */

import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const products = [
  { name: 'Crédito Simple',          tagline: 'Anticipo del gasto enfocado en expandir la capacidad instalada.',       photo: '/foto/illust-growth.jpg'    },
  { name: 'Crédito Puente',           tagline: 'Sincronización del flujo de efectivo con el avance de obra.',           photo: '/foto/illust-buildings.jpg' },
  { name: 'Cuenta Corriente',         tagline: 'Mitigación táctica en el ciclo de conversión de efectivo.',             photo: '/foto/illust-piechart.jpg'  },
  { name: 'Crédito Agroindustrial',   tagline: 'Calibración del financiamiento a la maduración de activos biológicos.', photo: '/foto/illust-truck.jpg'     },
  { name: 'Arrendamiento Financiero', tagline: 'Uso de activos productivos con máxima eficienca de capital.',           photo: '/foto/illust-house.jpg'     },
  { name: 'Factoring',                tagline: 'Aceleración estratégica del ciclo de conversión de efectivo.',          photo: '/foto/illust-shipping.jpg'  },
]

const CARD_H       = 'clamp(460px, 72vh, 640px)'
const CARD_W       = 'clamp(400px, 34vw,  540px)'
const CTA_W        = '360px'
const NUM_PRODUCTS = products.length
const CARD_OVERLAP = 35

const HOLD_DUR     = 3.0
const CAROUSEL_DUR = 7.5
const FLY_START    = HOLD_DUR + CAROUSEL_DUR

const FLY_DATA = [
  { xMul: -1.10, y:  28, rot: -14, delay: 0.00 },
  { xMul: -1.00, y: -18, rot:  -8, delay: 0.09 },
  { xMul: -0.88, y:  10, rot:  -4, delay: 0.17 },
  { xMul: -0.76, y: -10, rot:   4, delay: 0.17 },
  { xMul: -0.64, y:  18, rot:   8, delay: 0.09 },
  { xMul: -0.52, y: -28, rot:  14, delay: 0.00 },
]

// ─── ProductCard ─────────────────────────────────────────────────────────
function ProductCard({
  p, i, onOuterRef, onPullInRef,
}: {
  p:           (typeof products)[0]
  i:           number
  onOuterRef:  (el: HTMLElement | null) => void
  onPullInRef: (el: HTMLElement | null) => void
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const tagRef   = useRef<HTMLParagraphElement>(null)
  const glowRef  = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerRef.current) return
    const rect = innerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    gsap.to(innerRef.current, {
      rotateX: ((y - rect.height / 2) / (rect.height / 2)) * -5,
      rotateY: ((x - rect.width  / 2) / (rect.width  / 2)) *  5,
      duration: 0.4, ease: 'power2.out',
      transformPerspective: 800,
    })
    if (glowRef.current) {
      const xp = (x / rect.width)  * 100
      const yp = (y / rect.height) * 100
      glowRef.current.style.background =
        `radial-gradient(ellipse 55% 45% at ${xp}% ${yp}%, rgba(229,153,123,0.38) 0%, transparent 68%)`
    }
  }

  const handleMouseEnter = () => {
    if (!tagRef.current) return
    tagRef.current.style.maxHeight = '64px'
    tagRef.current.style.opacity   = '1'
    tagRef.current.style.marginTop = '6px'
  }

  const handleMouseLeave = () => {
    if (!innerRef.current) return
    gsap.to(innerRef.current, { rotateX: 0, rotateY: 0, duration: 0.85, ease: 'elastic.out(1, 0.45)' })
    if (!tagRef.current) return
    tagRef.current.style.maxHeight = '0'
    tagRef.current.style.opacity   = '0'
    tagRef.current.style.marginTop = '0'
  }

  return (
    // OUTER: scroll target — 2D flat, no overflow-hidden, no border-radius
    <div
      ref={el => onOuterRef(el)}
      className="shrink-0"
      style={{
        width:       CARD_W,
        height:      CARD_H,
        marginRight: `-${CARD_OVERLAP}px`,
        willChange:  'transform, filter, opacity',
        // NO overflow-hidden, NO border-radius di sini
      }}
    >
      {/* PULL-IN wrapper */}
      <div
        ref={el => onPullInRef(el)}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {/* INNER: visual container — border-radius di sini, tapi ga di-transform pas scroll */}
        <div
          ref={innerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group relative w-full h-full"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',  // ← overflow hidden di sini, bukan di outer
            cursor: 'default',
          }}
        >
          {/* IMAGE — absolute, object-fit, ga pernah kena transform */}
          <img
            src={p.photo} alt={p.name}
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            style={{
              objectPosition: 'center center',
              // KUNCI: will-change dihapus, transform dihapus
            }}
            loading={i < 3 ? 'eager' : 'lazy'}
            draggable={false}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/15 transition-colors duration-500 z-10" />

          {/* Glow layers */}
          <div ref={glowRef} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ zIndex: 11, borderRadius: '20px' }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ zIndex: 11, background: 'radial-gradient(ellipse 70% 50% at 50% 105%, rgba(229,153,123,0.28) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ zIndex: 11, borderRadius: '20px', boxShadow: 'inset 0 0 0 1px rgba(229,153,123,0.45), 0 0 32px rgba(229,153,123,0.12)' }} />

          {/* INFO — flat */}
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl px-5 py-4 z-20" style={{ background: 'rgba(3,0,53,0.68)', backdropFilter: 'blur(10px)' }}>
            <h3 className="font-display text-white text-[30px] leading-snug">{p.name}</h3>
            <p ref={tagRef} className="font-body text-white/55 text-[20px] leading-relaxed overflow-hidden" style={{ maxHeight: 0, opacity: 0, marginTop: 0, transition: 'max-height .45s ease, opacity .45s ease, margin-top .45s ease' }}>
              {p.tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── QuoteSVG ─────────────────────────────────────────────────────────────
function QuoteSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  const lines = [
    { text: '"Donde otros ven deuda,', color: '#F4F4F5', y: 120 },
    { text: 'nosotros diseñamos',      color: '#E5997B', y: 230 },
    { text: 'productividad."',         color: '#F4F4F5', y: 340 },
  ]
  return (
    <svg ref={svgRef} viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid meet"
      className="w-full max-w-5xl mx-auto" style={{ overflow: 'visible' }}
      aria-label="Donde otros ven deuda, nosotros diseñamos productividad.">
      <defs>
        <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#F4F4F5" stopOpacity="0.3" />
          <stop offset="50%"  stopColor="#E5997B" stopOpacity="1"   />
          <stop offset="100%" stopColor="#F4F4F5" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {lines.map((line, li) => (
        <g key={li}>
          <text x="600" y={line.y} textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic"
            fontSize="88" fontWeight="400" letterSpacing="-1"
            fill="none" stroke={line.color} strokeWidth="0.8" data-stroke-line={li}>
            {line.text}
          </text>
          <text x="600" y={line.y} textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic"
            fontSize="88" fontWeight="400" letterSpacing="-1"
            fill={line.color} stroke="none" fillOpacity="0" data-fill-line={li}>
            {line.text}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ─── Shatter triangles ────────────────────────────────────────────────────
type Point    = [number, number]
type Triangle = [Point, Point, Point]

function buildShatterTriangles(w: number, h: number): Triangle[] {
  const triangles: Triangle[] = []
  const cols = 28, rows = 18
  const cX = w / cols, cY = h / rows
  let seed = 42
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  const pts: Point[][] = []
  for (let r = 0; r <= rows; r++) {
    pts[r] = []
    for (let c = 0; c <= cols; c++) {
      pts[r][c] = [
        c * cX + ((c === 0 || c === cols) ? 0 : (rand() - 0.5) * cX * 0.40),
        r * cY + ((r === 0 || r === rows) ? 0 : (rand() - 0.5) * cY * 0.40),
      ]
    }
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      triangles.push([pts[r][c], pts[r][c+1], pts[r+1][c]])
      triangles.push([pts[r][c+1], pts[r+1][c+1], pts[r+1][c]])
    }
  return triangles
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function ProductsToPhotoSection() {
  const wrapperRef      = useRef<HTMLDivElement>(null)
  const stickyRef       = useRef<HTMLDivElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const productsRef     = useRef<HTMLDivElement>(null)
  const bgRef           = useRef<HTMLDivElement>(null)
  const ctaCardRef      = useRef<HTMLDivElement>(null)
  const quoteRef        = useRef<HTMLDivElement>(null)
  const quoteSvgRef     = useRef<SVGSVGElement>(null)
  const dissolveRef     = useRef<HTMLDivElement>(null)
  const ornamentRef     = useRef<HTMLDivElement>(null)
  const bylineRef       = useRef<HTMLDivElement>(null)
  const bgCanvasRef     = useRef<HTMLCanvasElement>(null)
  const shatterRef      = useRef<HTMLCanvasElement>(null)
  const ctaPatternRef   = useRef<HTMLCanvasElement>(null)
  const quotePatternRef = useRef<HTMLCanvasElement>(null)
  const cardEls         = useRef<HTMLElement[]>([])
  const pullInEls       = useRef<HTMLElement[]>([])
  const headEls         = useRef<HTMLElement[]>([])

  useLayoutEffect(() => {
    const wrapper    = wrapperRef.current
    const sticky     = stickyRef.current
    const track      = trackRef.current
    const productsEl = productsRef.current
    const ctaCard    = ctaCardRef.current
    const quote      = quoteRef.current
    const svg        = quoteSvgRef.current
    const dissolveEl = dissolveRef.current
    const bgCvs      = bgCanvasRef.current
    const shatterCvs = shatterRef.current
    const ctaPat     = ctaPatternRef.current
    const quotePat   = quotePatternRef.current
    if (!wrapper || !sticky || !track || !productsEl || !ctaCard ||
        !quote   || !svg    || !dissolveEl || !bgCvs   || !shatterCvs ||
        !ctaPat  || !quotePat) return

    let ctx: gsap.Context

    const setup = () => {
      ctx?.revert()
      const vw = window.innerWidth
      const vh = window.innerHeight

      const firstCardEl  = cardEls.current[0] as HTMLElement | undefined
      const actualCardW  = firstCardEl?.offsetWidth ?? Math.min(540, Math.max(400, vw * 0.34))
      const trackPadLeft = vw * 0.025
      const cardStep     = actualCardW - CARD_OVERLAP

      const updateCards = (activeFloat: number) => {
        gsap.set(track, {
          x: vw / 2 - activeFloat * cardStep - trackPadLeft - actualCardW / 2,
        })

        const centerIdx = Math.round(activeFloat)

        cardEls.current.forEach((card, i) => {
          if (i >= NUM_PRODUCTS) return
          const dist = Math.abs(i - activeFloat)
          gsap.set(card, {
            scale:           Math.max(0.72, 1 - dist * 0.10),
            filter:          `grayscale(${Math.min(100, dist * 35)}%) brightness(${Math.max(0.40, 1 - dist * 0.20)})`,
            opacity:         Math.max(0.65, 1 - dist * 0.13),
            zIndex:          Math.round(50 - dist * 8),
            transformOrigin: 'center center',
          })

          const pullEl  = pullInEls.current[i]
          const distInt = Math.abs(i - centerIdx)
          if (pullEl) gsap.set(pullEl, { x: distInt === 2 ? (i < centerIdx ? 1 : -1) * 20 : 0 })
        })
      }

      // ── DISSOLVE PANELS ──────────────────────────────────────────────────
      dissolveEl.innerHTML = ''
      dissolveEl.style.height = `${vh}px`
      const panelWidths = [15, 5, 10, 20, 5, 15, 10, 20]
      const panels: HTMLDivElement[] = []
      const frag = document.createDocumentFragment()
      let left = 0
      panelWidths.forEach((w, i) => {
        const d = document.createElement('div')
        d.style.cssText = `
          position:absolute; left:${left}%; top:0;
          width:${w}%; height:100%; background:#ffffff;
          transform:scaleY(0);
          transform-origin:${i % 2 === 0 ? 'top' : 'bottom'} center;
          will-change:transform;
        `
        frag.appendChild(d); panels.push(d); left += w
      })
      dissolveEl.appendChild(frag)

      // ── CANVAS ───────────────────────────────────────────────────────────
      bgCvs.width = vw;  bgCvs.height = vh
      shatterCvs.width = vw; shatterCvs.height = vh
      const bgCtx      = bgCvs.getContext('2d')!
      const shatterCtx = shatterCvs.getContext('2d')!
      const NAVY_CRACK = '#060030'
      const triangles  = buildShatterTriangles(vw, vh)
      const maxDist    = Math.sqrt((vw / 2) ** 2 + (vh / 2) ** 2)

      const triMeta = triangles.map(tri => {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
        const normDist = Math.sqrt((cx - vw/2)**2 + (cy - vh/2)**2) / maxDist
        const shade    = 0.92 + Math.random() * 0.08
        return {
          tri, cx, cy,
          delay: (1 - normDist) * 0.70 + (Math.random() * 0.04 - 0.02),
          fill:  `rgb(${Math.round(3*shade)},0,${Math.round(53*shade)})`,
        }
      })

      const drawBg = () => {
        bgCtx.clearRect(0, 0, vw, vh)
        bgCtx.fillStyle = NAVY_CRACK
        bgCtx.fillRect(0, 0, vw, vh)
        for (const td of triMeta) {
          bgCtx.save()
          bgCtx.translate(td.cx, td.cy); bgCtx.scale(0.97, 0.97); bgCtx.translate(-td.cx, -td.cy)
          bgCtx.beginPath()
          bgCtx.moveTo(td.tri[0][0], td.tri[0][1])
          bgCtx.lineTo(td.tri[1][0], td.tri[1][1])
          bgCtx.lineTo(td.tri[2][0], td.tri[2][1])
          bgCtx.closePath()
          bgCtx.fillStyle = td.fill; bgCtx.fill()
          bgCtx.strokeStyle = 'rgba(0,0,10,0.65)'; bgCtx.lineWidth = 0.7; bgCtx.stroke()
          bgCtx.restore()
        }
      }

      const drawPattern = (canvas: HTMLCanvasElement, fill: string, stroke: string) => {
        const w = canvas.offsetWidth || vw, h = canvas.offsetHeight || vh
        canvas.width = w; canvas.height = h
        const c = canvas.getContext('2d')!
        const sx = w / vw, sy = h / vh
        c.clearRect(0, 0, w, h)
        for (const td of triMeta) {
          c.save()
          c.beginPath()
          c.moveTo(td.tri[0][0]*sx, td.tri[0][1]*sy)
          c.lineTo(td.tri[1][0]*sx, td.tri[1][1]*sy)
          c.lineTo(td.tri[2][0]*sx, td.tri[2][1]*sy)
          c.closePath()
          c.fillStyle = fill; c.fill()
          c.strokeStyle = stroke; c.lineWidth = 0.6; c.stroke()
          c.restore()
        }
      }

      const drawShatter = (t: number) => {
        shatterCtx.clearRect(0, 0, vw, vh)
        for (const td of triMeta) {
          const localT = Math.max(0, Math.min(1, (t - td.delay) / 0.30))
          if (localT <= 0) continue
          const e = 1 - (1 - localT) ** 3
          shatterCtx.save()
          shatterCtx.globalAlpha = Math.min(1, e * 1.5)
          shatterCtx.translate(td.cx, td.cy); shatterCtx.scale(e, e); shatterCtx.translate(-td.cx, -td.cy)
          shatterCtx.beginPath()
          shatterCtx.moveTo(td.tri[0][0], td.tri[0][1])
          shatterCtx.lineTo(td.tri[1][0], td.tri[1][1])
          shatterCtx.lineTo(td.tri[2][0], td.tri[2][1])
          shatterCtx.closePath()
          shatterCtx.fillStyle = td.fill; shatterCtx.fill()
          shatterCtx.restore()
        }
      }

      // ── INIT ─────────────────────────────────────────────────────────────
      drawBg()
      requestAnimationFrame(() => {
        drawPattern(ctaPat,   'rgba(229,153,123,0.04)',  'rgba(229,153,123,0.22)')
        drawPattern(quotePat, 'rgba(229,153,123,0.015)', 'rgba(255,255,255,0.06)')
      })

      updateCards(0)
      pullInEls.current.forEach(el => { if (el) gsap.set(el, { x: 0 }) })

      gsap.to(bgCvs, { opacity: 0.55, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
      const fillLines   = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))
      const LINE_LENGTH = 2000
      strokeLines.forEach(el => {
        el.style.strokeDasharray  = `${LINE_LENGTH}`
        el.style.strokeDashoffset = `${LINE_LENGTH}`
      })

      gsap.set(productsEl, { opacity: 1 })
      gsap.set(quote,      { opacity: 0 })
      gsap.set(shatterCvs, { visibility: 'hidden', opacity: 1 })
      if (bgRef.current)          gsap.set(bgRef.current,       { opacity: 1 })
      if (headEls.current.length) gsap.set(headEls.current,     { opacity: 1, y: 0 })
      if (ornamentRef.current)    gsap.set(ornamentRef.current, { opacity: 0, y: 12 })
      if (bylineRef.current)      gsap.set(bylineRef.current,   { opacity: 0, y: 8  })
      gsap.set(strokeLines, { strokeDashoffset: LINE_LENGTH, opacity: 1 })
      gsap.set(fillLines,   { fillOpacity: 0 })
      gsap.set(dissolveEl,  { opacity: 1, visibility: 'visible' })

      const STROKE_DUR  = 2.2
      const STROKE_GAP  = 0.7
      const FILL_OFFSET = 1.2

      ctx = gsap.context(() => {
        const shatterProxy = { t: 0 }
        const activeProxy  = { active: 0 }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: wrapper,
            start:   () => `top+=${window.innerHeight * 2}px top`,
            end:     'bottom bottom',
            scrub:   1.5,
            invalidateOnRefresh: true,
          },
        })

        tl.set(activeProxy, { active: 0 }, 0)

        tl.fromTo(
          activeProxy,
          { active: 0 },
          {
            active:   NUM_PRODUCTS - 1,
            duration: CAROUSEL_DUR,
            ease:     'none',
            onUpdate() { updateCards(activeProxy.active) },
          },
          HOLD_DUR,
        )

        tl.to(headEls.current, { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' }, FLY_START)

        tl.call(() => {
          pullInEls.current.forEach(el => { if (el) gsap.set(el, { x: 0 }) })
        }, [], FLY_START)

        for (let i = 0; i < NUM_PRODUCTS; i++) {
          const card = cardEls.current[i]; if (!card) continue
          const fd   = FLY_DATA[i]
          tl.to(card, {
            x:        fd.xMul * vw,
            y:        fd.y,
            rotation: fd.rot,
            scale:    0.72,
            opacity:  0,
            duration: 0.65,
            ease:     'power3.in',
          }, FLY_START + fd.delay)
        }

        const ctaEl = cardEls.current[NUM_PRODUCTS]
        if (ctaEl) tl.to(ctaEl, { x: -vw * 0.55, opacity: 0, duration: 0.5, ease: 'power2.in' }, FLY_START + 0.18)

        const BG_STOP = FLY_START + 1.5
        tl.call(() => gsap.killTweensOf(bgCvs), [], BG_STOP)
        tl.to(bgCvs, { opacity: 0, duration: 0.3 }, BG_STOP)

        const SHATTER_START = FLY_START + 1.7
        tl.set(shatterCvs, { visibility: 'visible' }, SHATTER_START)
        tl.fromTo(shatterProxy, { t: 0 }, {
          t: 1, duration: 3.0, ease: 'power1.inOut',
          onUpdate()  { drawShatter(shatterProxy.t) },
          onComplete(){ drawShatter(1) },
        }, SHATTER_START)

        const QUOTE_START = SHATTER_START + 2.3
        tl.to(productsEl,  { opacity: 0, duration: 0.4 }, QUOTE_START - 0.5)
        tl.set(quote,       { opacity: 1 },                QUOTE_START)
        tl.to(shatterCvs,   { opacity: 0, duration: 0.6 }, QUOTE_START + 0.1)
        tl.set(shatterCvs,  { visibility: 'hidden' },       QUOTE_START + 0.8)
        tl.to(ornamentRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, QUOTE_START + 0.3)

        strokeLines.forEach((strokeEl, li) => {
          const fillEl = fillLines[li]
          const tStart = QUOTE_START + 0.7 + li * (STROKE_DUR + STROKE_GAP)
          const fStart = tStart + FILL_OFFSET
          tl.to(strokeEl, { strokeDashoffset: 0, duration: STROKE_DUR, ease: 'power1.inOut' }, tStart)
          tl.to(fillEl,   { fillOpacity: 1,      duration: 0.8,        ease: 'power2.out'   }, fStart)
          tl.to(strokeEl, { opacity: 0,           duration: 0.5,        ease: 'power1.in'    }, fStart + 0.4)
        })

        const lastLineEnd = QUOTE_START + 0.7 + (strokeLines.length - 1) * (STROKE_DUR + STROKE_GAP) + STROKE_DUR + 0.4
        tl.to(bylineRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, lastLineEnd)

        const dissolveStart = lastLineEnd + 2.0
        if (bgRef.current) tl.to(bgRef.current, { opacity: 0, duration: 1.2 }, dissolveStart - 0.3)
        tl.to(panels, {
          scaleY:  1,
          duration: 2.8,
          ease:    'power2.inOut',
          stagger: { amount: 1.4, from: 'edges' },
        }, dissolveStart)
        tl.to(quote, { scale: 1.04, duration: 3.0, ease: 'power1.inOut' }, dissolveStart)
        tl.to(quote, { autoAlpha: 0, duration: 1.2, ease: 'power1.inOut' }, dissolveStart + 1.8)
        tl.set(wrapper, { zIndex: 5 }, dissolveStart + 3.2)

      }, wrapper)

      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
    }

    setup()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(timer); timer = setTimeout(setup, 200) }
    window.addEventListener('resize', onResize)
    return () => { ctx?.revert(); clearTimeout(timer); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '1500vh', marginTop: '-100vh', position: 'relative', zIndex: 25 }}>
      <div ref={stickyRef} className="sticky top-0 w-full overflow-hidden" style={{ height: '100vh' }}>

        <div ref={bgRef} className="absolute inset-0 bg-[#030035]" style={{ zIndex: 0 }} />

        {/* ── Quote section ── */}
        <div ref={quoteRef} className="absolute inset-0" style={{ zIndex: 1, opacity: 0, isolation: 'isolate' }}>
          <img src="/foto/brand-nature.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#030035]/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030035] via-[#030035]/80 to-[#030035]/60" />
          <div className="absolute inset-0 bg-navy/70" />
          <canvas ref={quotePatternRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 1 }} />
          {(['top-8 left-8','top-8 right-8','bottom-8 left-8','bottom-8 right-8'] as const).map((pos, i) => (
            <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none`} viewBox="0 0 40 40" fill="none">
              <path d={['M0 20 L0 0 L20 0','M40 20 L40 0 L20 0','M0 20 L0 40 L20 40','M40 20 L40 40 L20 40'][i]}
                stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.35" />
            </svg>
          ))}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5">
            {['DIMA Finance — México',"19°26'N 99°08'O",'SOFOM E.N.R.'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-px bg-[#E5997B]/40" />
                <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/25">{t}</span>
              </div>
            ))}
          </div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 items-end">
            {['Arquitectura de Equilibrio','Ingeniería Crediticia','Est. MMXXIV'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/25">{t}</span>
                <div className="w-4 h-px bg-[#E5997B]/40" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-16 flex items-center justify-between">
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/15">Sociedad Financiera de Objeto Múltiple</span>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_,i) => <div key={i} className="w-1 h-1 bg-[#E5997B]/20" style={{ opacity: 0.1 + i * 0.15 }} />)}
            </div>
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/15">Arquitectos de Equilibrio</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16">
            <div ref={ornamentRef} className="flex items-center gap-6 mb-10" style={{ opacity: 0 }}>
              <div className="w-32 h-px bg-[#E5997B]/50" />
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
                <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#E5997B" fillOpacity="0.5" />
              </svg>
              <div className="w-32 h-px bg-[#E5997B]/50" />
            </div>
            <QuoteSVG svgRef={quoteSvgRef} />
            <div ref={bylineRef} className="flex items-center gap-5 mt-10" style={{ opacity: 0 }}>
              <div className="w-8 h-px bg-[#E5997B]/40" />
              <span className="font-mono text-[#E5997B]/70 text-[9px] tracking-[0.6em] uppercase">
                DIMA Finance — Principio Fundacional
              </span>
              <div className="w-8 h-px bg-[#E5997B]/40" />
            </div>
          </div>
          <div ref={dissolveRef} className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ mixBlendMode: 'destination-out' as any, zIndex: 99 }} />
        </div>

        {/* Shatter canvas */}
        <canvas ref={shatterRef} className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 3, visibility: 'hidden' }} />

        {/* ── Products section ── */}
        <div ref={productsRef} className="absolute inset-0" style={{ background: '#030035', zIndex: 2 }}>
          <canvas ref={bgCanvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

          <div className="relative z-10 flex items-end justify-between px-10 md:px-16"
            style={{ paddingTop: '136px', paddingBottom: '20px' }}>
            <div>
              <p className="font-body text-[12px] tracking-[0.35em] uppercase text-[#E5997B] mb-3"
                ref={el => { if (el) headEls.current[0] = el }}>Productos</p>
              <h2 className="font-display text-[clamp(36px,4.5vw,64px)] text-[#F4F4F5] leading-[1.1]"
                ref={el => { if (el) headEls.current[1] = el }}>
                Soluciones con <em className="italic text-[#E5997B]">ingeniería.</em>
              </h2>
            </div>
            <Link to="/productos"
              ref={el => { if (el) headEls.current[2] = el as HTMLElement }}
              className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-[#F4F4F5] hover:text-[#E5997B] transition-colors border-b border-[#F4F4F5]/25 hover:border-[#E5997B] pb-0.5 mb-2">
              Ver todos
              <svg className="transition-transform duration-300 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="relative z-10 flex flex-col justify-center"
            style={{ height: 'calc(100vh - 296px)', paddingBottom: '24px' }}>
            <div
              ref={trackRef}
              className="flex items-center will-change-transform"
              style={{ paddingLeft: '2.5vw', paddingRight: '2.5vw', gap: 0, overflow: 'visible' }}
            >
              {products.map((p, i) => (
                <ProductCard
                  key={p.name}
                  p={p}
                  i={i}
                  onOuterRef={el  => { cardEls.current[i]   = el as HTMLElement }}
                  onPullInRef={el => { pullInEls.current[i] = el as HTMLElement }}
                />
              ))}

              {/* CTA card */}
              <div
                ref={el => {
                  if (!el) return
                  ;(ctaCardRef as React.MutableRefObject<HTMLDivElement>).current = el
                  cardEls.current[products.length] = el
                }}
                className="relative shrink-0 flex flex-col justify-end overflow-hidden"
                style={{
                  width:        CTA_W,
                  height:       CARD_H,
                  borderRadius: '20px',
                  background:   'rgba(3,0,53,0.6)',
                  padding:      '32px',
                  border:       '1px solid rgba(229,153,123,0.18)',
                  flexShrink:   0,
                  marginRight:  `-${CARD_OVERLAP}px`,
                }}>
                <canvas ref={ctaPatternRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 0, borderRadius: '20px' }} />
                <div className="relative z-10">
                  <svg className="absolute top-[-168px] right-[-16px] opacity-[0.08]" width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <path d="M26 2 L50 26 L26 50 L2 26 Z" stroke="#E5997B" strokeWidth="1.5" />
                    <path d="M26 13 L39 26 L26 39 L13 26 Z" stroke="#E5997B" strokeWidth="1" />
                  </svg>
                  <div className="w-7 h-px bg-[#E5997B]/40 mb-5" />
                  <p className="font-display text-white text-[20px] leading-snug mb-7">
                    Encuentra el producto <em className="text-[#E5997B] italic">ideal</em> para tu empresa.
                  </p>
                  <Link to="/productos"
                    className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-[#E5997B] border black-[#E5997B]/35 px-5 py-3 transition-all duration-300 hover:bg-[#E5997B] hover:text-navy"
                    style={{ borderRadius: '2px', width: 'fit-content' }}>
                    Ver todos
                    <svg className="transition-transform duration-300 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  )
}