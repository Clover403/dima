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

      {/* LEFT SIDE: GRAFIS ASLI (TETAP SAMA) */}
      <div className="w-[45%] h-full flex items-center justify-center relative">
        <svg className="analysis-machine-svg relative h-[70vh] w-auto drop-shadow-2xl" viewBox="0 0 200 400" fill="none">
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

          <circle className="animate-[spin_60s_linear_infinite]" cx="100" cy="200" r="140" stroke="#030035" strokeWidth="0.1" strokeDasharray="2 4" />
          <circle className="animate-[spin_40s_linear_infinite_reverse]" cx="100" cy="200" r="110" stroke="#030035" strokeWidth="0.5" opacity="0.1" />

          {/* Base Engineering Blueprint */}
          <g className="analysis-machine-base origin-center">
            <path d="M20 380 L180 380 L170 395 L30 395 Z" stroke="#030035" strokeWidth="0.5" fill="url(#hatch-navy-niat)" />
            <path d="M30 360 L170 360 L175 380 L25 380 Z" stroke="#E5997B" strokeWidth="0.8" />
            
            {[70, 85, 100, 115, 130].map((x, i) => (
              <line key={i} x1={x} y1="65" x2={x} y2="360" stroke="#030035" strokeWidth={x === 100 ? "0.8" : "0.2"} opacity={x === 100 ? "1" : "0.4"} />
            ))}
            
            <path d="M20 30 L180 30 L165 50 L35 50 Z" stroke="#030035" strokeWidth="0.5" fill="url(#hatch-navy-niat)" />
            <path d="M15 10 L185 10 L180 30 L20 30 Z" stroke="#E5997B" strokeWidth="0.8" />
          </g>

          <circle className="analysis-point-1" cx="100" cy="65" r="4" stroke="#E5997B" strokeWidth="1" filter="url(#glow)"/>
          
          <g className="scale-core">
            <line className="scale-beam origin-center" x1="50" y1="120" x2="150" y2="120" stroke="#030035" strokeWidth="0.5" />
            <path className="scale-pan-left" d="M40 120 C 35 120, 35 140, 50 140 Z" stroke="#030035" strokeWidth="0.5"/>
            <path className="scale-pan-right" d="M160 120 C 165 120, 165 140, 150 140 Z" stroke="#030035" strokeWidth="0.5"/>
          </g>
          {/* Scanning Bar (Untuk Animasi) */}
          <line className="scanning-bar opacity-0" x1="-20" y1="0" x2="220" y2="0" stroke="#E5997B" strokeWidth="1" strokeDasharray="4 2" />
        </svg>
      </div>
      
      {/* RIGHT SIDE: TEXT LAYERS (55% Width - Font Besar) */}
      <div className="w-[55%] h-full flex flex-col justify-center max-w-2xl relative">
        
        <div className="p-text-1 absolute w-full">
          <div className="text-[#E5997B] tracking-[0.4em] uppercase text-[10px] font-semibold mb-6">Filosofía — Poin 01</div>
          <h2 className="font-serif text-4xl md:text-6xl text-[#030035] leading-[1.05] tracking-tight flex flex-col gap-2">
            <span>Interpretamos</span>
            <span>la <span className="italic text-[#030035]/80">economía global</span></span>
          </h2>
        </div>

        <div className="p-text-2 absolute w-full invisible opacity-0">
          <div className="text-[#E5997B] tracking-[0.4em] uppercase text-[10px] font-semibold mb-6">Estrategia — Poin 02</div>
          <p className="font-body text-xl md:text-2xl text-[#030035]/60 leading-relaxed font-light">
             Logramos transformar su modelo macroeconómico al <span className="text-[#030035] font-medium underline decoration-[#E5997B]/30 decoration-2">nivel empresarial</span> dan fusionarlo dengan praktik kredit.
          </p>
        </div>

        <div className="p-text-3 absolute w-full invisible opacity-0">
          <div className="text-[#E5997B] tracking-[0.4em] uppercase text-[10px] font-semibold mb-6">Identidad — Poin 03</div>
          <p className="font-body text-xl md:text-2xl text-[#030035]/60 leading-relaxed font-light border-l-2 border-[#E5997B] pl-8 ml-2 bg-white/50 backdrop-blur-sm p-4">
             No operamos bajo la lógica transaccional — <span className="text-[#030035] font-semibold italic">somos una institución de pensamiento aplicado.</span>
          </p>
        </div>

        <div className="p-text-4 absolute w-full invisible opacity-0">
          <h3 className="font-serif italic text-3xl md:text-5xl text-[#030035]/90 leading-snug">
            "Replicar para cada acreditado la misma lógica de equilibrio y sostenibilidad que mantiene estable la economía global."
          </h3>
        </div>

      </div>

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(3,0,53,0.01)_50%,transparent_50%)] bg-[length:100%_4px]" />
    </section>
  );
}