import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// AFTER
import { ProductPointIcon } from '../../constants/EngravingillustrationsDark'

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    index: '01',
    title: 'Modelo Macroeconómico Aplicado',
    body: 'Adaptamos la ingeniería económica de Ray Dalio al nivel de la empresa. No operamos con intuición — operamos con ciclos verificables.',
    detail: 'ANALYTICS SYSTEM v1.0',
    illustIndex:2
  },
  {
    index: '02',
    title: 'Evaluación por Solvencia',
    body: 'La elegibilidad de crédito se determina por la capacidad de pago real de la entidad — no por su escala o antigüedad superficial.',
    detail: 'SOLVENCY PROTOCOL',
    illustIndex:0
  },
  {
    index: '03',
    title: 'Reconfiguración Estratégica',
    body: 'Cuando una entidad no califica, se le interviene. DIMA reconfigura la estructura financiera hasta alcanzar solvencia.',
    detail: 'STRATEGIC RECONFIG',
    illustIndex:4
  },
  {
    index: '04',
    title: 'Enlace Institucional',
    body: 'DIMA opera como arquitecto técnico entre la empresa y los comités de crédito de SOFOMEs aliadas.',
    detail: 'INSTITUTIONAL LINK',
    illustIndex:3
  },
];

export default function AboutDissolveSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const originLayerRef = useRef<HTMLDivElement>(null);
  const pillarsLayerRef = useRef<HTMLDivElement>(null);
  const originContentRef = useRef<HTMLDivElement>(null);
  const pillarsContentRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const originTitleSvgRef = useRef<SVGSVGElement>(null);
  const originScaleSvgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const originLayer = originLayerRef.current;
    const pillarsLayer = pillarsLayerRef.current;
    const originContent = originContentRef.current;
    const pillarsContent = pillarsContentRef.current;
    const bgCanvas = bgCanvasRef.current;
    const originTitleSvg = originTitleSvgRef.current;
    const originScaleSvg = originScaleSvgRef.current;

    if (!container || !originLayer || !pillarsLayer || !originContent || !pillarsContent || !bgCanvas || !originTitleSvg || !originScaleSvg) return;

    const drawBackground = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      bgCanvas.width = vw;
      bgCanvas.height = vh;

      const ctx2d = bgCanvas.getContext('2d');
      if (!ctx2d) return;

      const cols = 28;
      const rows = 18;
      const cX = vw / cols;
      const cY = vh / rows;
      let seed = 42;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

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

      const NAVY_CRACK = '#060030';
      ctx2d.clearRect(0, 0, vw, vh);
      ctx2d.fillStyle = NAVY_CRACK;
      ctx2d.fillRect(0, 0, vw, vh);

      triangles.forEach((tri) => {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
        const shade = 0.92 + Math.random() * 0.08;
        ctx2d.save();
        ctx2d.translate(cx, cy);
        ctx2d.scale(0.97, 0.97);
        ctx2d.translate(-cx, -cy);
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
    const resizeBg = () => drawBackground();
    window.addEventListener('resize', resizeBg);

    const ctx = gsap.context(() => {
      // ── INITIAL STATES ──
      gsap.set('.origin-scale-wrapper', { opacity: 0, clearProps: 'filter,scale,blur' });
      gsap.set('.origin-reveal', { opacity: 0, y: 40, clearProps: 'filter' });
      gsap.set('.origin-title', { opacity: 0, y: 20, clearProps: 'filter,scale' });
      gsap.set('.origin-title-stroke', { opacity: 0 });

      // Pillars initial state
      gsap.set('.pillar-card', { opacity: 0, yPercent: 0 });
      gsap.set('.pillar-card-0', { opacity: 1 });
      gsap.set('.pillars-header', { opacity: 0, y: -30 });
      gsap.set('.pillars-footer', { opacity: 0, y: 30 });
      gsap.set('.progress-bar-inner', { yPercent: 100 });

      const strokeLines = Array.from(originTitleSvg.querySelectorAll<SVGTextElement>('[data-stroke-line]'));
      const fillLines = Array.from(originTitleSvg.querySelectorAll<SVGTextElement>('[data-fill-line]'));
      const lengths = strokeLines.map((line) => {
        let len = line.getComputedTextLength();
        if (!len || len < 10) len = 1200;
        line.style.strokeDasharray = `${len}`;
        line.style.strokeDashoffset = `${len}`;
        return len;
      });
      gsap.set(fillLines, { fillOpacity: 0 });
      gsap.set(strokeLines, { opacity: 1 });

      const scaleStrokeEls = Array.from(originScaleSvg.querySelectorAll<SVGGeometryElement>('path, line, circle, rect, polyline, polygon'));
      const scaleLengths = scaleStrokeEls.map((el) => {
        let len = 0;
        try {
          len = el.getTotalLength?.() || 0;
        } catch { len = 0; }
        if (!len || len < 10) len = 800;
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        return len;
      });

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

      // Word scale animation — MORE DRAMATIC ZOOM
      tl.to('.arquitectos-word', {
        scale: 150,
        ease: 'power2.inOut',
        duration: 3,
      }, 0);

      // White overlay fade — ORIGINAL WHITE
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
        duration: 1.2,
      }, 2.8);
      tl.to(scaleStrokeEls, {
        strokeDashoffset: 0,
        duration: 3.0,
        ease: 'power2.out',
        stagger: 0.005,
      }, 2.9);

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
      tl.set('.origin-title-stroke', { opacity: 1 }, 3.05);
      tl.to(strokeLines, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power1.inOut',
        stagger: 0.2,
      }, 3.0);
      tl.to(fillLines, { fillOpacity: 1, duration: 1.2, ease: 'power2.out' }, 4.5);

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

      // 1. Body text elements fade out gently
      tl.to('.origin-reveal', {
        opacity: 0,
        y: -20,
        duration: 2.5,
        ease: 'power2.inOut',
        stagger: 0.08,
      }, 7.5);

      // 2. SVG scale fades out gently
      tl.to('.origin-scale-wrapper', {
        opacity: 0,
        duration: 3.0,
        ease: 'power2.inOut',
      }, 7.6);

      // 3. Title stroke REVERSES (draws back) — elegant disappearance
      tl.to(strokeLines, {
        strokeDashoffset: (i) => lengths[i],
        duration: 3.5,
        ease: 'power1.inOut',
        stagger: 0.25,
      }, 7.4);

      // 4. Fill fades before stroke completes
      tl.to(fillLines, { fillOpacity: 0, duration: 2.0, ease: 'power2.in' }, 7.6);

      // 5. Scale strokes reverse
      tl.to(scaleStrokeEls, {
        strokeDashoffset: (i) => scaleLengths[i],
        duration: 3.0,
        ease: 'power2.in',
        stagger: 0.005,
      }, 7.8);

      // 6. Main origin content fades with slight scale down
      tl.to(originContent, {
        opacity: 0,
        scale: 0.95,
        duration: 3.0,
        ease: 'power2.inOut',
      }, 8.0);

      // 7. Origin layer fades to transparent — OVERLAPS with pillars
      tl.to(originLayer, {
        opacity: 0,
        duration: 2.5,
        ease: 'power2.inOut',
      }, 9.5);

      // ═══════════════════════════════════════════════════════
      // PHASE 3: PILLARS DISSOLVE IN (42% - 52%)
      // ═══════════════════════════════════════════════════════

      // Pillars layer becomes visible BEFORE origin fully fades
      tl.set(pillarsLayer, { visibility: 'visible' }, 8.5);

      // Pillars content fades in GENTLY while origin is still visible
      tl.fromTo(pillarsContent,
        { opacity: 0, scale: 1.02 },
        {
          opacity: 1,
          scale: 1,
          duration: 3.0,
          ease: 'power2.out'
        },
        9.0
      );

      // Header and footer fade in
      tl.to('.pillars-header', {
        opacity: 1,
        y: 0,
        duration: 2.0,
        ease: 'power2.out',
      }, 9.5);

      tl.to('.pillars-footer', {
        opacity: 1,
        y: 0,
        duration: 2.0,
        ease: 'power2.out',
      }, 9.5);

      // ═══════════════════════════════════════════════════════
      // PHASE 4: PILLARS CAROUSEL (52% - 100%)
      // ═══════════════════════════════════════════════════════

      const cards = gsap.utils.toArray<HTMLElement>('.pillar-card');
      const bars = gsap.utils.toArray<HTMLElement>('.progress-bar-inner');

      cards.forEach((card, i) => {
        const position = 12 + i * 4;

        if (i > 0) {
          tl.fromTo(card,
            { opacity: 0, yPercent: 30 },       // ← FROM: datang dari bawah
            { opacity: 1, yPercent: 0, duration: 2, ease: 'power2.out' },
            position
          );

          tl.to(cards[i - 1], {
            opacity: 0,
            scale: 0.9,
            yPercent: -30,
            duration: 2,
            ease: 'power2.inOut'
          }, position);
        }

        if (bars[i]) {
          tl.to(bars[i], { yPercent: -100, duration: 2, ease: 'none' }, position);
        }
      });
    }, container);

    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener('resize', resizeBg);
      ctx.revert();
    };
  }, []);

  // Set up mouse parallax using GSAP instead of framer-motion since this component already relies heavily on GSAP
  useLayoutEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      
      // Menerapkan efek parallax dan tilt 3D ke elemen yang memiliki class tertentu
      gsap.to('.parallax-bg', {
        x: x * 40,
        y: y * 40,
        duration: 1,
        ease: 'power2.out'
      });
      
      gsap.to('.parallax-mid', {
        x: x * -20,
        y: y * -20,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.to('.parallax-front', {
        x: x * -50,
        y: y * -50,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.to('.tilt-3d', {
        rotateX: -y * 20,
        rotateY: x * 20,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', perspective: 1200 }}
    >
      {/* SHARED BACKGROUND - Ditambahkan class parallax-bg untuk efek layer paling belakang */}
      <div className="absolute inset-[-5%] bg-[#030035] z-0 parallax-bg">
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.9 }}
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

          {/* Vertical accent line */}
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#E5997B]/10 to-transparent hidden md:block" />

          {/* Coordinates */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 parallax-front">
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

            {/* Left: Content - Ditambahkan parallax-mid */}
            <div className="flex flex-col gap-4 parallax-mid">
              <div className="origin-reveal flex items-center gap-4">
                <div className="w-8 h-px bg-[#E5997B]/50" />
                <span className="text-[#E5997B] tracking-[0.6em] uppercase text-[14px] font-semibold font-mono">
                  Filosofía fundacional — 2024
                </span>
              </div>

              {/* TITLE — BIGGER, TIGHTER MARGIN */}
              <div className="origin-title relative parallax-front" style={{ minHeight: 'clamp(9rem, 16vw, 12rem)' }}>
                <svg
                  ref={originTitleSvgRef}
                  viewBox="0 0 1200 400"
                  preserveAspectRatio="xMinYMin meet"
                  className="origin-title-stroke absolute inset-0 w-full h-full pointer-events-none opacity-0"
                >
                  <text
                    x="0"
                    y="190"
                    textAnchor="start"
                    fontFamily="'Playfair Display', serif"
                    fontStyle="normal"
                    fontSize="220"
                    fontWeight="300"
                    fill="none"
                    stroke="#F4F4F5"
                    strokeWidth="1.2"
                    data-stroke-line="0"
                  >
                    Arquitectos
                  </text>
                  <text
                    x="0"
                    y="190"
                    textAnchor="start"
                    fontFamily="'Playfair Display', serif"
                    fontStyle="normal"
                    fontSize="220"
                    fontWeight="300"
                    fill="#F4F4F5"
                    fillOpacity="1"
                    data-fill-line="0"
                  >
                    Arquitectos
                  </text>
                  <text
                    x="0"
                    y="380"
                    textAnchor="start"
                    fontFamily="'Playfair Display', serif"
                    fontStyle="italic"
                    fontSize="220"
                    fontWeight="300"
                    fill="none"
                    stroke="#E5997B"
                    strokeWidth="1.2"
                    data-stroke-line="1"
                  >
                    de equilibrio.
                  </text>
                  <text
                    x="0"
                    y="380"
                    textAnchor="start"
                    fontFamily="'Playfair Display', serif"
                    fontStyle="italic"
                    fontSize="220"
                    fontWeight="300"
                    fill="#E5997B"
                    fillOpacity="1"
                    data-fill-line="1"
                  >
                    de equilibrio.
                  </text>
                </svg>
              </div>

              <div className="origin-reveal flex items-center gap-4">
                <div className="flex-1 max-w-[80px] h-px bg-gradient-to-r from-[#E5997B]/60 to-transparent" />
                <span className="text-[#F4F4F5]/20 text-[14px] font-mono tracking-[0.3em] uppercase">§ 001</span>
              </div>

              <div className="origin-reveal flex flex-col gap-3 max-w-xl">
                <p className="font-body text-[#F4F4F5]/55 text-xl md:text-2xl leading-[1.7] font-light tracking-wide">
                  Fundada sobre la premisa de que el crédito, correctamente estructurado, no es deuda — es arquitectura. Cada institución lleva en sí misma un ciclo; nuestra labor es leerlo.
                </p>
                <p className="font-body text-[#F4F4F5]/35 text-base md:text-lg leading-[1.7] tracking-wider uppercase font-light">
                  Inspirados en la metodología de Raymond Thomas Dalio — adaptada de la macroeconomía al tejido vivo de la empresa.
                </p>
              </div>

              <div className="origin-reveal border-l-2 border-[#E5997B]/30 pl-6 py-2">
                <p className="font-display text-[#F4F4F5]/45 text-lg italic leading-relaxed tracking-wide">
                  "La deuda no es el problema. El desajuste entre ciclos es el problema."
                </p>
                <span className="text-[#E5997B]/40 text-[14px] font-mono tracking-[0.4em] uppercase mt-3 block">— Principio DIMA</span>
              </div>
            </div>

            {/* Right: SVG Scale - Ditambahkan parallax-front dan tilt-3d untuk ilusi kedalaman */}
            <div className="flex items-center justify-center relative parallax-front tilt-3d" style={{ transformStyle: 'preserve-3d' }}>
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
                <svg ref={originScaleSvgRef} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"
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
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-24 flex items-center justify-between parallax-front">
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

          {/* White/Light overlay — ORIGINAL: light bg with navy text */}
          <div className="arquitectos-overlay absolute inset-0 z-10 bg-[#F4F4F5] pointer-events-none" />

          {/* Scaling Word — ORIGINAL: navy text on light overlay */}
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

      {/* pillarsection LAYER 2 */}

      <div ref={pillarsLayerRef} className="absolute inset-0 z-20" style={{ visibility: 'hidden' }}>
        {/* Fixed Header Label */}
        <div className="pillars-header absolute top-28 left-12 z-50 parallax-front">
          <div className="flex items-center gap-4 text-[#E5997B]">
            <div className="w-12 h-px bg-current" />
            <span className="font-mono text-[10px] tracking-[0.8em] uppercase font-bold">Protocol Pillars</span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="pillars-footer absolute bottom-16 right-16 flex gap-3 z-50 parallax-front">
          {PILLARS.map((_, i) => (
            <div key={i} className="w-1 h-12 bg-white/10 relative overflow-hidden">
              <div className="progress-bar-inner absolute inset-0 bg-[#E5997B]" style={{ transform: 'translateY(100%)' }} />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="pillars-footer absolute bottom-16 left-16 z-50 parallax-front">
          <div className="font-mono text-[9px] text-white/20 uppercase leading-loose tracking-[0.2em]">
            Dima Finance<br />System Architecture v2
          </div>
        </div>

        <div ref={pillarsContentRef} className="relative w-full h-full">
          <div className="relative w-full max-w-5xl h-full mx-auto">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.index}
                className={`pillar-card pillar-card-${i} absolute inset-0 will-change-transform parallax-mid`}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: '15vh',
                  paddingBottom: '15vh', 
                  gap: '2rem'
                }}
              >
                {/* Icon - Dilengkapi tilt-3d untuk efek kedalaman */}
                <div 
                  className="opacity-75 flex justify-center items-center tilt-3d"
                  style={{
                    width: '26rem',
                    height: '26rem',
                    flexShrink: 0,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <ProductPointIcon index={pillar.illustIndex} drawProgress={1} />
                </div>

                {/* Text - Berada di layer berbeda dari Icon */}
                <div 
                  className="parallax-front"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    width: '100%',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem'
                  }}
                >
                  <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] text-white font-light leading-none tracking-tighter text-center">
                    {pillar.title.split(' ').map((word, idx) => (
                      <span key={idx} className={idx % 2 !== 0 ? 'italic text-[#E5997B]' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </h2>

                  <p className="text-white/40 text-xl md:text-3xl max-w-5xl font-light leading-relaxed text-center">
                    {pillar.body}
                  </p>

                  <div className="flex items-center justify-center gap-6">
                    <div className="h-[0.5px] w-12 bg-white/20" />
                    <span className="font-mono text-[9px] tracking-[0.6em] text-white/30 uppercase">
                      {pillar.detail}
                    </span>
                    <div className="h-[0.5px] w-12 bg-white/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}