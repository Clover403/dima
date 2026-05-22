import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const phases = [
  {
    num: '01',
    title: 'Diagnóstico e Ideación',
    subtitle: 'Fase de Identificación',
    nodes: [
      {
        title: 'Diagnóstico',
        desc: 'Revisión integral del perfil corporativo. Análisis de la situación financiera actual, requerimientos de capital y viabilidad estructural preliminar.'
      },
      {
        title: 'Alineación',
        desc: 'Determinación del producto financiero preliminar y sus componentes estructurales base. Sincronización de expectativas entre las partes.'
      },
      {
        title: 'Sincronización',
        desc: 'Intercambio de métricas clave: avalúos, tasas, plazos y garantías. Establecimiento de reglas de gobernanza y marcos de referencia.'
      }
    ]
  },
  {
    num: '02',
    title: 'Due Diligence y Riesgos',
    subtitle: 'Reingeniería de Riesgos',
    nodes: [
      {
        title: 'Recopilación y Validación',
        desc: 'Due diligence multidisciplinario: legal, fiscal, contable y financiero. Evaluación profunda con el modelo macroeconómico DIMA.'
      },
      {
        title: 'Evaluación',
        desc: 'Análisis de integridad reputacional, buró de crédito y solvencia estructural. Determinación de viabilidad de base y condiciones de intervención.'
      },
      {
        title: 'ITERAR',
        desc: 'Protocolo de reconfiguración estratégica. Intervención activa para transformar el balance corporativo hasta alcanzar la solvencia y estructura óptima requerida.',
        isIterate: true
      }
    ]
  },
  {
    num: '03',
    title: 'Modelado y Despliegue',
    subtitle: 'Implementación y Escalabilidad',
    nodes: [
      {
        title: 'Integración',
        desc: 'Ingeniería financiera absoluta. Definición de variables crediticias y sincronización de la amortización con el flujo de caja libre operativo.'
      },
      {
        title: 'Formalización',
        desc: 'Estructuración jurídica integral. Constitución de garantías, fideicomisos y blindaje contractual dentro de un marco legal robusto.'
      },
      {
        title: 'Dispersión',
        desc: 'Inyección de liquidez como anticipo estratégico del gasto. Desembolso productivo diseñado para maximizar el rendimiento del capital desde el primer día.'
      }
    ]
  },
  {
    num: '04',
    title: 'Gobernanza y Escalabilidad',
    subtitle: 'Consolidación Institucional',
    nodes: [
      {
        title: 'Gobernanza y Escalabilidad',
        desc: 'Establecimiento de métricas de control, políticas de capital y comités internos. Profesionalización de la toma de decisiones financieras a largo plazo.'
      },
      {
        title: 'Disciplina de Capital',
        desc: 'Implementación de reglas estructurales para la asignación eficiente del capital. Creación de políticas de dividendos y reinversión alineadas al ciclo económico.'
      },
      {
        title: 'Sucesión Financiera',
        desc: 'Diseño de continuidad institucional. Transferencia ordenada de conocimiento financiero y estructuras de gobierno para garantizar la sostenibilidad del modelo.'
      }
    ]
  }
]

// ─── Intro Title SVG ──────────────────────────────────────────────────────────
function IntroTitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 275"
      preserveAspectRatio="xMinYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible', opacity: 0 }}
    >
      <text x="0" y="130" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="130" fontWeight="400" fill="none" stroke="#030035" strokeWidth="1" data-stroke-line="0">The Process</text>
      <text x="0" y="130" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="130" fontWeight="400" fill="#030035" fillOpacity="0" data-fill-line="0">The Process</text>
      <text x="0" y="243" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="130" fontWeight="400" fill="none" stroke="#E5997B" strokeWidth="1" data-stroke-line="1">Architecture.</text>
      <text x="0" y="243" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="130" fontWeight="400" fill="#E5997B" fillOpacity="0" data-fill-line="1">Architecture.</text>
    </svg>
  )
}

