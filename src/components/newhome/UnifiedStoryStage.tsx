import { useState, useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Minus } from 'lucide-react';
import { HERO_STAGE_DATA, NEW_HOME_SECTORS } from './newHomeData';
import CreditArchitectureDiagram from './CreditArchitectureDiagram';
import HybridRevealText from '../HybridRevealText';
import { getLenis } from '../../hooks/useLenis';

export interface UnifiedStoryStageHandle {
  setProgress: (progress: number) => void;
}

interface UnifiedStoryStageProps {
  onProgressUpdate?: (
    progress: number,
    activeVidIndex: number,
    activeVidProgress: number,
    shiftX: number,
    overlayOpacity: number,
    heroProgress: number
  ) => void;
}

interface PhaseConfig {
  id: string;
  start: number;
  fadeIn: number;
  fadeOut: number;
  end: number;
}

// 9 Distinct Narrative Phases spanning scroll progress 0.00 to 1.00
const PHASES: PhaseConfig[] = [
  // 0: Phrase 1 (0.025 to 0.075) - Video 1
  { id: 'phrase-1', start: 0.025, fadeIn: 0.035, fadeOut: 0.065, end: 0.075 },
  // 1: Phrase 2 (0.070 to 0.115) - Video 1
  { id: 'phrase-2', start: 0.070, fadeIn: 0.078, fadeOut: 0.105, end: 0.115 },
  // 2: Phrase 3 (0.110 to 0.155) - Video 1
  { id: 'phrase-3', start: 0.110, fadeIn: 0.118, fadeOut: 0.145, end: 0.155 },
  // 3: Main Hero Block (0.150 to 0.285) - Video 2
  { id: 'hero', start: 0.150, fadeIn: 0.165, fadeOut: 0.270, end: 0.285 },
  // 4: Sector 1 - Agroindustria (0.280 to 0.405) - Video 3
  { id: 'modelo', start: 0.280, fadeIn: 0.295, fadeOut: 0.390, end: 0.405 },
  // 5: Sector 2 - Construcción (0.400 to 0.588) - Videos 4 & 5
  { id: 'proceso', start: 0.400, fadeIn: 0.415, fadeOut: 0.570, end: 0.588 },
  // 6: Sector 3 - Expansión (0.580 to 0.705) - Video 6
  { id: 'filosofia', start: 0.580, fadeIn: 0.595, fadeOut: 0.690, end: 0.705 },
  // 7: Sector 4 - Energía & Productos (0.700 to 0.845) - Video 7
  { id: 'productos', start: 0.700, fadeIn: 0.715, fadeOut: 0.830, end: 0.845 },
  // 8: Sector 5 - Logística & Servicios (0.840 to 0.995) - Videos 8, 9, 10
  { id: 'servicios', start: 0.840, fadeIn: 0.855, fadeOut: 0.980, end: 0.995 },
];

function calcPhaseOpacity(p: number, cfg: PhaseConfig): number {
  if (p < cfg.start || p > cfg.end) return 0;
  if (p >= cfg.fadeIn && p <= cfg.fadeOut) return 1;
  if (p < cfg.fadeIn) return (p - cfg.start) / (cfg.fadeIn - cfg.start);
  return (cfg.end - p) / (cfg.end - cfg.fadeOut);
}

