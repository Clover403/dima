import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import HoverTrailOverlay from '../HoverTrailOverlay';
import ScrollSequence from '../ScrollSequence';
import HybridRevealText from '../HybridRevealText';
import SpotlightGridBackground from '../layout/SpotlightGridBackground';
import SequenceLoadingBar from '../common/SequenceLoadingBar';
import { nosotrosSequenceFrames } from '../../lib/sequences';

const chapters = [
  {
    eyebrow: "Nosotros",
    headline: "Arquitectos\ndel equilibrio.",
    body: "Somos una Institución de Ingeniería\nFinanciera fundada sobre la ideología\ny filosofía del economista filantrópico\nRaymond Thomas Dalio.",
    position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-auto lg:bottom-32 lg:left-12 lg:translate-x-0 lg:translate-y-0",
    align: "items-center text-center lg:items-start lg:text-left" 
  },
  {
    eyebrow: "Filosofía — 01",
    headline: "No somos un banco.",
    body: "Somos arquitectos de equilibrio.",
    position: "top-1/2 -translate-y-1/2 left-6 md:left-12",
    align: "items-start text-left"
  },
  {
    eyebrow: "Estrategia — 02",
    headline: "Transformamos la deuda en productividad.",
    body: "Operamos con ciclos, no con intuición.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 right-6 md:right-12",
    align: "items-end text-right" 
  },
  {
    eyebrow: "Principio DIMA",
    headline: "Replicar para cada empresa\nla misma lógica de equilibrio.",
    body: "Filosofía Fundacional DIMA.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-1/2 -translate-x-1/2",
    align: "items-center text-center"
  },
  {
    eyebrow: "Filosofía fundacional — 2024",
    headline: "El crédito no es deuda —\nes arquitectura.",
    body: "Cada institución lleva en sí misma un ciclo; nuestra labor es leerlo. Inspirados en la metodología de Raymond Thomas Dalio — adaptada de la macroeconomía al tejido vivo de la empresa.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-1/2 -translate-x-1/2",
    align: "items-center text-center" 
  },
  {
    eyebrow: "Pilar 01 / Analytics System v1.0",
    headline: "Modelo Macroeconómico Aplicado",
    body: "Adaptamos la ingeniería económica de Ray Dalio al nivel de la empresa. No operamos con intuición — operamos con ciclos verificables.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 right-6 md:right-12",
    align: "items-end text-right" 
  },
  {
    eyebrow: "Pilar 02 / Solvency Protocol",
    headline: "Evaluación por Solvencia",
    body: "La elegibilidad de crédito se determina por la capacidad de pago real de la entidad — no por su escala o antigüedad superficial.",
    position: "top-1/2 -translate-y-1/2 right-6 md:right-12",
    align: "items-end text-right"
  },
  {
    eyebrow: "Pilar 03 / Strategic Reconfig",
    headline: "Reconfiguración Estratégica",
    body: "Cuando una entidad no califica, se le interviene. DIMA reconfigura la estructura financiera hasta alcanzar solvencia.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-6 md:left-12",
    align: "items-start text-left" 
  },
  {
    eyebrow: "Pilar 04 / Institutional Link",
    headline: "Enlace Institucional",
    body: "DIMA opera como arquitecto técnico entre la empresa y los comités de crédito de SOFOMEs aliadas.",
    position: "top-1/2 -translate-y-1/2 left-6 md:left-12",
    align: "items-start text-left"
  },
];

