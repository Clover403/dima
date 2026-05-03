import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function AboutDissolveSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const originLayerRef = useRef<HTMLDivElement>(null);
  const pillarsLayerRef = useRef<HTMLDivElement>(null);
  const originContentRef = useRef<HTMLDivElement>(null);
  const pillarsContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const originLayer = originLayerRef.current;
    const pillarsLayer = pillarsLayerRef.current;
    const originContent = originContentRef.current;
    const pillarsContent = pillarsContentRef.current;

    if (!container || !originLayer || !pillarsLayer || !originContent || !pillarsContent) return;

    const ctx = gsap.context(() => {
      // ── INITIAL STATES ──
      gsap.set('.origin-scale-wrapper', { opacity: 0, clearProps: 'filter,scale,blur' });
      gsap.set('.origin-reveal', { opacity: 0, y: 40, clearProps: 'filter' });
      gsap.set('.origin-title', { opacity: 0, y: 20, clearProps: 'filter,scale' });

      // Pillars initial state
      gsap.set('.pillar-card', { opacity: 0, yPercent: 50 });
      gsap.set('.pillar-card-0', { opacity: 1, yPercent: 0 });
      gsap.set('.pillars-header', { opacity: 0, y: -30 });
      gsap.set('.pillars-footer', { opacity: 0, y: 30 });
      gsap.set('.progress-bar-inner', { yPercent: 100 });

      // ── MAIN TIMELINE ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=800%',
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ═══════════════════════════════════════════════════════
      // PHASE 1: ORIGIN (0% - 35%)
      // ═══════════════════════════════════════════════════════

      // Word scale animation
      tl.to('.arquitectos-word', {
        scale: 75,
        ease: 'power2.inOut',
        duration: 3,
      }, 0);

      // White overlay fade
      tl.to('.arquitectos-overlay', {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.8,
      }, 2.4);

      // Word fade
      tl.to('.arquitectos-word', {
        opacity: 0,
        ease: 'power3.in',
        duration: 0.5,
      }, 2.7);

      // SVG scale appears
      tl.to('.origin-scale-wrapper', {
        opacity: 0.25,
        ease: 'power3.out',
        duration: 0.6,
      }, 2.8);

      // Plates animation
      tl.to('.origin-left-plate', { y: -20, ease: 'power2.out', duration: 0.8 }, 2.9);
      tl.to('.origin-right-plate', { y: 20, ease: 'power2.out', duration: 0.8 }, 2.9);

      // Title reveal
      tl.to('.origin-title', {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 0.6,
      }, 3.1);

      // Body content stagger
      tl.to('.origin-reveal', {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: 'power2.out',
        duration: 0.5,
      }, 3.3);

      // ═══════════════════════════════════════════════════════
      // PHASE 2: ORIGIN DISSOLVE OUT (35% - 45%)
      // ═══════════════════════════════════════════════════════

      // Smooth dissolve with blur + scale + opacity
      tl.to(originContent, {
        opacity: 0,
        scale: 0.92,
        filter: 'blur(12px) brightness(0.6)',
        duration: 2.5,
        ease: 'power2.inOut',
      }, 8);

      // Origin layer fade to transparent
      tl.to(originLayer, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
      }, 9);

      // ═══════════════════════════════════════════════════════
      // PHASE 3: PILLARS DISSOLVE IN (42% - 52%)
      // ═══════════════════════════════════════════════════════

      // Pillars layer becomes visible
      tl.set(pillarsLayer, { visibility: 'visible' }, 8.5);

      // Pillars content dissolves in with blur + scale
      tl.fromTo(pillarsContent,
        { opacity: 0, scale: 1.08, filter: 'blur(15px) brightness(1.3)' },
        { 
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px) brightness(1)',
          duration: 2.5, 
          ease: 'power2.out' 
        },
        8.5
      );

      // Header and footer fade in
      tl.to('.pillars-header', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      }, 9.5);

      tl.to('.pillars-footer', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      }, 9.5);

      // ═══════════════════════════════════════════════════════
      // PHASE 4: PILLARS CAROUSEL (52% - 100%)
      // ═══════════════════════════════════════════════════════

      const cards = gsap.utils.toArray<HTMLElement>('.pillar-card');
      const bars = gsap.utils.toArray<HTMLElement>('.progress-bar-inner');

      cards.forEach((card, i) => {
        const position = 12 + i * 4; // Start at 12, each card takes 4 units

        if (i > 0) {
          // Card enters
          tl.to(card, {
            opacity: 1,
            yPercent: 0,
            duration: 2,
            ease: 'power2.out'
          }, position);

          // Previous card exits
          tl.to(cards[i - 1], {
            opacity: 0,
            scale: 0.9,
            yPercent: -30,
            duration: 2,
            ease: 'power2.inOut'
          }, position);
        }

        // Progress bar
        if (bars[i]) {
          tl.to(bars[i], {
            yPercent: -100,
            duration: 2,
            ease: 'none'
          }, position);
        }
      });

    }, container);

    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* ═══════════════════════════════════════════════════════ */}
      {/* SHARED BACKGROUND — AboutPillarsSection grid style */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-[#030035] z-0">
        {/* Grid Pattern — full screen dengan fade di edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(229,153,123,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229,153,123,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* LAYER 1: ORIGIN SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        ref={originLayerRef}
        className="absolute inset-0 z-10"
      >
        <div ref={originContentRef} className="relative w-full h-full">

          {/* Glowing Corner Ornaments */}
          <svg className="absolute top-8 left-8 w-20 h-20 pointer-events-none" viewBox="0 0 48 48" fill="none">
            <path d="M0 24 L0 0 L24 0" stroke="#E5997B" strokeWidth="1.8" strokeOpacity="0.9"
              style={{ filter: 'drop-shadow(0 0 6px rgba(229,153,123,0.8)) drop-shadow(0 0 12px rgba(229,153,123,0.4))' }} />
          </svg>
          <svg className="absolute top-8 right-8 w-20 h-20 pointer-events-none" viewBox="0 0 48 48" fill="none">
            <path d="M48 24 L48 0 L24 0" stroke="#E5997B" strokeWidth="1.8" strokeOpacity="0.9"
              style={{ filter: 'drop-shadow(0 0 6px rgba(229,153,123,0.8)) drop-shadow(0 0 12px rgba(229,153,123,0.4))' }} />
          </svg>
          <svg className="absolute bottom-8 left-8 w-20 h-20 pointer-events-none" viewBox="0 0 48 48" fill="none">
            <path d="M0 24 L0 48 L24 48" stroke="#E5997B" strokeWidth="1.8" strokeOpacity="0.9"
              style={{ filter: 'drop-shadow(0 0 6px rgba(229,153,123,0.8)) drop-shadow(0 0 12px rgba(229,153,123,0.4))' }} />
          </svg>
          <svg className="absolute bottom-8 right-8 w-20 h-20 pointer-events-none" viewBox="0 0 48 48" fill="none">
            <path d="M48 24 L48 48 L24 48" stroke="#E5997B" strokeWidth="1.8" strokeOpacity="0.9"
              style={{ filter: 'drop-shadow(0 0 6px rgba(229,153,123,0.8)) drop-shadow(0 0 12px rgba(229,153,123,0.4))' }} />
          </svg>

          {/* Vertical accent line */}
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#E5997B]/10 to-transparent hidden md:block" />

          {/* Coordinates */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#E5997B]/30" />
            <span
              className="text-[#E5997B]/25 font-mono text-[14px] tracking-[0.25em] whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              19.4326° N — 99.1332° W
            </span>
            <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#E5997B]/30" />
          </div>

          {/* Main Content Grid */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-24 py-24 h-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">

            {/* Left: Content */}
            <div className="flex flex-col gap-10">
              <div className="origin-reveal flex items-center gap-4">
                <div className="w-8 h-px bg-[#E5997B]/50" />
                <span className="text-[#E5997B] tracking-[0.6em] uppercase text-[14px] font-semibold font-mono">
                  Filosofía fundacional — 2024
                </span>
              </div>

              <div className="origin-title">
                <h2 className="font-display text-[clamp(3rem,5.5vw,5.5rem)] text-[#F4F4F5] font-light leading-[1.05] tracking-tight">
                  Arquitectos
                </h2>
                <h2 className="font-display italic text-[clamp(3rem,5.5vw,5.5rem)] text-[#E5997B] font-light leading-[1.05] tracking-tight">
                  de equilibrio.
                </h2>
              </div>

              <div className="origin-reveal flex items-center gap-4">
                <div className="flex-1 max-w-[80px] h-px bg-gradient-to-r from-[#E5997B]/60 to-transparent" />
                <span className="text-[#F4F4F5]/20 text-[14px] font-mono tracking-[0.3em] uppercase">§ 001</span>
              </div>

              <div className="origin-reveal flex flex-col gap-6 max-w-xl">
                <p className="font-body text-[#F4F4F5]/55 text-xl md:text-2xl leading-[1.9] font-light tracking-wide">
                  Fundada sobre la premisa de que el crédito, correctamente estructurado, no es deuda — es arquitectura. Cada institución lleva en sí misma un ciclo; nuestra labor es leerlo.
                </p>
                <p className="font-body text-[#F4F4F5]/35 text-base md:text-lg leading-[1.9] tracking-wider uppercase font-light">
                  Inspirados en la metodología de Raymond Thomas Dalio — adaptada de la macroeconomía al tejido vivo de la empresa.
                </p>
              </div>

              <div className="origin-reveal border-l-2 border-[#E5997B]/30 pl-6 py-2">
                <p className="font-display text-[#F4F4F5]/45 text-lg italic leading-relaxed tracking-wide">
                  "La deuda no es el problema. El desajuste entre ciclos es el problema."
                </p>
                <span className="text-[#E5997B]/40 text-[14px] font-mono tracking-[0.4em] uppercase mt-3 block">— Principio DIMA</span>
              </div>

              <div className="origin-reveal grid grid-cols-3 gap-6 pt-4 border-t border-[#F4F4F5]/5">
                {[
                  { value: '6', label: 'Productos de crédito' },
                  { value: '6', label: 'Servicios estratégicos' },
                  { value: '∞', label: 'Sectores atendidos' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="font-display text-5xl md:text-6xl text-[#E5997B] font-light">{stat.value}</span>
                    <span className="text-[#F4F4F5]/25 text-[12px] leading-tight tracking-widest uppercase font-mono">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: SVG Scale */}
            <div className="flex items-center justify-center relative">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(229,153,123,0.18) 0%, transparent 70%)',
                }}
              />
              <div className="origin-scale-wrapper w-full max-w-[720px] aspect-square"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(229,153,123,0.25)) drop-shadow(0 0 80px rgba(229,153,123,0.12))',
                  transform: 'scale(1.15)',
                }}>
                <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(229,153,123,0.5)) drop-shadow(0 0 30px rgba(229,153,123,0.25))' }}>
                  <circle cx="250" cy="250" r="230" stroke="#E5997B" strokeWidth="1.4" strokeDasharray="1 7" />
                  <circle cx="250" cy="250" r="218" stroke="#E5997B" strokeWidth="0.8" />
                  {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 10 * Math.PI) / 180;
                    const x1 = 250 + 218 * Math.cos(angle - Math.PI / 2);
                    const y1 = 250 + 218 * Math.sin(angle - Math.PI / 2);
                    const x2 = 250 + 228 * Math.cos(angle - Math.PI / 2);
                    const y2 = 250 + 228 * Math.sin(angle - Math.PI / 2);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5997B" strokeWidth="1.8" strokeOpacity="0.85" />;
                  })}
                  {Array.from({ length: 180 }).map((_, i) => {
                    const angle = (i * 2 * Math.PI) / 180;
                    const x1 = 250 + 218 * Math.cos(angle - Math.PI / 2);
                    const y1 = 250 + 218 * Math.sin(angle - Math.PI / 2);
                    const x2 = 250 + 222 * Math.cos(angle - Math.PI / 2);
                    const y2 = 250 + 222 * Math.sin(angle - Math.PI / 2);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5997B" strokeWidth="0.9" strokeOpacity="0.55" />;
                  })}
                  <circle cx="250" cy="250" r="190" stroke="#E5997B" strokeWidth="0.7" strokeOpacity="0.65" />
                  <circle cx="250" cy="250" r="160" stroke="#E5997B" strokeWidth="1.1" strokeDasharray="3 9" strokeOpacity="0.55" />
                  <circle cx="250" cy="250" r="100" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.5" />
                  <line x1="250" y1="20" x2="250" y2="480" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.45" />
                  <line x1="20" y1="250" x2="480" y2="250" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.45" />
                  <line x1="66" y1="66" x2="434" y2="434" stroke="#E5997B" strokeWidth="0.6" strokeOpacity="0.3" />
                  <line x1="434" y1="66" x2="66" y2="434" stroke="#E5997B" strokeWidth="0.6" strokeOpacity="0.3" />
                  <g stroke="#E5997B">
                    <path d="M244 420 L256 420 L253 90 L247 90 Z" strokeWidth="2.6" fill="#E5997B" fillOpacity="0.15" />
                    <rect x="228" y="418" width="44" height="14" rx="2" strokeWidth="2.0" fill="#E5997B" fillOpacity="0.12" />
                    <rect x="218" y="430" width="64" height="8" rx="1" strokeWidth="1.5" fill="#E5997B" fillOpacity="0.1" />
                    <circle cx="250" cy="92" r="7" strokeWidth="2.2" fill="#030035" />
                    <circle cx="250" cy="92" r="3" fill="#E5997B" fillOpacity="0.9" strokeWidth="0" />
                    <circle cx="250" cy="92" r="11" strokeWidth="1.2" strokeDasharray="2 4" strokeOpacity="0.75" />
                    <path className="origin-scale-arm" d="M80 92 L420 92" strokeWidth="4.5" />
                    <path d="M80 92 L95 86 L110 92 L125 86 L140 92 L155 86 L170 92 L185 86 L200 92" strokeWidth="1.2" strokeOpacity="0.75" />
                    <path d="M300 92 L315 86 L330 92 L345 86 L360 92 L375 86 L390 92 L405 86 L420 92" strokeWidth="1.2" strokeOpacity="0.75" />
                    <line x1="82" y1="92" x2="60" y2="195" strokeWidth="1.6" strokeOpacity="1" />
                    <line x1="82" y1="92" x2="104" y2="195" strokeWidth="1.6" strokeOpacity="1" />
                    <line x1="60" y1="192" x2="104" y2="192" strokeWidth="1.0" strokeOpacity="0.8" />
                    <g className="origin-left-plate">
                      <path d="M44 195 C 44 230, 120 230, 120 195 Z" strokeWidth="3.0" fill="#E5997B" fillOpacity="0.12" />
                      <line x1="55" y1="210" x2="109" y2="210" strokeWidth="0.9" strokeOpacity="0.65" />
                      <line x1="52" y1="217" x2="112" y2="217" strokeWidth="0.9" strokeOpacity="0.55" />
                      <line x1="50" y1="224" x2="114" y2="224" strokeWidth="0.9" strokeOpacity="0.45" />
                      <circle cx="82" cy="208" r="10" strokeWidth="1.5" strokeOpacity="0.7" />
                      <circle cx="82" cy="208" r="5" strokeWidth="0.9" strokeOpacity="0.55" />
                    </g>
                    <line x1="418" y1="92" x2="396" y2="195" strokeWidth="1.6" strokeOpacity="1" />
                    <line x1="418" y1="92" x2="440" y2="195" strokeWidth="1.6" strokeOpacity="1" />
                    <line x1="396" y1="192" x2="440" y2="192" strokeWidth="1.0" strokeOpacity="0.8" />
                    <g className="origin-right-plate">
                      <path d="M380 195 C 380 230, 456 230, 456 195 Z" strokeWidth="3.0" fill="#E5997B" fillOpacity="0.12" />
                      <line x1="391" y1="210" x2="445" y2="210" strokeWidth="0.9" strokeOpacity="0.65" />
                      <line x1="388" y1="217" x2="448" y2="217" strokeWidth="0.9" strokeOpacity="0.55" />
                      <line x1="386" y1="224" x2="450" y2="224" strokeWidth="0.9" strokeOpacity="0.45" />
                      <circle cx="418" cy="208" r="10" strokeWidth="1.5" strokeOpacity="0.7" />
                      <circle cx="418" cy="208" r="5" strokeWidth="0.9" strokeOpacity="0.55" />
                    </g>
                    <line x1="236" y1="200" x2="264" y2="200" strokeWidth="1.0" strokeOpacity="0.65" />
                    <line x1="236" y1="260" x2="264" y2="260" strokeWidth="1.0" strokeOpacity="0.65" />
                    <line x1="236" y1="320" x2="264" y2="320" strokeWidth="1.0" strokeOpacity="0.65" />
                    <line x1="236" y1="380" x2="264" y2="380" strokeWidth="1.0" strokeOpacity="0.65" />
                    <path d="M250 200 L254 206 L250 212 L246 206 Z" strokeWidth="1.0" strokeOpacity="0.75" />
                    <path d="M250 260 L254 266 L250 272 L246 266 Z" strokeWidth="1.0" strokeOpacity="0.75" />
                    <path d="M250 320 L254 326 L250 332 L246 326 Z" strokeWidth="1.0" strokeOpacity="0.75" />
                  </g>
                  {[
                    { x: 250, y: 14, label: 'N' }, { x: 250, y: 493, label: 'S' },
                    { x: 12, y: 254, label: 'W' }, { x: 488, y: 254, label: 'E' },
                  ].map((p) => (
                    <text key={p.label} x={p.x} y={p.y} fill="#E5997B" fillOpacity="0.6" fontSize="14" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" letterSpacing="2">{p.label}</text>
                  ))}
                  <text x="250" y="255" fill="#E5997B" fillOpacity="0.45" fontSize="16" fontFamily="'Playfair Display', serif" textAnchor="middle" letterSpacing="8">DIMA</text>
                  <text x="250" y="270" fill="#E5997B" fillOpacity="0.3" fontSize="11" fontFamily="monospace" textAnchor="middle" letterSpacing="4">FINANCE</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-24 flex items-center justify-between">
            <span className="text-[#F4F4F5]/15 font-mono text-[14px] tracking-[0.3em] uppercase">
              Sociedad Financiera de Objeto Múltiple — México
            </span>
            <span className="text-[#F4F4F5]/15 font-mono text-[14px] tracking-[0.3em] uppercase hidden md:block">
              Est. MMXXIV
            </span>
            <span className="text-[#E5997B]/20 font-mono text-[14px] tracking-[0.3em] uppercase">
              § Arquitectos de Equilibrio
            </span>
          </div>

          {/* White Overlay for word animation */}
          <div className="arquitectos-overlay absolute inset-0 z-10 bg-[#F4F4F5] pointer-events-none" />

          {/* Scaling Word */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <span
              className="arquitectos-word select-none font-display font-light tracking-tight leading-none text-[#030035]"
              style={{
                fontSize: 'clamp(6rem, 22vw, 18rem)',
                transformOrigin: '51.16% center',
                willChange: 'transform, opacity',
              }}
            >
              Arquitectos
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* LAYER 2: PILLARS SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        ref={pillarsLayerRef}
        className="absolute inset-0 z-20"
        style={{ visibility: 'hidden' }}
      >
        <div ref={pillarsContentRef} className="relative w-full h-full">

          {/* Fixed Header Label */}
          <div className="pillars-header absolute top-28 left-12 z-50">
            <div className="flex items-center gap-4 text-[#E5997B]">
              <div className="w-12 h-px bg-current" />
              <span className="font-mono text-[10px] tracking-[0.8em] uppercase font-bold">Protocol Pillars</span>
            </div>
          </div>

          {/* Cards Container */}
          <div className="relative w-full max-w-5xl h-[50vh] mx-auto mt-[25vh]">
            {PILLARS.map((pillar, i) => (
              <div 
                key={pillar.index}
                className={`pillar-card pillar-card-${i} absolute inset-0 flex flex-col items-center justify-center text-center px-6 will-change-transform`}
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

          {/* Progress Bars */}
          <div className="pillars-footer absolute bottom-16 right-16 flex gap-3">
            {PILLARS.map((_, i) => (
              <div key={i} className="w-1 h-12 bg-white/10 relative overflow-hidden">
                <div className="progress-bar-inner absolute inset-0 bg-[#E5997B]" style={{ transform: 'translateY(100%)' }} />
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="pillars-footer absolute bottom-16 left-16">
            <div className="font-mono text-[9px] text-white/20 uppercase leading-loose tracking-[0.2em]">
              Dima Finance<br/>System Architecture v2
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}