// Perimeter layout configurations per sector
const SECTOR_LAYOUTS: Record<string, {
  titlePosition: string;
  titleAlign: string;
  descPosition: string;
  descAlign: string;
}> = {
  modelo: {
    // 01: Kiri Bawah (Title) & Kanan Bawah (Desc)
    titlePosition: 'lg:absolute lg:left-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-xl xl:max-w-2xl',
    descAlign: 'items-start text-left lg:items-end lg:text-right',
  },
  proceso: {
    // 02: Kanan Tengah (Title) & Kiri Bawah (Desc)
    titlePosition: 'lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left lg:items-end lg:text-right',
    descPosition: 'lg:absolute lg:left-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-xl xl:max-w-2xl',
    descAlign: 'items-start text-left',
  },
  filosofia: {
    // 03: Kiri Bawah (Title) & Kanan Atas (Desc)
    titlePosition: 'lg:absolute lg:left-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-0 lg:top-24 lg:xl:top-28 lg:max-w-xl xl:max-w-2xl',
    descAlign: 'items-start text-left lg:items-end lg:text-right',
  },
  productos: {
    // 04: Kiri Atas (Title) & Kanan Bawah (Table / Diagram)
    titlePosition: 'lg:absolute lg:left-0 lg:top-24 lg:xl:top-28 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-0 lg:bottom-6 lg:xl:bottom-10 lg:w-full lg:max-w-[560px] xl:max-w-[620px]',
    descAlign: 'items-start text-left',
  },
  servicios: {
    // 05: Tengah Bawah (Title) & Deskripsi inline di antara subtitle & CTA
    titlePosition: 'lg:absolute lg:inset-x-0 lg:bottom-8 lg:xl:bottom-12 lg:mx-auto lg:max-w-3xl xl:max-w-4xl',
    titleAlign: 'items-center text-center',
    descPosition: '',
    descAlign: 'items-center text-center',
  },
};

