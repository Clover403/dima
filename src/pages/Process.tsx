import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import ModeloProceso from '../components/modelo/ModeloProceso';
import AnimatedGrid from '../components/AnimatedGrid';
import ProcessCTASection from '../components/ProcessCTASection';
import SectionCurtain from '../components/SectionCurtain';
import InteractiveConstellationText from '../components/InteractiveConstellationText';

gsap.registerPlugin(ScrollTrigger);

function runStrokeDraw(
  root: Element,
  opts: { scrub?: boolean; start?: string; end?: string; duration?: number; stagger?: number } = {}
) {
  const paths = root.querySelectorAll<SVGGeometryElement>('.draw-path');
  paths.forEach((p) => {
    const len = p.getTotalLength?.() ?? 1000;
    (p as unknown as SVGPathElement).style.strokeDasharray = `${len}`;
    (p as unknown as SVGPathElement).style.strokeDashoffset = `${len}`;
  });
  return gsap.to(paths, {
    strokeDashoffset: 0,
    duration: opts.duration ?? 2,
    ease: 'power2.inOut',
    stagger: opts.stagger ?? 0.03,
    scrollTrigger: {
      trigger: root,
      start: opts.start ?? 'top 75%',
      end: opts.end,
      scrub: opts.scrub ?? false,
    },
  });
}

export default function Process() {
  const pageRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.proceso-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 55,
        ease: 'none',
      });

      if (narrativeRef.current) {
        const phaseEls = narrativeRef.current.querySelectorAll('.phase-frame');
        phaseEls.forEach((frame) => {
          const text = frame.querySelectorAll('.phase-text > *');
          const illus = frame.querySelector('.phase-illus');
          gsap.from(text, {
            opacity: 0,
            y: 40,
            filter: 'blur(4px)',
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: frame, start: 'top 70%' },
          });
          if (illus) {
            gsap.fromTo(
              illus,
              { opacity: 0, scale: 0.96 },
              {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: frame, start: 'top 70%' },
              }
            );
            runStrokeDraw(illus, { start: 'top 75%', duration: 2.5 });
          }
        });
      }

      gsap.utils.toArray<HTMLElement>('.principle-block').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        );
      });

      gsap.utils.toArray<SVGSVGElement>('.principle-divider').forEach((svg) => {
        runStrokeDraw(svg, { start: 'top 85%', duration: 2 });
      });

      gsap.utils.toArray<HTMLElement>('.cta-reveal').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div ref={pageRef}>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#030035]">
          <AnimatedGrid cellSize={60} color="229,153,123" />

          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

            <div className="absolute top-[12%] left-0 flex whitespace-nowrap opacity-[0.04] select-none pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="proceso-marquee font-display text-[14vw] leading-none uppercase pr-20 text-[#F4F4F5]"
                >
                  Proceso &bull; Ingeniería &bull; Crédito &bull; Iteración &bull;
                </span>
              ))}
            </div>

            <div className="relative z-10 text-center max-w-6xl w-full px-8 pointer-events-none flex flex-col items-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-[#E5997B]/50" />
                <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
                  Nuestro Proceso
                </p>
                <div className="w-8 h-px bg-[#E5997B]/50" />
              </div>

              <InteractiveConstellationText
                lines={[
                  { text: 'Ingeniería', y: 115, color: '#F4F4F5' },
                  { text: 'Financiera.', y: 265, fontStyle: 'italic', color: '#E5997B' },
                ]}
                viewBox="0 0 1350 310"
                defaultFontSize={150}
                fontFamily="'Playfair Display', serif"
                containerClassName="pointer-events-auto w-full"
              />

              <p className="font-body text-[#F4F4F5]/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-4 mb-12">
                Un enfoque metodológico y disciplinado para la estructuración de
                soluciones de crédito empresarial.
              </p>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
              </div>
            </div>
          </section>

          <ModeloProceso />
          <SectionCurtain curtainColor="#F4F4F5">
            <ProcessCTASection />
          </SectionCurtain>
      </div>
    </PageTransition>
  );
}