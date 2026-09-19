import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

import ScrollSequence from '../ScrollSequence'
import HybridRevealText from '../HybridRevealText'
import SequenceLoadingBar from '../common/SequenceLoadingBar'
import SpotlightGridBackground from '../layout/SpotlightGridBackground'
import HoverTrailOverlay from '../HoverTrailOverlay'
import { modelPrincipiosSequenceFrames } from '../../lib/sequences'

const chapters = [
  {
    label: "Causalidad Productiva",
    quote: "\"Que la deuda nunca supere al ingreso.\"",
    explanation: "El crédito se considera legítimo únicamente cuando la productividad futura generada es suficiente para amortizar el pasivo de forma independiente.",
    isClimax: false,
    position: "bottom-16 left-6 md:left-12 w-[85vw] md:w-[50vw] lg:w-[38vw] text-left items-start", 
    direction: "left"
  },
  {
    label: "Eficiencia Operativa",
    quote: "\"Productividad antes que ingresos.\"",
    explanation: "El modelo evalúa la Productividad del Capital más allá del crecimiento nominal de ingresos. Un aumento de ingresos derivado únicamente de indexación de precios erosiona la competitividad.",
    isClimax: false,
    position: "top-16 right-6 md:right-12 w-[85vw] md:w-[50vw] lg:w-[38vw] text-right items-end",
    direction: "right"
  },
  {
    label: "Financiamiento \"Tractor\"",
    quote: "\"Invertir en productividad es lo esencial.\"",
    explanation: "La asignación de resources se canaliza hacia la productivity — activos que optimizan procesos — y no hacia consumo improductivo.",
    isClimax: false,
    position: "bottom-8 left-6 md:left-12 w-[85vw] md:w-[50vw] lg:w-[38vw] text-left items-start",
    direction: "left"
  },
  {
    label: "",
    quote: "Tres principios, una arquitectura.",
    explanation: "",
    isClimax: true,
    position: "inset-0 flex flex-col items-center justify-center text-center p-6",
    direction: "center"
  }
];

