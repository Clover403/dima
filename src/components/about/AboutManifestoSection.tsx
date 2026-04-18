import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTOS = [
  {
    num: 'I',
    law: 'Primera Ley',
    text: 'No dejes que la deuda crezca más rápido que los ingresos, porque el peso de tus deudas eventualmente te aplastará.',
    expl: 'Control de apalancamiento preventivo en nuestra estructura crediticia.',
    img: '/foto/brand-corporate1.jpg',
  },
  {
    num: 'II',
    law: 'Segunda Ley',
    text: 'No dejes que tus ingresos crezcan más rápido que tu productividad, porque con el tiempo perderás competitividad.',
    expl: 'Evaluación de eficiencia operativa más allá del ingreso nominal.',
    img: '/foto/brand-documents.jpg',
  },
  {
    num: 'III',
    law: 'Tercera Ley',
    text: 'Haz todo lo posible por aumentar tu productividad, porque a largo plazo, eso es lo que más importa.',
    expl: 'El objetivo final de cualquier inyección de capital en DIMA.',
    img: '/foto/brand-nature.jpg',
  },
];

export default function AboutManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLDivElement>('.manifesto-item');
      const bgContainers = gsap.utils.toArray<HTMLDivElement>('.manifesto-bg-img');

      // 1. Initial State Setup
      gsap.set(blocks, { opacity: 0, y: 80, filter: 'blur(10px)', pointerEvents: 'none' });
      gsap.set(bgContainers, { opacity: 0 });
      
      // Tampilkan pilar pertama
      gsap.set(blocks[0], { opacity: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'all' });
      gsap.set(bgContainers[0], { opacity: 1 });
      gsap.set(bgContainers.map(c => c.querySelector('img')), { scale: 1.15 });
      gsap.set(bgContainers[0].querySelector('img'), { scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${MANIFESTOS.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          // PENTING: Supaya tidak menabrak section pilar di atasnya
          refreshPriority: 0, 
        },
      });

      // 2. Animation Loop
      blocks.forEach((_, i) => {
        if (i < blocks.length - 1) {
          const startTime = i; // Menggunakan index sebagai timestamp timeline

          // Keluar (Current)
          tl.to(blocks[i], {
            opacity: 0,
            y: -80,
            filter: 'blur(10px)',
            pointerEvents: 'none',
            duration: 1,
          }, startTime)
          .to(bgContainers[i], {
            opacity: 0,
            duration: 1,
          }, startTime)
          .to(bgContainers[i].querySelector('img'), {
            scale: 1.15,
            duration: 1,
          }, startTime)

          // Masuk (Next)
          .to(blocks[i + 1], {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            pointerEvents: 'all',
            duration: 1,
            immediateRender: false, // Mencegah bug menumpuk di awal
          }, startTime)
          .to(bgContainers[i + 1], {
            opacity: 1,
            duration: 1,
            immediateRender: false,
          }, startTime)
          .to(bgContainers[i + 1].querySelector('img'), {
            scale: 1,
            duration: 1,
            immediateRender: false,
          }, startTime);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#030035] overflow-hidden"
    >
      {/* Background Images Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        {MANIFESTOS.map((manifesto, index) => (
          <div
            key={`bg-container-${index}`}
            className="manifesto-bg-img absolute inset-0 w-full h-full overflow-hidden"
          >
            <img
              src={manifesto.img}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700"
            />
            {/* Navy Overlay per image */}
            <div className="absolute inset-0 bg-[#030035]/70" />
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-8 relative h-[400px]">
          {MANIFESTOS.map((manifesto, index) => (
            <div
              key={index}
              className="manifesto-item absolute inset-0 flex items-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
                <div className="md:col-span-3 text-center md:text-right">
                  <span className="text-8xl md:text-[10rem] font-display text-[#E5997B] opacity-30 block leading-none">
                    {manifesto.num}
                  </span>
                </div>
                <div className="md:col-span-9 flex flex-col gap-6">
                  <h2 className="text-sm font-mono tracking-[0.5em] uppercase text-[#E5997B]">
                    {manifesto.law}
                  </h2>
                  <blockquote className="text-4xl md:text-6xl font-display text-white leading-tight tracking-tight">
                    "{manifesto.text}"
                  </blockquote>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-px bg-[#E5997B]/40" />
                    <p className="text-lg md:text-xl text-white/50 italic font-light max-w-xl">
                      {manifesto.expl}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Static Sidebar Decoration */}
      <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-2">
        <div className="w-px h-12 bg-white/10 mx-auto" />
        <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em] [writing-mode:vertical-lr]">
          Dima Manifesto v.2026
        </span>
      </div>
    </section>
  );
}