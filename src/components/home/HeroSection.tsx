import { useLayoutEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DimaGeometric from '../DimaGeometric'

gsap.registerPlugin(ScrollTrigger)

const HERO_STROKE_LENGTH = 3000

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function HeroSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const curtainRef    = useRef<HTMLDivElement>(null)
  const lineOneRef    = useRef<HTMLHeadingElement>(null)
  const lineTwoRef    = useRef<HTMLHeadingElement>(null)
  const lineOneSvgRef = useRef<SVGSVGElement>(null)
  const lineTwoSvgRef = useRef<SVGSVGElement>(null)
  const clipIdOne     = useId()
  const clipIdTwo     = useId()
  const vantaRef      = useRef<any>(null)

  // ── Vanta init ────────────────────────────────────────────
  useLayoutEffect(() => {
    let destroyed = false
    let scrolling = false
    let resumeTimer: ReturnType<typeof setTimeout>

    async function initVanta() {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js')
      if (destroyed || !sectionRef.current) return

      vantaRef.current = (window as any).VANTA.WAVES({
        el: sectionRef.current,
        THREE: (window as any).THREE,
        mouseControls: false,  // matiin — nyumbang jank saat scroll
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x06091a,
        color: 0x0c1028,
        shininess: 12,
        waveHeight: 20,
        waveSpeed: 0.4,
        zoom: 0.9,
      })
    }

    // Pause Vanta render loop saat scroll biar ga rebutan RAF sama curtain
    const onScroll = () => {
      if (!scrolling) {
        scrolling = true
        vantaRef.current?.renderer?.setAnimationLoop?.(null)
      }
      clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        scrolling = false
        if (vantaRef.current?.renderer) {
          const v = vantaRef.current
          v.renderer.setAnimationLoop(() => v.onUpdate?.())
        }
      }, 200)
    }

    initVanta()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      destroyed = true
      clearTimeout(resumeTimer)
      window.removeEventListener('scroll', onScroll)
      vantaRef.current?.destroy()
    }
  }, [])

  // ── Curtain scroll effect ─────────────────────────────────
  useLayoutEffect(() => {
    const curtain = curtainRef.current
    if (!curtain) return

    gsap.set(curtain, { opacity: 1, filter: 'blur(0px)', force3D: true })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: curtain,
        start: 'top top',
        end: '+=80%',
        scrub: true,          // instant follow — no lag
        invalidateOnRefresh: true,
      },
    })

    tl.to(curtain, {
      opacity: 0,
      filter: 'blur(32px)',
      scale: 1.04,           // sedikit zoom out biar kesan "menghilang ke dalam"
      ease: 'none',
      duration: 1,
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  // ── GSAP SVG stroke overlay ───────────────────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = [
      { h1: lineOneRef, svg: lineOneSvgRef },
      { h1: lineTwoRef, svg: lineTwoSvgRef },
    ]

    const detectLines = (h1El: HTMLElement, rect: DOMRect): { text: string; top: number }[] => {
      let textNode: Text | null = null
      for (const child of Array.from(h1El.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          textNode = child as Text
          break
        }
      }
      if (!textNode) return []

      const fullText    = textNode.textContent!.trim()
      const startOffset = textNode.textContent!.indexOf(fullText)
      if (startOffset === -1) return []

      const range    = document.createRange()
      const lineData: { text: string; top: number }[] = []
      let lineStart  = 0
      let lastTop: number | null = null

      for (let i = 0; i < fullText.length; i++) {
        range.setStart(textNode, startOffset + i)
        range.setEnd(textNode, startOffset + i + 1)
        const charRect = range.getBoundingClientRect()
        if (lastTop !== null && Math.abs(charRect.top - lastTop) > 2) {
          lineData.push({ text: fullText.slice(lineStart, i).trim(), top: lastTop - rect.top })
          lineStart = i
        }
        lastTop = charRect.top
      }

      lineData.push({ text: fullText.slice(lineStart).trim(), top: (lastTop ?? rect.top) - rect.top })
      return lineData.filter(l => l.text.length > 0)
    }

    const syncOverlay = () => {
      const sectionRect = section.getBoundingClientRect()
      lines.forEach(({ h1, svg }) => {
        const h1El  = h1.current
        const svgEl = svg.current
        if (!h1El || !svgEl) return

        const rect   = h1El.getBoundingClientRect()
        const styles = getComputedStyle(h1El)

        svgEl.style.position = 'absolute'
        svgEl.style.left     = `${rect.left - sectionRect.left}px`
        svgEl.style.top      = `${rect.top  - sectionRect.top}px`
        svgEl.style.width    = `${rect.width}px`
        svgEl.style.height   = `${rect.height}px`
        svgEl.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)

        const textEl = svgEl.querySelector<SVGTextElement>('[data-hero-stroke]')
        if (!textEl) return

        textEl.setAttribute('font-size',      styles.fontSize)
        textEl.setAttribute('font-family',    styles.fontFamily)
        textEl.setAttribute('font-weight',    styles.fontWeight)
        textEl.setAttribute('font-style',     styles.fontStyle)
        textEl.setAttribute('letter-spacing', styles.letterSpacing)
        textEl.innerHTML = ''

        detectLines(h1El, rect).forEach(({ text, top }) => {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          tspan.setAttribute('x', '0')
          tspan.setAttribute('y', `${top}`)
          tspan.setAttribute('dominant-baseline', 'text-before-edge')
          tspan.textContent = text
          textEl.appendChild(tspan)
        })

        h1El.style.color              = 'transparent'
        h1El.style.webkitTextFillColor = 'transparent'

        const clipRect = svgEl.querySelector<SVGRectElement>('[data-hero-clip]')
        if (clipRect) {
          clipRect.setAttribute('x',      `${rect.width}`)
          clipRect.setAttribute('y',      '0')
          clipRect.setAttribute('width',  '0')
          clipRect.setAttribute('height', `${rect.height}`)
        }
      })
    }

    const ctx = gsap.context(() => {
      syncOverlay()

      const strokeEls = lines
        .map(({ svg }) => svg.current?.querySelector<SVGTextElement>('[data-hero-stroke]'))
        .filter(Boolean) as SVGTextElement[]
      const clipEls = lines
        .map(({ svg }) => svg.current?.querySelector<SVGRectElement>('[data-hero-clip]'))
        .filter(Boolean) as SVGRectElement[]

      if (!strokeEls.length || !clipEls.length) return

      gsap.set(strokeEls, { strokeDasharray: HERO_STROKE_LENGTH, strokeDashoffset: HERO_STROKE_LENGTH, opacity: 0 })

      const h1Els = [lineOneRef.current, lineTwoRef.current].filter(Boolean) as HTMLElement[]

      const intro = gsap.timeline()
      intro.to(strokeEls, { opacity: 1, strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.08 }, 0)
      intro.to(clipEls, {
        attr: { x: 0, width: (_: number, el: SVGRectElement) => el.ownerSVGElement?.getBoundingClientRect().width || 0 },
        duration: 1.1, ease: 'power2.out', stagger: 0.08,
      }, 0)
      intro.to(h1Els, {
        color: (_: number, el: HTMLElement) => el.dataset.color ?? '#ffffff',
        webkitTextFillColor: (_: number, el: HTMLElement) => el.dataset.color ?? '#ffffff',
        duration: 1.1, ease: 'power2.out', stagger: 0.08,
      }, 0)
      intro.to(strokeEls, { opacity: 0, strokeDashoffset: HERO_STROKE_LENGTH, duration: 0.7, ease: 'power2.in', stagger: 0.08 }, 1.1)
      intro.to(clipEls, {
        attr: { x: (_: number, el: SVGRectElement) => el.ownerSVGElement?.getBoundingClientRect().width || 0, width: 0 },
        duration: 0.7, ease: 'power2.in', stagger: 0.08,
      }, 1.1)
    }, sectionRef)

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => { syncOverlay(); ScrollTrigger.refresh() }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      ctx.revert()
    }
  }, [])

  return (
    <>
      {/* ── Curtain wrapper — fixed di atas, lenyap saat scroll ── */}
      <div
        ref={curtainRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          pointerEvents: 'none',
          willChange: 'opacity, filter, transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <section
          ref={sectionRef}
          className="relative w-full h-screen overflow-hidden"
        >
          {/* DimaGeometric */}
          <div className="absolute inset-y-0 right-0 w-[60%] z-[3] pointer-events-none select-none overflow-hidden">
            <div className="w-full h-full flex items-center justify-end">
              <div style={{ width: '85%', height: '85%', transform: 'translateX(9%)', mixBlendMode: 'screen' }}>
                <DimaGeometric />
              </div>
            </div>
          </div>

          {/* UI Layout */}
          <div className="relative z-[10] w-full h-full flex flex-col justify-between p-10 md:p-16 lg:p-24">
            <div className="invisible flex flex-col gap-1">
              <span className="font-mono text-[9px]">x</span>
              <span className="font-mono text-[8px]">x</span>
            </div>

            <div className="max-w-4xl select-none">
              <div className="reveal-item overflow-hidden mb-8">
                <p className="text-[#E5997B] font-mono text-[11px] tracking-[1em] uppercase flex items-center gap-6">
                  <span className="w-16 h-[1px] bg-[#E5997B]/30" />
                  Ingeniería de Capital
                </p>
              </div>

              <div className="space-y-2">
                <h1 ref={lineOneRef} data-color="#ffffff"
                  className="reveal-item font-display text-[12vw] lg:text-[8.5vw] text-white leading-[0.85] tracking-tighter">
                  DEUDA QUE
                </h1>
                <h1 ref={lineTwoRef} data-color="#E5997B"
                  className="reveal-item font-display text-[12vw] lg:text-[8.5vw] text-[#E5997B] italic leading-[0.85] tracking-tighter">
                  GENERA VALOR.
                </h1>
              </div>

              <div className="reveal-item mt-14 flex items-start gap-10">
                <div className="w-[1px] h-20 bg-gradient-to-b from-[#E5997B] to-transparent opacity-40" />
                <p className="text-white/40 font-body text-base lg:text-lg max-w-[380px] leading-relaxed">
                  Diseñamos arquitecturas financieras que transforman el balance corporativo en una plataforma de crecimiento estratégico.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="reveal-item hidden md:block">
                <div className="flex flex-col gap-1 opacity-30">
                  <span className="font-mono text-[8px] text-white tracking-[0.8em] uppercase">Crédito Empresarial</span>
                  <span className="font-mono text-[10px] text-white tracking-[0.2em]">Todos los sectores · Todas las escalas</span>
                </div>
              </div>

              <div className="reveal-item flex items-center gap-6 w-full md:w-auto pointer-events-auto">
                <Link to="/contacto"
                  className="flex-1 md:flex-none text-center px-8 py-5 font-mono text-[10px] tracking-[0.5em] uppercase text-white/40 hover:text-white transition-all border border-white/0 hover:border-white/10">
                  Contacto
                </Link>
                <Link to="/modelo-crediticio"
                  className="group relative flex-1 md:flex-none flex items-center justify-center gap-6 px-12 py-5 bg-white/[0.03] backdrop-blur-3xl border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-[#E5997B] translate-y-full group-hover:translate-y-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]" />
                  <span className="relative z-10 font-body text-[10px] tracking-[0.6em] uppercase text-white group-hover:text-[#000000] transition-colors duration-[900ms] font-bold">Ver Modelo</span>
                  <svg className="relative z-10 w-4 h-4 text-[#E5997B] group-hover:text-[#000000] transition-all duration-[900ms] group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute inset-10 pointer-events-none opacity-20 z-[20]">
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#E5997B]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#E5997B]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#E5997B]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#E5997B]" />
          </div>

          {/* Stroke overlay */}
          <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-[15]">
            <svg ref={lineOneSvgRef} aria-hidden="true">
              <defs>
                <clipPath id={clipIdOne} clipPathUnits="userSpaceOnUse">
                  <rect data-hero-clip x="0" y="0" width="0" height="0" />
                </clipPath>
              </defs>
              <text data-hero-stroke clipPath={`url(#${clipIdOne})`} fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
            <svg ref={lineTwoSvgRef} aria-hidden="true">
              <defs>
                <clipPath id={clipIdTwo} clipPathUnits="userSpaceOnUse">
                  <rect data-hero-clip x="0" y="0" width="0" height="0" />
                </clipPath>
              </defs>
              <text data-hero-stroke clipPath={`url(#${clipIdTwo})`} fill="none" stroke="#E5997B" strokeWidth="1.8" />
            </svg>
          </div>
        </section>
      </div>

      {/* Spacer — dorong konten bawah turun setinggi viewport */}
      <div style={{ height: '180vh' }} aria-hidden="true" />
    </>
  )
}