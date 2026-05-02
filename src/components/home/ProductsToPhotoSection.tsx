/**
 * ProductsToPhotoSection.tsx
 *
 * Background produk = NAVY dengan tekstur retakan sejak awal.
 * Animasi: retakan menutup dari pinggir → tengah (kebalikan dari sebelumnya).
 * Setelah mulus, transisi ke quote.
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

/* ── Grid titik kecil di atas navy ── */
function NavyGrid() {
  const ref = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    let raf = 0, t = 0
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      t += 0.04
      ctx.clearRect(0, 0, c.width, c.height)
      const S = 56, D = 1.5
      const cols = Math.ceil(c.width / S) + 2
      const rows = Math.ceil(c.height / S) + 2
      for (let r = 0; r < rows; r++) for (let co = 0; co < cols; co++) {
        const x = co * S, y = r * S
        const w = Math.sin(t + co * 0.5 + r * 0.6) * 0.5 + 0.5
        ctx.fillStyle = `rgba(229,153,123,${0.06 + w * 0.1})`
        ctx.beginPath(); ctx.arc(x, y, D, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    const visObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (!raf) draw() }
      else { cancelAnimationFrame(raf); raf = 0 }
    }, { threshold: 0 })
    visObserver.observe(c)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); visObserver.disconnect() }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
}

const CARD_H = 'clamp(360px, 58vh, 520px)'

function QuoteSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) {
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

// ── Types & helpers untuk shatter ──
type Point = [number, number]
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
      const isEdgeX = c === 0 || c === cols
      const isEdgeY = r === 0 || r === rows
      const jx = isEdgeX ? 0 : (rand() - 0.5) * cX * 0.40
      const jy = isEdgeY ? 0 : (rand() - 0.5) * cY * 0.40
      pts[r][c] = [c * cX + jx, r * cY + jy]
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      triangles.push([pts[r][c], pts[r][c+1], pts[r+1][c]])
      triangles.push([pts[r][c+1], pts[r+1][c+1], pts[r+1][c]])
    }
  }
  return triangles
}

