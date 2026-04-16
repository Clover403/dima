import type { RefObject } from 'react';

type Props = {
  heroRef: RefObject<HTMLDivElement | null>;
};

export default function AboutHeroSection({ heroRef }: Props) {
  return (
    <section ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#F4F4F5]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0300350D_1px,transparent_1px),linear-gradient(to_bottom,#0300350D_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <svg 
          className="hero-ghost-svg w-[60vw] max-w-[800px] aspect-square overflow-visible" 
          viewBox="0 0 100 100" 
          fill="none"
          style={{ transformOrigin: 'center' }}
        >
          <circle cx="50" cy="50" r="48" stroke="#030035" strokeWidth="0.1" strokeDasharray="1 3"/>
          
          {/* Main Diamond Frame */}
          <path className="hero-svg-diamond" d="M50 5 L95 50 L50 95 L5 50 Z" stroke="#030035" strokeWidth="0.5" />
          
          <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke="#030035" strokeWidth="0.3" />
          <line x1="15" y1="15" x2="85" y2="85" stroke="#030035" strokeWidth="0.15"/>
          <line x1="15" y1="85" x2="85" y2="15" stroke="#030035" strokeWidth="0.15"/>
          <circle cx="50" cy="50" r="20" stroke="#030035" strokeWidth="0.4" />
          
          {/* Moving Needle */}
          <path className="hero-svg-needle" d="M50 20 L55 50 L50 80 L45 50 Z" stroke="#E5997B" strokeWidth="0.6" strokeOpacity="0.5"/>
          
          <circle cx="15" cy="50" r="2" stroke="#030035" strokeWidth="0.1"/>
          <circle cx="85" cy="50" r="2" stroke="#030035" strokeWidth="0.1"/>
        </svg>
      </div>

      {/* Marquee Teks */}
      <div className="absolute top-[18%] w-[200vw] flex opacity-[0.04] pointer-events-none select-none">
        <div className="hero-marquee whitespace-nowrap font-serif text-[14vw] text-[#030035] uppercase" style={{ WebkitTextStroke: '2px #030035' }}>
          DIMA Finance • Ingeniería Financiera • Equilibrio • DIMA Finance • Ingeniería Financiera • Equilibrio •
        </div>
      </div>

      <div className="hero-content-layer relative z-10 flex flex-col items-center text-center px-6">
        <div className="text-[#E5997B] tracking-[0.5em] uppercase text-sm mb-6 font-medium hero-fade-in">Nosotros</div>
        <h1 className="font-serif text-5xl md:text-8xl leading-none tracking-tight flex flex-col items-center gap-2 text-[#030035]">
          <div className="flex overflow-hidden"><span className="hero-word">Arquitectos</span>&nbsp;<span className="hero-word">del</span></div>
          <div className="flex overflow-hidden"><span className="hero-word italic text-[#E5997B]">equilibrio</span></div>
        </h1>
        <p className="hero-subtext mt-8 text-[#030035]/40 max-w-xl text-lg md:text-xl font-light leading-relaxed">
          Somos una Institución de Ingeniería Financiera fundada sobre la ideología y filosofía del economista filantrópico Raymond Thomas Dalio.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-[10px] tracking-widest text-[#030035]/30 uppercase">Scroll</span>
        <div className="w-px h-16 bg-[#E5997B]/40 animate-pulse origin-top" />
      </div>
    </section>
  )
}