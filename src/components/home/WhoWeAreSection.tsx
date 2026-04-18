import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAreSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const textWrapRef = useRef<HTMLDivElement>(null)
  const pinnedRef   = useRef<HTMLDivElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const wordRef     = useRef<HTMLSpanElement>(null)
  const emRef       = useRef<HTMLSpanElement>(null)
  const svgTextRef  = useRef<SVGTextElement>(null)

  // ── Reveal animations ────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return
    const phrases = sectionRef.current.querySelectorAll('.reveal-phrase')
    const desc    = document.querySelector('.desc-reveal')
    gsap.set(phrases, { opacity: 0, y: 40 })
    if (desc) gsap.set(desc, { opacity: 0, y: 24 })
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(phrases, { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out' })
          if (desc) gsap.to(desc, { opacity: 1, y: 0, duration: 0.8, delay: phrases.length * 0.18 + 0.2, ease: 'power3.out' })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // ── Float + stroke trace + fill flip ────────────────────────
  useEffect(() => {
    if (!pinnedRef.current || !overlayRef.current || !wordRef.current || !emRef.current || !svgTextRef.current) return

    const START_OFFSET_Y = +30
    const LAND_OFFSET_Y  = -23

    const pinEl     = pinnedRef.current
    const overlayEl = overlayRef.current
    const wordEl    = wordRef.current
    const emEl      = emRef.current
    const svgText   = svgTextRef.current

    let isMounted = true

    // ──────────────────────────────────────────────────────────
    //  Mutable vars dipakai oleh getter functions di tween.
    //  Nilainya di-update setelah font load, lalu ST.refresh()
    //  men-trigger getter functions buat re-evaluate.
    // ──────────────────────────────────────────────────────────
    let travelX = 0
    let travelY = 0

    // SYNC: overlay nutupin konten, word disembunyiin dulu
    gsap.set(overlayEl, { opacity: 1 })
    gsap.set(wordEl,    { opacity: 0 })

    // ══════════════════════════════════════════════════════════
    //  PIN DAN TIMELINE DIBUAT SYNC
    //  Ini WAJIB sync supaya pinSpacing-nya masuk ke kalkulasi
    //  ScrollTrigger section lain (DalioPrinciplesSection, dll)
    //  SEBELUM mereka bikin ST instance mereka sendiri.
    // ══════════════════════════════════════════════════════════
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top', end: '+=250%',
          pin: true, scrub: 1, anticipatePin: 1,
        },
      })

      // Getter functions: nilai dibaca ulang setiap ST.refresh()
      // invalidateOnRefresh: true → tween re-evaluasi getter-nya
      tl.to(wordEl, {
        x: () => travelX,
        y: () => travelY,
        scale: 1,
        ease: 'power2.inOut',
        duration: 2,
        invalidateOnRefresh: true,
      }, 0)

      tl.to(svgText, { attr: { strokeDashoffset: '0' }, ease: 'power1.inOut', duration: 1.0 }, 0.15)
      tl.to(svgText, { attr: { fill: '#E5997B' }, ease: 'none', duration: 0.12 }, 1.18)
      tl.to(svgText, { attr: { strokeWidth: '2.8' }, ease: 'power2.out', duration: 0.06 }, 1.18)
      tl.to(svgText, { attr: { strokeWidth: '0'   }, ease: 'power2.in',  duration: 0.20 }, 1.24)
      tl.to(overlayEl, { opacity: 0, ease: 'power2.in', duration: 0.7 }, 1.3)

    }, pinEl)

    // ══════════════════════════════════════════════════════════
    //  FONT-DEPENDENT MEASUREMENTS — ASYNC
    //  Runs setelah semua useEffect di semua section selesai
    //  (Promise resolve = setelah seluruh sync code).
    //  ScrollTrigger.refresh() di sini aman karena semua ST
    //  instance sudah terbuat — refresh hanya recalculate,
    //  tidak mengubah urutan/struktur pin.
    // ══════════════════════════════════════════════════════════
    document.fonts
      .load('400 1em "Playfair Display"')
      .then(() => {
        if (!isMounted) return

        // Baca font yang sudah pasti loaded
        const cs           = window.getComputedStyle(emEl)
        const emFontSize   = parseFloat(cs.fontSize)
        const emFontFamily = cs.fontFamily
        const emFontWeight = cs.fontWeight

        // Apply ke SVG sebelum ukur bbox
        gsap.set(svgText, {
          attr: {
            fontSize:   `${emFontSize}`,
            fontFamily: emFontFamily,
            fontWeight: emFontWeight,
            fontStyle:  'normal',
          },
        })

        // Path length akurat setelah font applied
        let pathLen = 4000
        try {
          const bbox = svgText.getBBox()
          pathLen = (bbox.width + bbox.height) * 2.8
          if (!pathLen || pathLen < 200) pathLen = 4000
        } catch { pathLen = 4000 }

        gsap.set(svgText, {
          attr: {
            fill: '#030035', stroke: '#E5997B',
            strokeWidth:      '1.5',
            strokeDasharray:  `${pathLen} ${pathLen}`,
            strokeDashoffset: `${pathLen}`,
            strokeLinejoin:   'round',
            strokeLinecap:    'round',
            paintOrder:       'stroke fill',
          },
        })

        // Ukur posisi dengan font yang benar
        const pinRect = pinEl.getBoundingClientRect()
        const emRect  = emEl.getBoundingClientRect()
        const centerX = pinRect.width / 2

        // startY = posisi word saat section sedang pinned (pinRect.top = 0)
        // = viewport center relatif ke pinnedRef.top
        // Nilai ini konsisten karena word hanya visible saat section pinned
        const startY  = window.innerHeight / 2 + START_OFFSET_Y

        // Update mutable vars → getter functions akan baca ini saat refresh
        travelX = emRect.left - pinRect.left + emRect.width  / 2 - centerX
        travelY = emRect.top  - pinRect.top  + emRect.height / 2 + LAND_OFFSET_Y - startY

        // Set posisi awal word yang akurat, tampilkan
        gsap.set(wordEl, {
          position:        'absolute',
          top:             startY,
          left:            centerX,
          xPercent:        -50,
          yPercent:        -50,
          x: 0, y: 0,
          scale:           3.2,
          opacity:         1,
          transformOrigin: 'center center',
          zIndex:          20,
        })

        // Refresh semua ST instance sekaligus.
        // Aman karena semua section sudah setup duluan (async > sync).
        // invalidateOnRefresh:true pada wordEl tween akan re-evaluasi
        // getter () => travelX / () => travelY dengan nilai baru.
        ScrollTrigger.refresh()

      })
      .catch(() => {
        // Fallback browser lama: tampilkan word apa adanya
        if (!isMounted) return
        gsap.set(wordEl, { opacity: 1 })
      })

    return () => {
      isMounted = false
      ctx.revert()
    }
  }, [])

  return (
    <div ref={pinnedRef} className="relative w-full">

      <section
        ref={sectionRef}
        className="relative w-full h-screen flex items-center justify-center bg-[#F4F4F5] overflow-hidden"
      >
        <div ref={textWrapRef} className="w-full max-w-5xl px-8 md:px-12 lg:px-16 xl:px-20 py-24">
          <p className="text-[#E5997B] font-mono text-xs tracking-[0.3em] uppercase mb-12 reveal-phrase">
            QUIÉNES SOMOS
          </p>
          <div className="space-y-10 md:space-y-14">
            <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#030035] leading-tight">
              No somos un banco.
            </p>

            <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#030035] leading-tight">
              Somos{' '}
              <span ref={emRef} className="invisible" aria-hidden="true">
                arquitectos
              </span>
              {' '}de equilibrio.
            </p>

            <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#030035] leading-tight">
              Transformamos la deuda en{' '}
              <em className="text-[#E5997B] not-italic">productividad.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <div className="relative w-full bg-[#F4F4F5] pb-32 px-8 md:px-12 lg:px-16 xl:px-20 z-30">
        <div className="w-full max-w-5xl mx-auto border-t border-[#030035]/10 pt-12">
          <div className="desc-reveal flex flex-col md:flex-row items-start gap-10">
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[#E5997B]/60 shrink-0 pt-1">
              §&nbsp;001
            </span>
            <p className="font-body text-base md:text-lg text-[#030035]/45 max-w-xl leading-[1.95]">
              En DIMA Finance, cada decisión crediticia se fundamenta en principios
              de ingeniería financiera y equilibrio macroeconómico. No otorgamos
              créditos — diseñamos estructuras que generan valor.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: '#F4F4F5', zIndex: 10 }}
      />

      {/* Floating SVG word */}
      <span ref={wordRef} className="select-none pointer-events-none" style={{ willChange: 'transform, opacity' }}>
        <svg width="1" height="1" style={{ overflow: 'visible', display: 'block' }} aria-hidden="true">
          <text
            ref={svgTextRef}
            x="0" y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontStyle="normal"
            fontWeight="400"
            fontSize="96"
            letterSpacing="0.01em"
            fill="#030035"
            stroke="#E5997B"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="4000 4000"
            strokeDashoffset="4000"
            paintOrder="stroke fill"
          >
            arquitectos
          </text>
        </svg>
      </span>

    </div>
  )
}