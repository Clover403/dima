import { useState, useRef, useEffect, useLayoutEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HERO_STAGE_DATA, NEW_HOME_SECTORS } from './newHomeData';
import CreditArchitectureDiagram from './CreditArchitectureDiagram';
import HybridRevealText from '../HybridRevealText';
import CharRevealParagraph from './CharRevealParagraph';
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

// 9 Distinct Narrative Phases spanning scroll progress 0.00 to 1.00
const PHASES: PhaseConfig[] = [
  // 0: Phrase 1 (0.018 to 0.075) - Video 1
  { id: 'phrase-1', start: 0.018, fadeIn: 0.028, fadeOut: 0.065, end: 0.075 },
  // 1: Phrase 2 (0.075 to 0.140) - Video 1
  { id: 'phrase-2', start: 0.075, fadeIn: 0.085, fadeOut: 0.130, end: 0.140 },
  // 2: Phrase 3 (0.140 to 0.205) - Video 1
  { id: 'phrase-3', start: 0.140, fadeIn: 0.150, fadeOut: 0.195, end: 0.205 },
  // 3: DIMA FINANCE Parallax (0.205 to 0.282) - Video 1
  { id: 'dima-finance', start: 0.205, fadeIn: 0.218, fadeOut: 0.270, end: 0.282 },
  // 4: Sector 1 - Agroindustria (0.280 to 0.405) - Videos 2 & 3
  { id: 'modelo', start: 0.280, fadeIn: 0.295, fadeOut: 0.390, end: 0.405 },
  // 5: Sector 2 - Construcción & Real Estate Fused (0.400 to 0.588) - Videos 4, 5, 6, 7
  { id: 'proceso', start: 0.400, fadeIn: 0.415, fadeOut: 0.570, end: 0.588 },
  // 6: Sector 3 - Comercio & Retail (0.580 to 0.705) - Video 10 (consumption cycles)
  { id: 'filosofia', start: 0.580, fadeIn: 0.595, fadeOut: 0.690, end: 0.705 },
  // 7: Sector 4 - Energía & Productos (0.700 to 0.845) - Video 8
  { id: 'productos', start: 0.700, fadeIn: 0.715, fadeOut: 0.830, end: 0.845 },
  // 8: Sector 5 - Logística & Servicios (0.840 to 0.995) - Videos 9, 11, 12
  { id: 'servicios', start: 0.840, fadeIn: 0.855, fadeOut: 0.980, end: 0.995 },
];

function calcPhaseOpacity(p: number, cfg: PhaseConfig): number {
  if (p < cfg.start || p > cfg.end) return 0;
  if (p >= cfg.fadeIn && p <= cfg.fadeOut) return 1;
  if (p < cfg.fadeIn) return (p - cfg.start) / (cfg.fadeIn - cfg.start);
  return (cfg.end - p) / (cfg.end - cfg.fadeOut);
}

