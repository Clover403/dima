import { useState, useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef, Fragment } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    overlayOpacity: number
  ) => void;
}

interface PhaseConfig {
  id: string;
  start: number;
  fadeIn: number;
  fadeOut: number;
  end: number;
}

// 10 Distinct Narrative Phases spanning scroll progress 0.00 to 1.00
const PHASES: PhaseConfig[] = [
  // 0: Phrase 1 (0.018 to 0.068) - Video 1
  { id: 'phrase-1', start: 0.018, fadeIn: 0.026, fadeOut: 0.060, end: 0.068 },
  // 1: Phrase 2 (0.068 to 0.125) - Video 1
  { id: 'phrase-2', start: 0.068, fadeIn: 0.076, fadeOut: 0.118, end: 0.125 },
  // 2: Phrase 3 (0.125 to 0.180) - Video 1
  { id: 'phrase-3', start: 0.125, fadeIn: 0.133, fadeOut: 0.172, end: 0.180 },
  // 3: DIMA FINANCE Parallax (0.180 to 0.245) - Video 1
  { id: 'dima-finance', start: 0.180, fadeIn: 0.192, fadeOut: 0.235, end: 0.245 },
  // 4: The Hero Text (Section 1) (0.245 to 0.320) - Dipercepat keluar & seimbang P0/P1
  { id: 'hero-text', start: 0.245, fadeIn: 0.256, fadeOut: 0.314, end: 0.320 },
  // 5: Sector 1 - Agroindustria (0.390 to 0.455) - Videos 2 & 3
  { id: 'modelo', start: 0.390, fadeIn: 0.402, fadeOut: 0.446, end: 0.455 },
  // 6: Sector 2 - Construcción & Real Estate Fused (0.516 to 0.561) - Videos 4, 5, 6, 7
  { id: 'proceso', start: 0.516, fadeIn: 0.521, fadeOut: 0.557, end: 0.561 },
  // 7: Sector 3 - Comercio & Retail (0.600 to 0.700) - Video 8
  { id: 'filosofia', start: 0.600, fadeIn: 0.610, fadeOut: 0.695, end: 0.700 },
  // 8: Sector 4 - Energía & Productos (0.766 to 0.840) - Videos 9 & 10
  { id: 'productos', start: 0.766, fadeIn: 0.774, fadeOut: 0.834, end: 0.840 },
  // 9: Sector 5 - Logística & Servicios (0.880 to 0.985) - Videos 11 & 12
  { id: 'servicios', start: 0.880, fadeIn: 0.890, fadeOut: 0.976, end: 0.985 },
];

function calcPhaseOpacity(p: number, cfg: PhaseConfig): number {
  if (p < cfg.start || p > cfg.end) return 0;
  if (p >= cfg.fadeIn && p <= cfg.fadeOut) return 1;
  if (p < cfg.fadeIn) return (p - cfg.start) / (cfg.fadeIn - cfg.start);
  return (cfg.end - p) / (cfg.end - cfg.fadeOut);
}

// Perimeter layout configurations per sector - matches perimeter padding (left-8/12/20 & right-8/12/20) and alignment
const SECTOR_LAYOUTS: Record<string, {
  titlePosition: string;
  titleAlign: string;
  descPositions: string[];
  descAligns: string[];
}> = {
  modelo: {
    // 01: Kiri Bawah (Title) & P0 Kanan Atas, P1 Kanan Bawah
    titlePosition: 'absolute left-8 sm:left-12 lg:left-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[46vw] lg:max-w-[42vw]',
    titleAlign: 'items-start text-left',
    descPositions: [
      'absolute right-8 sm:right-12 lg:right-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
      'absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
    ],
    descAligns: [
      'items-end text-right',
      'items-end text-right',
    ],
  },
  proceso: {
    // 02: Kanan Bawah (Title), P0, P1, P2 semua Kiri Bawah
    titlePosition: 'absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[46vw] lg:max-w-[42vw]',
    titleAlign: 'items-end text-right',
    descPositions: [
      'absolute left-8 sm:left-12 lg:left-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
      'absolute left-8 sm:left-12 lg:left-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
      'absolute left-8 sm:left-12 lg:left-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
    ],
    descAligns: [
      'items-start text-left',
      'items-start text-left',
      'items-start text-left',
    ],
  },
  filosofia: {
    // 03: Kanan Atas (Title), P0 & P1 Kiri Atas, P2 & P3 Kiri Bawah
    titlePosition: 'absolute right-8 sm:right-12 lg:right-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[75%] lg:w-[46vw] lg:max-w-[42vw]',
    titleAlign: 'items-end text-right',
    descPositions: [
      'absolute left-8 sm:left-12 lg:left-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
      'absolute left-8 sm:left-12 lg:left-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
      'absolute left-8 sm:left-12 lg:left-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
      'absolute left-8 sm:left-12 lg:left-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw]',
    ],
    descAligns: [
      'items-start text-left',
      'items-start text-left',
      'items-start text-left',
      'items-start text-left',
    ],
  },
  productos: {
    // 04: Atas Tengah (Title), P0 Tengah Bawah, P1 Tengah Bawah
    titlePosition: 'absolute inset-x-8 sm:inset-x-12 lg:inset-x-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] mx-auto max-w-2xl lg:max-w-[50vw]',
    titleAlign: 'items-center text-center',
    descPositions: [
      'absolute inset-x-6 sm:inset-x-10 lg:inset-x-[4.17vw] bottom-14 sm:bottom-16 lg:bottom-[7.5vh] mx-auto max-w-xl lg:max-w-[48vw]',
      'absolute inset-x-6 sm:inset-x-10 lg:inset-x-[4.17vw] bottom-14 sm:bottom-16 lg:bottom-[7.5vh] mx-auto max-w-xl lg:max-w-[48vw]',
    ],
    descAligns: [
      'items-center text-center',
      'items-center text-center',
    ],
  },
  servicios: {
    // 05: Tengah Bawah (Title & CTA), P0 Kanan Atas (4 baris), P1 Kiri Tengah (4 baris)
    titlePosition: 'absolute inset-x-8 sm:inset-x-12 lg:inset-x-[4.17vw] bottom-8 sm:bottom-10 lg:bottom-[4.5vh] mx-auto max-w-4xl lg:max-w-[55vw]',
    titleAlign: 'items-center text-center',
    descPositions: [
      'absolute right-8 sm:right-12 lg:right-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[75%] lg:w-[32vw] lg:max-w-[27.5vw]',
      'absolute left-8 sm:left-12 lg:left-[4.17vw] top-1/2 -translate-y-1/2 w-[90%] sm:w-[75%] lg:w-[32vw] lg:max-w-[27.5vw]',
    ],
    descAligns: [
      'items-end text-right',
      'items-start text-left',
    ],
  },
};

