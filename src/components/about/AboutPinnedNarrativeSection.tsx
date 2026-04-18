import type { RefObject } from 'react';

type Props = {
  pinnedRef: RefObject<HTMLDivElement | null>;
};

export default function AboutPinnedNarrativeSection({ pinnedRef }: Props) {
  return (
    <section ref={pinnedRef} className="relative z-30 w-full h-screen flex px-6 md:px-16 lg:px-24 bg-[#F4F4F5] overflow-hidden">

      {/* TECHNICAL HUD OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-40 selection:bg-transparent">
        <div className="absolute top-10 left-10 font-mono text-[10px] text-[#030035]/50 flex flex-col gap-1">
          <span>SYSTEM: DIMA_CORE_v2.0</span>
          <span>MODULE: CONCEPTUAL_NARRATIVE</span>
          <span>COORD: 19.4326° N, 99.1332° W</span>
        </div>
        <div className="absolute bottom-10 right-10 font-mono text-[10px] text-[#030035]/50 text-right">
          <span>DATA_STREAM: ACTIVE</span>
          <div className="flex gap-1 items-end mt-1">
            <span className="text-[20px] font-bold text-[#E5997B] leading-none scroll-progress-digit">000</span>
            <span className="mb-[2px]">PROGRESS_VAL</span>
          </div>
        </div>
      </div>

      {/* LEFT SIDE: SVG GRAFIS */}
      <div className="w-[45%] h-full flex items-center justify-center relative flex-shrink-0">
        <svg
          className="analysis-machine-svg relative h-[70vh] w-auto drop-shadow-2xl"
          viewBox="0 0 200 400"
          fill="none"
        >
          <defs>
            <pattern id="hatch-navy-niat" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#030035" strokeWidth="0.3" opacity="0.4" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Orbit rings */}
          <circle className="svg-d-ring1" cx="100" cy="200" r="140" stroke="#030035" strokeWidth="0.1" strokeDasharray="880" strokeDashoffset="880" />
          <circle className="svg-d-ring2" cx="100" cy="200" r="110" stroke="#030035" strokeWidth="0.5" opacity="0.1" strokeDasharray="692" strokeDashoffset="692" />

          {/* Bottom structures */}
          <path className="svg-d-bot1" d="M20 380 L180 380 L170 395 L30 395 Z" stroke="#030035" strokeWidth="0.5" fill="url(#hatch-navy-niat)" strokeDasharray="350" strokeDashoffset="350" />
          <path className="svg-d-bot2" d="M30 360 L170 360 L175 380 L25 380 Z" stroke="#E5997B" strokeWidth="0.8" strokeDasharray="310" strokeDashoffset="310" />

          {/* Vertical columns */}
          {[70, 85, 100, 115, 130].map((x, i) => (
            <line key={i} className="svg-d-col" x1={x} y1="65" x2={x} y2="360" stroke="#030035" strokeWidth={x === 100 ? "0.8" : "0.2"} opacity={x === 100 ? "1" : "0.4"} strokeDasharray="295" strokeDashoffset="295" />
          ))}

          {/* Top structures */}
          <path className="svg-d-top1" d="M20 30 L180 30 L165 50 L35 50 Z" stroke="#030035" strokeWidth="0.5" fill="url(#hatch-navy-niat)" strokeDasharray="350" strokeDashoffset="350" />
          <path className="svg-d-top2" d="M15 10 L185 10 L180 30 L20 30 Z" stroke="#E5997B" strokeWidth="0.8" strokeDasharray="310" strokeDashoffset="310" />

          {/* Glow dot */}
          <circle className="svg-d-dot" cx="100" cy="65" r="4" stroke="#E5997B" strokeWidth="1" filter="url(#glow)" strokeDasharray="25" strokeDashoffset="25" />

          {/* Scale / balance */}
          <line className="svg-d-beam" x1="50" y1="120" x2="150" y2="120" stroke="#030035" strokeWidth="0.5" strokeDasharray="100" strokeDashoffset="100" />
          <path className="svg-d-pan" d="M40 120 C 35 120, 35 140, 50 140 Z" stroke="#030035" strokeWidth="0.5" strokeDasharray="60" strokeDashoffset="60" />
          <path className="svg-d-pan" d="M160 120 C 165 120, 165 140, 150 140 Z" stroke="#030035" strokeWidth="0.5" strokeDasharray="60" strokeDashoffset="60" />

          {/* Scanning Bar */}
          <line className="scanning-bar opacity-0" x1="-20" y1="0" x2="220" y2="0" stroke="#E5997B" strokeWidth="1" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* RIGHT SIDE: TEXT LAYERS */}
      <div className="w-[55%] h-full flex flex-col justify-center relative">

        {/* TEXT 1 */}
        <div className="p-text-1 absolute w-full flex flex-col gap-5">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Filosofía — 01
          </p>
          <div className="space-y-1">
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              No somos un banco.
            </p>
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              Somos <em className="text-[#E5997B] not-italic">arquitectos</em>
            </p>
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              de equilibrio.
            </p>
          </div>
        </div>

        {/* TEXT 2 */}
        <div className="p-text-2 absolute w-full flex flex-col gap-5">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Estrategia — 02
          </p>
          <div className="space-y-1">
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              Transformamos la
            </p>
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              <em className="text-[#E5997B] not-italic">deuda</em> en
            </p>
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              productividad.
            </p>
          </div>
        </div>

        {/* TEXT 3 */}
        <div className="p-text-3 absolute w-full flex flex-col gap-5">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Identidad — 03
          </p>
          <div className="space-y-1">
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              No operamos con
            </p>
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              <em className="text-[#E5997B] not-italic">intuición</em>.
            </p>
            <p className="font-display text-5xl md:text-6xl lg:text-7xl text-[#030035] leading-[0.92] tracking-tight">
              Operamos con ciclos.
            </p>
          </div>
        </div>

        {/* TEXT 4 — Final quote, 3 lines */}
        <div className="p-text-4 absolute w-full flex flex-col gap-6">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Principio DIMA
          </p>
          <blockquote className="font-display italic text-5xl md:text-6xl lg:text-7xl text-[#030035]/90 leading-[0.95] tracking-tight">
            <span className="block">"Replicar para cada</span>
            <span className="block">empresa la misma lógica</span>
            <span className="block">de <em className="text-[#E5997B] not-italic">equilibrio</em>."</span>
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-[#E5997B]/40" />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#030035]/35">
              Filosofía Fundacional DIMA
            </span>
          </div>
        </div>

      </div>

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(3,0,53,0.01)_50%,transparent_50%)] bg-[length:100%_4px]" />
    </section>
  );
}