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
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    // ── BACKGROUND CANVAS ──
    const bgCanvas = bgCanvasRef.current;
    let drawBackground: (() => void) | null = null;

    if (bgCanvas) {
      drawBackground = () => {
  bgCanvas.width = window.innerWidth;   // ← bukan offsetWidth
  bgCanvas.height = window.innerHeight;
        const ctx2d = bgCanvas.getContext('2d');
        if (!ctx2d) return;
        const cols = 28, rows = 18;
        const cX = bgCanvas.width / cols, cY = bgCanvas.height / rows;
        let seed = 42;
        const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
        const pts: [number, number][][] = [];
        for (let r = 0; r <= rows; r++) {
          pts[r] = [];
          for (let c = 0; c <= cols; c++) {
            pts[r][c] = [
              c * cX + ((c === 0 || c === cols) ? 0 : (rand() - 0.5) * cX * 0.40),
              r * cY + ((r === 0 || r === rows) ? 0 : (rand() - 0.5) * cY * 0.40),
            ];
          }
        }
        const triangles: [number, number][][] = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            triangles.push([pts[r][c], pts[r][c + 1], pts[r + 1][c]]);
            triangles.push([pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]]);
          }
        ctx2d.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        ctx2d.fillStyle = '#060030';
        ctx2d.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        triangles.forEach((tri) => {
          const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
          const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
          const shade = 0.92 + Math.random() * 0.08;
          ctx2d.save();
          ctx2d.translate(cx, cy); ctx2d.scale(0.97, 0.97); ctx2d.translate(-cx, -cy);
          ctx2d.beginPath();
          ctx2d.moveTo(tri[0][0], tri[0][1]);
          ctx2d.lineTo(tri[1][0], tri[1][1]);
          ctx2d.lineTo(tri[2][0], tri[2][1]);
          ctx2d.closePath();
          ctx2d.fillStyle = `rgb(${Math.round(3 * shade)},0,${Math.round(53 * shade)})`;
          ctx2d.fill();
          ctx2d.strokeStyle = 'rgba(0,0,10,0.65)';
          ctx2d.lineWidth = 0.7;
          ctx2d.stroke();
          ctx2d.restore();
        });
      };
      drawBackground();
      window.addEventListener('resize', drawBackground);
    }

    // ── GSAP ──
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLDivElement>('.manifesto-item');
      const bgContainers = gsap.utils.toArray<HTMLDivElement>('.manifesto-bg-img');

      gsap.set(blocks, { opacity: 0, y: 80, filter: 'blur(10px)', pointerEvents: 'none' });
      gsap.set(bgContainers, { opacity: 0 });

      gsap.set(blocks[0], { opacity: 1, y: 0, filter: 'blur(0px)', pointerEvents: 'all' });
      gsap.set(bgContainers[0], { opacity: 1 });
      gsap.set(bgContainers.map(c => c.querySelector('img')), { scale: 1.15 });
      gsap.set(bgContainers[0].querySelector('img'), { scale: 1 });

      const dissolveContainer = sectionRef.current?.closest('[data-dissolve-container="true"]') ?? undefined;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pinnedContainer: dissolveContainer,
          start: 'top top',
          end: `+=${MANIFESTOS.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 0,
        },
      });

      blocks.forEach((_, i) => {
        if (i < blocks.length - 1) {
          const startTime = i;

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
          .to(blocks[i + 1], {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            pointerEvents: 'all',
            duration: 1,
            immediateRender: false,
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

    return () => {
      ctx.revert();
      if (drawBackground) window.removeEventListener('resize', drawBackground);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#030035] overflow-hidden"
    >
      {/* Canvas background */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.9 }}
      />

      {/* Background Images Layer */}
      <div className="absolute inset-0 w-full h-full z-[1]">
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