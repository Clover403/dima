import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function TitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 700 120"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible' }}
    >
      {/* Line 1 — normal, lightgray */}
      <text x="350" y="52" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="56" fontWeight="400" fill="none" stroke="#F5F3EE" strokeWidth="1" data-stroke-line="0">¿Listo para estructurar</text>
      <text x="350" y="52" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="56" fontWeight="400" fill="#F5F3EE" fillOpacity="0" data-fill-line="0">¿Listo para estructurar</text>

      {/* Line 2 — italic, bronze */}
      <text x="350" y="112" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="56" fontWeight="400" fill="none" stroke="#E5997B" strokeWidth="1" data-stroke-line="1">su crecimiento?</text>
      <text x="350" y="112" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="56" fontWeight="400" fill="#E5997B" fillOpacity="0" data-fill-line="1">su crecimiento?</text>
    </svg>
  )
}

export default function ProcessCTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLImageElement>(null)
  const titleSvgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current

    /* ── SVG stroke animation ── */
    document.fonts.ready.then(() => {
      const svg = titleSvgRef.current
      if (!svg) return

      const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
      const fillLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))

      const lengths = strokeLines.map(line => {
        const len = line.getComputedTextLength()
        return len > 10 ? len : 600
      })

      strokeLines.forEach((line, i) => {
        line.style.strokeDasharray = `${lengths[i]}`
        line.style.strokeDashoffset = `${lengths[i]}`
        line.style.opacity = '1'
      })
      fillLines.forEach(line => {
        line.style.fillOpacity = '0'
      })

      const tl = gsap.timeline({ paused: true })
      tl
        .to(strokeLines, { strokeDashoffset: 0, duration: 1.6, stagger: 0.25, ease: 'power2.inOut' }, 0)
        .to(fillLines, { fillOpacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, 1.2)
        .to(strokeLines, { opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power1.in' }, 1.8)

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => tl.play(0),
      })
    })

    /* ── Background parallax + other animations ── */
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { y: 30, scale: 1.1 },
          {
            y: -30, scale: 1.05, ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', end: 'bottom top', scrub: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden border-t border-lightgray/5"
    >
      {/* ── Background photo ── */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="/foto/brand-nature.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/60 to-navy/90" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">

        {/* Title SVG */}
        <div className="cta-reveal mb-6">
          <TitleSVG svgRef={titleSvgRef} />
        </div>

        <p className="cta-reveal font-body text-lightgray/55 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Iniciemos con un diagnóstico estructural. Cada conversación es el
          primer nodo del proceso.
        </p>

        <div className="cta-reveal flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contacto" className="btn-bronze-fill">
            Agendar Consulta
          </Link>
          <Link to="/productos" className="btn-bronze">
            Ver Productos
          </Link>
        </div>
      </div>
    </section>
  )
}