// Perimeter layout configurations per sector - ensures comfortable margins away from edges
const SECTOR_LAYOUTS: Record<string, {
  titlePosition: string;
  titleAlign: string;
  descPosition: string;
  descAlign: string;
  descPositions?: string[];
}> = {
  modelo: {
    // 01: Kiri Bawah (Title) & P0 Kanan Atas, P1 Kanan Bawah
    titlePosition: 'lg:absolute lg:left-6 xl:left-10 lg:bottom-12 xl:bottom-16 lg:max-w-md xl:max-w-lg',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-6 xl:right-10 lg:top-16 xl:top-20 lg:max-w-2xl xl:max-w-[700px]',
    descAlign: 'items-start text-left',
    descPositions: [
      'lg:absolute lg:right-6 xl:right-10 lg:top-16 xl:top-20 lg:max-w-2xl xl:max-w-[700px]',
      'lg:absolute lg:right-6 xl:right-10 lg:bottom-12 xl:bottom-16 lg:max-w-2xl xl:max-w-[700px]',
    ],
  },
  proceso: {
    // 02: Kanan Atas (Title), P0 & P2 Kiri Atas, P1 Kiri Bawah
    titlePosition: 'lg:absolute lg:right-6 xl:right-10 lg:top-20 xl:top-24 2xl:top-28 lg:max-w-md xl:max-w-lg',
    titleAlign: 'items-start text-left lg:items-end lg:text-right',
    descPosition: 'lg:absolute lg:left-6 xl:left-10 lg:top-24 xl:top-28 lg:max-w-2xl xl:max-w-[700px]',
    descAlign: 'items-start text-left',
    descPositions: [
      'lg:absolute lg:left-6 xl:left-10 lg:top-24 xl:top-28 2xl:top-32 lg:max-w-2xl xl:max-w-[700px]',
      'lg:absolute lg:left-6 xl:left-10 lg:bottom-12 xl:bottom-16 lg:max-w-2xl xl:max-w-[700px]',
      'lg:absolute lg:left-6 xl:left-10 lg:top-24 xl:top-28 2xl:top-32 lg:max-w-2xl xl:max-w-[700px]',
    ],
  },
  filosofia: {
    // 03: Kiri Bawah (Title) & Kanan Atas (Desc)
    titlePosition: 'lg:absolute lg:left-6 xl:left-10 lg:bottom-12 xl:bottom-16 lg:max-w-md xl:max-w-lg',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-6 xl:right-10 lg:top-16 xl:top-20 lg:max-w-2xl xl:max-w-[700px]',
    descAlign: 'items-start text-left',
  },
  productos: {
    // 04: Kiri Atas (Title), P0 Kanan Atas, P1 Kiri Bawah
    titlePosition: 'lg:absolute lg:left-6 xl:left-10 lg:top-16 xl:top-20 lg:max-w-md xl:max-w-lg',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-6 xl:right-10 lg:top-16 xl:top-20 lg:w-full lg:max-w-2xl xl:max-w-[720px]',
    descAlign: 'items-start text-left',
    descPositions: [
      'lg:absolute lg:right-6 xl:right-10 lg:top-16 xl:top-20 lg:max-w-2xl xl:max-w-[700px]',
      'lg:absolute lg:left-6 xl:left-10 lg:bottom-12 xl:bottom-16 lg:max-w-2xl xl:max-w-[700px]',
    ],
  },
  servicios: {
    // 05: Batas pinggir sama seperti sektor lain, posisi judul dan tombol lebih ke bawah
    titlePosition: 'lg:absolute lg:inset-x-6 xl:inset-x-10 lg:bottom-6 xl:bottom-8 lg:mx-auto lg:max-w-4xl xl:max-w-5xl',
    titleAlign: 'items-center text-center',
    descPosition: 'lg:absolute lg:left-6 xl:left-10 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-md xl:max-w-[430px]',
    descAlign: 'items-start text-left',
  },
};