const UnifiedStoryStage = forwardRef<UnifiedStoryStageHandle, UnifiedStoryStageProps>(
  ({ onProgressUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageViewportRef = useRef<HTMLDivElement>(null);
    const phaseRefs = useRef<(HTMLDivElement | null)[]>(new Array(PHASES.length).fill(null));

    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
      setExpandedSection((prev) => (prev === id ? null : id));
    };

    // Central progress applicator: executes 120 FPS DOM updates for narrative texts and sends data to canvas
    const applyProgress = useCallback((rawP: number) => {
      // Critical guard: when user is at the top of the window, strictly lock progress to 0.000
      const p = (typeof window !== 'undefined' && window.scrollY <= 10) ? 0 : rawP;

      // 1. Update each phase layer's opacity & visibility directly
      for (let i = 0; i < PHASES.length; i++) {
        const el = phaseRefs.current[i];
        if (!el) continue;
        const op = calcPhaseOpacity(p, PHASES[i]);
        el.style.opacity = `${op.toFixed(3)}`;
        el.style.visibility = op > 0.005 ? 'visible' : 'hidden';
        el.style.pointerEvents = op > 0.1 ? 'auto' : 'none';
      }

      // 2. Stage container fade out at the end when transitioning to CTA form
      if (stageViewportRef.current) {
        const stageOp = p >= 0.985 ? Math.max(0, 1 - (p - 0.985) / 0.015) : 1;
        stageViewportRef.current.style.opacity = `${stageOp.toFixed(3)}`;
        stageViewportRef.current.style.visibility = stageOp > 0.005 ? 'visible' : 'hidden';
      }

      if (!onProgressUpdate) return;

      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
      const maxShift = isDesktop ? 18 : 8;

      let activeVid = 1;
      let vidProg = 0.001;
      let shiftX = 0;
      let heroProg = 1;

      let overlayOp = 0.50;
      if (p < 0.02) {
        overlayOp = 0;
      } else if (p < 0.06) {
        const t = (p - 0.02) / (0.06 - 0.02);
        const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
        overlayOp = smoothT * 0.50;
      } else {
        overlayOp = 0.50;
      }

      if (p < 0.03) {
        heroProg = (p / 0.03) * 0.16;
        shiftX = maxShift * (1 - p / 0.03);
        activeVid = 1;
        vidProg = 0.001;
      } else if (p < 0.15) {
        heroProg = 0.18 + ((p - 0.03) / 0.12) * 0.36;
        shiftX = 0;
        activeVid = 1;
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.03) / 0.12));
      } else if (p < 0.28) {
        heroProg = 0.54 + ((p - 0.15) / 0.13) * 0.42;
        shiftX = 0;
        activeVid = 2;
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.15) / 0.13));
      } else if (p < 0.40) {
        heroProg = 1;
        shiftX = 0;
        activeVid = 3;
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.28) / 0.12));
      } else if (p < 0.58) {
        heroProg = 1;
        shiftX = 0;
        if (p < 0.49) {
          activeVid = 4;
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.40) / 0.09));
        } else {
          activeVid = 5;
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.49) / 0.09));
        }
      } else if (p < 0.70) {
        heroProg = 1;
        shiftX = 0;
        activeVid = 6;
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.58) / 0.12));
      } else if (p < 0.84) {
        heroProg = 1;
        shiftX = 0;
        activeVid = 7;
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.70) / 0.14));
      } else {
        heroProg = 1;
        shiftX = 0;
        if (p < 0.89) {
          activeVid = 8;
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.84) / 0.05));
        } else if (p < 0.95) {
          activeVid = 9;
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.89) / 0.06));
        } else {
          activeVid = 10;
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.95) / 0.05));
        }
      }

      onProgressUpdate(p, activeVid, vidProg, shiftX, overlayOp, heroProg);
    }, [onProgressUpdate]);

    // Expose direct imperative progress handle for 120 FPS updates with 100% reliability
    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        applyProgress(p);
      },
    }), [applyProgress]);

    // Measure scroll progress across 2200vh height
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start start', 'end end'],
    });

    // Reveal progress MotionValues for each narrative phase (reveals letter-by-letter based on scroll)
    const phrase1Progress = useTransform(scrollYProgress, [0.025, 0.055], [0, 1]);
    const phrase2Progress = useTransform(scrollYProgress, [0.070, 0.098], [0, 1]);
    const phrase3Progress = useTransform(scrollYProgress, [0.110, 0.135], [0, 1]);
    const phrase3HookProgress = useTransform(scrollYProgress, [0.125, 0.145], [0, 1]);
    const heroTitleProgress = useTransform(scrollYProgress, [0.155, 0.215], [0, 1]);

    const sector1TitleProgress = useTransform(scrollYProgress, [0.282, 0.335], [0, 1]);
    const sector2TitleProgress = useTransform(scrollYProgress, [0.402, 0.460], [0, 1]);
    const sector3TitleProgress = useTransform(scrollYProgress, [0.582, 0.635], [0, 1]);
    const sector4TitleProgress = useTransform(scrollYProgress, [0.702, 0.755], [0, 1]);
    const sector5TitleProgress = useTransform(scrollYProgress, [0.842, 0.895], [0, 1]);

    const computeScrollProgress = useCallback((): number => {
      if (!containerRef.current) return 0;
      // Strictly guarantee 0 if at top of page
      if (typeof window !== 'undefined' && window.scrollY <= 1) {
        return 0;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / totalScroll));
    }, []);

    // Force progress 0 and sync window.scrollTo synchronously on mount before any painting or child scrub
    useLayoutEffect(() => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      applyProgress(0);
    }, [applyProgress]);

    useEffect(() => {
      // 1. Initial calculation on mount (if user reloaded at a valid non-zero scroll)
      applyProgress(computeScrollProgress());

      // 2. High-performance RAF scroll listener
      let rafId: number | null = null;
      const onScrollOrResize = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          applyProgress(computeScrollProgress());
          rafId = null;
        });
      };

      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });
      window.addEventListener('loaderFinished', onScrollOrResize);

      // 3. Framer Motion subscription as dual-sync channel
      const unsub = scrollYProgress.on('change', (p) => {
        if (typeof window !== 'undefined' && window.scrollY <= 10) {
          applyProgress(0);
          return;
        }
        applyProgress(p);
      });

      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        window.removeEventListener('loaderFinished', onScrollOrResize);
        unsub();
      };
    }, [scrollYProgress, applyProgress, computeScrollProgress]);

    const sector1 = NEW_HOME_SECTORS[0];
    const sector2 = NEW_HOME_SECTORS[1];
    const sector3 = NEW_HOME_SECTORS[2];
    const sector4 = NEW_HOME_SECTORS[3];
    const sector5 = NEW_HOME_SECTORS[4];

    const parseSubtitle = (sub?: string) => {
      const words = (sub || '').trim().split(/\s+/);
      return {
        main: words.slice(0, -1).join(' '),
        last: words[words.length - 1] || '',
        first: words[0] || '',
        rest: words.slice(1).join(' '),
      };
    };

    return (
      <>
        {/* 1. Spatial Scroll Track: 2200vh height to drive Lenis scroll travel & Navbar anchors */}
        <div
          ref={containerRef}
          className="relative w-full pointer-events-none"
          style={{ height: '2200vh' }}
          id="unified-story-stage"
        >
          <div id="hero-stage" className="absolute top-0 pointer-events-none" />
          <div id="sector-modelo" className="absolute top-[28%] pointer-events-none" />
          <div id="sector-proceso" className="absolute top-[40%] pointer-events-none" />
          <div id="sector-filosofia" className="absolute top-[58%] pointer-events-none" />
          <div id="sector-productos" className="absolute top-[70%] pointer-events-none" />
          <div id="sector-servicios" className="absolute top-[84%] pointer-events-none" />
        </div>

        {/* 2. Fixed Narrative Viewport Layer (z-[25]): Locked to screen, 100% visible across scroll */}
        <div
          ref={stageViewportRef}
          className="fixed inset-0 h-screen w-full overflow-hidden pointer-events-none z-[25] flex items-center justify-center transition-opacity duration-300 ease-out"
          style={{ opacity: 1 }}
        >
          {/* ------------------------------------------------------------------- */}
          {/* PHASE 0: Opening Phrase 1 (01 — Premisa)                           */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[0] = el; }}
            className="absolute left-6 sm:left-10 md:left-14 lg:left-16 xl:left-20 top-1/2 -translate-y-1/2 w-[88%] sm:w-[75%] md:w-[58%] lg:w-[46%] max-w-xl text-left pointer-events-none transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#E5997B] font-semibold uppercase mb-2 sm:mb-3">
              01 — Premisa
            </p>
            <h2 className="leading-[1.12] tracking-tight w-full block break-words drop-shadow-md text-left">
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[0]}
                progress={phrase1Progress}
                className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.6rem] inline break-words text-white"
                targetColor="#FFFFFF"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 1: Opening Phrase 2 (02 — Mecánica)                          */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[1] = el; }}
            className="absolute right-6 sm:right-10 md:right-14 lg:right-16 xl:right-20 top-1/2 -translate-y-1/2 w-[88%] sm:w-[75%] md:w-[58%] lg:w-[46%] max-w-xl text-right flex flex-col items-end pointer-events-none transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#E5997B] font-semibold uppercase mb-2 sm:mb-3">
              02 — Mecánica
            </p>
            <h2 className="leading-[1.12] tracking-tight w-full block break-words drop-shadow-md text-right">
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[1]}
                progress={phrase2Progress}
                className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.6rem] inline break-words text-white"
                targetColor="#FFFFFF"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 2: Opening Phrase 3 (03 — Escala)                            */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[2] = el; }}
            className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-14 inset-x-0 mx-auto w-[92%] sm:w-[85%] md:w-[75%] lg:w-[65%] max-w-4xl px-4 text-center flex flex-col items-center pointer-events-none transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#E5997B] font-semibold uppercase mb-2 sm:mb-3">
              03 — Escala
            </p>
            <h2 className="leading-[1.14] tracking-tight w-full block break-words drop-shadow-md text-center">
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[2]}
                progress={phrase3Progress}
                className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.6rem] inline break-words text-white"
                targetColor="#FFFFFF"
              />
            </h2>
            <div className="mt-3 sm:mt-4">
              <HybridRevealText
                text={`— ${HERO_STAGE_DATA.openingPhrases[3]}`}
                progress={phrase3HookProgress}
                className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#E5997B] font-normal italic tracking-wide inline break-words drop-shadow"
                targetColor="#E5997B"
              />
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 3: Main Hero Block (Sistema Operativo)                       */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[3] = el; }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <div className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 flex flex-col lg:block justify-center gap-8">
              {/* Title Left */}
              <div className="w-full flex flex-col space-y-3 sm:space-y-4 lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-xl xl:max-w-2xl items-start text-left pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5997B]" />
                  <span className="font-body text-xs sm:text-[13px] tracking-[0.25em] text-[#E5997B] font-semibold uppercase">
                    Sistema Operativo // Principio Directriz
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] text-white font-normal leading-[1.08] tracking-tight drop-shadow-md">
                  <HybridRevealText
                    text={HERO_STAGE_DATA.title}
                    progress={heroTitleProgress}
                    className="inline break-words text-white"
                    targetColor="#FFFFFF"
                  />
                </h2>
                <p className="font-body text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1.55rem] text-white/95 font-light leading-relaxed border-l-4 border-[#E5997B] pl-5 sm:pl-6 max-w-2xl xl:max-w-3xl">
                  {(() => {
                    const words = HERO_STAGE_DATA.subtitle.trim().split(/\s+/);
                    const main = words.slice(0, -1).join(' ');
                    const last = words[words.length - 1];
                    return (
                      <>
                        <span>{main} </span>
                        <span className="inline-flex items-center whitespace-nowrap">
                          <span>{last}</span>
                          <button
                            type="button"
                            onClick={() => toggleExpand('hero')}
                            className="inline-flex items-center justify-center align-middle ml-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm"
                            title={expandedSection === 'hero' ? 'Ocultar descripción' : 'Mostrar descripción'}
                          >
                            <ChevronRight
                              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B] transition-transform duration-300 ${expandedSection === 'hero' ? 'rotate-180' : ''}`}
                              strokeWidth={2.5}
                            />
                          </button>
                        </span>
                      </>
                    );
                  })()}
                </p>
                <div className="pt-2">
                  <a
                    href="#sector-modelo"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/30 hover:border-[#E5997B] bg-white/[0.04] hover:bg-white/[0.1] font-body text-xs tracking-[0.2em] uppercase text-white hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
                  >
                    Explorar los Sectores
                  </a>
                </div>
              </div>

              {/* Description Right (Expandable) */}
              <div className="w-full flex flex-col space-y-4 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-xl xl:max-w-2xl items-start text-left lg:items-end lg:text-right pointer-events-auto">
                {expandedSection === 'hero' && (
                  <div className="w-full max-h-[75vh] overflow-y-auto custom-scrollbar pr-1 text-left lg:text-right animate-fadeIn">
                    <div className="space-y-4 sm:space-y-5 text-lg sm:text-xl md:text-2xl lg:text-[1.38rem] xl:text-[1.48rem] text-white/95 font-body leading-relaxed font-light py-1">
                      {HERO_STAGE_DATA.body.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                    <div className="pt-3 flex items-center justify-start lg:justify-end">
                      <button
                        type="button"
                        onClick={() => toggleExpand('hero')}
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5997B] bg-white/[0.06] hover:bg-white/[0.14] font-body text-xs tracking-[0.2em] uppercase text-white/85 hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#E5997B]" />
                        <span>Minimizar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASES 4 - 7: Sectors 1 to 4 (Modelo, Proceso, Filosofia, Productos) */}
          {/* ------------------------------------------------------------------- */}
          {[
            { sec: sector1, phaseIdx: 4, progress: sector1TitleProgress },
            { sec: sector2, phaseIdx: 5, progress: sector2TitleProgress },
            { sec: sector3, phaseIdx: 6, progress: sector3TitleProgress },
            { sec: sector4, phaseIdx: 7, progress: sector4TitleProgress },
          ].map(({ sec, phaseIdx, progress: secTitleProgress }) => {
            const layout = SECTOR_LAYOUTS[sec.id] || SECTOR_LAYOUTS.modelo;
            const isRightSide = layout.titlePosition.includes('lg:right-0');
            const isExpanded = expandedSection === sec.id;
            const subParsed = parseSubtitle(sec.subtitle);

            return (
              <div
                key={sec.id}
                ref={(el) => { phaseRefs.current[phaseIdx] = el; }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-200 ease-out"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                <div className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 flex flex-col lg:block justify-center gap-8">
                  {/* Title Block */}
                  <div className={`w-full flex flex-col space-y-3 sm:space-y-4 ${layout.titlePosition} ${layout.titleAlign} pointer-events-auto`}>
                    <div className={`flex items-center gap-2 ${isRightSide ? 'lg:flex-row-reverse' : ''}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5997B]" />
                      <span className="font-body text-xs sm:text-[13px] tracking-[0.25em] text-[#E5997B] font-semibold uppercase">
                        {sec.sectorName}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] text-white font-normal leading-[1.08] tracking-tight drop-shadow-md">
                      <HybridRevealText
                        text={sec.title}
                        progress={secTitleProgress}
                        className="inline break-words text-white"
                        targetColor="#FFFFFF"
                      />
                    </h3>

                    {sec.subtitle && (
                      <div>
                        <p
                          className={`max-w-xl xl:max-w-2xl font-body text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1.55rem] text-white/95 font-light leading-relaxed border-l-4 border-[#E5997B] pl-5 sm:pl-6 text-left ${
                            isRightSide
                              ? 'lg:border-l-0 lg:border-r-4 lg:border-[#E5997B] lg:pl-0 lg:pr-5 sm:lg:pr-6 lg:text-right'
                              : ''
                          }`}
                        >
                          {isRightSide ? (
                            <>
                              <span className="hidden lg:inline">
                                <span className="inline-flex items-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(sec.id)}
                                    className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm mr-2.5 align-middle"
                                    title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                                  >
                                    <ChevronLeft
                                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B] transition-transform duration-300 ${isExpanded ? '-rotate-180' : ''}`}
                                      strokeWidth={2.5}
                                    />
                                  </button>
                                  <span>{subParsed.first}</span>
                                </span>
                                <span> {subParsed.rest}</span>
                              </span>
                              <span className="inline lg:hidden">
                                <span>{subParsed.main} </span>
                                <span className="inline-flex items-center whitespace-nowrap">
                                  <span>{subParsed.last}</span>
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(sec.id)}
                                    className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm ml-2.5 align-middle"
                                    title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                                  >
                                    <ChevronRight
                                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                      strokeWidth={2.5}
                                    />
                                  </button>
                                </span>
                              </span>
                            </>
                          ) : (
                            <>
                              <span>{subParsed.main} </span>
                              <span className="inline-flex items-center whitespace-nowrap">
                                <span>{subParsed.last}</span>
                                <button
                                    type="button"
                                    onClick={() => toggleExpand(sec.id)}
                                    className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm ml-2.5 align-middle"
                                    title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                                >
                                  <ChevronRight
                                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                    strokeWidth={2.5}
                                  />
                                </button>
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    {/* CTA Link */}
                    <div className="pt-2">
                      <Link
                        to={sec.linkTo}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/30 hover:border-[#E5997B] bg-white/[0.04] hover:bg-white/[0.1] font-body text-xs tracking-[0.2em] uppercase text-white hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
                      >
                        {sec.linkText}
                      </Link>
                    </div>
                  </div>

                  {/* Description Block */}
                  <div className={`w-full flex flex-col space-y-4 ${layout.descPosition} ${layout.descAlign} pointer-events-auto`}>
                    {isExpanded && (
                      <div className="w-full max-h-[75vh] overflow-y-auto custom-scrollbar pr-1 animate-fadeIn">
                        <div className="space-y-4 sm:space-y-5 text-lg sm:text-xl md:text-2xl lg:text-[1.38rem] xl:text-[1.48rem] text-white/95 font-body leading-relaxed font-light py-1">
                          {sec.body.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                        </div>
                        <div className={`pt-3 flex items-center ${layout.descAlign.includes('lg:items-end') ? 'justify-start lg:justify-end' : 'justify-start'}`}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(sec.id)}
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5997B] bg-white/[0.06] hover:bg-white/[0.14] font-body text-xs tracking-[0.2em] uppercase text-white/85 hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5 text-[#E5997B]" />
                            <span>Minimizar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Interactive Credit Elements Diagram for Sector 4 (Productos) */}
                    {sec.hasDiagram && (
                      <div className="pt-2 w-full">
                        <CreditArchitectureDiagram />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 8: Sector 5 - Servicios & CTA                                */}
          {/* ------------------------------------------------------------------- */}
          {(() => {
            const sec = sector5;
            const layout = SECTOR_LAYOUTS.servicios;
            const isExpanded = expandedSection === sec.id;
            const subParsed = parseSubtitle(sec.subtitle);

            return (
              <div
                ref={(el) => { phaseRefs.current[8] = el; }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-200 ease-out"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                <div className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 flex flex-col lg:block justify-center gap-8">
                  <div className={`w-full flex flex-col space-y-3 sm:space-y-4 ${layout.titlePosition} ${layout.titleAlign} pointer-events-auto`}>
                    <div className="flex items-center gap-2 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5997B]" />
                      <span className="font-body text-xs sm:text-[13px] tracking-[0.25em] text-[#E5997B] font-semibold uppercase">
                        {sec.sectorName}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] text-white font-normal leading-[1.08] tracking-tight drop-shadow-md">
                      <HybridRevealText
                        text={sec.title}
                        progress={sector5TitleProgress}
                        className="inline break-words text-white"
                        targetColor="#FFFFFF"
                      />
                    </h3>

                    {sec.subtitle && (
                      <div>
                        <p className="max-w-3xl xl:max-w-4xl mx-auto font-body text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1.55rem] text-white/95 font-light leading-relaxed text-center px-4">
                          <span>{subParsed.main} </span>
                          <span className="inline-flex items-center whitespace-nowrap">
                            <span>{subParsed.last}</span>
                            <button
                              type="button"
                              onClick={() => toggleExpand(sec.id)}
                              className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm ml-2.5 align-middle"
                              title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                            >
                              <ChevronRight
                                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                                strokeWidth={2.5}
                              />
                            </button>
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Inline Expandable Description */}
                    {isExpanded && (
                      <div className="w-full max-w-2xl mx-auto overflow-hidden text-center my-1 animate-fadeIn">
                        <div className="space-y-4 text-lg sm:text-xl md:text-2xl text-white/95 font-body leading-relaxed font-light py-2 max-h-[46vh] overflow-y-auto custom-scrollbar px-3">
                          {sec.body.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                        </div>
                        <div className="pt-1.5 pb-1 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => toggleExpand(sec.id)}
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5997B] bg-white/[0.06] hover:bg-white/[0.14] font-body text-xs tracking-[0.2em] uppercase text-white/85 hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5 text-[#E5997B]" />
                            <span>Minimizar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex justify-center">
                      <Link
                        to={sec.linkTo}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/30 hover:border-[#E5997B] bg-white/[0.04] hover:bg-white/[0.1] font-body text-xs tracking-[0.2em] uppercase text-white hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
                      >
                        {sec.linkText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </>
    );
  }
);

export default UnifiedStoryStage;
