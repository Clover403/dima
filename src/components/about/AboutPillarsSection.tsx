import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  pillarsRef: RefObject<HTMLDivElement | null>;
};

const PILLARS = [
  {
    index: '01',
    title: 'Modelo Macroeconómico Aplicado',
    body: 'Adaptamos la ingeniería económica de Ray Dalio al nivel de la empresa. No operamos con intuición — operamos con ciclos verificables.',
    detail: 'ANALYTICS SYSTEM v1.0'
  },
  {
    index: '02',
    title: 'Evaluación por Solvencia',
    body: 'La elegibilidad de crédito se determina por la capacidad de pago real de la entidad — no por su escala o antigüedad superficial.',
    detail: 'SOLVENCY PROTOCOL'
  },
  {
    index: '03',
    title: 'Reconfiguración Estratégica',
    body: 'Cuando una entidad no califica, se le interviene. DIMA reconfigura la estructura financiera hasta alcanzar solvencia.',
    detail: 'STRATEGIC RECONFIG'
  },
  {
    index: '04',
    title: 'Enlace Institucional',
    body: 'DIMA opera como arquitecto técnico entre la empresa y los comités de crédito de SOFOMEs aliadas.',
    detail: 'INSTITUTIONAL LINK'
  },
];

export default function AboutPillarsSection({ pillarsRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const targetTrigger = sectionRef.current || pillarsRef.current || containerRef.current;
    if (!targetTrigger) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.pillar-card', targetTrigger);
      const bars = gsap.utils.toArray<HTMLElement>('.progress-bar-inner', targetTrigger);

      if (!cards.length) return;

      // 1. SETUP AWAL
      gsap.set(cards, { opacity: 0, yPercent: 50 });
      gsap.set(cards[0], { opacity: 1, yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: targetTrigger,
          start: "top top",
          end: () => `+=${window.innerHeight * (PILLARS.length * 1.25)}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // 2. ANIMATION LOOP
      cards.forEach((card, i) => {
        const position = i; // Detik ke-i dalam timeline

        if (i > 0) {
          // Card masuk
          tl.to(card, {
            opacity: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2.out"
          }, position);

          // Card sebelumnya keluar
          tl.to(cards[i - 1], {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.inOut"
          }, position);
        }

        // Progress Bar Sync
        if (bars[i]) {
          tl.to(bars[i], {
            yPercent: -100,
            duration: 1,
            ease: "none"
          }, position);
        }
      });

    }, sectionRef);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 50);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, [pillarsRef]);

  return (
    <section 
      ref={sectionRef}
      className="relative z-20 w-full min-h-screen bg-[#030035] overflow-hidden flex items-center justify-center"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#F4F4F5 1px, transparent 1px), linear-gradient(90deg, #F4F4F5 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Fixed Header Label */}
      <div className="absolute top-28 left-12 z-50">
        <div className="flex items-center gap-4 text-[#E5997B]">
          <div className="w-12 h-px bg-current" />
          <span className="font-mono text-[10px] tracking-[0.8em] uppercase font-bold">Protocol Pillars</span>
        </div>
      </div>

      <div className="relative w-full max-w-5xl h-[50vh]">
        {PILLARS.map((pillar) => (
          <div 
            key={pillar.index}
            className="pillar-card absolute inset-0 flex flex-col items-center justify-center text-center px-6 will-change-transform"
          >
            <span className="font-mono text-[12px] text-[#E5997B] tracking-[1.2em] mb-10 block uppercase opacity-40">
              Phase {pillar.index}
            </span>
            
            <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] text-white font-light leading-none tracking-tighter mb-8">
              {pillar.title.split(' ').map((word, idx) => (
                <span key={idx} className={idx % 2 !== 0 ? 'italic text-[#E5997B]' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>

            <p className="text-white/40 text-lg md:text-xl max-w-2xl font-light leading-relaxed mx-auto">
              {pillar.body}
            </p>

            <div className="mt-12 flex items-center justify-center gap-6">
              <div className="h-[0.5px] w-12 bg-white/20" />
              <span className="font-mono text-[9px] tracking-[0.6em] text-white/30 uppercase">
                {pillar.detail}
              </span>
              <div className="h-[0.5px] w-12 bg-white/20" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-16 right-16 flex gap-3">
        {PILLARS.map((_, i) => (
          <div key={i} className="w-1 h-12 bg-white/10 relative overflow-hidden">
            <div className="progress-bar-inner absolute inset-0 bg-[#E5997B] translate-y-full" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-16 left-16">
         <div className="font-mono text-[9px] text-white/20 uppercase leading-loose tracking-[0.2em]">
            Dima Finance<br/>System Architecture v2
         </div>
      </div>
    </section>
  );
}