export default function PrincipiosHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px 0px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const slot = 1 / chapters.length;

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

  // 1. Overlay aktif sejak awal (0.55) dan memudar ke 0 pada jarak 95% sampai 100% scroll
  const overlayOpacity = useTransform(scrollYProgress, (v) => {
    if (typeof v !== 'number' || isNaN(v) || v <= 0) return 0.55;
    if (v <= 0.95) return 0.55;
    if (v >= 1) return 0;
    return 0.55 * (1 - (v - 0.95) / 0.05);
  });

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

  return (
    <div ref={containerRef} className="relative h-[550vh] w-full bg-[#F4F4F5]">
      <div className="sticky top-0 h-[calc(100vh+2px)] w-full overflow-hidden cursor-none bg-[#F4F4F5]">
        
        {/* Spotlight Grid Background dengan tema Lightgray (#F4F4F5) persis seperti di Modelo Hero & Nosotros */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <SpotlightGridBackground theme="lightgray" />
        </div>

        {/* Scroll Sequence Background */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <ScrollSequence
            progress={scrollYProgress}
            frameCount={modelPrincipiosSequenceFrames.length}
            imagePaths={modelPrincipiosSequenceFrames}
            className="contrast-105"
            onLoadedChange={setIsSequenceLoaded}
            onProgress={(pct) => setLoadingProgress(pct)}
          />
        </div>

        {/* Overlay Gelap Transparan */}
        <motion.div 
          className="absolute inset-0 bg-black z-[5] pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Hover Trail Overlay */}
        <HoverTrailOverlay 
          theme="white" 
          className="absolute inset-0 z-15 w-full h-full mix-blend-soft-light" 
        />

        {/* Text Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {chapters.map((ch, i) => {
            const start = i * slot;
            const end = (i + 1) * slot;
            const isFirst = i === 0;
            const isLast = i === chapters.length - 1;

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
            
            // blockOpacity: Bab 0 (isFirst) langsung terlihat di awal scroll
            const blockOpacity = useTransform(scrollYProgress, (v) => {
              if (isFirst) {
                if (typeof v !== 'number' || isNaN(v) || v <= slot * 0.5) return 1;
                if (v >= slot) return 0;
                return 1 - ((v - slot * 0.5) / (slot * 0.5));
              }
              if (typeof v !== 'number' || isNaN(v)) return 0;
              const bStart = start;
              if (isLast) {
                const bInEnd = start + slot * 0.15;
                if (v < bStart) return 0;
                if (v < bInEnd) return (v - bStart) / (bInEnd - bStart);
                if (v <= 0.95) return 1;
                if (v >= 1) return 0;
                return 1 - (v - 0.95) / 0.05;
              } else {
                const bInEnd = start + slot * 0.1;
                const bOutStart = end - slot * 0.15;
                const bEnd = end;
                if (v < bStart) return 0;
                if (v < bInEnd) return (v - bStart) / (bInEnd - bStart);
                if (v <= bOutStart) return 1;
                if (v >= bEnd) return 0;
                return 1 - (v - bOutStart) / (bEnd - bOutStart);
              }
            });

            const xTransform = useTransform(
              scrollYProgress,
              isLast
                ? [start, end]
                : [start, end - slot * 0.2, end],
              ch.direction === 'left'
                ? [0, 0, -150]
                : ch.direction === 'right'
                ? [0, 0, 150]
                : [0, 0, 0]
            );

            const yTransform = useTransform(
              scrollYProgress,
              isLast
                ? [start, end]
                : [start, end - slot * 0.2, end],
              ch.direction === 'center'
                ? [0, 150]
                : [0, 0, 0]
            );

            const isExpanded = expandedChapters.has(i);

            if (ch.isClimax) {
              return (
                <motion.div 
                  key={i} 
                  className={`absolute ${ch.position}`}
                  style={{ opacity: blockOpacity, y: yTransform }}
                >
                  <img 
                    src="/logo/Imagen 1.png" 
                    alt="Logo" 
                    loading="eager"
                    fetchPriority="high"
                    className="w-56 md:w-72 lg:w-96 h-auto mb-8 md:mb-12" 
                  />
                  
                  <h1 className="leading-[1.05] tracking-tight w-full max-w-[90vw] lg:max-w-[75vw] mx-auto font-display font-medium text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] inline-block break-words">
                    <HybridRevealText 
                      text={ch.quote} 
                      progress={chapterProgress} 
                      isLast={isLast} 
                      className="inline-block" 
                      style={{ color: 'white' }}
                    />
                  </h1>
                </motion.div>
              );
            }

            return (
              <motion.div 
                key={i} 
                className={`absolute flex flex-col gap-2 ${ch.position}`}
                style={{ opacity: blockOpacity, x: xTransform }}
              >
                
                <h2 className="leading-[1.05] tracking-tight w-full font-display font-medium text-[3.2rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] break-words block">
                  <HybridRevealText
                    text={ch.quote}
                    progress={chapterProgress}
                    isLast={isLast}
                    className="inline"
                    style={{ color: 'white' }}
                  />
                  
                  <motion.button
                    onClick={() => toggleChapter(i)}
                    className="inline-flex items-center justify-center text-white hover:text-[#E5997B] transition-colors duration-300 ml-2 sm:ml-4 pointer-events-auto cursor-pointer align-middle"
                    style={{ opacity: buttonOpacity }} 
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    aria-label="Toggle explanation"
                  >
                    <ChevronDown 
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
                      strokeWidth={3} 
                    />
                  </motion.button>
                </h2>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -12 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -12 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-full pointer-events-auto overflow-hidden mt-1"
                    >
                      <p 
                        className="font-body text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-medium leading-tight w-full break-words pb-2"
                        style={{ color: 'white' }}
                      >
                        <HybridRevealText
                          text={ch.explanation}
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
          theme="light"
          overlayOpacity={overlayOpacity}
          label="Cargando animación" 
        />
      </div>
    </div>
  )
}