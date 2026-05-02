import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const counters = [
  { target: 500, suffix: "M", prefix: "+", label: "Capital estructurado (MXN)" },
  { target: 150, suffix: "", prefix: "+", label: "Empresas fortalecidas" },
  { target: 98, suffix: "%", prefix: "", label: "Tasa de cumplimiento" },
  { target: 360, suffix: "°", prefix: "", label: "Visión integral de riesgo" },
];

function AnimatedCounter({ target, suffix, prefix, label }: { target: number; suffix: string; prefix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      },
    });

    return () => st.kill();
  }, [target, suffix, prefix]);

  return (
    <div className="text-center px-4">
      <span ref={ref} className="font-display text-6xl md:text-7xl lg:text-8xl text-navy block mb-4">
        {prefix}0{suffix}
      </span>
      <div className="w-12 h-px bg-bronze/40 mx-auto mb-4" />
      <p className="font-body text-sm md:text-base text-navy/50 tracking-wide">{label}</p>
    </div>
  );
}

function CTATitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 130"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible' }}
    >
      {/* Line 1 */}
      <text x="400" y="52" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="64" fontWeight="400" fill="none" stroke="#030035" strokeWidth="1" data-stroke-line="0">¿Listo para estructurar</text>
      <text x="400" y="52" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="64" fontWeight="400" fill="#030035" fillOpacity="0" data-fill-line="0">¿Listo para estructurar</text>
      {/* Line 2 */}
      <text x="400" y="118" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="64" fontWeight="400" fill="none" stroke="#030035" strokeWidth="1" data-stroke-line="1">tu crecimiento?</text>
      <text x="400" y="118" textAnchor="middle" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="64" fontWeight="400" fill="#030035" fillOpacity="0" data-fill-line="1">tu crecimiento?</text>
    </svg>
  )
}

export default function FinaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const titleSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1, scale: 1, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
          }
        );
      }
    }, sectionRef);

    /* SVG stroke animation */
    document.fonts.ready.then(() => {
      const svg = titleSvgRef.current
      if (!svg || !ctaRef.current) return

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
        trigger: ctaRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => tl.play(0),
      })
    })

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex flex-col">
      {/* TOP HALF — Counters on gray */}
      <div className="flex-1 bg-lightgray flex items-center py-24 md:py-32 px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            {counters.map((c, i) => (
              <AnimatedCounter key={i} {...c} />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM HALF — CTA on bronze gradient */}
      <div className="bg-lightgray px-8 md:px-16 lg:px-24 py-16">
        <div
          ref={ctaRef}
          className="relative overflow-hidden bg-gradient-to-br from-bronze to-bronze px-8 md:px-16 lg:px-24 py-20 md:py-28"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="xMidYMid slice">
              <path d="M400 0L800 200L400 400L0 200Z" stroke="#030035" strokeWidth="1" />
              <path d="M400 50L750 200L400 350L50 200Z" stroke="#030035" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Title SVG */}
            <div className="mb-6">
              <CTATitleSVG svgRef={titleSvgRef} />
            </div>

            <p className="font-body text-navy/70 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Conversemos sobre cómo la ingeniería financiera puede transformar
              la estructura de tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacto"
                className="inline-block px-8 py-4 bg-navy text-white font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-navy/80"
              >
                AGENDA UNA VIDEOLLAMADA
              </Link>
              <Link
                to="/contacto"
                className="inline-block px-8 py-4 border border-navy text-navy font-body font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-navy hover:text-white"
              >
                CONTÁCTANOS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}