// ─── HOOK ANIMASI ENVELOPE (MAIL) DOTS UNTUK INITIAL SCREEN ───
function useEnvelopeDots(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isActiveRef: React.RefObject<boolean>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const RAW_SEGMENTS: [number, number][][] = [
      [[0, 0], [9.75, 15.13], [19.5, 30.25], [29.25, 45.38], [39, 60.5],
       [44.5, 63.25], [50, 66.0], [55.5, 63.25], [61, 60.5],
       [70.75, 45.38], [80.5, 30.25], [90.25, 15.13], [100, 0]],
      [[0, 100], [17, 76.25], [34, 52.5]],
      [[100, 100], [83, 76.25], [66, 52.5]],
    ];

    const segments = RAW_SEGMENTS.map(points => {
      const dist: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        dist.push(dist[i - 1] + Math.hypot(bx - ax, by - ay));
      }
      return { points, dist, total: dist[dist.length - 1] };
    });

    const pointAt = (seg: typeof segments[0], d: number) => {
      const { points, dist, total } = seg;
      const clamped = Math.max(0, Math.min(total, d));
      let i = 1;
      while (i < dist.length && dist[i] < clamped) i++;
      const d0 = dist[i - 1], d1 = dist[i];
      const t = d1 === d0 ? 0 : (clamped - d0) / (d1 - d0);
      const [ax, ay] = points[i - 1];
      const [bx, by] = points[i];
      return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t };
    };

    interface Dot {
      segIndex: number; pos: number; dir: 1 | -1;
      speed: number; trail: number; opacity: number;
      dead: boolean; deadAge: number;
    }
    const dots: Dot[] = [];

    const spawnDot = (segIndex: number) => {
      const seg = segments[segIndex];
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      dots.push({
        segIndex, pos: dir === 1 ? 0 : seg.total, dir,
        speed: 0.7 + Math.random() * 0.3,
        trail: 1.5,
        opacity: 0.65,
        dead: false, deadAge: 0,
      });
    };

    segments.forEach((_, i) => spawnDot(i));
    const spawnInterval = setInterval(() => {
      if (isActiveRef.current === false) return;
      segments.forEach((_, segIndex) => {
        if (dots.filter(d => d.segIndex === segIndex).length === 0) {
          spawnDot(segIndex);
        }
      });
    }, 1500);

    let raf = 0;
    const color = '229,153,123'; // Bronze #E5997B

    const draw = () => {
      if (isActiveRef.current === false) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 100;
      const scaleY = canvas.height / 100;
      const lineW = 1.5;

      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        const seg = segments[dot.segIndex];

        if (dot.dead) {
          dot.deadAge++;
          if (dot.deadAge > 20) { 
            const sIdx = dot.segIndex;
            dots.splice(i, 1);
            spawnDot(sIdx); 
            continue; 
          }
        } else {
          dot.pos += dot.dir * dot.speed;
          if (dot.pos <= 0 || dot.pos >= seg.total) dot.dead = true;
        }

        const fade = dot.dead ? Math.max(0, 1 - dot.deadAge / 20) : 1;
        const head = pointAt(seg, dot.pos);
        const tail = pointAt(seg, dot.pos - dot.dir * dot.trail);
        const hx = head.x * scaleX, hy = head.y * scaleY;
        const tx = tail.x * scaleX, ty = tail.y * scaleY;

        const cx = (hx + tx) / 2;
        const cy = (hy + ty) / 2;
        const glowRadius = 45; 
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        glow.addColorStop(0, `rgba(${color},${0.08 * fade})`); 
        glow.addColorStop(1, `rgba(${color},0)`);
        
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.strokeStyle = `rgba(${color},${dot.opacity * fade})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(spawnInterval);
      ro.disconnect();
    };
  }, [isActiveRef]);
}

const UnifiedStoryStage = forwardRef<UnifiedStoryStageHandle, UnifiedStoryStageProps>(
  ({ onProgressUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageViewportRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const mailEffectRef = useRef<HTMLDivElement>(null);
    const mailCanvasRef = useRef<HTMLCanvasElement>(null);
    const isMailActiveRef = useRef<boolean>(true);
    const phaseRefs = useRef<(HTMLDivElement | null)[]>(new Array(PHASES.length).fill(null));
    const [showDiagram, setShowDiagram] = useState(false);

    useEnvelopeDots(mailCanvasRef, isMailActiveRef);

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

      // 3. Scroll instruction indicator fades out immediately when scrolling begins
      if (scrollIndicatorRef.current) {
        const indOp = Math.max(0, 1 - (p / 0.012));
        scrollIndicatorRef.current.style.opacity = `${indOp.toFixed(3)}`;
        scrollIndicatorRef.current.style.visibility = indOp > 0.005 ? 'visible' : 'hidden';
      }

      // 4. Initial opening mail/envelope effect: fades out smoothly when user begins scrolling
      if (mailEffectRef.current) {
        const mOp = Math.max(0, 1 - (p / 0.016));
        mailEffectRef.current.style.opacity = `${mOp.toFixed(3)}`;
        mailEffectRef.current.style.visibility = mOp > 0.005 ? 'visible' : 'hidden';
        isMailActiveRef.current = mOp > 0.005;
      }

      if (!onProgressUpdate) return;

      let activeVid = 1;
      let vidProg = 0.001;
      const shiftX = 0;

      // Clean unblurred presentation: overlay is removed per design instructions
      const overlayOp = 0;

      if (p < 0.28) {
        activeVid = 1; // download.mp4 (Merged Hourglass complete 13s)
        vidProg = Math.max(0.001, Math.min(0.999, p / 0.28));
      } else if (p < 0.40) {
        // Sector 1: Modelo (Agroindustria & Escala Productiva)
        if (p < 0.34) {
          activeVid = 2; // Agro bulir gandum
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.28) / 0.06));
        } else {
          activeVid = 3; // Agro traktor panen
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.34) / 0.06));
        }
      } else if (p < 0.58) {
        // Sector 2: Proceso (Construcción & Fused Real Estate - Videos 4, 5, 6, 7)
        // Active construction ground-up (4), exterior frame (5), interior navigation (6), continuing through finished building window zoom (7)
        if (p < 0.445) {
          activeVid = 4; // Excavator pondasi (ground up)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.40) / 0.045));
        } else if (p < 0.490) {
          activeVid = 5; // Rangka luar baru (structural frame)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.445) / 0.045));
        } else if (p < 0.535) {
          activeVid = 6; // Rangka dalam interior (navigating through space during construction)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.490) / 0.045));
        } else {
          activeVid = 7; // Finished skyscraper window zoom (seamlessly morphs into solar farm)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.535) / 0.045));
        }
      } else if (p < 0.70) {
        // Sector 3: Filosofía (Energía & Fundamentos Macroeconómicos)
        activeVid = 8; // Turbinas de viento y parques solares (continues seamlessly from building window zoom)
        vidProg = Math.max(0.001, Math.min(0.999, (p - 0.58) / 0.12));
      } else if (p < 0.84) {
        // Sector 4: Productos (Comercio & Mercados Globales - Pelabuhan & Retail Supermarket)
        if (p < 0.77) {
          activeVid = 9; // Logistik pelabuhan loading docks (continues seamlessly from solar coast)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.70) / 0.07));
        } else {
          activeVid = 10; // Lorong rak supermarket retail (continues seamlessly from port building)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.77) / 0.07));
        }
      } else {
        // Sector 5: Servicios (Logística & Distribución Global)
        if (p < 0.92) {
          activeVid = 11; // Logistik warehouse interior (continues seamlessly from retail store exit)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.84) / 0.08));
        } else {
          activeVid = 12; // Logistik armada truk kontainer (continues seamlessly from warehouse roll door)
          vidProg = Math.max(0.001, Math.min(0.999, (p - 0.92) / 0.08));
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

    // Minimalist scroll indicator opacity: visible at initial state, smoothly fades out as scroll starts
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0.000, 0.012], [1, 0]);
    // Initial opening mail/envelope effect opacity: visible at top, fades out smoothly
    const mailEffectOpacity = useTransform(scrollYProgress, [0.000, 0.016], [1, 0]);

    // Reveal progress MotionValues for the 3 narrative phrases (reveals letter-by-letter based on scroll)
    const phrase1Progress = useTransform(scrollYProgress, [0.020, 0.055], [0, 1]);
    const phrase2Progress = useTransform(scrollYProgress, [0.082, 0.118], [0, 1]);
    const phrase3Progress = useTransform(scrollYProgress, [0.148, 0.185], [0, 1]);

    // DIMA FINANCE Text Parallax Controls:
    // Entrance: DIMA enters from left (-60% -> 0%), FINANCE enters from right (60% -> 0%)
    // Center Pause (0.222 -> 0.260): Both stay perfectly centered
    // Exit (0.260 -> 0.280): DIMA exits to right (0% -> 60%), FINANCE exits to left (0% -> -60%)
    const dimaOpacity = useTransform(
      scrollYProgress,
      [0.205, 0.218, 0.262, 0.280],
      [0, 1, 1, 0]
    );
    const dimaX = useTransform(
      scrollYProgress,
      [0.205, 0.222, 0.260, 0.280],
      ['-60%', '0%', '0%', '60%']
    );
    const financeX = useTransform(
      scrollYProgress,
      [0.205, 0.222, 0.260, 0.280],
      ['60%', '0%', '0%', '-60%']
    );

    // Sector 1: Modelo (0.280 to 0.405) - Title stays visible throughout sector, 2 sessions
    const sector1TitleProgress = useTransform(scrollYProgress, [0.282, 0.315], [0, 1]);
    const s1p0Opacity = useTransform(scrollYProgress, [0.288, 0.298, 0.342, 0.348], [0, 1, 1, 0]);
    const s1p0CharProgress = useTransform(scrollYProgress, [0.298, 0.338], [0, 1]);
    const s1p1Opacity = useTransform(scrollYProgress, [0.348, 0.354, 0.395, 0.404], [0, 1, 1, 0]);
    const s1p1CharProgress = useTransform(scrollYProgress, [0.354, 0.390], [0, 1]);

    // Sector 2: Proceso (0.400 to 0.588) - 3 sessions (each strictly 4-5 lines max)
    const sector2TitleProgress = useTransform(scrollYProgress, [0.402, 0.435], [0, 1]);
    const s2p0Opacity = useTransform(scrollYProgress, [0.408, 0.416, 0.460, 0.466], [0, 1, 1, 0]);
    const s2p0CharProgress = useTransform(scrollYProgress, [0.416, 0.455], [0, 1]);
    const s2p1Opacity = useTransform(scrollYProgress, [0.466, 0.474, 0.520, 0.526], [0, 1, 1, 0]);
    const s2p1CharProgress = useTransform(scrollYProgress, [0.474, 0.515], [0, 1]);
    const s2p2Opacity = useTransform(scrollYProgress, [0.526, 0.534, 0.578, 0.586], [0, 1, 1, 0]);
    const s2p2CharProgress = useTransform(scrollYProgress, [0.534, 0.572], [0, 1]);

    // Sector 3: Filosofia (0.580 to 0.705) - 4 sessions (each strictly 4-6 lines max)
    const sector3TitleProgress = useTransform(scrollYProgress, [0.582, 0.608], [0, 1]);
    const s3p0Opacity = useTransform(scrollYProgress, [0.588, 0.594, 0.614, 0.618], [0, 1, 1, 0]);
    const s3p0CharProgress = useTransform(scrollYProgress, [0.594, 0.612], [0, 1]);
    const s3p1Opacity = useTransform(scrollYProgress, [0.618, 0.624, 0.644, 0.648], [0, 1, 1, 0]);
    const s3p1CharProgress = useTransform(scrollYProgress, [0.624, 0.642], [0, 1]);
    const s3p2Opacity = useTransform(scrollYProgress, [0.648, 0.654, 0.674, 0.678], [0, 1, 1, 0]);
    const s3p2CharProgress = useTransform(scrollYProgress, [0.654, 0.672], [0, 1]);
    const s3p3Opacity = useTransform(scrollYProgress, [0.678, 0.684, 0.698, 0.704], [0, 1, 1, 0]);
    const s3p3CharProgress = useTransform(scrollYProgress, [0.684, 0.696], [0, 1]);

    // Sector 4: Productos (0.700 to 0.845) - 2 sessions + Architecture Diagram
    const sector4TitleProgress = useTransform(scrollYProgress, [0.702, 0.730], [0, 1]);
    const s4p0Opacity = useTransform(scrollYProgress, [0.708, 0.716, 0.758, 0.766], [0, 1, 1, 0]);
    const s4p0CharProgress = useTransform(scrollYProgress, [0.716, 0.755], [0, 1]);
    const s4p1Opacity = useTransform(scrollYProgress, [0.766, 0.774, 0.835, 0.844], [0, 1, 1, 0]);
    const s4p1CharProgress = useTransform(scrollYProgress, [0.774, 0.815], [0, 1]);

    // Sector 5: Servicios (0.840 to 0.995) - 2 sessions
    const sector5TitleProgress = useTransform(scrollYProgress, [0.842, 0.870], [0, 1]);
    const s5p0Opacity = useTransform(scrollYProgress, [0.850, 0.858, 0.910, 0.918], [0, 1, 1, 0]);
    const s5p0CharProgress = useTransform(scrollYProgress, [0.858, 0.905], [0, 1]);
    const s5p1Opacity = useTransform(scrollYProgress, [0.918, 0.926, 0.985, 0.994], [0, 1, 1, 0]);
    const s5p1CharProgress = useTransform(scrollYProgress, [0.926, 0.975], [0, 1]);

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
          {/* Initial Opening Mail (Envelope) Bronze Lines & Dots Effect - fades out smoothly on scroll */}
          <motion.div
            ref={mailEffectRef}
            style={{ opacity: mailEffectOpacity }}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-200"
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              aria-hidden="true"
            >
              <path
                d="M0,0 L39,60.5 Q50,71.5 61,60.5 L100,0 M0,100 L34,52.5 M100,100 L66,52.5"
                fill="none"
                stroke="#E5997B"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-30"
              />
            </svg>
            <canvas
              ref={mailCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
            />
          </motion.div>

          {/* Minimalist Scroll Instruction Indicator (Bottom Center): Visible only at top / scroll = 0 */}
          <motion.div
            ref={scrollIndicatorRef}
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-6 sm:bottom-8 inset-x-0 mx-auto w-fit z-30 pointer-events-none flex flex-col items-center gap-1.5 transition-opacity duration-150"
          >
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#030035]/75 font-medium">
              SCROLL
            </span>
            <div className="w-[1.5px] sm:w-[2px] h-3 bg-[#030035]/20 overflow-hidden rounded-full relative">
              <motion.div
                animate={{ y: [-6, 12] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className="w-full h-1.5 bg-[#030035]/70 rounded-full"
              />
            </div>
          </motion.div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 0: Opening Phrase 1 ("La economía\nno es caos.") - Kiri Tengah, 2 Baris */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[0] = el; }}
            className="absolute left-8 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] lg:w-[48%] max-w-xl text-left pointer-events-none transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="block leading-[1.08] tracking-tight font-normal drop-shadow text-[2.5rem] sm:text-[3.2rem] md:text-[4.5vw] lg:text-[5.2vw] break-words text-[#030035]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[0]}
                progress={phrase1Progress}
                targetColor="#030035"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 1: Opening Phrase 2 ("Es un mecanismo — predecible...") - Kanan Bawah */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[1] = el; }}
            className="absolute right-8 sm:right-12 lg:right-20 bottom-16 sm:bottom-20 lg:bottom-24 w-[90%] sm:w-[70%] lg:w-[50%] max-w-xl text-right flex flex-col items-end pointer-events-none transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="block leading-[1.08] tracking-tight font-normal drop-shadow text-[2.5rem] sm:text-[3rem] md:text-[4.2vw] lg:text-[4.8vw] break-words text-[#030035]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[1]}
                progress={phrase2Progress}
                targetColor="#030035"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 2: Opening Phrase 3 ("Adaptamos esa misma lógica...") - Kiri Atas */}
          {/* ------------------------------------------------------------------- */}
          <div
            ref={(el) => { phaseRefs.current[2] = el; }}
            className="absolute left-8 sm:left-12 lg:left-20 top-24 sm:top-28 lg:top-36 w-[90%] sm:w-[70%] lg:w-[52%] max-w-2xl text-left pointer-events-none transition-opacity duration-200 ease-out"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2
              className="block leading-[1.08] tracking-tight font-normal drop-shadow text-[2.5rem] sm:text-[3rem] md:text-[4.2vw] lg:text-[4.8vw] break-words text-[#030035]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <HybridRevealText
                text={HERO_STAGE_DATA.openingPhrases[2]}
                progress={phrase3Progress}
                targetColor="#030035"
              />
            </h2>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASE 3: DIMA FINANCE Big Typography Parallax - Center & Criss-Cross */}
          {/* ------------------------------------------------------------------- */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center select-none px-4"
            style={{ opacity: dimaOpacity }}
          >
            <motion.div style={{ x: dimaX }}>
              <h1
                className="leading-[0.85] tracking-tight font-normal text-[22vw] md:text-[18vw] lg:text-[14vw]"
                style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#030035', letterSpacing: '-0.02em' }}
              >
                DIMA
              </h1>
            </motion.div>

            <motion.div style={{ x: financeX }}>
              <h1
                className="leading-[0.85] tracking-tight font-normal text-[22vw] md:text-[18vw] lg:text-[14vw]"
                style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#030035', letterSpacing: '-0.02em' }}
              >
                FINANCE
              </h1>
            </motion.div>
          </motion.div>

          {/* ------------------------------------------------------------------- */}
          {/* PHASES 4 - 7: Sectors 1 to 4 (Modelo, Proceso, Filosofia, Productos) */}
          {/* ------------------------------------------------------------------- */}
          {[
            {
              sec: sector1,
              phaseIdx: 4,
              titleProgress: sector1TitleProgress,
              paragraphs: [
                { opacity: s1p0Opacity, charProgress: s1p0CharProgress },
                { opacity: s1p1Opacity, charProgress: s1p1CharProgress },
              ],
            },
            {
              sec: sector2,
              phaseIdx: 5,
              titleProgress: sector2TitleProgress,
              paragraphs: [
                { opacity: s2p0Opacity, charProgress: s2p0CharProgress },
                { opacity: s2p1Opacity, charProgress: s2p1CharProgress },
                { opacity: s2p2Opacity, charProgress: s2p2CharProgress },
              ],
            },
            {
              sec: sector3,
              phaseIdx: 6,
              titleProgress: sector3TitleProgress,
              paragraphs: [
                { opacity: s3p0Opacity, charProgress: s3p0CharProgress },
                { opacity: s3p1Opacity, charProgress: s3p1CharProgress },
                { opacity: s3p2Opacity, charProgress: s3p2CharProgress },
                { opacity: s3p3Opacity, charProgress: s3p3CharProgress },
              ],
            },
            {
              sec: sector4,
              phaseIdx: 7,
              titleProgress: sector4TitleProgress,
              paragraphs: [
                { opacity: s4p0Opacity, charProgress: s4p0CharProgress },
                { opacity: s4p1Opacity, charProgress: s4p1CharProgress },
              ],
            },
          ].map(({ sec, phaseIdx, titleProgress: secTitleProgress, paragraphs }) => {
            const layout = SECTOR_LAYOUTS[sec.id] || SECTOR_LAYOUTS.modelo;
            const isDescTop = layout.descPosition.includes('top-');

            return (
              <div
                key={sec.id}
                ref={(el) => { phaseRefs.current[phaseIdx] = el; }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-200 ease-out"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                <div className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 flex flex-col lg:block justify-center gap-8">
                  {/* Title Block - Stays visible throughout the sector until next section */}
                  <div className={`w-full flex flex-col space-y-4 sm:space-y-6 ${layout.titlePosition} ${layout.titleAlign} pointer-events-auto`}>
                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] text-[#030035] font-normal leading-[1.08] tracking-tight">
                      <HybridRevealText
                        text={sec.title}
                        progress={secTitleProgress}
                        className="inline break-words text-[#030035]"
                        targetColor="#030035"
                      />
                    </h3>

                    {/* CTA Link */}
                    <div className="pt-1">
                      <Link
                        to={sec.linkTo}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
                      >
                        {sec.linkText}
                      </Link>
                    </div>
                  </div>

                  {/* Description Block - Large Sequential Letter-by-Letter Reveal (4-6 lines max per session) */}
                  {layout.descPositions ? (
                    <>
                      {sec.body.map((paragraphText, pIdx) => {
                        const pConfig = paragraphs[pIdx];
                        if (!pConfig) return null;
                        const specificPos = layout.descPositions![pIdx];

                        return (
                          <motion.div
                            key={pIdx}
                            style={{ opacity: pConfig.opacity }}
                            className={`w-full ${specificPos} ${layout.descAlign} pointer-events-none max-lg:absolute max-lg:inset-x-0 max-lg:top-[48%] max-lg:-translate-y-1/2 max-lg:px-6 max-lg:text-center`}
                          >
                            <CharRevealParagraph
                              text={paragraphText}
                              progress={pConfig.charProgress}
                              className="font-body font-normal text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2.05rem] xl:text-[2.25rem] text-[#030035] leading-[1.35] tracking-[-0.015em]"
                            />
                          </motion.div>
                        );
                      })}

                      {sec.hasDiagram && (
                        <div className="lg:absolute lg:right-6 xl:right-10 lg:bottom-10 xl:bottom-14 max-lg:relative max-lg:mt-4 pointer-events-auto flex flex-col items-end z-20">
                          {showDiagram && (
                            <motion.div
                              initial={{ opacity: 0, y: 15, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 15, scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                              className="mb-3 w-full max-w-[640px]"
                            >
                              <CreditArchitectureDiagram />
                            </motion.div>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowDiagram((prev) => !prev)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 text-xs font-mono tracking-wider text-[#030035] uppercase shadow-sm transition-all duration-200"
                          >
                            <span>{showDiagram ? 'Ocultar Arquitectura' : 'Ver Arquitectura del Crédito'}</span>
                            <span className="text-[#E5997B] font-bold text-sm leading-none">{showDiagram ? '✕' : '+'}</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={`w-full flex flex-col ${layout.descPosition} ${layout.descAlign} pointer-events-auto`}>
                      <div className={`relative w-full ${sec.hasDiagram ? 'min-h-[340px] sm:min-h-[400px] lg:min-h-[460px]' : 'min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[340px]'} flex ${isDescTop ? 'items-start' : 'items-end'}`}>
                        {sec.body.map((paragraphText, pIdx) => {
                          const pConfig = paragraphs[pIdx];
                          if (!pConfig) return null;

                          return (
                            <motion.div
                              key={pIdx}
                              style={{ opacity: pConfig.opacity }}
                              className={`absolute inset-x-0 ${isDescTop ? 'top-0' : 'bottom-0'} pointer-events-none`}
                            >
                              <CharRevealParagraph
                                text={paragraphText}
                                progress={pConfig.charProgress}
                                className={
                                  sec.hasDiagram
                                    ? "font-body font-normal text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] xl:text-[1.95rem] text-[#030035] leading-[1.32] tracking-[-0.015em]"
                                    : "font-body font-normal text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2.05rem] xl:text-[2.25rem] text-[#030035] leading-[1.35] tracking-[-0.015em]"
                                }
                              />

                              {sec.hasDiagram && pIdx === 1 && (
                                <div className="pt-4 w-full pointer-events-auto">
                                  <CreditArchitectureDiagram />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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

            return (
              <div
                ref={(el) => { phaseRefs.current[8] = el; }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-200 ease-out"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                <div className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 flex flex-col lg:block justify-center">
                  {/* Paragraf Pertama: Di Kanan Atas */}
                  <motion.div
                    style={{ opacity: s5p0Opacity }}
                    className="lg:absolute lg:right-6 xl:right-10 lg:top-16 xl:top-20 lg:max-w-2xl xl:max-w-[700px] max-lg:relative max-lg:px-6 pointer-events-auto flex flex-col items-start"
                  >
                    <CharRevealParagraph
                      text={sec.body[0]}
                      progress={s5p0CharProgress}
                      className="font-body font-normal text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2.05rem] xl:text-[2.25rem] text-[#030035] leading-[1.35] tracking-[-0.015em] text-left max-lg:text-center"
                    />
                  </motion.div>

                  {/* Paragraf Kedua: Di Kiri Tengah */}
                  <motion.div
                    style={{ opacity: s5p1Opacity }}
                    className={`w-full ${layout.descPosition} ${layout.descAlign} max-lg:absolute max-lg:inset-x-0 max-lg:top-[48%] max-lg:-translate-y-1/2 max-lg:px-6 max-lg:text-center pointer-events-auto flex flex-col items-start max-lg:items-center`}
                  >
                    <CharRevealParagraph
                      text={sec.body[1]}
                      progress={s5p1CharProgress}
                      className="font-body font-normal text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2.05rem] xl:text-[2.25rem] text-[#030035] leading-[1.35] tracking-[-0.015em] text-left max-lg:text-center"
                    />
                  </motion.div>

                  {/* Bottom Center Block: Judul lebih ke bawah dan didekatkan dengan Tombol CTA */}
                  <div className={`w-full flex flex-col items-center space-y-2.5 sm:space-y-3.5 ${layout.titlePosition} ${layout.titleAlign} pointer-events-auto`}>
                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.4rem] text-[#030035] font-normal leading-[1.08] tracking-tight text-center">
                      <HybridRevealText
                        text={sec.title}
                        progress={sector5TitleProgress}
                        className="inline break-words text-[#030035]"
                        targetColor="#030035"
                      />
                    </h3>

                    {/* Tombol CTA: Tepat di bawah judul, dengan background transparan tanpa blur */}
                    <div className="pt-1 flex justify-center pointer-events-auto">
                      <Link
                        to={sec.linkTo}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
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