const UnifiedStoryStage = forwardRef<UnifiedStoryStageHandle, UnifiedStoryStageProps>(
  ({ onProgressUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageViewportRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const initialLogoRef = useRef<HTMLDivElement>(null);
    const openingOverlayRef = useRef<HTMLDivElement>(null);
    const phaseRefs = useRef<(HTMLDivElement | null)[]>(new Array(PHASES.length).fill(null));
    const [showDiagram, setShowDiagram] = useState(false);

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

      // 3. Initial brand logo & scroll instruction indicator fade out immediately when scrolling begins
      if (initialLogoRef.current) {
        const logoOp = Math.max(0, 1 - (p / 0.015));
        initialLogoRef.current.style.opacity = `${logoOp.toFixed(3)}`;
        initialLogoRef.current.style.visibility = logoOp > 0.005 ? 'visible' : 'hidden';
      }
      if (scrollIndicatorRef.current) {
        const indOp = Math.max(0, 1 - (p / 0.012));
        scrollIndicatorRef.current.style.opacity = `${indOp.toFixed(3)}`;
        scrollIndicatorRef.current.style.visibility = indOp > 0.005 ? 'visible' : 'hidden';
      }

      // 4. Darkening overlay: NO overlay at initial state (p=0).
      // Smoothly fades in as user scrolls away from top (0.000 to 0.025), stays at 0.55 for Opening phrases & DIMA FINANCE,
      // then uses a wide, silky-smooth S-curve (smoothstep) fade out between 0.210 and 0.258
      if (openingOverlayRef.current) {
        let op = 0;
        const fadeInEnd = 0.025;
        const startFadeOut = 0.210;
        const endFadeOut = 0.258;

        if (p <= 0.000) {
          op = 0; // Di awal jangan ada overlay
        } else if (p < fadeInEnd) {
          // Pas di scroll baru overlay muncul (smoothstep fade in)
          const t = p / fadeInEnd;
          const smooth = t * t * (3 - 2 * t);
          op = 0.55 * smooth;
        } else if (p <= startFadeOut) {
          op = 0.55; // Opening phrases & DIMA FINANCE
        } else if (p < endFadeOut) {
          // Smooth fade out before Phase 4 starts
          const t = (p - startFadeOut) / (endFadeOut - startFadeOut);
          const smooth = t * t * (3 - 2 * t);
          op = 0.55 * (1 - smooth);
        } else {
          op = 0;
        }
        openingOverlayRef.current.style.opacity = `${op.toFixed(3)}`;
        openingOverlayRef.current.style.visibility = op > 0.005 ? 'visible' : 'hidden';
      }

      if (!onProgressUpdate) return;

      let activeVid = 1;
      let vidProg = 0.001;
      const shiftX = 0;
      const overlayOp = 0;

      // 15 Videos Sequence:
      // Hero (0.000 to 0.350):
      // - 0.000 to 0.075: Video 1 (home13_intra.mp4 - Lokal: Opening Logo DIMA)
      // - 0.075 to 0.155: Video 2 (home14_intra.mp4 - Lokal: Logo to Hourglass)
      // - 0.155 to 0.250: Video 3 (home15_intra.mp4 - Lokal: Hourglass filling)
      // - 0.250 to 0.350: Video 4 (home16_intra.mp4 - Lokal: Hourglass flow & Hero text)
      // Sector 1: Modelo (Agroindustria) (0.350 to 0.470):
      // - 0.350 to 0.410: Video 5 (home17_intra.mp4 - R2: Bulir gandum)
      // - 0.410 to 0.470: Video 6 (home18_intra.mp4 - R2: Traktor panen)
      // Sector 2: Proceso (Construcción) (0.470 to 0.605):
      // - 0.470 to 0.505: Video 7 (home4_intra.mp4 - R2: Excavator pondasi)
      // - 0.505 to 0.540: Video 8 (home5_intra.mp4 - R2: Rangka luar baru)
      // - 0.540 to 0.575: Video 9 (home6_intra.mp4 - R2: Rangka dalam interior)
      // - 0.575 to 0.605: Video 10 (home7_intra.mp4 - R2: Skyscraper zoom window)
      // Sector 3: Filosofía (Energía) (0.605 to 0.730):
      // - 0.605 to 0.730: Video 11 (home8_intra.mp4 - R2: Turbinas de viento & solar)
      // Sector 4: Productos (Comercio & Retail) (0.730 to 0.855):
      // - 0.730 to 0.795: Video 12 (home9_intra.mp4 - R2: Pelabuhan docks)
      // - 0.795 to 0.855: Video 13 (home10_intra.mp4 - R2: Supermarket shelves)
      // Sector 5: Servicios (Logística Global) (0.855 to 1.000):
      // - 0.855 to 0.920: Video 14 (home11_intra.mp4 - R2: Warehouse interior)
      // - 0.920 to 1.000: Video 15 (home12_intra.mp4 - R2: Truk kontainer / armada)
      if (p < 0.075) {
        activeVid = 1; // home13_intra.mp4 (Lokal: Opening Logo DIMA)
        vidProg = Math.max(0.001, Math.min(0.999, p / 0.075));
      } else if (p < 0.155) {
        activeVid = 2; // home14_intra.mp4 (Lokal: Logo to Hourglass)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.075) / 0.080));
      } else if (p < 0.250) {
        activeVid = 3; // home15_intra.mp4 (R2: Hourglass filling)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.155) / 0.095));
      } else if (p < 0.350) {
        activeVid = 4; // home16_intra.mp4 (R2: Hourglass flow & Hero text)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.250) / 0.100));
      } else if (p < 0.470) {
        // Sector 1: Modelo (Agroindustria & Escala Productiva)
        if (p < 0.410) {
          activeVid = 5; // home17_intra.mp4 (R2: Agro bulir gandum)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.350) / 0.060));
        } else {
          activeVid = 6; // home18_intra.mp4 (R2: Agro traktor panen)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.410) / 0.060));
        }
      } else if (p < 0.605) {
        // Sector 2: Proceso (Construcción & Fused Real Estate - Videos 4, 5, 6, 7)
        if (p < 0.505) {
          activeVid = 7; // home4_intra.mp4 (R2: Excavator pondasi)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.470) / 0.035));
        } else if (p < 0.540) {
          activeVid = 8; // home5_intra.mp4 (R2: Rangka luar baru)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.505) / 0.035));
        } else if (p < 0.575) {
          activeVid = 9; // home6_intra.mp4 (R2: Rangka dalam interior)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.540) / 0.035));
        } else {
          activeVid = 10; // home7_intra.mp4 (R2: Finished skyscraper window zoom)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.575) / 0.030));
        }
      } else if (p < 0.730) {
        // Sector 3: Filosofía (Energía & Fundamentos Macroeconómicos)
        activeVid = 11; // home8_intra.mp4 (R2: Turbinas de viento y solar)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.605) / 0.125));
      } else if (p < 0.855) {
        // Sector 4: Productos (Comercio & Mercados Globales - Pelabuhan & Retail Supermarket)
        if (p < 0.795) {
          activeVid = 12; // home9_intra.mp4 (R2: Logistik pelabuhan loading docks)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.730) / 0.065));
        } else {
          activeVid = 13; // home10_intra.mp4 (R2: Lorong rak supermarket retail)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.795) / 0.060));
        }
      } else {
        // Sector 5: Servicios (Logística & Distribución Global)
        if (p < 0.920) {
          activeVid = 14; // home11_intra.mp4 (R2: Logistik warehouse interior)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.855) / 0.065));
        } else {
          activeVid = 15; // home12_intra.mp4 (R2: Logistik armada truk kontainer)
          // Video 15 bergerak hingga mendekati frame akhir (0.93) di p = 0.946, lalu dikunci posisinya untuk menunggu deskripsi selesai reveal
          const lockFrameProg = 0.93;
          if (p < 0.946) {
            vidProg = Math.max(0.001, Math.min(lockFrameProg, ((p - 0.920) / 0.026) * lockFrameProg));
          } else {
            vidProg = lockFrameProg;
          }
        }
      }

      onProgressUpdate(p, activeVid, vidProg, shiftX, overlayOp);
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

    // Initial brand logo & scroll indicator opacities: visible at initial state (p=0), immediately fade out on scroll
    const initialLogoOpacity = useTransform(scrollYProgress, [0.000, 0.015], [1, 0]);
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0.000, 0.012], [1, 0]);

    // Reveal progress MotionValues for the 3 narrative phrases (reveals letter-by-letter based on scroll)
    const phrase1Progress = useTransform(scrollYProgress, [0.018, 0.052], [0, 1]);
    const phrase2Progress = useTransform(scrollYProgress, [0.070, 0.106], [0, 1]);
    const phrase3Progress = useTransform(scrollYProgress, [0.128, 0.162], [0, 1]);

    // DIMA FINANCE Text Parallax Controls:
    const dimaOpacity = useTransform(
      scrollYProgress,
      [0.178, 0.190, 0.230, 0.245],
      [0, 1, 1, 0]
    );
    const dimaX = useTransform(
      scrollYProgress,
      [0.178, 0.195, 0.228, 0.245],
      ['-60%', '0%', '0%', '60%']
    );
    const financeX = useTransform(
      scrollYProgress,
      [0.178, 0.195, 0.228, 0.245],
      ['60%', '0%', '0%', '-60%']
    );

    // Hero Text MotionValues (0.245 to 0.320) - Dipercepat menghilangnya & seimbang rata antara P0 & P1:
    const heroTitleProgress = useTransform(scrollYProgress, [0.248, 0.264], [0, 1]);
    const heroTitleOpacity = useTransform(scrollYProgress, [0.248, 0.256, 0.312, 0.318], [0, 1, 1, 0]);
    const heroTitleY = useTransform(scrollYProgress, [0.248, 0.256, 0.312, 0.318], [12, 0, 0, -10]);
    
    // Paragraph 1 (Session 1): Durasi seimbang (0.032), keluar di 0.282
    const heroP0Opacity = useTransform(scrollYProgress, [0.250, 0.256, 0.276, 0.282], [0, 1, 1, 0]);
    const heroP0Y = useTransform(scrollYProgress, [0.250, 0.256, 0.276, 0.282], [16, 0, 0, -12]);
    const heroP0Filter = useTransform(
      scrollYProgress,
      [0.250, 0.256, 0.276, 0.282],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

    // Paragraph 2 (Session 2): Durasi seimbang (0.032), keluar bareng judul di 0.318
    const heroP1Opacity = useTransform(scrollYProgress, [0.286, 0.292, 0.312, 0.318], [0, 1, 1, 0]);
    const heroP1Y = useTransform(scrollYProgress, [0.286, 0.292, 0.312, 0.318], [16, 0, 0, -12]);
    const heroP1Filter = useTransform(
      scrollYProgress,
      [0.286, 0.292, 0.312, 0.318],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

    // Sector 1: Modelo (0.390 to 0.455) - 2 sessions (p1 hilang lebih cepat, p2 muncul lebih awal, exit dipercepat)
    const sector1TitleProgress = useTransform(scrollYProgress, [0.390, 0.410], [0, 1]);
    const s1p0Opacity = useTransform(scrollYProgress, [0.392, 0.402, 0.416, 0.422], [0, 1, 1, 0]);
    const s1p0Y = useTransform(scrollYProgress, [0.392, 0.402, 0.416, 0.422], [16, 0, 0, -12]);
    const s1p0Filter = useTransform(
      scrollYProgress,
      [0.392, 0.402, 0.416, 0.422],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s1p1Opacity = useTransform(scrollYProgress, [0.422, 0.428, 0.446, 0.454], [0, 1, 1, 0]);
    const s1p1Y = useTransform(scrollYProgress, [0.422, 0.428, 0.446, 0.454], [16, 0, 0, -12]);
    const s1p1Filter = useTransform(
      scrollYProgress,
      [0.422, 0.428, 0.446, 0.454],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

    // Sector 2: Proceso (0.516 to 0.561) - Judul kanan bawah, 3 paragraf sama rata durasinya & cepat hilang
    const sector2TitleProgress = useTransform(scrollYProgress, [0.516, 0.526], [0, 1]);
    const s2p0Opacity = useTransform(scrollYProgress, [0.516, 0.520, 0.527, 0.531], [0, 1, 1, 0]);
    const s2p0Y = useTransform(scrollYProgress, [0.516, 0.520, 0.527, 0.531], [16, 0, 0, -12]);
    const s2p0Filter = useTransform(
      scrollYProgress,
      [0.516, 0.520, 0.527, 0.531],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s2p1Opacity = useTransform(scrollYProgress, [0.531, 0.535, 0.542, 0.546], [0, 1, 1, 0]);
    const s2p1Y = useTransform(scrollYProgress, [0.531, 0.535, 0.542, 0.546], [16, 0, 0, -12]);
    const s2p1Filter = useTransform(
      scrollYProgress,
      [0.531, 0.535, 0.542, 0.546],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s2p2Opacity = useTransform(scrollYProgress, [0.546, 0.550, 0.557, 0.561], [0, 1, 1, 0]);
    const s2p2Y = useTransform(scrollYProgress, [0.546, 0.550, 0.557, 0.561], [16, 0, 0, -12]);
    const s2p2Filter = useTransform(
      scrollYProgress,
      [0.546, 0.550, 0.557, 0.561],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

    // Sector 3: Filosofia (0.600 to 0.700) - 4 sessions sama rata, teks 4 hilang di 0.700
    const sector3TitleProgress = useTransform(scrollYProgress, [0.602, 0.624], [0, 1]);
    const s3p0Opacity = useTransform(scrollYProgress, [0.608, 0.613, 0.626, 0.631], [0, 1, 1, 0]);
    const s3p0Y = useTransform(scrollYProgress, [0.608, 0.613, 0.626, 0.631], [16, 0, 0, -12]);
    const s3p0Filter = useTransform(
      scrollYProgress,
      [0.608, 0.613, 0.626, 0.631],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s3p1Opacity = useTransform(scrollYProgress, [0.631, 0.636, 0.649, 0.654], [0, 1, 1, 0]);
    const s3p1Y = useTransform(scrollYProgress, [0.631, 0.636, 0.649, 0.654], [16, 0, 0, -12]);
    const s3p1Filter = useTransform(
      scrollYProgress,
      [0.631, 0.636, 0.649, 0.654],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s3p2Opacity = useTransform(scrollYProgress, [0.654, 0.659, 0.672, 0.677], [0, 1, 1, 0]);
    const s3p2Y = useTransform(scrollYProgress, [0.654, 0.659, 0.672, 0.677], [16, 0, 0, -12]);
    const s3p2Filter = useTransform(
      scrollYProgress,
      [0.654, 0.659, 0.672, 0.677],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s3p3Opacity = useTransform(scrollYProgress, [0.677, 0.682, 0.695, 0.700], [0, 1, 1, 0]);
    const s3p3Y = useTransform(scrollYProgress, [0.677, 0.682, 0.695, 0.700], [16, 0, 0, -12]);
    const s3p3Filter = useTransform(
      scrollYProgress,
      [0.677, 0.682, 0.695, 0.700],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

    // Sector 4: Productos (0.766 to 0.840) - Dipercepat sedikit, deskripsi kedua & judul hilang bareng di 0.834 - 0.840
    const sector4TitleProgress = useTransform(scrollYProgress, [0.768, 0.790], [0, 1]);
    const s4p0Opacity = useTransform(scrollYProgress, [0.770, 0.778, 0.800, 0.804], [0, 1, 1, 0]);
    const s4p0Y = useTransform(scrollYProgress, [0.770, 0.778, 0.800, 0.804], [16, 0, 0, -12]);
    const s4p0Filter = useTransform(
      scrollYProgress,
      [0.770, 0.778, 0.800, 0.804],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    const s4p1Opacity = useTransform(scrollYProgress, [0.804, 0.812, 0.834, 0.840], [0, 1, 1, 0]);
    const s4p1Y = useTransform(scrollYProgress, [0.804, 0.812, 0.834, 0.840], [16, 0, 0, -12]);
    const s4p1Filter = useTransform(
      scrollYProgress,
      [0.804, 0.812, 0.834, 0.840],
      ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

    // Sector 5: Servicios (0.880 to 0.985) - Judul pas di 0.884, kedua paragraf reveal per-huruf
    const sector5TitleProgress = useTransform(scrollYProgress, [0.884, 0.908], [0, 1]);
    const s5p0Progress = useTransform(scrollYProgress, [0.925, 0.948], [0, 1]);
    const s5p0Opacity = useTransform(scrollYProgress, [0.923, 0.925, 0.976, 0.984], [0, 1, 1, 0]);
    const s5p0Y = useTransform(scrollYProgress, [0.923, 0.925, 0.976, 0.984], [0, 0, 0, -10]);
    const s5p0Filter = useTransform(
      scrollYProgress,
      [0.923, 0.925, 0.976, 0.984],
      ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );
    // Deskripsi Terakhir (Sector 5 Paragraf 2): Muncul di akhir dengan efek HybridRevealText per-huruf saat frame terkunci
    const s5p1Progress = useTransform(scrollYProgress, [0.948, 0.972], [0, 1]);
    const s5p1Opacity = useTransform(scrollYProgress, [0.946, 0.948, 0.976, 0.984], [0, 1, 1, 0]);
    const s5p1Y = useTransform(scrollYProgress, [0.946, 0.948, 0.976, 0.984], [0, 0, 0, -10]);
    const s5p1Filter = useTransform(
      scrollYProgress,
      [0.946, 0.948, 0.976, 0.984],
      ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']
    );

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

    return (
      <>
        {/* 1. Spatial Scroll Track: 4200vh height to drive Lenis scroll travel & Navbar anchors */}
        <div
          ref={containerRef}
          className="relative w-full pointer-events-none"
          style={{ height: '4200vh' }}
          id="unified-story-stage"
        >
          <div id="hero-stage" className="absolute top-0 pointer-events-none" />
          <div id="sector-hero-text" className="absolute top-[25%] pointer-events-none" />
          <div id="sector-modelo" className="absolute top-[35%] pointer-events-none" />
          <div id="sector-proceso" className="absolute top-[47%] pointer-events-none" />
          <div id="sector-filosofia" className="absolute top-[60%] pointer-events-none" />
          <div id="sector-productos" className="absolute top-[73%] pointer-events-none" />
          <div id="sector-servicios" className="absolute top-[85%] pointer-events-none" />
        </div>

        {/* 2. Fixed Narrative Viewport Layer (z-[25]): Locked to screen, 100% visible across scroll */}
        <div
          ref={stageViewportRef}
          className="fixed inset-0 h-screen w-full overflow-hidden pointer-events-none z-[25] flex items-center justify-center transition-opacity duration-300 ease-out"
          style={{ opacity: 1 }}
        >
          {/* Opening & DIMA Darkening Overlay (z-10): Sits directly behind opening text and DIMA FINANCE */}
          <div
            ref={openingOverlayRef}
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{ opacity: 0, visibility: 'hidden' }}
          />

          {/* Initial Brand Hourglass Logo (z-20): Centered crisp Imagen 1 over video, fades out immediately on scroll */}
          <motion.div
            ref={initialLogoRef}
            style={{ opacity: initialLogoOpacity }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-150"
          >
            <img
              src="/logo/Imagen 1.png"
              alt="Logo DIMA"
              className="w-[27.5vw] min-w-[205px] max-w-[530px] h-auto object-contain"
            />
          </motion.div>

          {/* Scroll Instruction Indicator: Positioned cleanly below the hourglass logo */}
          <motion.div
            ref={scrollIndicatorRef}
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute top-[73%] sm:top-[75%] lg:top-[76%] inset-x-0 mx-auto w-fit z-30 pointer-events-none flex flex-col items-center gap-2 transition-opacity duration-150"
          >
            <span className="font-body text-xs sm:text-[13px] tracking-[0.24em] uppercase text-[#030035] font-semibold">
              Desliza para explorar
            </span>
            <div className="w-[2px] h-3.5 sm:h-4 bg-[#030035]/25 overflow-hidden rounded-full relative">
              <motion.div
                animate={{ y: [-16, 16] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-full h-2 bg-[#E5997B] rounded-full shadow-[0_0_8px_rgba(229,153,123,0.8)]"
              />
            </div>
          </motion.div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 0: Opening Phrase 1 ("La economía\nno es caos.") - Kiri Tengah, 2 Baris */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[0] = el; }}
            className="absolute left-8 sm:left-12 lg:left-[4.17vw] top-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] lg:w-[45vw] lg:max-w-[35vw] text-left pointer-events-none transition-opacity duration-200 ease-out z-20"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="block leading-[1.08] lg:leading-[5.6vw] tracking-tight font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-[2.5rem] sm:text-[3.2rem] md:text-[4.5vw] lg:text-[5.2vw] break-words text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[0]}
                progress={phrase1Progress}
                targetColor="#FFFFFF"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 1: Opening Phrase 2 ("Es un mecanismo — predecible...") - Kanan Bawah, 5 Baris */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[1] = el; }}
            className="absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[70%] lg:w-[35vw] lg:max-w-[28vw] text-right flex flex-col items-end pointer-events-none transition-opacity duration-200 ease-out z-20"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="block leading-[1.08] lg:leading-[5.2vw] tracking-tight font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-[2.5rem] sm:text-[3rem] md:text-[4.2vw] lg:text-[4.8vw] break-words text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[1]}
                progress={phrase2Progress}
                targetColor="#FFFFFF"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 2: Opening Phrase 3 ("Adaptamos esa misma lógica...") - Kiri Atas, 4 Baris */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[2] = el; }}
            className="absolute left-8 sm:left-12 lg:left-[4.17vw] top-24 sm:top-28 lg:top-[12vh] w-[90%] sm:w-[70%] lg:w-[48vw] lg:max-w-[38vw] text-left pointer-events-none transition-opacity duration-200 ease-out z-20"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="block leading-[1.08] lg:leading-[5.2vw] tracking-tight font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-[2.5rem] sm:text-[3rem] md:text-[4.2vw] lg:text-[4.8vw] break-words text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[2]}
                progress={phrase3Progress}
                targetColor="#FFFFFF"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 3: DIMA FINANCE Big Typography Parallax - Center & Criss-Cross */}
          {/* ------------------------------------------------------------------- */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center select-none px-4"
            style={{ opacity: dimaOpacity }}
          >
            <motion.div style={{ x: dimaX }}>
              <h1
                className="relative -left-[0.8vw] lg:-left-[1vw] leading-[0.85] tracking-tight font-normal text-[31vw] md:text-[26vw] lg:text-[21.2vw] drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#F4F4F5', letterSpacing: '-0.02em' }}
              >
                DIMA
              </h1>
            </motion.div>

            <motion.div style={{ x: financeX }} className="mt-1 md:mt-2">
              <h1
                className="leading-[0.85] tracking-tight font-normal text-[17.6vw] md:text-[14.7vw] lg:text-[11.95vw] drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                style={{
                  fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif",
                  color: '#F4F4F5',
                  letterSpacing: '0em',
                  fontWeight: 400,
                  WebkitTextStroke: '0.18vw #F4F4F5',
                  paintOrder: 'stroke fill',
                }}
              >
                FINANCE
              </h1>
            </motion.div>
          </motion.div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 4: The Hero Text (Section 1) - Anchored to Hourglass Video    */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[4] = el; }}
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out z-20"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            {/* 1. Title Block - Kiri Atas dengan fading keluar bersamaan dengan paragraf 2 */}
            <motion.div
              style={{
                opacity: heroTitleOpacity,
                y: heroTitleY,
              }}
              className="absolute left-8 sm:left-12 lg:left-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[75%] lg:w-[46vw] lg:max-w-[42vw] text-left pointer-events-auto flex flex-col space-y-3 sm:space-y-4 lg:space-y-[0.8vh]"
            >
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.2vw] xl:text-[2.45vw] lg:leading-[2.5vw] xl:leading-[2.75vw] text-[#030035] font-normal leading-[1.12] tracking-tight">
                <HybridRevealText
                  text={HERO_STAGE_DATA.title}
                  progress={heroTitleProgress}
                  className="inline break-words text-[#030035]"
                  targetColor="#030035"
                />
              </h2>

              {/* Subtitle */}
              {HERO_STAGE_DATA.subtitle && (
                <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[1.0vw] xl:text-[1.08vw] lg:leading-[1.5vw] xl:leading-[1.6vw] text-[#030035] leading-relaxed tracking-[-0.01em]">
                  {HERO_STAGE_DATA.subtitle}
                </p>
              )}
            </motion.div>

            {/* 2. Description Block - Kanan Bawah dengan padding persis sama seperti 3 frasa pembuka & Rata Kanan (text-right) */}
            <div className="absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[75%] lg:w-[48vw] lg:max-w-[42vw] text-right flex flex-col items-end pointer-events-auto">
              <div className="relative w-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[20.5vh]">
                {/* Session 1 / Part 1 */}
                <motion.div
                  style={{
                    opacity: heroP0Opacity,
                    y: heroP0Y,
                    filter: heroP0Filter,
                  }}
                  className="absolute inset-x-0 bottom-0 pointer-events-none flex flex-col items-end"
                >
                  <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[1.0vw] xl:text-[1.08vw] lg:leading-[1.5vw] xl:leading-[1.6vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-right">
                    {HERO_STAGE_DATA.body[0]}
                  </p>
                </motion.div>

                {/* Session 2 / Part 2 */}
                <motion.div
                  style={{
                    opacity: heroP1Opacity,
                    y: heroP1Y,
                    filter: heroP1Filter,
                  }}
                  className="absolute inset-x-0 bottom-0 pointer-events-none flex flex-col items-end"
                >
                  <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[1.0vw] xl:text-[1.08vw] lg:leading-[1.5vw] xl:leading-[1.6vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-right">
                    {HERO_STAGE_DATA.body[1]}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASES 5 - 8: Sectors 1 to 4 (Modelo, Proceso, Filosofia, Productos) */}
          {/* ------------------------------------------------------------------- */}
          {[
            {
              sec: sector1,
              phaseIdx: 5,
              titleProgress: sector1TitleProgress,
              paragraphs: [
                { opacity: s1p0Opacity, y: s1p0Y, filter: s1p0Filter },
                { opacity: s1p1Opacity, y: s1p1Y, filter: s1p1Filter },
              ],
            },
            {
              sec: sector2,
              phaseIdx: 6,
              titleProgress: sector2TitleProgress,
              paragraphs: [
                { opacity: s2p0Opacity, y: s2p0Y, filter: s2p0Filter },
                { opacity: s2p1Opacity, y: s2p1Y, filter: s2p1Filter },
                { opacity: s2p2Opacity, y: s2p2Y, filter: s2p2Filter },
              ],
            },
            {
              sec: sector3,
              phaseIdx: 7,
              titleProgress: sector3TitleProgress,
              paragraphs: [
                { opacity: s3p0Opacity, y: s3p0Y, filter: s3p0Filter },
                { opacity: s3p1Opacity, y: s3p1Y, filter: s3p1Filter },
                { opacity: s3p2Opacity, y: s3p2Y, filter: s3p2Filter },
                { opacity: s3p3Opacity, y: s3p3Y, filter: s3p3Filter },
              ],
            },
            {
              sec: sector4,
              phaseIdx: 8,
              titleProgress: sector4TitleProgress,
              paragraphs: [
                { opacity: s4p0Opacity, y: s4p0Y, filter: s4p0Filter },
                { opacity: s4p1Opacity, y: s4p1Y, filter: s4p1Filter },
              ],
            },
          ].map(({ sec, phaseIdx, titleProgress: secTitleProgress, paragraphs }) => {
            const layout = SECTOR_LAYOUTS[sec.id] || SECTOR_LAYOUTS.modelo;

            return (
              <div
                key={sec.id}
                ref={(el) => { phaseRefs.current[phaseIdx] = el; }}
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out z-20"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                {/* Overlay lightgray di sisi kiri bawah khusus Sector 2 (Proceso) - tinggi pertengahan yang pas & pekat menaungi teks */}
                {sec.id === 'proceso' && (
                  <div
                    className="absolute bottom-0 left-0 w-[96%] sm:w-[90%] md:w-[80%] lg:w-[58vw] xl:w-[57vw] max-w-4xl lg:max-w-[62vw] h-[360px] sm:h-[410px] md:h-[460px] lg:h-[48vh] xl:h-[50vh] pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    {/* Lapisan 1: Kabut atmosfer terluar melebur sangat lembut ke atas & ke arah tengah */}
                    <div
                      className="absolute -top-12 -left-12 w-[118%] h-[122%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 106% 96% at 0% 100%, rgba(244, 244, 246, 0.90) 0%, rgba(244, 244, 246, 0.72) 40%, rgba(244, 244, 246, 0.38) 70%, rgba(244, 244, 246, 0.12) 90%, transparent 100%)',
                        filter: 'blur(44px)',
                      }}
                    />
                    {/* Lapisan 2: Kabut medium transisi halus */}
                    <div
                      className="absolute -top-6 -left-6 w-[108%] h-[112%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 96% 86% at 0% 100%, rgba(240, 240, 244, 0.93) 0%, rgba(240, 240, 244, 0.80) 46%, rgba(240, 240, 244, 0.40) 76%, transparent 100%)',
                        filter: 'blur(28px)',
                      }}
                    />
                    {/* Lapisan 3: Inti pekat di pojok dan area teks agar teks sangat jelas & terbaca kontras */}
                    <div
                      className="absolute bottom-0 left-0 w-[94%] h-[94%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 88% 78% at 0% 100%, rgba(232, 232, 238, 0.97) 0%, rgba(236, 236, 242, 0.92) 48%, rgba(240, 240, 245, 0.55) 78%, transparent 100%)',
                        filter: 'blur(15px)',
                      }}
                    />
                  </div>
                )}

                {/* Overlay lightgray di sisi kanan bawah khusus Sector 2 (Proceso) - tinggi pertengahan yang pas & pekat menaungi judul */}
                {sec.id === 'proceso' && (
                  <div
                    className="absolute bottom-0 right-0 w-[96%] sm:w-[90%] md:w-[80%] lg:w-[58vw] xl:w-[57vw] max-w-4xl lg:max-w-[62vw] h-[360px] sm:h-[410px] md:h-[460px] lg:h-[48vh] xl:h-[50vh] pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    {/* Lapisan 1: Kabut atmosfer terluar melebur sangat lembut ke atas & ke arah tengah */}
                    <div
                      className="absolute -top-12 -right-12 w-[118%] h-[122%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 106% 96% at 100% 100%, rgba(244, 244, 246, 0.90) 0%, rgba(244, 244, 246, 0.72) 40%, rgba(244, 244, 246, 0.38) 70%, rgba(244, 244, 246, 0.12) 90%, transparent 100%)',
                        filter: 'blur(44px)',
                      }}
                    />
                    {/* Lapisan 2: Kabut medium transisi halus */}
                    <div
                      className="absolute -top-6 -right-6 w-[108%] h-[112%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 96% 86% at 100% 100%, rgba(240, 240, 244, 0.93) 0%, rgba(240, 240, 244, 0.80) 46%, rgba(240, 240, 244, 0.40) 76%, transparent 100%)',
                        filter: 'blur(28px)',
                      }}
                    />
                    {/* Lapisan 3: Inti pekat di pojok dan area judul agar judul & CTA sangat jelas & terbaca kontras */}
                    <div
                      className="absolute bottom-0 right-0 w-[94%] h-[94%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 88% 78% at 100% 100%, rgba(232, 232, 238, 0.97) 0%, rgba(236, 236, 242, 0.92) 48%, rgba(240, 240, 245, 0.55) 78%, transparent 100%)',
                        filter: 'blur(15px)',
                      }}
                    />
                  </div>
                )}

                {/* Overlay lightgray di sisi kanan atas khusus Sector 3 (Filosofia) - pekat di pojok, makin ke pojok makin pekat, menaungi judul dengan jelas */}
                {sec.id === 'filosofia' && (
                  <div
                    className="absolute top-0 right-0 w-[96%] sm:w-[90%] md:w-[80%] lg:w-[58vw] xl:w-[58vw] max-w-4xl lg:max-w-[62vw] h-[380px] sm:h-[430px] md:h-[480px] lg:h-[49vh] xl:h-[52vh] pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    {/* Lapisan 1: Kabut atmosfer terluar melebur sangat lembut ke arah bawah & tengah */}
                    <div
                      className="absolute -top-12 -right-12 w-[118%] h-[122%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 105% 95% at 100% 0%, rgba(244, 244, 246, 0.75) 0%, rgba(244, 244, 246, 0.55) 35%, rgba(244, 244, 246, 0.28) 65%, rgba(244, 244, 246, 0.08) 85%, transparent 100%)',
                        filter: 'blur(44px)',
                      }}
                    />
                    {/* Lapisan 2: Kabut medium transisi halus */}
                    <div
                      className="absolute -top-6 -right-6 w-[108%] h-[112%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 95% 85% at 100% 0%, rgba(240, 240, 244, 0.88) 0%, rgba(240, 240, 244, 0.65) 30%, rgba(240, 240, 244, 0.35) 60%, transparent 88%)',
                        filter: 'blur(28px)',
                      }}
                    />
                    {/* Lapisan 3: Inti pekat di sudut pojok kanan atas, makin ke pojok makin pekat */}
                    <div
                      className="absolute top-0 right-0 w-[92%] h-[92%] pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 80% 72% at 100% 0%, rgba(232, 232, 238, 0.96) 0%, rgba(235, 235, 240, 0.85) 20%, rgba(238, 238, 244, 0.50) 45%, rgba(240, 240, 245, 0.20) 70%, transparent 100%)',
                        filter: 'blur(16px)',
                      }}
                    />
                  </div>
                )}

                {/* Title Block - Stays visible throughout the sector until next section */}
                <div className={`${layout.titlePosition} ${layout.titleAlign} pointer-events-auto flex flex-col space-y-4 sm:space-y-6 lg:space-y-[1.2vh] z-10`}>
                  <h3 className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.2vw] xl:text-[2.45vw] lg:leading-[2.5vw] xl:leading-[2.75vw] text-[#030035] font-normal leading-[1.12] tracking-tight ${layout.titleAlign.includes('text-center') ? 'text-center' : ''}`}>
                    <HybridRevealText
                      text={sec.title}
                      progress={secTitleProgress}
                      className="inline break-words text-[#030035]"
                      targetColor="#030035"
                    />
                  </h3>

                  {/* CTA Link */}
                  <div className="pt-1 lg:pt-[0.4vh]">
                    <Link
                      to={sec.linkTo}
                      className="inline-flex items-center justify-center px-6 py-2.5 lg:px-[1.25vw] lg:py-[0.9vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs lg:text-[0.68vw] lg:leading-[1vw] tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
                    >
                      {sec.linkText}
                    </Link>
                  </div>
                </div>

                {/* Description Paragraphs - Cinematic reveal (intact text with opacity, y-drift, blur dissolve) */}
                {sec.body.map((paragraphText, pIdx) => {
                  const pConfig = paragraphs[pIdx];
                  if (!pConfig) return null;
                  const specificPos = layout.descPositions[pIdx] || layout.descPositions[0];
                  const specificAlign = layout.descAligns[pIdx] || layout.descAligns[0];
                  const isRight = specificAlign.includes('text-right');
                  const isCenter = specificAlign.includes('text-center');
                  const alignClass = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left';
                  const isModeloP1 = sec.id === 'modelo' && pIdx === 1;
                  const isProductos = sec.id === 'productos';

                  return (
                    <Fragment key={pIdx}>
                      {/* Overlay lightgray khusus Sector 1 Deskripsi Kedua - tinggi pertengahan yang pas & pekat menaungi teks deskripsi 2 */}
                      {isModeloP1 && (
                        <motion.div
                          style={{ opacity: pConfig.opacity }}
                          className="absolute bottom-0 right-0 w-[96%] sm:w-[90%] md:w-[80%] lg:w-[58vw] xl:w-[57vw] max-w-4xl lg:max-w-[62vw] h-[360px] sm:h-[410px] md:h-[460px] lg:h-[48vh] xl:h-[50vh] pointer-events-none z-0"
                          aria-hidden="true"
                        >
                          {/* Lapisan 1: Kabut atmosfer terluar melebur sangat lembut ke atas teks & ke arah tengah */}
                          <div
                            className="absolute -top-12 -right-12 w-[118%] h-[122%] pointer-events-none"
                            style={{
                              background: 'radial-gradient(ellipse 106% 96% at 100% 100%, rgba(244, 244, 246, 0.90) 0%, rgba(244, 244, 246, 0.72) 40%, rgba(244, 244, 246, 0.38) 70%, rgba(244, 244, 246, 0.12) 90%, transparent 100%)',
                              filter: 'blur(44px)',
                            }}
                          />
                          {/* Lapisan 2: Kabut medium transisi halus */}
                          <div
                            className="absolute -top-6 -right-6 w-[108%] h-[112%] pointer-events-none"
                            style={{
                              background: 'radial-gradient(ellipse 96% 86% at 100% 100%, rgba(240, 240, 244, 0.93) 0%, rgba(240, 240, 244, 0.80) 46%, rgba(240, 240, 244, 0.40) 76%, transparent 100%)',
                              filter: 'blur(28px)',
                            }}
                          />
                          {/* Lapisan 3: Inti pekat di pojok dan area teks agar teks deskripsi kedua sangat jelas & terbaca kontras */}
                          <div
                            className="absolute bottom-0 right-0 w-[94%] h-[94%] pointer-events-none"
                            style={{
                              background: 'radial-gradient(ellipse 88% 78% at 100% 100%, rgba(232, 232, 238, 0.97) 0%, rgba(236, 236, 242, 0.92) 48%, rgba(240, 240, 245, 0.55) 78%, transparent 100%)',
                              filter: 'blur(15px)',
                            }}
                          />
                        </motion.div>
                      )}

                      <motion.div
                        style={{
                          opacity: pConfig.opacity,
                          y: pConfig.y,
                          filter: pConfig.filter,
                        }}
                        className={`${specificPos} ${specificAlign} pointer-events-none flex flex-col z-10`}
                      >
                        {isProductos ? (
                          pIdx === 0 ? (
                            <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[0.95vw] xl:text-[1.03vw] lg:leading-[1.45vw] xl:leading-[1.55vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center [text-wrap:balance] flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-[0.5vh]">
                              <span className="block max-w-md sm:max-w-lg lg:max-w-[34vw] text-center">
                                Parte de nuestra filosofía operativa, y como política organizacional, promovemos la educación financiera tanto interna y como externa.
                              </span>
                              <span className="block max-w-lg sm:max-w-xl lg:max-w-[42vw] text-center">
                                La confusión y falta de entendimiento sobre los productos financieros lleva a subestimar las variables que determinan su viabilidad,
                              </span>
                              <span className="block max-w-xl sm:max-w-2xl lg:max-w-[48vw] text-center">
                                no solo afectando la planeación estratégica y la toma de decisiones financieras internas de alto impacto, sino que genera un riesgo de insolvencia irreversible al adquirir financiamiento.
                              </span>
                            </p>
                          ) : (
                            <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[0.95vw] xl:text-[1.03vw] lg:leading-[1.45vw] xl:leading-[1.55vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center [text-wrap:balance] flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-[0.5vh]">
                              <span className="block max-w-sm sm:max-w-md lg:max-w-[32vw] text-center">
                                Por ello, exponemos los elementos que componen un crédito.
                              </span>
                              <span className="block max-w-lg sm:max-w-xl lg:max-w-[38vw] text-center">
                                La solidez de una entidad no depende únicamente de tener acceso al capital,
                              </span>
                              <span className="block max-w-lg sm:max-w-xl lg:max-w-[38vw] text-center">
                                sino del entendimiento y la arquitectura con la que este se integra:
                              </span>
                              <span className="block max-w-xl sm:max-w-2xl lg:max-w-[42vw] text-center font-semibold text-[#030035]">
                                la Solución correcta, ejecutada a través del Instrumento idóneo y blindada bajo la Estructura precisa.
                              </span>
                            </p>
                          )
                        ) : (
                          <p className={`font-body font-medium text-sm sm:text-base md:text-lg lg:text-[1.0vw] xl:text-[1.08vw] lg:leading-[1.5vw] xl:leading-[1.6vw] text-[#030035] leading-relaxed tracking-[-0.01em] ${alignClass}`}>
                            {paragraphText}
                          </p>
                        )}
                      </motion.div>
                    </Fragment>
                  );
                })}

                {/* Architecture Diagram (Sector 4 only) */}
                {sec.hasDiagram && (
                  <div className="absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-8 sm:bottom-10 lg:bottom-[4.5vh] pointer-events-auto flex flex-col items-end z-20">
                    {showDiagram && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="mb-3 w-full max-w-[640px] lg:max-w-[34vw]"
                      >
                        <CreditArchitectureDiagram />
                      </motion.div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowDiagram((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-[1.2vw] lg:py-[0.85vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 text-xs lg:text-[0.68vw] font-mono tracking-wider text-[#030035] uppercase shadow-sm transition-all duration-200"
                    >
                      <span>{showDiagram ? 'Ocultar Arquitectura' : 'Ver Arquitectura del Crédito'}</span>
                      <span className="text-[#E5997B] font-bold text-sm leading-none">{showDiagram ? '✕' : '+'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 9: Sector 5 - Servicios & CTA                                */}
          {/* ------------------------------------------------------------------- */}
          {(() => {
            const sec = sector5;
            const layout = SECTOR_LAYOUTS.servicios;

            return (
              <div
                ref={(el) => { phaseRefs.current[9] = el; }}
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out z-20"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                {/* Paragraf Pertama: Di Kanan Atas - text-right, items-end, reveal per-huruf */}
                <motion.div
                  style={{
                    opacity: s5p0Opacity,
                    y: s5p0Y,
                    filter: s5p0Filter,
                  }}
                  className={`${layout.descPositions[0]} ${layout.descAligns[0]} pointer-events-none flex flex-col`}
                >
                  <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[1.0vw] xl:text-[1.08vw] lg:leading-[1.5vw] xl:leading-[1.6vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-right">
                    <HybridRevealText
                      text={sec.body[0]}
                      progress={s5p0Progress}
                      targetColor="#030035"
                      className="inline text-[#030035]"
                    />
                  </p>
                </motion.div>

                {/* Paragraf Kedua: Di Kiri Tengah - text-left, items-start, reveal per-huruf saat frame terkunci */}
                <motion.div
                  style={{
                    opacity: s5p1Opacity,
                    y: s5p1Y,
                    filter: s5p1Filter,
                  }}
                  className={`${layout.descPositions[1]} ${layout.descAligns[1]} pointer-events-none flex flex-col`}
                >
                  <p className="font-body font-medium text-sm sm:text-base md:text-lg lg:text-[1.0vw] xl:text-[1.08vw] lg:leading-[1.5vw] xl:leading-[1.6vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-left">
                    <HybridRevealText
                      text={sec.body[1]}
                      progress={s5p1Progress}
                      targetColor="#030035"
                      className="inline text-[#030035]"
                    />
                  </p>
                </motion.div>

                {/* Bottom Center Block: Judul & Tombol CTA */}
                <div className={`${layout.titlePosition} ${layout.titleAlign} pointer-events-auto flex flex-col items-center space-y-2.5 sm:space-y-3.5 lg:space-y-[0.8vh]`}>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.2vw] xl:text-[2.45vw] lg:leading-[2.5vw] xl:leading-[2.75vw] text-[#030035] font-normal leading-[1.12] tracking-tight text-center">
                    <HybridRevealText
                      text={sec.title}
                      progress={sector5TitleProgress}
                      className="inline break-words text-[#030035]"
                      targetColor="#030035"
                    />
                  </h3>

                  {/* Tombol CTA */}
                  <div className="pt-1 lg:pt-[0.4vh] flex justify-center pointer-events-auto">
                    <Link
                      to={sec.linkTo}
                      className="inline-flex items-center justify-center px-6 py-2.5 lg:px-[1.25vw] lg:py-[0.9vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs lg:text-[0.68vw] lg:leading-[1vw] tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
                    >
                      {sec.linkText}
                    </Link>
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
