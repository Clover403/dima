import { useState, useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { NEW_HOME_SECTORS } from './newHomeData';
import MoneyFlow3D from './MoneyFlow3D';
import { getLenis } from '../../hooks/useLenis';
import {
  HeroSection,
  OpeningPhrasesSection,
  Sector1ModeloSection,
  Sector2ProcesoSection,
  Sector3FilosofiaSection,
  Sector4ProductosSection,
  Sector5ServiciosSection,
} from './UnifiedStoryStages';

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

// 8 Distinct Narrative Phases spanning scroll progress 0.00 to 1.00
const PHASES: PhaseConfig[] = [
  // 0: Phrase 1 (0.015 to 0.046) - Video 1 (Kanan Atas)
  { id: 'phrase-1', start: 0.015, fadeIn: 0.020, fadeOut: 0.042, end: 0.046 },
  // 1: Phrase 2 (0.048 to 0.077) - Video 2 (Kanan Atas/Tengah)
  { id: 'phrase-2', start: 0.048, fadeIn: 0.054, fadeOut: 0.073, end: 0.077 },
  // 2: Phrase 3 (0.079 to 0.128) - Video 3 & 4 (Kanan Bawah - 3 Frasa Lengkap)
  { id: 'phrase-3', start: 0.079, fadeIn: 0.086, fadeOut: 0.120, end: 0.128 },
  // 3: Sector 1 - Agroindustria (0.136 to 0.280) - Overlay muncul duluan di 0.136, teks diakhirkan di 0.164, akhir tetap 0.280
  { id: 'modelo', start: 0.136, fadeIn: 0.150, fadeOut: 0.274, end: 0.280 },
  // 4: Sector 2 - Construcción & Real Estate Fused (0.388 to 0.482) - Videos 7, 8, 9
  { id: 'proceso', start: 0.388, fadeIn: 0.400, fadeOut: 0.478, end: 0.482 },
  // 5: Sector 3 - Filosofía (Energía) (0.574 to 0.682) - Video 10
  { id: 'filosofia', start: 0.574, fadeIn: 0.580, fadeOut: 0.678, end: 0.682 },
  // 6: Sector 4 - Comercio & Retail (0.730 to 0.812) - Durasi akhir dikurangi sedikit
  { id: 'productos', start: 0.730, fadeIn: 0.738, fadeOut: 0.808, end: 0.812 },
  // 7: Sector 5 - Logística & Servicios (0.855 to 0.985) - Videos 13 & 14
  { id: 'servicios', start: 0.855, fadeIn: 0.864, fadeOut: 0.982, end: 0.985 },
];

function calcPhaseOpacity(p: number, cfg: PhaseConfig): number {
  if (p < cfg.start || p > cfg.end) return 0;
  if (p >= cfg.fadeIn && p <= cfg.fadeOut) return 1;
  if (p < cfg.fadeIn) return (p - cfg.start) / (cfg.fadeIn - cfg.start);
  return (cfg.end - p) / (cfg.end - cfg.fadeOut);
}

const UnifiedStoryStage = forwardRef<UnifiedStoryStageHandle, UnifiedStoryStageProps>(
  ({ onProgressUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageViewportRef = useRef<HTMLDivElement>(null);
    const initialLogoRef = useRef<HTMLDivElement>(null);
    const openingOverlayRef = useRef<HTMLDivElement>(null);
    const navyOverlayRef = useRef<HTMLDivElement>(null);
    const heroMoneyFlowRef = useRef<HTMLDivElement>(null);
    const scrollPromptRef = useRef<HTMLDivElement>(null);
    const phaseRefs = useRef<(HTMLDivElement | null)[]>(new Array(PHASES.length).fill(null));
    const heroTextColRef = useRef<HTMLDivElement>(null);
    const [heroLogoHeight, setHeroLogoHeight] = useState<number | undefined>(undefined);
    const lastProgressRef = useRef<number>(-1);

    // Central progress applicator: executes 120 FPS DOM updates for narrative texts and sends data to canvas
    const applyProgress = useCallback((rawP: number) => {
      // Critical guard: when user is at the top of the window, strictly lock progress to 0.000
      const p = (typeof window !== 'undefined' && window.scrollY <= 10) ? 0 : rawP;

      if (Math.abs(p - lastProgressRef.current) < 0.00003 && p !== 0) return;
      lastProgressRef.current = p;

      // 1. Update each phase layer's opacity & visibility directly
      // Pre-warm sectors (i >= 3) continuously with min opacity 0.001 and visibility: visible so Chromium
      // keeps backdrop fog/blur layers pre-rasterized in GPU VRAM without any stutter/hitching before and as they appear.
      for (let i = 0; i < PHASES.length; i++) {
        const el = phaseRefs.current[i];
        if (!el) continue;
        const cfg = PHASES[i];
        const op = calcPhaseOpacity(p, cfg);

        if (i < 3) {
          // Opening phrases (Phase 0, 1, 2)
          const isNearPhase = p >= cfg.start - 0.08 && p <= cfg.end + 0.08;
          el.style.opacity = `${op.toFixed(3)}`;
          el.style.visibility = isNearPhase ? 'visible' : 'hidden';
          el.style.pointerEvents = op > 0.1 ? 'auto' : 'none';
        } else {
          // Sectors 1-5 (Phase 3-7):
          // Pre-warm with baseline 0.001 opacity and visibility 'visible' ONLY when approaching or within the phase
          // (window 0.05 before start and after end). Outside this window, set hidden so GPU doesn't composite 40 blur layers simultaneously!
          const isNearSector = p >= cfg.start - 0.05 && p <= cfg.end + 0.05;
          if (isNearSector) {
            const baseOp = Math.max(0.001, op);
            el.style.opacity = `${baseOp.toFixed(3)}`;
            el.style.visibility = 'visible';
            el.style.pointerEvents = op > 0.1 ? 'auto' : 'none';
          } else {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        }
      }

      // 2. Stage container fade out at the end when transitioning to CTA form
      if (stageViewportRef.current) {
        const stageOp = p >= 0.985 ? Math.max(0, 1 - (p - 0.985) / 0.015) : 1;
        stageViewportRef.current.style.opacity = `${stageOp.toFixed(3)}`;
        stageViewportRef.current.style.visibility = stageOp > 0.005 ? 'visible' : 'hidden';
      }

      // 3. Initial hero stage: Tetap 100% solid navy saat di awal (buffer p <= 0.005), lalu fade out halus ke 0 di p = 0.016
      let logoOp = 1;
      if (p <= 0.005) {
        logoOp = 1;
      } else if (p < 0.016) {
        logoOp = 1 - (p - 0.005) / (0.016 - 0.005);
      } else {
        logoOp = 0;
      }

      if (initialLogoRef.current) {
        initialLogoRef.current.style.opacity = `${logoOp.toFixed(3)}`;
        initialLogoRef.current.style.visibility = logoOp > 0.005 ? 'visible' : 'hidden';
      }

      // Currency animation / MoneyFlow (dinonaktifkan sementara, kode tetap utuh)
      if (heroMoneyFlowRef.current) {
        heroMoneyFlowRef.current.style.opacity = '0';
        heroMoneyFlowRef.current.style.visibility = 'hidden';
      }

      // 3a. Scroll prompt ("Desliza para explorar"): Fades out as soon as the user starts scrolling
      if (scrollPromptRef.current) {
        let promptOp = 0;
        let promptY = 0;
        const fadeStart = 0.0005;
        const fadeEnd = 0.004;

        if (p <= fadeStart) {
          promptOp = 1;
          promptY = 0;
        } else if (p < fadeEnd) {
          const t = (p - fadeStart) / (fadeEnd - fadeStart);
          const smooth = t * t * (3 - 2 * t);
          promptOp = 1 - smooth;
          promptY = smooth * 8; // Geser turun sedikit secara organik saat memudar
        } else {
          promptOp = 0;
          promptY = 8;
        }
        scrollPromptRef.current.style.opacity = `${promptOp.toFixed(3)}`;
        scrollPromptRef.current.style.transform = `translateY(${promptY.toFixed(1)}px)`;
        scrollPromptRef.current.style.visibility = promptOp > 0.005 ? 'visible' : 'hidden';
      }

      // 3b. Navbar logo: Muncul halus secara proporsional HANYA ketika logo di hero mulai memudar (p > 0.005 s/d 0.016)
      const navLogoSlot = document.getElementById('navbar-logo-slot');
      if (navLogoSlot) {
        let navLogoOp = 0;
        if (p <= 0.005) {
          navLogoOp = 0;
        } else if (p < 0.016) {
          navLogoOp = (p - 0.005) / (0.016 - 0.005);
        } else {
          navLogoOp = 1;
        }
        navLogoSlot.style.opacity = `${navLogoOp.toFixed(3)}`;
        navLogoSlot.style.pointerEvents = navLogoOp > 0.5 ? 'auto' : 'none';
      }

      // 4. Navy & Black Overlay transition:
      // - Video 1 (Hero & Phrase 1, p < 0.046): Overlay Navy (#030035, opacity 0.80) tetap aktif solid
      // - Video 2 (Phrase 2, 0.046 <= p <= 0.077): Transisi pergantian overlay dari Navy ke Hitam
      // - Video 3 & 4 (Phrase 3, 0.077 < p <= 0.118): Overlay Hitam menetap di 0.65, lalu fade out sebelum Sektor 1 (0.118 s/d 0.138)
      if (navyOverlayRef.current) {
        let navyOp = 0;
        if (p < 0.046) {
          navyOp = 0.80;
        } else if (p <= 0.077) {
          const t = (p - 0.046) / (0.077 - 0.046);
          const smooth = t * t * (3 - 2 * t);
          navyOp = 0.80 * (1 - smooth);
        } else {
          navyOp = 0;
        }
        navyOverlayRef.current.style.opacity = `${navyOp.toFixed(3)}`;
        navyOverlayRef.current.style.visibility = navyOp > 0.005 ? 'visible' : 'hidden';
      }

      if (openingOverlayRef.current) {
        let blackOp = 0;
        const targetOp = 0.65;
        if (p < 0.046) {
          blackOp = 0;
        } else if (p <= 0.077) {
          // Transisi dari navy ke hitam di Video 2
          const t = (p - 0.046) / (0.077 - 0.046);
          const smooth = t * t * (3 - 2 * t);
          blackOp = targetOp * smooth;
        } else if (p <= 0.110) {
          blackOp = targetOp;
        } else if (p < 0.124) {
          // Fade out selesai di 0.124 agar hitam hilang total sebelum transisi ke overlay putih Sektor 1
          const t = (p - 0.110) / (0.124 - 0.110);
          const smooth = t * t * (3 - 2 * t);
          blackOp = targetOp * (1 - smooth);
        } else {
          blackOp = 0;
        }
        openingOverlayRef.current.style.opacity = `${blackOp.toFixed(3)}`;
        openingOverlayRef.current.style.visibility = blackOp > 0.005 ? 'visible' : 'hidden';
      }

      if (!onProgressUpdate) return;

      let activeVid = 1;
      let vidProg = 0.001;
      const shiftX = 0;
      const overlayOp = 0;

      // 14 Videos Sequence (Unified narrative mapping):
      // Hero (0.000 to 0.160):
      // - Langsung ke Video 2 (video2.mp4 - navy-gray transisi warna) melintasi Hero & Phrase 1 + 2
      // - 0.077 to 0.090: Video 3 (video3.mp4 - Logo to Hourglass di latar putih)
      // - 0.090 to 0.160: Video 4 (video4.mp4 - Hourglass flow & fill, durasi normal penuh tidak dipercepat)
      if (p === 0) {
        activeVid = 2; // Langsung ke Video 2 (video 1 dilewati, kode tetap ada)
        vidProg = 0;
      } else if (p < 0.015) {
        activeVid = 2; // Mulai Video 2 saat scroll dimulai
        vidProg = 0.001;
      } else if (p < 0.077) {
        activeVid = 2; // video2.mp4 melintasi Phrase 1 & Phrase 2
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.015) / (0.077 - 0.015)));
      } else if (p < 0.077) {
        activeVid = 2; // fallback safety
        vidProg = 0.999;
      } else if (p < 0.090) {
        activeVid = 3; // video3.mp4 (Logo to Hourglass)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.077) / 0.013));
      } else if (p < 0.160) {
        activeVid = 4; // video4.mp4 (Hourglass flow & fill - normal speed)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.090) / 0.070));
      } else if (p < 0.375) {
        // Sector 1: Modelo (Agroindustria & Escala Productiva)
        if (p < 0.265) {
          activeVid = 5; // video5.mp4 (Agro bulir gandum)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.160) / (0.265 - 0.160)));
        } else {
          activeVid = 6; // video6.mp4 (Agro traktor panen)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.265) / (0.375 - 0.265)));
        }
      } else if (p < 0.585) {
        // Sector 2: Proceso (Construcción & Fused Real Estate - Videos 7, 8, 9)
        if (p < 0.440) {
          activeVid = 7; // video7.mp4 (Excavator pondasi)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.375) / 0.065));
        } else if (p < 0.505) {
          activeVid = 8; // video8.mp4 (Rangka luar gedung)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.440) / 0.065));
        } else {
          activeVid = 9; // video9.mp4 (Gedung & solar panel)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.505) / 0.080));
        }
      } else if (p < 0.700) {
        // Sector 3: Filosofía (Energía & Fundamentos Macroeconómicos - Video 10)
        activeVid = 10; // video10.mp4 (Turbinas de viento y solar)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.585) / 0.115));
      } else if (p < 0.830) {
        // Sector 4: Productos (Comercio & Mercados Globales - Videos 11, 12)
        if (p < 0.765) {
          activeVid = 11; // video11.mp4 (Logistik pelabuhan docks)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.700) / 0.065));
        } else {
          activeVid = 12; // video12.mp4 (Lorong rak supermarket retail)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.765) / 0.065));
        }
      } else {
        // Sector 5: Servicios (Logística & Distribución Global - Videos 13, 14)
        if (p < 0.900) {
          activeVid = 13; // video13.mp4 (Logistik warehouse interior)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.830) / 0.070));
        } else {
          activeVid = 14; // video14.mp4 (Logistik armada truk kontainer)
          const lockFrameProg = 0.93;
          if (p < 0.960) {
            vidProg = Math.max(0.001, Math.min(lockFrameProg, ((p - 0.900) / 0.060) * lockFrameProg));
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

    // Measure scroll progress across 4200vh height
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start start', 'end end'],
    });

    // Initial hero stage opacity: solid at top (p <= 0.005), smoothly fades out as scroll approaches 0.016
    const initialLogoOpacity = useTransform(scrollYProgress, [0.000, 0.005, 0.016], [1, 1, 0]);

    // Reveal progress MotionValues for the 3 narrative phrases (reveals letter-by-letter based on scroll)
    const phrase1Progress = useTransform(scrollYProgress, [0.016, 0.027], [0, 1]);
    const phrase2Progress = useTransform(scrollYProgress, [0.050, 0.065], [0, 1]);
    const phrase3Progress = useTransform(scrollYProgress, [0.080, 0.114], [0, 1]);

    // Sector 1: Modelo (0.136 to 0.280 - Overlay muncul duluan di 0.136, teks diakhirkan di 0.164, akhir tetap 0.254 - 0.280)
    // 1. Single overlay mencakup atmosferik luar + penopang teks dalam muncul duluan (0.136 -> 0.146 -> 0.158), hilang di (0.268 - 0.280)
    // Baseline 0.001 keeps GPU raster tile hot and cached in memory across the entire narrative with 0 raster stalls.
    const sector1OverlayOpacity = useTransform(
      scrollYProgress,
      [0.136, 0.146, 0.158, 0.268, 0.280],
      [0.001, 0.40, 1, 1, 0.001]
    );
    // 2. Teks muncul lebih diakhirkan setelah overlay siap (0.164 - 0.176), akhir tetap di (0.254 - 0.266 tetap persis awal)
    const sector1TextOpacity = useTransform(scrollYProgress, [0.164, 0.176, 0.254, 0.266], [0, 1, 1, 0]);
    const sector1DescOpacity = sector1TextOpacity;
    const sector1TitleOpacity = sector1TextOpacity;
    const sector1TitleProgress = useTransform(scrollYProgress, [0.164, 0.176], [0, 1]);
    const sector1ContentY = useTransform(scrollYProgress, [0.160, 0.176, 0.254, 0.266], [14, 0, 0, -8]);

    // Sector 2: Proceso (0.388 to 0.482)
    // 1. Overlay muncul pertama kali (0.388 - 0.402), hilang terakhir setelah teks (0.468 - 0.482)
    const sector2OverlayOpacity = useTransform(scrollYProgress, [0.388, 0.402, 0.468, 0.482], [0.001, 1, 1, 0.001]);
    // 2. Teks muncul kedua setelah overlay (0.404 - 0.418), hilang pertama kali (0.452 - 0.466)
    const sector2TextOpacity = useTransform(scrollYProgress, [0.404, 0.418, 0.452, 0.466], [0, 1, 1, 0]);
    const sector2DescOpacity = sector2TextOpacity;
    const sector2TitleOpacity = sector2TextOpacity;
    const sector2TitleProgress = useTransform(scrollYProgress, [0.404, 0.418], [0, 1]);
    const sector2ContentY = useTransform(scrollYProgress, [0.402, 0.418, 0.452, 0.466], [14, 0, 0, -8]);

    // Sector 3: Filosofia (0.574 to 0.682)
    // 1. Overlay muncul pertama kali (0.574 - 0.584), hilang lebih awal (0.648 - 0.660)
    const sector3OverlayOpacity = useTransform(scrollYProgress, [0.574, 0.584, 0.648, 0.660], [0.001, 1, 1, 0.001]);
    // 2. Teks muncul kedua setelah overlay (0.584 - 0.594), hilang pertama kali (0.636 - 0.648)
    const sector3TextOpacity = useTransform(scrollYProgress, [0.584, 0.594, 0.636, 0.648], [0, 1, 1, 0]);
    const sector3DescOpacity = sector3TextOpacity;
    const sector3TitleOpacity = sector3TextOpacity;
    const sector3TitleProgress = useTransform(scrollYProgress, [0.584, 0.594], [0, 1]);
    const sector3ContentY = useTransform(scrollYProgress, [0.582, 0.592, 0.636, 0.648], [14, 0, 0, -8]);

    // Sector 4: Productos (0.730 to 0.812)
    // 1. Overlay muncul pertama kali (0.730 - 0.740), hilang terakhir setelah teks (0.800 - 0.812)
    const sector4OverlayOpacity = useTransform(scrollYProgress, [0.730, 0.740, 0.800, 0.812], [0.001, 1, 1, 0.001]);
    // 2. Judul & CTA hilang di (0.786 - 0.798)
    const sector4TitleOpacity = useTransform(scrollYProgress, [0.740, 0.750, 0.786, 0.798], [0, 1, 1, 0]);
    const sector4TitleProgress = useTransform(scrollYProgress, [0.740, 0.750], [0, 1]);
    // 3. Teks deskripsi berakhir lebih awal sedikit (0.772 - 0.784)
    const sector4DescOpacity = useTransform(scrollYProgress, [0.740, 0.750, 0.772, 0.784], [0, 1, 1, 0]);
    const sector4ContentY = useTransform(scrollYProgress, [0.738, 0.748, 0.772, 0.784], [14, 0, 0, -8]);

    // Sector 5: Servicios (0.855 to 0.985)
    // 1. Overlay muncul pertama kali (0.855 - 0.866), hilang terakhir setelah teks (0.970 - 0.985)
    const sector5OverlayOpacity = useTransform(scrollYProgress, [0.855, 0.866, 0.970, 0.985], [0.001, 1, 1, 0.001]);
    // 2. Teks muncul kedua setelah overlay (0.866 - 0.878), hilang pertama kali (0.954 - 0.968)
    const sector5TextOpacity = useTransform(scrollYProgress, [0.866, 0.878, 0.954, 0.968], [0, 1, 1, 0]);
    const sector5DescOpacity = sector5TextOpacity;
    const sector5TitleOpacity = sector5TextOpacity;
    const sector5TitleProgress = useTransform(scrollYProgress, [0.866, 0.878], [0, 1]);
    const sector5ContentY = useTransform(scrollYProgress, [0.864, 0.876, 0.954, 0.968], [14, 0, 0, -8]);

    const computeScrollProgress = useCallback((): number => {
      if (typeof window === 'undefined' || window.scrollY <= 1) {
        return 0;
      }
      if (!containerRef.current) return 0;
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      return Math.max(0, Math.min(1, window.scrollY / totalScroll));
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

    // Dynamically match Hero Logo height with the Hero Text Column height to match reference design 100%
    useLayoutEffect(() => {
      const updateHeight = () => {
        if (typeof window === 'undefined') return;
        // On mobile / tablet (< 1024px), layout is flex-col so logo height should be auto/compact, NOT matching text column height!
        if (window.innerWidth < 1024) {
          setHeroLogoHeight(undefined);
          return;
        }

        if (heroTextColRef.current) {
          const rect = heroTextColRef.current.getBoundingClientRect();
          if (rect.height > 0) {
            setHeroLogoHeight(Math.round(rect.height));
          }
        }
      };
      updateHeight();
      const ro = new ResizeObserver(() => updateHeight());
      if (heroTextColRef.current) {
        ro.observe(heroTextColRef.current);
      }
      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(updateHeight);
      }
      window.addEventListener('resize', updateHeight);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', updateHeight);
      };
    }, []);

    // Adaptive Reference Scale: Strictly 'none' on Lenovo laptop (h >= 780px, w >= 1200px) so the overlay
    // remains 100% full, thick, and rich as Vercel production without any artificial thinning.
    // Only gently scales down on genuinely compact viewports (MacBook ~700px, 1366x768) to prevent blowouts.
    useLayoutEffect(() => {
      const updateOverlayScale = () => {
        if (typeof window === 'undefined') return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        // On Lenovo laptop and desktop (h >= 780px and w >= 1200px), NO transform is applied!
        if (h >= 780 && w >= 1200) {
          if (stageViewportRef.current) {
            stageViewportRef.current.style.setProperty('--overlay-transform', 'none');
          }
          return;
        }

        // On genuinely compact screens (MacBook ~700px, 1366x768 ~620px), scale gently to avoid overflow
        const vhScale = h / 780;
        const vwScale = w / 1200;
        const targetScale = Math.min(1, Math.min(vhScale, vwScale));
        const finalScale = Math.max(0.70, targetScale);

        if (stageViewportRef.current) {
          stageViewportRef.current.style.setProperty('--overlay-transform', `scale(${finalScale.toFixed(3)})`);
        }
      };

      updateOverlayScale();
      window.addEventListener('resize', updateOverlayScale);
      return () => {
        window.removeEventListener('resize', updateOverlayScale);
      };
    }, []);

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
          <div id="sector-modelo" className="absolute top-[14%] pointer-events-none" />
          <div id="sector-proceso" className="absolute top-[38%] pointer-events-none" />
          <div id="sector-filosofia" className="absolute top-[59%] pointer-events-none" />
          <div id="sector-productos" className="absolute top-[71%] pointer-events-none" />
          <div id="sector-servicios" className="absolute top-[84%] pointer-events-none" />
        </div>

        {/* 2. Fixed Narrative Viewport Layer (z-[25]): Locked to screen, 100% visible across scroll */}
        <div
          ref={stageViewportRef}
          className="fixed inset-0 h-screen w-full overflow-hidden pointer-events-none z-[25] flex items-center justify-center"
          style={{ opacity: 1, ['--overlay-transform' as any]: 'none' }}
        >
          {/* 1. 3D Money Stream (Arus Uang): Dinonaktifkan sementara (hidden), kode tetap utuh */}
          <div
            ref={heroMoneyFlowRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
            style={{ opacity: 0, visibility: 'hidden', display: 'none' }}
          >
            <MoneyFlow3D className="absolute inset-0 w-full h-full pointer-events-none" />
          </div>

          {/* 2. Opening & DIMA Darkening Overlay (z-10): Black overlay untuk Video 2 ke depan */}
          <div
            ref={openingOverlayRef}
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{ opacity: 0, visibility: 'hidden' }}
          />

          {/* 3. Navy DIMA Overlay (z-10): Menutupi Video 1 & Hero, lalu transisi ke hitam di Video 2 */}
          <div
            ref={navyOverlayRef}
            className="absolute inset-0 bg-[#030035] pointer-events-none z-10"
            style={{ opacity: 0.80 }}
          />

          {/* 4. Initial Hero Stage */}
          <HeroSection
            initialLogoRef={initialLogoRef}
            initialLogoOpacity={initialLogoOpacity}
            heroLogoHeight={heroLogoHeight}
            heroTextColRef={heroTextColRef}
            scrollPromptRef={scrollPromptRef}
          />

          {/* Opening Phrases (Phases 0, 1, 2) */}
          <OpeningPhrasesSection
            phaseRefs={phaseRefs}
            phrase1Progress={phrase1Progress}
            phrase2Progress={phrase2Progress}
            phrase3Progress={phrase3Progress}
          />

          {/* Phase 3: Sector 1 - Agroindustria & Producción (Modelo) */}
          <Sector1ModeloSection
            phaseRef={(el) => { phaseRefs.current[3] = el; }}
            data={sector1}
            contentY={sector1ContentY}
            overlayOpacity={sector1OverlayOpacity}
            titleOpacity={sector1TitleOpacity}
            titleProgress={sector1TitleProgress}
            descOpacity={sector1DescOpacity}
          />

          {/* Phase 4: Sector 2 - Construcción & Infraestructura (Proceso) */}
          <Sector2ProcesoSection
            phaseRef={(el) => { phaseRefs.current[4] = el; }}
            data={sector2}
            contentY={sector2ContentY}
            overlayOpacity={sector2OverlayOpacity}
            titleOpacity={sector2TitleOpacity}
            titleProgress={sector2TitleProgress}
            descOpacity={sector2DescOpacity}
          />

          {/* Phase 5: Sector 3 - Energía & Sostenibilidad (Filosofia) */}
          <Sector3FilosofiaSection
            phaseRef={(el) => { phaseRefs.current[5] = el; }}
            data={sector3}
            contentY={sector3ContentY}
            overlayOpacity={sector3OverlayOpacity}
            titleOpacity={sector3TitleOpacity}
            titleProgress={sector3TitleProgress}
            descOpacity={sector3DescOpacity}
          />

          {/* Phase 6: Sector 4 - Comercio & Mercados Globales (Productos) */}
          <Sector4ProductosSection
            phaseRef={(el) => { phaseRefs.current[6] = el; }}
            data={sector4}
            contentY={sector4ContentY}
            overlayOpacity={sector4OverlayOpacity}
            titleOpacity={sector4TitleOpacity}
            titleProgress={sector4TitleProgress}
            descOpacity={sector4DescOpacity}
          />

          {/* Phase 7: Sector 5 - Servicios & CTA (Kiri Tengah) */}
          <Sector5ServiciosSection
            phaseRef={(el) => { phaseRefs.current[7] = el; }}
            data={sector5}
            contentY={sector5ContentY}
            overlayOpacity={sector5OverlayOpacity}
            titleOpacity={sector5TitleOpacity}
            titleProgress={sector5TitleProgress}
            descOpacity={sector5DescOpacity}
          />
        </div>
      </>
    );
  }
);

export default UnifiedStoryStage;