// ── Main component ──
export default function ProductsToPhotoSection() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const stickyRef    = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const productsRef  = useRef<HTMLDivElement>(null)
  const bgRef        = useRef<HTMLDivElement>(null)
  const ctaCardRef   = useRef<HTMLDivElement>(null)
  const quoteRef     = useRef<HTMLDivElement>(null)
  const quoteSvgRef  = useRef<SVGSVGElement>(null)
  const dissolveRef  = useRef<HTMLDivElement>(null)
  const ornamentRef  = useRef<HTMLDivElement>(null)
  const bylineRef    = useRef<HTMLDivElement>(null)
  const shatterRef   = useRef<HTMLCanvasElement>(null)
  const cardEls      = useRef<HTMLElement[]>([])
  const headEls      = useRef<HTMLElement[]>([])

  useLayoutEffect(() => {
    const wrapper    = wrapperRef.current
    const sticky     = stickyRef.current
    const track      = trackRef.current
    const productsEl = productsRef.current
    const ctaCard    = ctaCardRef.current
    const quote      = quoteRef.current
    const svg        = quoteSvgRef.current
    const dissolveEl = dissolveRef.current
    const shatterCvs = shatterRef.current
    if (!wrapper || !sticky || !track || !productsEl || !ctaCard || !quote || !svg || !dissolveEl || !shatterCvs) return

    let ctx: gsap.Context

    const setup = () => {
      ctx?.revert()

      const vw = window.innerWidth
      const vh = window.innerHeight

      const cardW  = ctaCard.offsetWidth  || 300
      const cardH  = ctaCard.offsetHeight || Math.min(Math.max(360, vh * 0.58), 520)
      const padH   = vw * 0.025
      const trackW = track.scrollWidth
      const centeredX = vw / 2 - padH - (trackW - padH - cardW) - cardW / 2

      // ── DISSOLVE PANELS ──
      dissolveEl.innerHTML = ''
      dissolveEl.style.height = `${vh}px`
      const panelWidths = [15, 5, 10, 20, 5, 15, 10, 20]
      const panels: HTMLDivElement[] = []
      const frag = document.createDocumentFragment()
      let currentLeft = 0
      panelWidths.forEach((w, i) => {
        const d = document.createElement('div')
        d.style.cssText = `
          position: absolute; left: ${currentLeft}%; top: 0;
          width: ${w}%; height: 100%; background: #ffffff;
          transform: scaleY(0);
          transform-origin: ${i % 2 === 0 ? 'top' : 'bottom'} center;
          will-change: transform;
        `
        frag.appendChild(d)
        panels.push(d)
        currentLeft += w
      })
      dissolveEl.appendChild(frag)

      // ── SHATTER CANVAS ──
      shatterCvs.width = vw
      shatterCvs.height = vh
      const shatterCtx = shatterCvs.getContext('2d')!

      const NAVY_LIGHT = '#0A1A3A'   // warna celah (retakan)
      const NAVY_DARK  = '#030035'   // warna segitiga & solid akhir

      const triangles = buildShatterTriangles(vw, vh)
      const maxDistGlobal = Math.sqrt((vw / 2) ** 2 + (vh / 2) ** 2)

      const triMeta = triangles.map(tri => {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
        const dx = cx - vw / 2
        const dy = cy - vh / 2
        const normDist = Math.sqrt(dx * dx + dy * dy) / maxDistGlobal

        // Delay terbalik: edge (normDist besar) dapat delay kecil → mulai duluan
        const delay = (1 - normDist) * 0.70 + (Math.random() * 0.04 - 0.02)

        const shade = 0.9 + Math.random() * 0.1
        const r = Math.round(3 * shade)
        const g = 0
        const b = Math.round(53 * shade)

        return { tri, cx, cy, delay, fill: `rgb(${r},${g},${b})` }
      })

      // Gambar canvas: selalu menampilkan segitiga dengan skala minimum 0.85
      const drawShatter = (t: number) => {
        shatterCtx.clearRect(0, 0, vw, vh)

        // Latar belakang retakan
        shatterCtx.fillStyle = NAVY_LIGHT
        shatterCtx.fillRect(0, 0, vw, vh)

        // Gambar semua segitiga, dimulai dengan skala 0.85 (retakan tampak)
        for (const td of triMeta) {
          const raw    = (t - td.delay) / 0.28
          const localT = Math.max(0, Math.min(1, raw))

          // Skala dari 0.85 (retakan) → 1.0 (mulus)
          const e = localT < 0.5 ? 4 * localT ** 3 : 1 - (-2 * localT + 2) ** 3 / 2
          const scale = 0.85 + 0.15 * e   // minimal 0.85

          shatterCtx.save()
          shatterCtx.globalAlpha = 1
          shatterCtx.translate(td.cx, td.cy)
          shatterCtx.scale(scale, scale)
          shatterCtx.translate(-td.cx, -td.cy)

          shatterCtx.beginPath()
          shatterCtx.moveTo(td.tri[0][0], td.tri[0][1])
          shatterCtx.lineTo(td.tri[1][0], td.tri[1][1])
          shatterCtx.lineTo(td.tri[2][0], td.tri[2][1])
          shatterCtx.closePath()

          shatterCtx.fillStyle = td.fill
          shatterCtx.fill()

          shatterCtx.strokeStyle = 'rgba(0,0,10,0.65)'
          shatterCtx.lineWidth   = 0.7
          shatterCtx.stroke()

          shatterCtx.restore()
        }
      }

      // ── SVG STROKE ──
      const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
      const fillLines   = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))
      const LINE_LENGTH = 2000
      strokeLines.forEach(el => {
        el.style.strokeDasharray  = `${LINE_LENGTH}`
        el.style.strokeDashoffset = `${LINE_LENGTH}`
      })

      // ── INITIAL STATES ──
      gsap.set(track,       { x: 0 })
      gsap.set(productsEl,  { opacity: 1 })
      gsap.set(quote,       { opacity: 0 })
      // Canvas terlihat sebagai background produk
      gsap.set(shatterCvs,  { visibility: 'visible', opacity: 1 })
      if (bgRef.current)           gsap.set(bgRef.current,       { opacity: 1 })
      if (cardEls.current.length)  gsap.set(cardEls.current,     { opacity: 1 })
      if (headEls.current.length)  gsap.set(headEls.current,     { opacity: 1 })
      if (ornamentRef.current)     gsap.set(ornamentRef.current, { opacity: 0, y: 12 })
      if (bylineRef.current)       gsap.set(bylineRef.current,   { opacity: 0, y: 8  })
      gsap.set(strokeLines, { strokeDashoffset: LINE_LENGTH, opacity: 1 })
      gsap.set(fillLines,   { fillOpacity: 0 })
      gsap.set(dissolveEl,  { opacity: 1, visibility: 'visible' })

      // Gambar awal retakan (t=0)
      drawShatter(0)

      const STROKE_DUR  = 2.2
      const STROKE_GAP  = 0.7
      const FILL_OFFSET = 1.2

      ctx = gsap.context(() => {
        const shatterProxy = { t: 0 }

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

        // Horizontal scroll products
        tl.to(track, { x: centeredX, duration: 3, ease: 'power1.inOut' }, 5)

        // Bersihkan layar: heading + cards fade out
        tl.to(headEls.current, { opacity: 0, duration: 0.5 }, 7.5)
        tl.to(cardEls.current, { opacity: 0, duration: 0.5, stagger: { amount: 0.25, from: 'end' } }, 7.7)

        // ── SHATTER MENUTUP (pinggir → tengah) ──
        tl.fromTo(shatterProxy, { t: 0 }, {
          t: 1,
          duration: 3.0,
          ease: 'power1.inOut',
          onUpdate() { drawShatter(shatterProxy.t) },
          onComplete() { drawShatter(1) },
        }, 9.2)

        // Fade out produk setelah shatter selesai
        tl.to(productsEl, { opacity: 0, duration: 0.4 }, 11.5)

        // Reveal quote
        tl.set(quote, { opacity: 1 }, 12.0)
        tl.to(shatterCvs, { opacity: 0, duration: 0.4 }, 12.1)
        tl.set(shatterCvs, { visibility: 'hidden' }, 12.5)

        // Ornament
        tl.to(ornamentRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 12.3)

        // Animasi stroke teks quote
        strokeLines.forEach((strokeEl, li) => {
          const fillEl = fillLines[li]
          const tStart = 12.7 + li * (STROKE_DUR + STROKE_GAP)
          const fStart = tStart + FILL_OFFSET
          tl.to(strokeEl, { strokeDashoffset: 0, duration: STROKE_DUR, ease: 'power1.inOut' }, tStart)
          tl.to(fillEl,   { fillOpacity: 1,      duration: 0.8,        ease: 'power2.out'   }, fStart)
          tl.to(strokeEl, { opacity: 0,           duration: 0.5,        ease: 'power1.in'    }, fStart + 0.4)
        })

        const lastLineEnd = 12.7 + (strokeLines.length - 1) * (STROKE_DUR + STROKE_GAP) + STROKE_DUR + 0.4
        tl.to(bylineRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, lastLineEnd)

        // Dissolve panels (keluar ke section berikutnya)
        const dissolveStart = lastLineEnd + 2.0
        if (bgRef.current) tl.to(bgRef.current, { opacity: 0, duration: 0.6 }, dissolveStart - 0.5)
        tl.to(panels, {
          scaleY: 1, duration: 1.8, ease: 'expo.inOut',
          stagger: { amount: 0.8, from: 'edges' },
        }, dissolveStart)
        tl.to(quote, { scale: 1.05, duration: 2.5, ease: 'power2.inOut' }, dissolveStart)
        tl.to(quote, { autoAlpha: 0, duration: 0.4 }, dissolveStart + 2.2)
        tl.set(wrapper, { zIndex: 5 }, dissolveStart + 2.5)

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
    <div
      ref={wrapperRef}
      style={{ height: '1500vh', marginTop: '-100vh', position: 'relative', zIndex: 25 }}
    >
      <div ref={stickyRef} className="sticky top-0 w-full overflow-hidden" style={{ height: '100vh' }}>
        <div ref={bgRef} className="absolute inset-0 bg-[#F4F4F5]" style={{ zIndex: 0 }} />

        {/* Quote section */}
        <div ref={quoteRef} className="absolute inset-0" style={{ zIndex: 1, opacity: 0, isolation: 'isolate' }}>
          <img src="/foto/brand-nature.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#030035]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030035]/85 via-transparent to-[#030035]/40" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(229,153,123,1) 1px,transparent 1px),linear-gradient(90deg,rgba(229,153,123,1) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
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
              {[...Array(5)].map((_,i) => (
                <div key={i} className="w-1 h-1 bg-[#E5997B]/20" style={{ opacity: 0.1 + i * 0.15 }} />
              ))}
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
          <div ref={dissolveRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ mixBlendMode: 'destination-out' as any, zIndex: 99 }} />
        </div>

        {/* Products section — background NAVY + tekstur retakan via canvas */}
        <div ref={productsRef} className="absolute inset-0" style={{ background: '#030035', zIndex: 2 }}>
          {/* CANVAS SHATTER dijadikan background produk */}
          <canvas
            ref={shatterRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}   // di belakang konten
          />
          <NavyGrid />
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
            <div ref={trackRef} className="flex items-center will-change-transform"
              style={{ paddingLeft: '2.5vw', paddingRight: '2.5vw', gap: '16px' }}>
              {products.map((p, i) => (
                <Link key={p.name} to="/productos"
                  ref={el => { if (el) cardEls.current[i] = el as HTMLElement }}
                  className="group relative shrink-0 overflow-hidden"
                  style={{ width: 'clamp(300px,28vw,420px)', height: CARD_H, borderRadius: '20px' }}>
                  <img src={p.photo} alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    loading={i < 3 ? 'eager' : 'lazy'} />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-500" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl px-5 py-4"
                    style={{ background: 'rgba(3,0,53,0.68)', backdropFilter: 'blur(10px)' }}>
                    <h3 className="font-display text-white text-[19px] leading-snug">{p.name}</h3>
                    <p className="font-body text-white/55 text-[13px] leading-relaxed overflow-hidden transition-all duration-500"
                      style={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
                      ref={el => {
                        if (!el) return
                        const card = el.closest<HTMLElement>('.group'); if (!card) return
                        card.addEventListener('mouseenter', () => { el.style.maxHeight = '64px'; el.style.opacity = '1'; el.style.marginTop = '6px' })
                        card.addEventListener('mouseleave', () => { el.style.maxHeight = '0'; el.style.opacity = '0'; el.style.marginTop = '0' })
                      }}>
                      {p.tagline}
                    </p>
                  </div>
                </Link>
              ))}
              <div
                ref={el => {
                  if (!el) return
                  ;(ctaCardRef as React.MutableRefObject<HTMLDivElement>).current = el
                  cardEls.current[products.length] = el
                }}
                className="relative shrink-0 flex flex-col justify-end overflow-hidden"
                style={{ width: '300px', height: CARD_H, borderRadius: '20px',
                         background: '#030035', padding: '32px', flexShrink: 0 }}>
                <svg className="absolute top-6 right-6 opacity-[0.08]" width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <path d="M26 2 L50 26 L26 50 L2 26 Z" stroke="#E5997B" strokeWidth="1.5" />
                  <path d="M26 13 L39 26 L26 39 L13 26 Z" stroke="#E5997B" strokeWidth="1" />
                </svg>
                <div className="w-7 h-px bg-[#E5997B]/40 mb-5" />
                <p className="font-display text-white text-[20px] leading-snug mb-7">
                  Encuentra el producto <em className="text-[#E5997B] italic">ideal</em> para tu empresa.
                </p>
                <Link to="/productos"
                  className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-[#E5997B] border border-[#E5997B]/35 px-5 py-3 transition-all duration-300 hover:bg-[#E5997B] hover:text-navy"
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

        {/* Canvas shatter sudah dipindah ke dalam productsRef, hapus elemen ini */}
        {/* Sebelumnya: <canvas ref={shatterRef} ... /> */}

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