import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function TitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 130"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible' }}
    >
      {/* Line 1 — normal, white */}
      <text x="400" y="52" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="70" fontWeight="400" fill="none" stroke="#FFFFFF" strokeWidth="1" data-stroke-line="0">¿Listo para estructurar</text>
      <text x="400" y="52" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="70" fontWeight="400" fill="#FFFFFF" fillOpacity="0" data-fill-line="0">¿Listo para estructurar</text>
      {/* Line 2 — italic, bronze */}
      <text x="400" y="118" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="70" fontWeight="400" fill="none" stroke="#E5997B" strokeWidth="1" data-stroke-line="1">su crecimiento?</text>
      <text x="400" y="118" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="70" fontWeight="400" fill="#E5997B" fillOpacity="0" data-fill-line="1">su crecimiento?</text>
    </svg>
  )
}

export default function ModeloCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleSvgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current

    /* SVG stroke animation */
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

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Text + buttons reveal */
      gsap.fromTo(
        el.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      /* Geometric background float */
      const geo = el.querySelector('.geo-bg')
      if (geo) {
        gsap.to(geo, { y: -12, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate bg-navy py-32 md:py-48 section-padding overflow-hidden">
      {/* 1. Base Image */}
      <img
        src="/foto/brand-corporate.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* 2. Navy Overlay */}
      <div className="absolute inset-0 bg-navy/85 z-0" />

      {/* 3. Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">

        {/* Title SVG */}
        <div className="reveal mb-6">
          <TitleSVG svgRef={titleSvgRef} />
        </div>

        <p className="reveal font-body text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-12">
          Descubra cómo nuestro modelo puede transformar la deuda en un motor
          de productividad para su empresa.
        </p>

        <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contacto" className="btn-bronze-fill">Agendar Consulta</Link>
          <Link to="/productos" className="btn-bronze">Ver Productos</Link>
        </div>
      </div>

      <div className="geo-bg absolute -bottom-20 -right-20 w-96 h-96 bg-bronze/10 rounded-full blur-3xl -z-10" />
    </section>
  )
}