import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutOriginSection() {
  const pinnedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Hard reset — pastikan tidak ada sisa animasi dari About.tsx
      gsap.set('.origin-scale-wrapper', { opacity: 0, clearProps: 'filter,scale,blur' });
      gsap.set('.origin-reveal', { opacity: 0, y: 40, clearProps: 'filter' });
      gsap.set('.origin-title', { opacity: 0, y: 20, clearProps: 'filter,scale' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      /*
        Font: 22vw → cap-height ≈ 16vw
        Perlu menutup layar dari titik huruf "t" (≈51% lebar kata):
        - Vertikal: screen 100vh / cap-height 16vw ≈ 6.25× minimum
        - Pakai scale 16 → margin besar di semua arah

        Easing power2.inOut: terasa natural, tidak terlalu slow di awal
        Masih ada momen "percepatan" tapi lebih bisa dikontrol saat scrub.
      */

      // PHASE 1: Word scales to fill screen
      tl.to('.arquitectos-word', {
        scale: 75,
        ease: 'power2.inOut',
        duration: 3,
      }, 0);

      // PHASE 2: White overlay fades — word sudah sangat besar, layar tertutup navy
      tl.to('.arquitectos-overlay', {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.8,
      }, 2.4);

      // PHASE 3: Word itself fades — bersih
      tl.to('.arquitectos-word', {
        opacity: 0,
        ease: 'power3.in',
        duration: 0.5,
      }, 2.7);

      // PHASE 4: SVG appears first (as word disappears)
      tl.to('.origin-scale-wrapper', {
        opacity: 0.25,
        ease: 'power3.out',
        duration: 0.6,
      }, 2.8);

      tl.to('.origin-left-plate', { y: -20, ease: 'power2.out', duration: 0.8 }, 2.9);
      tl.to('.origin-right-plate', { y: 20, ease: 'power2.out', duration: 0.8 }, 2.9);

      // PHASE 5: Title text next
      tl.to('.origin-title', {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 0.6,
      }, 3.1);

      // PHASE 6: Body content staggered last
      tl.to('.origin-reveal', {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: 'power2.out',
        duration: 0.5,
      }, 3.3);

    }, pinnedRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pinnedRef} className="origin-section relative w-full h-screen overflow-hidden">

      {/* ── LAYER 0: Origin section content (always rendered, navy bg) ── */}
      <div className="absolute inset-0 z-0 bg-[#030035] overflow-hidden">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(229,153,123,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229,153,123,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <svg className="absolute top-8 left-8 w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
          <path d="M0 24 L0 0 L24 0" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
        <svg className="absolute top-8 right-8 w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
          <path d="M48 24 L48 0 L24 0" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
        <svg className="absolute bottom-8 left-8 w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
          <path d="M0 24 L0 48 L24 48" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
        <svg className="absolute bottom-8 right-8 w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
          <path d="M48 24 L48 48 L24 48" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>

        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#E5997B]/10 to-transparent hidden md:block" />

        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#E5997B]/30" />
          <span
            className="text-[#E5997B]/25 font-mono text-[9px] tracking-[0.25em] whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            19.4326° N — 99.1332° W
          </span>
          <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#E5997B]/30" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-24 py-24 h-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">

          {/* Left: content */}
          <div className="flex flex-col gap-10">

            <div className="origin-reveal flex items-center gap-4">
              <div className="w-8 h-px bg-[#E5997B]/50" />
              <span className="text-[#E5997B] tracking-[0.6em] uppercase text-[9px] font-semibold font-mono">
                Filosofía fundacional — 2024
              </span>
            </div>

            {/* origin-title: NO blur, NO opacity-0 class, controlled by GSAP only */}
            <div className="origin-title">
              <h2 className="font-display text-[clamp(3rem,6vw,6rem)] text-[#F4F4F5] font-light leading-[1.05] tracking-tight">
                Arquitectos
              </h2>
              <h2 className="font-display italic text-[clamp(3rem,6vw,6rem)] text-[#E5997B] font-light leading-[1.05] tracking-tight">
                de equilibrio.
              </h2>
            </div>

            <div className="origin-reveal flex items-center gap-4">
              <div className="flex-1 max-w-[80px] h-px bg-gradient-to-r from-[#E5997B]/60 to-transparent" />
              <span className="text-[#F4F4F5]/20 text-[9px] font-mono tracking-[0.3em] uppercase">§ 001</span>
            </div>

            <div className="origin-reveal flex flex-col gap-6 max-w-md">
              <p className="font-body text-[#F4F4F5]/55 text-sm md:text-[15px] leading-[1.9] font-light tracking-wide">
                Fundada sobre la premisa de que el crédito, correctamente estructurado, no es deuda — es arquitectura. Cada institución lleva en sí misma un ciclo; nuestra labor es leerlo.
              </p>
              <p className="font-body text-[#F4F4F5]/35 text-xs leading-[1.9] tracking-wider uppercase font-light">
                Inspirados en la metodología de Raymond Thomas Dalio — adaptada de la macroeconomía al tejido vivo de la empresa.
              </p>
            </div>

            <div className="origin-reveal border-l-2 border-[#E5997B]/30 pl-6 py-2">
              <p className="font-display text-[#F4F4F5]/45 text-xs italic leading-relaxed tracking-wide">
                "La deuda no es el problema. El desajuste entre ciclos es el problema."
              </p>
              <span className="text-[#E5997B]/40 text-[9px] font-mono tracking-[0.4em] uppercase mt-3 block">— Principio DIMA</span>
            </div>

            <div className="origin-reveal grid grid-cols-3 gap-6 pt-4 border-t border-[#F4F4F5]/5">
              {[
                { value: '6', label: 'Productos de crédito' },
                { value: '6', label: 'Servicios estratégicos' },
                { value: '∞', label: 'Sectores atendidos' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="font-display text-3xl text-[#E5997B] font-light">{stat.value}</span>
                  <span className="text-[#F4F4F5]/25 text-[9px] leading-tight tracking-widest uppercase font-mono">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: SVG engraving */}
          <div className="flex items-center justify-center relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(229,153,123,0.07) 0%, transparent 70%)',
              }}
            />
            <div className="origin-scale-wrapper w-full max-w-[520px] aspect-square">
              <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="250" cy="250" r="230" stroke="#E5997B" strokeWidth="0.3" strokeDasharray="1 7" />
                <circle cx="250" cy="250" r="218" stroke="#E5997B" strokeWidth="0.15" />
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  const x1 = 250 + 218 * Math.cos(angle - Math.PI / 2);
                  const y1 = 250 + 218 * Math.sin(angle - Math.PI / 2);
                  const x2 = 250 + 228 * Math.cos(angle - Math.PI / 2);
                  const y2 = 250 + 228 * Math.sin(angle - Math.PI / 2);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5997B" strokeWidth="0.6" strokeOpacity="0.5" />;
                })}
                {Array.from({ length: 180 }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 180;
                  const x1 = 250 + 218 * Math.cos(angle - Math.PI / 2);
                  const y1 = 250 + 218 * Math.sin(angle - Math.PI / 2);
                  const x2 = 250 + 222 * Math.cos(angle - Math.PI / 2);
                  const y2 = 250 + 222 * Math.sin(angle - Math.PI / 2);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5997B" strokeWidth="0.3" strokeOpacity="0.25" />;
                })}
                <circle cx="250" cy="250" r="190" stroke="#E5997B" strokeWidth="0.15" strokeOpacity="0.3" />
                <circle cx="250" cy="250" r="160" stroke="#E5997B" strokeWidth="0.3" strokeDasharray="3 9" strokeOpacity="0.25" />
                <circle cx="250" cy="250" r="100" stroke="#E5997B" strokeWidth="0.2" strokeOpacity="0.2" />
                <line x1="250" y1="20" x2="250" y2="480" stroke="#E5997B" strokeWidth="0.2" strokeOpacity="0.15" />
                <line x1="20" y1="250" x2="480" y2="250" stroke="#E5997B" strokeWidth="0.2" strokeOpacity="0.15" />
                <line x1="66" y1="66" x2="434" y2="434" stroke="#E5997B" strokeWidth="0.15" strokeOpacity="0.08" />
                <line x1="434" y1="66" x2="66" y2="434" stroke="#E5997B" strokeWidth="0.15" strokeOpacity="0.08" />
                <g stroke="#E5997B">
                  <path d="M244 420 L256 420 L253 90 L247 90 Z" strokeWidth="1" fill="#E5997B" fillOpacity="0.06" />
                  <rect x="228" y="418" width="44" height="14" rx="2" strokeWidth="0.8" fill="#E5997B" fillOpacity="0.04" />
                  <rect x="218" y="430" width="64" height="8" rx="1" strokeWidth="0.6" fill="#E5997B" fillOpacity="0.03" />
                  <circle cx="250" cy="92" r="7" strokeWidth="1" fill="#030035" />
                  <circle cx="250" cy="92" r="3" fill="#E5997B" fillOpacity="0.6" strokeWidth="0" />
                  <circle cx="250" cy="92" r="11" strokeWidth="0.4" strokeDasharray="2 4" strokeOpacity="0.4" />
                  <path className="origin-scale-arm" d="M80 92 L420 92" strokeWidth="1.8" />
                  <path d="M80 92 L95 86 L110 92 L125 86 L140 92 L155 86 L170 92 L185 86 L200 92" strokeWidth="0.4" strokeOpacity="0.4" />
                  <path d="M300 92 L315 86 L330 92 L345 86 L360 92 L375 86 L390 92 L405 86 L420 92" strokeWidth="0.4" strokeOpacity="0.4" />
                  <line x1="82" y1="92" x2="60" y2="195" strokeWidth="0.6" strokeOpacity="0.7" />
                  <line x1="82" y1="92" x2="104" y2="195" strokeWidth="0.6" strokeOpacity="0.7" />
                  <line x1="60" y1="192" x2="104" y2="192" strokeWidth="0.4" strokeOpacity="0.4" />
                  <g className="origin-left-plate">
                    <path d="M44 195 C 44 230, 120 230, 120 195 Z" strokeWidth="1.2" fill="#E5997B" fillOpacity="0.04" />
                    <line x1="55" y1="210" x2="109" y2="210" strokeWidth="0.3" strokeOpacity="0.3" />
                    <line x1="52" y1="217" x2="112" y2="217" strokeWidth="0.3" strokeOpacity="0.2" />
                    <line x1="50" y1="224" x2="114" y2="224" strokeWidth="0.3" strokeOpacity="0.15" />
                    <circle cx="82" cy="208" r="10" strokeWidth="0.5" strokeOpacity="0.35" />
                    <circle cx="82" cy="208" r="5" strokeWidth="0.3" strokeOpacity="0.25" />
                  </g>
                  <line x1="418" y1="92" x2="396" y2="195" strokeWidth="0.6" strokeOpacity="0.7" />
                  <line x1="418" y1="92" x2="440" y2="195" strokeWidth="0.6" strokeOpacity="0.7" />
                  <line x1="396" y1="192" x2="440" y2="192" strokeWidth="0.4" strokeOpacity="0.4" />
                  <g className="origin-right-plate">
                    <path d="M380 195 C 380 230, 456 230, 456 195 Z" strokeWidth="1.2" fill="#E5997B" fillOpacity="0.04" />
                    <line x1="391" y1="210" x2="445" y2="210" strokeWidth="0.3" strokeOpacity="0.3" />
                    <line x1="388" y1="217" x2="448" y2="217" strokeWidth="0.3" strokeOpacity="0.2" />
                    <line x1="386" y1="224" x2="450" y2="224" strokeWidth="0.3" strokeOpacity="0.15" />
                    <circle cx="418" cy="208" r="10" strokeWidth="0.5" strokeOpacity="0.35" />
                    <circle cx="418" cy="208" r="5" strokeWidth="0.3" strokeOpacity="0.25" />
                  </g>
                  <line x1="236" y1="200" x2="264" y2="200" strokeWidth="0.4" strokeOpacity="0.3" />
                  <line x1="236" y1="260" x2="264" y2="260" strokeWidth="0.4" strokeOpacity="0.3" />
                  <line x1="236" y1="320" x2="264" y2="320" strokeWidth="0.4" strokeOpacity="0.3" />
                  <line x1="236" y1="380" x2="264" y2="380" strokeWidth="0.4" strokeOpacity="0.3" />
                  <path d="M250 200 L254 206 L250 212 L246 206 Z" strokeWidth="0.4" strokeOpacity="0.4" />
                  <path d="M250 260 L254 266 L250 272 L246 266 Z" strokeWidth="0.4" strokeOpacity="0.4" />
                  <path d="M250 320 L254 326 L250 332 L246 326 Z" strokeWidth="0.4" strokeOpacity="0.4" />
                </g>
                {[
                  { x: 250, y: 14, label: 'N' }, { x: 250, y: 493, label: 'S' },
                  { x: 12, y: 254, label: 'W' }, { x: 488, y: 254, label: 'E' },
                ].map((p) => (
                  <text key={p.label} x={p.x} y={p.y} fill="#E5997B" fillOpacity="0.3" fontSize="10" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" letterSpacing="2">{p.label}</text>
                ))}
                <text x="250" y="255" fill="#E5997B" fillOpacity="0.2" fontSize="11" fontFamily="'Playfair Display', serif" textAnchor="middle" letterSpacing="8">DIMA</text>
                <text x="250" y="270" fill="#E5997B" fillOpacity="0.12" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="4">FINANCE</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-24 flex items-center justify-between">
          <span className="text-[#F4F4F5]/15 font-mono text-[9px] tracking-[0.3em] uppercase">
            Sociedad Financiera de Objeto Múltiple — México
          </span>
          <span className="text-[#F4F4F5]/15 font-mono text-[9px] tracking-[0.3em] uppercase hidden md:block">
            Est. MMXXIV
          </span>
          <span className="text-[#E5997B]/20 font-mono text-[9px] tracking-[0.3em] uppercase">
            § Arquitectos de Equilibrio
          </span>
        </div>
      </div>

      {/* ── LAYER 1: White overlay ── */}
      <div className="arquitectos-overlay absolute inset-0 z-10 bg-[#F4F4F5] pointer-events-none" />

      {/* ── LAYER 2: Scaling word ──
          Font 22vw → scale 16 → covers 352vw × 352vh
          Lebih dari cukup untuk menutup seluruh layar dari titik "t".
          transformOrigin 51% = tepat di huruf 't' pertama "Arqui[t]ectos"
      ── */}
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
  );
}