// ─── Final Title SVG ──────────────────────────────────────────────────────────
function FinalTitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 900 228"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible', opacity: 0 }}
    >
      <text x="450" y="105" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="115" fontWeight="400" fill="none" stroke="#030035" strokeWidth="1" data-stroke-line="0">Ready to</text>
      <text x="450" y="105" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="115" fontWeight="400" fill="#030035" fillOpacity="0" data-fill-line="0">Ready to</text>
      <text x="450" y="215" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="145" fontWeight="400" fill="none" stroke="#E5997B" strokeWidth="1" data-stroke-line="1">Execute?</text>
      <text x="450" y="215" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="145" fontWeight="400" fill="#E5997B" fillOpacity="0" data-fill-line="1">Execute?</text>
    </svg>
  )
}

// ─── Helper: stroke timeline ──────────────────────────────────────────────────
function buildStrokeTl(svg: SVGSVGElement) {
  const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
  const fillLines   = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))

  const lengths = strokeLines.map((line) => {
    let len = line.getComputedTextLength()
    if (!len || len < 10) len = 800
    line.style.strokeDasharray  = `${len}`
    line.style.strokeDashoffset = `${len}`
    return len
  })

  gsap.set(strokeLines, { strokeDashoffset: (i) => lengths[i] })
  gsap.set(fillLines,   { fillOpacity: 0 })
  gsap.set(svg,         { opacity: 1 })

  const tl = gsap.timeline({ paused: true })
  tl
    .to(strokeLines, { strokeDashoffset: 0,  duration: 1.6, stagger: 0.2,  ease: 'power2.inOut' }, 0)
    .to(fillLines,   { fillOpacity: 1,        duration: 0.8, stagger: 0.1,  ease: 'power2.out'   }, 1.2)
    .to(strokeLines, { opacity: 0,            duration: 0.6, stagger: 0.06, ease: 'power1.in'    }, 1.7)

  return tl
}

// ─── Particles ────────────────────────────────────────────────────────────────
function ProcessParticles() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const win = window as Window
    let animationId = 0
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []
    const mouse = { x: -1000, y: -1000 }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    let ro: ResizeObserver | null = null
    if ('ResizeObserver' in win) {
      ro = new ResizeObserver(resize)
      ro.observe(wrap)
    } else {
      win.addEventListener('resize', resize)
    }
    resize()

    const NAVY = '#0A192F'
    const COUNT = 70
    const PARTICLE_OPACITY = 0.6
    const LINK_OPACITY = 0.22
    const GRAB_RADIUS = 130
    const GRAB_OPACITY = 0.4
    const ATTRACT_FORCE = 0.07

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.4 + 1.2,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }
    wrap.addEventListener('mousemove', handleMouseMove)
    wrap.addEventListener('mouseleave', handleMouseLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 190) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = NAVY
            ctx.lineWidth = 0.9
            ctx.globalAlpha = LINK_OPACITY * (1 - dist / 190)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < GRAB_RADIUS) {
          const angle = Math.atan2(dy, dx)
          const force = (1 - dist / GRAB_RADIUS) * ATTRACT_FORCE
          p.vx += Math.cos(angle) * force
          p.vy += Math.sin(angle) * force
        }

        p.x += p.vx
        p.y += p.vy

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 1.4) {
          p.vx = (p.vx / speed) * 1.4
          p.vy = (p.vy / speed) * 1.4
        }

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      }

      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < GRAB_RADIUS) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = NAVY
          ctx.lineWidth = 0.8
          ctx.globalAlpha = GRAB_OPACITY * (1 - dist / GRAB_RADIUS)
          ctx.stroke()
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = NAVY
        ctx.globalAlpha = PARTICLE_OPACITY
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (ro) ro.disconnect()
      else win.removeEventListener('resize', resize)
      wrap.removeEventListener('mousemove', handleMouseMove)
      wrap.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none z-[1]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