export default function NosotrosHeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const slot = 1 / chapters.length;

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [isSequenceLoaded, setIsSequenceLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const activeChapterRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const currentActive = Math.min(
        Math.floor(v / slot),
        chapters.length - 1
      );
      
      if (currentActive !== activeChapterRef.current) {
        activeChapterRef.current = currentActive;
        setExpandedChapters(new Set());
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, slot]);

  const toggleChapter = (index: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const triggerUpdate = () => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    };
    triggerUpdate();
    const rafId = requestAnimationFrame(triggerUpdate);
    const timer = setTimeout(triggerUpdate, 120);
    window.addEventListener('loaderFinished', triggerUpdate, { once: true });
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener('loaderFinished', triggerUpdate);
    };
  }, []);

  // Logo hanya di awal (Chapter 0) dan menghilang saat scroll ke bab selanjutnya
  const logoOpacity = useTransform(scrollYProgress, (v) => {
    if (typeof v !== 'number' || isNaN(v) || v <= 0) return 1;
    if (v >= slot * 0.7) return 0;
    if (v <= slot * 0.3) return 1 - (v / (slot * 0.3)) * 0.4;
    return 0.6 - ((v - slot * 0.3) / (slot * 0.4)) * 0.6;
  });

  const overlayOpacity = useTransform(scrollYProgress, (v) => {
    if (typeof v !== 'number' || isNaN(v) || v <= slot * 0.8) return 0;
    if (v >= 1) return 0;
    if (v >= 0.95) return 0.5 * (1 - (v - 0.95) / 0.05);
    if (v <= slot * 1.5) return ((v - slot * 0.8) / (slot * 0.7)) * 0.5;
    return 0.5;
  });

  return (
      <div ref={containerRef} className="relative w-full bg-[#F4F4F5]" style={{ height: `${chapters.length * 150}vh` }}>
        <div className="sticky top-0 h-[calc(100vh+2px)] w-full overflow-hidden bg-[#F4F4F5]">

          {/* Spotlight Grid Background dengan tema Lightgray (#F4F4F5) persis seperti di Product Hero */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SpotlightGridBackground theme="lightgray" />
          </div>

          <div className="absolute inset-0 z-[1] pointer-events-none">
            <ScrollSequence 
              progress={scrollYProgress} 
              frameCount={nosotrosSequenceFrames.length} 
              imagePaths={nosotrosSequenceFrames} 
              onLoadedChange={setIsSequenceLoaded}
              onProgress={(pct) => setLoadingProgress(pct)}
            />
          </div>

          <div className="absolute inset-0 z-20 pointer-events-auto cursor-none">
            <HoverTrailOverlay theme="white" className="w-full h-full mix-blend-soft-light" />
          </div>

          {/* Overlay Gelap untuk kontras teks saat scroll ke bab selanjutnya */}
          <motion.div 
            className="absolute inset-0 bg-black z-30 pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />

          {/* Logo Terracotta di awal (Chapter 0) */}
          <motion.div 
            className="hidden lg:flex absolute bottom-8 right-12 z-40 pointer-events-none flex-col items-end"
            style={{ opacity: logoOpacity }}
          >
            <img 
              src="/logo/Imagen 1.png" 
              alt="Logo DIMA" 
              loading="eager"
              fetchPriority="high"
              className="w-72 h-auto" 
            />
          </motion.div>

          <div className="absolute inset-0 z-50 pointer-events-none">
            {chapters.map((ch, i) => {
              const start = i * slot;
              const end = (i + 1) * slot;
              
              const isFirst = i === 0;
              const isLast = i === chapters.length - 1;
              const isCentered = i === 3 || i === 4;

              const chapterProgress = useTransform(scrollYProgress, (v) => {
                if (isFirst) return 1;
                if (typeof v !== 'number' || isNaN(v) || v <= start) return 0;
                if (v >= end) return 1;
                return (v - start) / (end - start);
              });
              
              const buttonOpacity = useTransform(chapterProgress, (p) => {
                if (isFirst) return 1;
                if (typeof p !== 'number' || isNaN(p) || p <= 0.5) return 0;
                if (p >= 0.7) return 1;
                return (p - 0.5) / 0.2;
              });

              const blockOpacity = useTransform(scrollYProgress, (v) => {
                if (isFirst) {
                  if (typeof v !== 'number' || isNaN(v) || v <= slot * 0.5) return 1;
                  if (v >= slot) return 0;
                  return 1 - ((v - slot * 0.5) / (slot * 0.5));
                }
                if (typeof v !== 'number' || isNaN(v)) return 0;
                const bStart = start;
                const bInEnd = start + slot * 0.05;
                if (isLast) {
                  if (v < bStart) return 0;
                  if (v < bInEnd) return (v - bStart) / (bInEnd - bStart);
                  if (v <= 0.95) return 1;
                  if (v >= 1) return 0;
                  return 1 - (v - 0.95) / 0.05;
                } else {
                  const bOutStart = end - slot * 0.05;
                  const bEnd = end;
                  if (v < bStart) return 0;
                  if (v < bInEnd) return (v - bStart) / (bInEnd - bStart);
                  if (v <= bOutStart) return 1;
                  if (v >= bEnd) return 0;
                  return 1 - (v - bOutStart) / (bEnd - bOutStart);
                }
              });

              const pointerEvents = useTransform(blockOpacity, (v) => v > 0.1 ? "auto" : "none");
              
              const containerWidth = isFirst 
                ? "w-[90%] sm:w-[80%] md:w-[70%] lg:w-[45%]" 
                : isCentered 
                  ? "w-[95%] md:w-[85%] lg:w-[80%]" 
                  : "w-[85%] md:w-[30%] lg:w-[25%]";

              const isExpanded = expandedChapters.has(i);
const textColorClass = isFirst ? 'text-[#030035]' : 'text-white';

              return (
                <motion.div
                  key={i}
                  className={`absolute flex flex-col gap-2 md:gap-4 ${containerWidth} ${ch.position} ${ch.align}`}
                  style={{ opacity: blockOpacity, pointerEvents }} 
                >
                  
                  {isFirst && (
                    <motion.div className="flex lg:hidden mb-2 sm:mb-4 pointer-events-none w-full justify-center items-center">
                      <img 
                        src="/logo/Imagen 1.png" 
                        alt="Logo DIMA" 
                        loading="eager"
                        fetchPriority="high"
                        className="w-36 sm:w-48 md:w-56 h-auto object-contain mx-auto" 
                      />
                    </motion.div>
                  )}

                  {ch.eyebrow && (
                    <motion.p
                      className={`font-body text-[10px] md:text-sm tracking-[0.3em] uppercase font-semibold w-full ${isFirst ? 'text-[#030035]' : 'text-[#E5997B]'}`}
                    >
                      {ch.eyebrow}
                    </motion.p>
                  )}

                  <h1 className="leading-[1.05] tracking-tight w-full block break-words whitespace-pre-line">
                    <HybridRevealText
                      text={ch.headline}
                      progress={chapterProgress}
                      isLast={isLast}
                      className={`font-display font-medium inline break-words ${textColorClass} ${isFirst ? 'text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem]' : 'text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem]'}`}
                      targetColor={isFirst ? '#030035' : '#E5E5E5'}
                    />

                    <motion.button
                      onClick={() => toggleChapter(i)}
                      className={`inline-flex items-center justify-center hover:text-[#E5997B] transition-colors duration-300 ml-2 sm:ml-4 cursor-pointer relative -top-[0.15em] z-50 ${textColorClass}`}
                      style={{ opacity: buttonOpacity }}
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <ChevronDown 
                        className={`w-6 h-6 sm:w-8 sm:h-8 md:w-[3rem] md:h-[3rem] ${isFirst ? 'lg:drop-shadow-[0_4px_16px_rgba(255,255,255,0.8)]' : 'drop-shadow-[0_4px_16px_rgba(255,255,255,0.8)]'}`} 
                        strokeWidth={3} 
                      />
                    </motion.button>
                  </h1>

                  <AnimatePresence>
                    {isExpanded && ch.body && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full overflow-hidden"
                      >
                        <p
                          className={`font-body text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] lg:text-[2rem] font-medium leading-tight w-full break-words mt-2 md:mt-3 pb-1 whitespace-pre-line ${textColorClass}`}
                        >
                          <HybridRevealText
                            text={ch.body}
                            progress={chapterProgress}
                            isLast={isLast}
                          />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Minimalist Bottom-Center Sequence Loading Indicator */}
          <SequenceLoadingBar 
            progress={loadingProgress} 
            isLoaded={isSequenceLoaded} 
            isVisible={isInView}
            overlayOpacity={overlayOpacity}
            label="Cargando animación" 
          />
        </div>
      </div>
  );
}