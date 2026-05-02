import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAreSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const textWrapRef   = useRef<HTMLDivElement>(null)
  const pinnedRef     = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const wordRef       = useRef<HTMLSpanElement>(null)
  const emRef         = useRef<HTMLSpanElement>(null)
  const svgTextRef    = useRef<SVGTextElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)

  // ─── Canvas Particles NAVY + GRAB MODE + CLEAR LINES ───────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: {
      x: number; y: number; vx: number; vy: number; size: number
    }[] = []

    const mouse = { x: -1000, y: -1000 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    // ░░░ KONFIGURASI (bisa disesuaikan) ░░░
    const NAVY = '#0A192F'
    const COUNT = 70
    const PARTICLE_OPACITY = 0.6
    const LINK_OPACITY = 0.22          // lebih jelas
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
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Garis antar partikel
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

      // Update posisi + attraction (grab)
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

      // Garis ke kursor (grab lines)
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

      // Gambar titik
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
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // ─── Animasi teks (asli) ───────
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

  // Scroll hint
  useEffect(() => {
    const el = scrollHintRef.current
    if (!el) return
    gsap.set(el, { opacity: 0 })
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: 'top top', end: '+=250%',
        onEnter:     () => gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeave:     () => gsap.to(el, { opacity: 0, duration: 0.4, ease: 'power2.in'  }),
        onEnterBack: () => gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(el, { opacity: 0, duration: 0.4, ease: 'power2.in'  }),
        onUpdate: (self) => {
          if (self.progress > 0.06) gsap.to(el, { opacity: 0, duration: 0.4, ease: 'power2.in' })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Animasi "arquitectos"
  useEffect(() => {
    if (!pinnedRef.current || !overlayRef.current || !wordRef.current || !emRef.current || !svgTextRef.current) return

    const LAND_OFFSET_Y = -23
    const pinEl     = pinnedRef.current
    const overlayEl = overlayRef.current
    const wordEl    = wordRef.current
    const emEl      = emRef.current
    const svgText   = svgTextRef.current

    let isMounted = true
    let travelX   = 0
    let travelY   = 0

    gsap.set(overlayEl, { opacity: 1 })
    gsap.set(wordEl, { opacity: 0 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top', end: '+=350%',
          pin: true, scrub: 1, anticipatePin: 1,
        },
      })

      tl.to(wordEl, {
        x: () => travelX,
        y: () => travelY,
        scale: 1,
        ease: 'power2.inOut',
        duration: 2,
        invalidateOnRefresh: true,
      }, 0)

      tl.to(wordEl, { opacity: 1, duration: 0.01 }, 0)

      tl.to(svgText, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 1.0 }, 0.15)
      tl.to(svgText, { fill: '#030035', ease: 'power2.out', duration: 0.35 }, 0.72)
      tl.to(svgText, { strokeWidth: 0, ease: 'power2.in', duration: 0.35 }, 0.72)
      tl.to(svgText, { fill: '#E5997B', ease: 'none', duration: 0.12 }, 1.3)
      tl.to(overlayEl, { opacity: 0, ease: 'power2.in', duration: 0.7 }, 1.3)
      tl.to({}, { duration: 0.8 })

    }, pinEl)

    document.fonts.load('400 1em "Playfair Display"').then(() => {
      if (!isMounted) return

      const cs = window.getComputedStyle(emEl)
      gsap.set(svgText, {
        attr: {
          fontSize:   `${parseFloat(cs.fontSize)}`,
          fontFamily: cs.fontFamily,
          fontWeight: cs.fontWeight,
          fontStyle:  'normal',
        },
      })

      let pathLen = 4000
      try {
        const bbox = svgText.getBBox()
        pathLen = (bbox.width + bbox.height) * 2.8
        if (!pathLen || pathLen < 200) pathLen = 4000
      } catch { pathLen = 4000 }

      svgText.style.fill             = 'none'
      svgText.style.stroke           = '#030035'
      svgText.style.strokeWidth      = '0.8px'
      svgText.style.strokeDasharray  = `${pathLen}`
      svgText.style.strokeDashoffset = `${pathLen}`
      svgText.style.strokeLinejoin   = 'round'
      svgText.style.strokeLinecap    = 'round'
      svgText.style.paintOrder       = 'stroke fill'

      const pinRect = pinEl.getBoundingClientRect()
      const emRect  = emEl.getBoundingClientRect()
      const centerX = pinRect.width / 2
      const startY  = window.innerHeight / 2

      travelX = emRect.left - pinRect.left + emRect.width  / 2 - centerX
      travelY = emRect.top  - pinRect.top  + emRect.height / 2 + LAND_OFFSET_Y - startY

      gsap.set(wordEl, {
        position: 'absolute',
        top: startY, left: centerX,
        xPercent: -50, yPercent: -50,
        x: 0, y: 0,
        scale: 3.2,
        transformOrigin: 'center center',
        zIndex: 20,
      })

      ScrollTrigger.refresh()
    })

    return () => {
      isMounted = false
      ctx.revert()
    }
  }, [])

  return (
    <>
    <div ref={pinnedRef} className="relative w-full" style={{ position: 'relative', zIndex: 1 }}>
      <section
        ref={sectionRef}
        className="relative w-full h-screen flex items-center justify-center bg-[#F4F4F5] overflow-hidden"
      >
        {/* Canvas dengan grab mode */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          style={{ pointerEvents: 'auto' }}
        />

        <div ref={textWrapRef} className="w-full max-w-5xl px-8 md:px-12 lg:px-16 xl:px-20 py-24 relative z-10">
          <p className="text-[#E5997B] font-mono text-xs tracking-[0.3em] uppercase mb-12 reveal-phrase">
            QUIÉNES SOMOS
          </p>
          <div className="space-y-10 md:space-y-14">
            <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#030035] leading-tight">
              No somos un banco.
            </p>
            <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#030035] leading-tight">
              Somos{' '}
              <span ref={emRef} className="invisible" aria-hidden="true">arquitectos</span>
              {' '}de equilibrio.
            </p>
            <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#030035] leading-tight">
              Transformamos la deuda en{' '}
              <em className="text-[#E5997B] not-italic">productividad.</em>
            </p>
          </div>
        </div>
      </section>

      <div className="relative w-full bg-[#F4F4F5] pb-32 px-8 md:px-12 lg:px-16 xl:px-20 z-30">
        <div className="w-full max-w-5xl mx-auto border-t border-[#030035]/10 pt-12">
          <div className="desc-reveal flex flex-col md:flex-row items-start gap-10">
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[#E5997B]/60 shrink-0 pt-1">§&nbsp;001</span>
            <p className="font-body text-base md:text-lg text-[#030035]/45 max-w-xl leading-[1.95]">
              En DIMA Finance, cada decisión crediticia se fundamenta en principios
              de ingeniería financiera y equilibrio macroeconómico. No otorgamos
              créditos — diseñamos estructuras que generan valor.
            </p>
          </div>
        </div>
      </div>

      <div ref={overlayRef} className="absolute inset-0 pointer-events-none" style={{ backgroundColor: '#F4F4F5', zIndex: 10 }} />

      <span ref={wordRef} className="select-none pointer-events-none" style={{ willChange: 'transform, opacity' }}>
        <svg width="1" height="1" style={{ overflow: 'visible', display: 'block' }} aria-hidden="true">
          <text
            ref={svgTextRef}
            x="0" y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="400"
            fontSize="96"
            letterSpacing="0.01em"
          >
            arquitectos
          </text>
        </svg>
      </span>
    </div>

    <div ref={scrollHintRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" style={{ zIndex: 9999 }}>
      <span className="font-mono text-[8px] tracking-[0.5em] uppercase text-[#030035]/40">Scroll</span>
      <div className="w-px h-7 bg-gradient-to-b from-[#030035]/35 to-transparent" />
    </div>
    </>
  )
}