// ─── 3D Process Card ──────────────────────────────────────────────────────────
function ProcessCard({ node, index }: { node: { title: string; desc: string; isIterate?: boolean }; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const triCanvasRef = useRef<HTMLCanvasElement>(null)
  const triMetaRef = useRef<{ tri: [number, number][]; cx: number; cy: number }[]>([])

  const initTriangles = () => {
    const card = cardRef.current
    const canvas = triCanvasRef.current
    if (!card || !canvas) return
    const rect = card.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const cols = 16
    const rows = 11
    const cX = rect.width / cols
    const cY = rect.height / rows
    let seed = 42
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    const pts: [number, number][][] = []
    for (let r = 0; r <= rows; r++) {
      pts[r] = []
      for (let c = 0; c <= cols; c++) {
        pts[r][c] = [
          c * cX + ((c === 0 || c === cols) ? 0 : (rand() - 0.5) * cX * 0.35),
          r * cY + ((r === 0 || r === rows) ? 0 : (rand() - 0.5) * cY * 0.35),
        ]
      }
    }

    const triMeta: { tri: [number, number][]; cx: number; cy: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t1: [number, number][] = [pts[r][c], pts[r][c + 1], pts[r + 1][c]]
        const t2: [number, number][] = [pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]]
        const c1 = [(t1[0][0] + t1[1][0] + t1[2][0]) / 3, (t1[0][1] + t1[1][1] + t1[2][1]) / 3] as const
        const c2 = [(t2[0][0] + t2[1][0] + t2[2][0]) / 3, (t2[0][1] + t2[1][1] + t2[2][1]) / 3] as const
        triMeta.push({ tri: t1, cx: c1[0], cy: c1[1] })
        triMeta.push({ tri: t2, cx: c2[0], cy: c2[1] })
      }
    }
    triMetaRef.current = triMeta
  }

  const drawTriangles = (x: number, y: number) => {
    const canvas = triCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const RADIUS = 180
    for (const t of triMetaRef.current) {
      const dx = x - t.cx
      const dy = y - t.cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > RADIUS) continue
      const alpha = (1 - dist / RADIUS) * 0.25
      ctx.beginPath()
      ctx.moveTo(t.tri[0][0], t.tri[0][1])
      ctx.lineTo(t.tri[1][0], t.tri[1][1])
      ctx.lineTo(t.tri[2][0], t.tri[2][1])
      ctx.closePath()
      ctx.fillStyle = `rgba(229,153,123,${alpha * 0.18})`
      ctx.fill()
      ctx.strokeStyle = `rgba(229,153,123,${alpha})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !glowRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const nx = (x / rect.width  - 0.5) * 2
    const ny = (y / rect.height - 0.5) * 2

    const edgeX = Math.sign(nx) * Math.pow(Math.abs(nx), 2.2)
    const edgeY = Math.sign(ny) * Math.pow(Math.abs(ny), 2.2)

    const MAX_DEG = 14
    const rotateY =  edgeX * MAX_DEG
    const rotateX = -edgeY * MAX_DEG

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1 - Math.max(Math.abs(edgeX), Math.abs(edgeY)) * 0.018,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 900,
    })

    gsap.to(glowRef.current, {
      opacity: 1,
      x: x - 250,
      y: y - 250,
      duration: 0.2,
      ease: 'none',
    })

    drawTriangles(x, y)
  }

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.85,
      ease: 'elastic.out(1, 0.45)',
    })
    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.45,
    })
    const canvas = triCanvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={initTriangles}
      className={`process-card group relative w-[520px] h-[600px] p-12 flex flex-col justify-between
        rounded-[2.5rem] border-2 overflow-hidden
        transition-[border-color,box-shadow,background-color] duration-700
        hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)]
        ${node.isIterate
          ? 'bg-bronze/[0.04] border-bronze/30 hover:bg-[#FFFAF8]/95 hover:border-bronze'
          : 'bg-white/10 border-navy/5 hover:bg-white/95 hover:border-bronze/40'
        }`}
      style={{
        backdropFilter: 'blur(16px)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <canvas
        ref={triCanvasRef}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ zIndex: 1 }}
      />
      <div
        ref={glowRef}
        className="absolute pointer-events-none opacity-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(229,153,123,0.18) 0%, transparent 65%)',
          filter: 'blur(45px)',
          zIndex: 0,
        }}
      />
      <div className="absolute top-0 right-0 w-40 h-40 bg-bronze/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="relative z-10 flex justify-between items-center" style={{ transform: 'translateZ(30px)' }}>
        <span className="font-display text-lg text-bronze/40 font-bold italic group-hover:text-bronze transition-all duration-500">
          Step 0{index + 1}
        </span>
        {node.isIterate && (
          <div className="px-4 py-1 bg-bronze text-white text-[9px] font-black uppercase tracking-tighter rounded-full shadow-lg shadow-bronze/30">
            Critical Loop
          </div>
        )}
      </div>
      <div className="relative z-10" style={{ transform: 'translateZ(55px)' }}>
        <h4 className={`font-display text-4xl leading-[1.1] mb-8 transition-all duration-700 group-hover:-translate-y-4 ${node.isIterate ? 'text-bronze' : 'text-navy/80 group-hover:text-navy'}`}>
          {node.title}
        </h4>
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]">
          <div className="overflow-hidden">
            <p className="font-body text-navy/60 text-xl leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
              {node.desc}
            </p>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-4 transition-all duration-500">
          <div className="h-[2px] bg-bronze w-10 group-hover:w-20 transition-all duration-700 ease-in-out" />
          <span className="text-bronze font-body text-[10px] tracking-[0.3em] uppercase font-black opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
            Explore Insight
          </span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function UltimateHorizontalProcess() {
  const containerRef    = useRef<HTMLDivElement>(null)
  const sliderRef       = useRef<HTMLDivElement>(null)
  const processTrackRef = useRef<HTMLDivElement>(null)
  const introSvgRef     = useRef<SVGSVGElement>(null)
  const finalSvgRef     = useRef<SVGSVGElement>(null)
  const finalSectionRef = useRef<HTMLElement>(null)

  // ── Overlay Refs ───────────────────────────────────────────────────────────
  const overlayRef      = useRef<HTMLDivElement>(null)
  const numRef          = useRef<HTMLSpanElement>(null)
  const titleWrapRef    = useRef<HTMLDivElement>(null)
  const subtitleRef     = useRef<HTMLParagraphElement>(null)
  const cardsWrapRef    = useRef<HTMLDivElement>(null)
  const dotsRef         = useRef<HTMLDivElement>(null)

  // ── State ──────────────────────────────────────────────────────────────────
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [displayPhase, setDisplayPhase]     = useState(0)
  const [targetPhase, setTargetPhase]       = useState(0)

  const isFirstEnter = useRef(true)
  const isAnimating  = useRef(false)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (sliderRef.current) gsap.set(sliderRef.current, { x: 0 })
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // HORIZONTAL SCROLL + SCROLLTRIGGER SETUP
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!containerRef.current || !sliderRef.current || !processTrackRef.current) return

    const ctx = gsap.context(() => {
      const totalWidth = sliderRef.current!.scrollWidth - window.innerWidth
      const dissolveContainer = containerRef.current!.closest('[data-dissolve-container="true"]') ?? undefined

      const horizontalTween = gsap.to(sliderRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pinnedContainer: dissolveContainer,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      })

      // ── Intro SVG ─────────────────────────────────────────────────────────
      if (introSvgRef.current) {
        const introTl = buildStrokeTl(introSvgRef.current)
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 85%',
          onEnter:     () => introTl.play(),
          onLeaveBack: () => introTl.reverse(),
        })
      }

      // ── Final SVG ─────────────────────────────────────────────────────────
      if (finalSvgRef.current && finalSectionRef.current) {
        const finalTl = buildStrokeTl(finalSvgRef.current)
        ScrollTrigger.create({
          trigger:            finalSectionRef.current,
          containerAnimation: horizontalTween,
          start:              'left 80%',
          onEnter:            () => finalTl.play(),
          onLeaveBack:        () => finalTl.reverse(),
        })
      }

      // ── Process Track ScrollTrigger ───────────────────────────────────────
      // Area 400vw ini jadi "scroll space". Overlay fixed muncul saat masuk area ini.
      ScrollTrigger.create({
        trigger:            processTrackRef.current,
        containerAnimation: horizontalTween,
        start:              'left left',
        end:                'right right',
        onEnter:            () => setOverlayVisible(true),
        onLeave:            () => setOverlayVisible(false),
        onEnterBack:        () => setOverlayVisible(true),
        onLeaveBack:        () => setOverlayVisible(false),
        onUpdate:           (self) => {
          const p = Math.min(3, Math.floor(self.progress * 4))
          if (p !== targetPhase) setTargetPhase(p)
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE TRANSITION ANIMATION
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (targetPhase === displayPhase) return
    if (isAnimating.current) return
    isAnimating.current = true

    const numEl       = numRef.current
    const titleEls    = titleWrapRef.current?.children
    const subtitleEl  = subtitleRef.current
    const cardEls     = cardsWrapRef.current?.children
    const dotEls      = dotsRef.current?.children

    const exitTl = gsap.timeline({
      onComplete: () => {
        setDisplayPhase(targetPhase)
        isAnimating.current = false
      }
    })

    // EXIT: smooth, blur, slide up
    exitTl.to([numEl, subtitleEl], {
      y: -40,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.inOut'
    }, 0)

    if (titleEls && titleEls.length > 0) {
      exitTl.to(titleEls, {
        y: -50,
        opacity: 0,
        filter: 'blur(12px)',
        duration: 0.35,
        stagger: 0.04,
        ease: 'power2.in'
      }, 0)
    }

    if (cardEls && cardEls.length > 0) {
      exitTl.to(cardEls, {
        y: -60,
        opacity: 0,
        scale: 0.9,
        rotateX: -15,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power2.in'
      }, 0.05)
    }

    if (dotEls && dotEls.length > 0) {
      exitTl.to(dotEls, {
        scale: 0.6,
        opacity: 0.2,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.in'
      }, 0)
    }

  }, [targetPhase, displayPhase])

  // ═══════════════════════════════════════════════════════════════════════════
  // ENTER ANIMATION (setelah displayPhase berubah / overlay muncul)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!overlayVisible) return

    const numEl      = numRef.current
    const titleEls   = titleWrapRef.current?.children
    const subtitleEl = subtitleRef.current
    const cardEls    = cardsWrapRef.current?.children
    const dotEls     = dotsRef.current?.children

    const enterTl = gsap.timeline({ delay: isFirstEnter.current ? 0.3 : 0.05 })

    // Number: elastic pop
    enterTl.fromTo(numEl,
      { scale: 0.5, opacity: 0, y: 30, filter: 'blur(8px)' },
      { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'elastic.out(1, 0.5)' }
    )

    // Subtitle: letter spacing breath
    enterTl.fromTo(subtitleEl,
      { opacity: 0, y: 20, letterSpacing: '0.8em' },
      { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 0.7, ease: 'power3.out' },
      '<0.15'
    )

    // Title: staggered reveal with blur
    if (titleEls && titleEls.length > 0) {
      enterTl.fromTo(titleEls,
        { y: 60, opacity: 0, filter: 'blur(14px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.07, ease: 'power3.out' },
        '<0.1'
      )
    }

    // Cards: 3D staggered rise
    if (cardEls && cardEls.length > 0) {
      enterTl.fromTo(cardEls,
        { y: 100, opacity: 0, scale: 0.85, rotateX: 20 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        '<0.15'
      )
    }

    // Dots: pop in
    if (dotEls && dotEls.length > 0) {
      enterTl.fromTo(dotEls,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2)' },
        '<0.3'
      )
    }

    isFirstEnter.current = false

  }, [displayPhase, overlayVisible])

  const currentPhaseData = phases[displayPhase]

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div ref={containerRef} className="bg-lightgray overflow-hidden relative">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SLIDER: hanya 3 layer visual                                      */}
        {/* Layer 1: Intro (100vw)                                            */}
        {/* Layer 2: Process Track (400vw scroll space)                       */}
        {/* Layer 3: Final (100vw)                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div ref={sliderRef} className="flex h-screen w-max items-center relative z-10">

          {/* ══ LAYER 1: INTRO ═══════════════════════════════════════════════ */}
          <section className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 border-r border-gray-100 bg-lightgray relative z-40">
            <div className="max-w-[90%]">
              <span className="text-bronze font-body text-[12px] md:text-[14px] tracking-[0.6em] uppercase font-black mb-8 block">
                Metodología de Élite
              </span>
              <div className="mb-16 w-full">
                <IntroTitleSVG svgRef={introSvgRef} />
              </div>
              <div className="flex items-center gap-8">
                <div className="w-32 h-[2px] bg-bronze" />
                <p className="text-navy/40 font-body text-lg uppercase tracking-widest font-bold italic">
                  Scroll to navigate the framework
                </p>
              </div>
            </div>
          </section>

          {/* ══ LAYER 2: PROCESS TRACK (400vw scroll space) ══════════════════ */}
          <div
            ref={processTrackRef}
            className="w-[400vw] h-full relative bg-gradient-to-r from-white via-gray-50/20 to-white"
          >
            {/* Track ini kosong — kontennya di-handle oleh Fixed Overlay */}
          </div>

          {/* ══ LAYER 3: FINAL ═══════════════════════════════════════════════ */}
          <section
            ref={finalSectionRef}
            className="w-[100vw] h-full flex items-center justify-center bg-lightgray relative z-40"
          >
            <div className="text-center px-10">
              <span className="text-bronze font-body text-sm tracking-[0.8em] uppercase font-black mb-8 block">
                Conclusion
              </span>
              <div className="mb-14 w-[60vw] mx-auto">
                <FinalTitleSVG svgRef={finalSvgRef} />
              </div>
              <button className="group relative px-20 py-8 bg-navy text-white font-body text-xs tracking-[0.6em] uppercase overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(3,0,53,0.2)]">
                <span className="relative z-10">Solicitar Diagnóstico</span>
                <div className="absolute inset-0 bg-bronze translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </section>

        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FIXED OVERLAY: Konten Process yang dinamis                        */}
        {/* Muncul saat scroll masuk process track, hilang saat keluar        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          ref={overlayRef}
          className="fixed inset-0 z-30 flex flex-col justify-center px-12 md:px-32 lg:px-56 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            opacity: overlayVisible ? 1 : 0,
            pointerEvents: overlayVisible ? 'auto' : 'none',
          }}
        >
          {/* Background Marquee */}
          <div className="absolute bottom-[8%] left-0 w-full overflow-hidden opacity-[0.04] select-none pointer-events-none z-0">
            <div
              style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                animation: 'marqueeScroll 35s linear infinite',
                willChange: 'transform',
              }}
            >
              <span className="font-display text-[17vw] leading-none uppercase pr-40 text-navy flex-shrink-0">
                Dima Finance • Methodology • Architecture • Excellence •
              </span>
              <span className="font-display text-[17vw] leading-none uppercase pr-40 text-navy flex-shrink-0">
                Dima Finance • Methodology • Architecture • Excellence •
              </span>
            </div>
          </div>

          {/* Phase Header */}
          <div className="absolute top-[12%] left-12 md:left-32 z-10">
            <div className="flex items-end gap-6 mb-4">
              <span
                ref={numRef}
                className="font-display text-[100px] md:text-[130px] text-navy/[0.04] leading-[0.7] select-none block"
              >
                {currentPhaseData.num}
              </span>
              <div className="mb-4 overflow-hidden">
                <div ref={titleWrapRef}>
                  <h3 className="font-display text-4xl md:text-6xl lg:text-7xl text-navy leading-none mb-3">
                    {currentPhaseData.title}
                  </h3>
                </div>
                <p
                  ref={subtitleRef}
                  className="text-bronze font-body text-xs tracking-[0.5em] uppercase font-black"
                >
                  {currentPhaseData.subtitle}
                </p>
              </div>
            </div>
          </div>

          <ProcessParticles />

          {/* Cards Grid */}
          <div className="relative mt-24 md:mt-32 z-10">
            <div ref={cardsWrapRef} className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10 items-center lg:items-stretch justify-center">
              {currentPhaseData.nodes.map((node, i) => (
                <ProcessCard
                  key={`phase-${displayPhase}-card-${i}`}
                  node={node}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Progress Dots */}
          <div
            ref={dotsRef}
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-3 z-20"
          >
            {phases.map((p, i) => (
              <div
                key={p.num}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === displayPhase
                    ? 'w-10 bg-bronze shadow-lg shadow-bronze/30'
                    : 'w-2 bg-navy/20 hover:bg-navy/40'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </>
  )
}