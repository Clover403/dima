import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import PageTransition from '../layout/PageTransition';

const backgroundImages = [
  '/illustration-compressed/nosotros/nosotros1.webp',
  '/illustration-compressed/nosotros/nosotros2.webp',
  '/illustration-compressed/nosotros/nosotros3.webp',
];

const chapters = [
  {
    eyebrow: "Nosotros",
    headline: "Arquitectos\ndel\nequilibrio.",
    body: "Somos una Institución de Ingeniería\nFinanciera fundada sobre la ideología\ny filosofía del economista filantrópico\nRaymond Thomas Dalio.",
    // Posisi teks pertama dikembalikan ke kiri atas
    position: "top-24 md:top-32 lg:top-40 left-6 md:left-16 text-left items-start" 
  },
  {
    eyebrow: "Filosofía — 01",
    headline: "No somos un banco.",
    body: "Somos arquitectos de equilibrio.",
    position: "top-1/2 -translate-y-1/2 left-8 md:left-16 text-left items-start"
  },
  {
    eyebrow: "Estrategia — 02",
    headline: "Transformamos la deuda en productividad.",
    body: "Operamos con ciclos, no con intuición.",
    position: "bottom-32 md:bottom-48 lg:bottom-56 right-8 md:right-16 text-right items-end" 
  },
  {
    eyebrow: "Principio DIMA",
    headline: "Replicar para cada empresa la misma lógica de equilibrio.",
    body: "Filosofía Fundacional DIMA.",
    position: "top-1/2 -translate-y-1/2 right-8 md:right-16 text-right items-end"
  },
  {
    eyebrow: "Filosofía fundacional — 2024",
    headline: "El crédito no es deuda — es arquitectura.",
    body: "Cada institución lleva en sí misma un ciclo; nuestra labor es leerlo. Inspirados en la metodología de Raymond Thomas Dalio — adaptada de la macroeconomía al tejido vivo de la empresa.",
    position: "bottom-32 md:bottom-48 lg:bottom-56 left-8 md:left-16 text-left items-start" 
  },
  {
    eyebrow: "Principio DIMA",
    headline: "La deuda no es el problema.",
    body: "El desajuste entre ciclos es el problema.",
    position: "top-1/2 -translate-y-1/2 left-8 md:left-16 text-left items-start"
  },
  {
    eyebrow: "Pilar 01 / Analytics System v1.0",
    headline: "Modelo Macroeconómico Aplicado",
    body: "Adaptamos la ingeniería económica de Ray Dalio al nivel de la empresa. No operamos con intuición — operamos con ciclos verificables.",
    position: "bottom-32 md:bottom-48 lg:bottom-56 right-8 md:right-16 text-right items-end" 
  },
  {
    eyebrow: "Pilar 02 / Solvency Protocol",
    headline: "Evaluación por Solvencia",
    body: "La elegibilidad de crédito se determina por la capacidad de pago real de la entidad — no por su escala o antigüedad superficial.",
    position: "top-1/2 -translate-y-1/2 right-8 md:right-16 text-right items-end"
  },
  {
    eyebrow: "Pilar 03 / Strategic Reconfig",
    headline: "Reconfiguración Estratégica",
    body: "Cuando una entidad no califica, se le interviene. DIMA reconfigura la estructura financiera hasta alcanzar solvencia.",
    position: "bottom-32 md:bottom-48 lg:bottom-56 left-8 md:left-16 text-left items-start" 
  },
  {
    eyebrow: "Pilar 04 / Institutional Link",
    headline: "Enlace Institucional",
    body: "DIMA opera como arquitecto técnico entre la empresa y los comités de crédito de SOFOMEs aliadas.",
    position: "top-1/2 -translate-y-1/2 left-8 md:left-16 text-left items-start"
  },
];

function HybridRevealText({
  text,
  progress,
  className,
  style,
  isLast = false,
  startOffset = 0,
  totalLength,
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
  style?: React.CSSProperties;
  isLast?: boolean;
  startOffset?: number;
  totalLength?: number;
}) {
  const letters = text.split('');
  const tLength = totalLength || letters.length;

  return (
    <span className={`whitespace-pre-wrap ${className || ''}`} style={style}>
      {letters.map((char, i) => {
        const start = (startOffset + i) / tLength;
        const end = (startOffset + i + 1) / tLength;
        return <HybridLetter key={i} char={char} progress={progress} start={start} end={end} isLast={isLast} />;
      })}
    </span>
  );
}

function HybridLetter({
  char,
  progress,
  start,
  end,
  isLast,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  isLast?: boolean;
}) {
  const revealStart = start * 0.6;
  const revealEnd = end * 0.6;

  const opacity = useTransform(
    progress,
    isLast ? [start * 0.7, end * 0.7] : [revealStart, revealEnd],
    [0, 1]
  );

  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

function BackgroundLayer({
  src,
  scrollYProgress,
  fadeInStart,
  fadeInEnd,
  fadeOutStart,
  fadeOutEnd,
}: {
  src: string;
  scrollYProgress: MotionValue<number>;
  fadeInStart: number | null;
  fadeInEnd: number | null;
  fadeOutStart: number | null;
  fadeOutEnd: number | null;
}) {
  const inputRange: number[] = [];
  const outputRange: number[] = [];

  if (fadeInStart !== null && fadeInEnd !== null) {
    inputRange.push(fadeInStart, fadeInEnd);
    outputRange.push(0, 1);
  } else {
    inputRange.push(0);
    outputRange.push(1);
  }

  if (fadeOutStart !== null && fadeOutEnd !== null) {
    inputRange.push(fadeOutStart, fadeOutEnd);
    outputRange.push(1, 0);
  } else {
    inputRange.push(1);
    outputRange.push(1);
  }

  const opacity = useTransform(scrollYProgress, inputRange, outputRange);

  return (
    <motion.img
      src={src}
      className="absolute inset-0 w-full h-full object-cover object-center"
      style={{ opacity }}
    />
  );
}

export default function NosotrosHeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const slot = 1 / chapters.length;

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
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

  const boundary1 = 6 * slot;
  const boundary2 = 9 * slot;
  const fadeWidth = slot * 0.6; 

  const b1Start = boundary1 - fadeWidth / 2;
  const b1End = boundary1 + fadeWidth / 2;
  const b2Start = boundary2 - fadeWidth / 2;
  const b2End = boundary2 + fadeWidth / 2;

 const overlayOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 0.6, 0.6]);
  
  // Animasi untuk logo (memudar seiring scroll bab pertama)
  const logoOpacity = useTransform(scrollYProgress, [0, slot * 0.5, slot, 1], [1, 1, 0, 0]);

  return (
    <PageTransition>
      <div ref={containerRef} className="relative w-full bg-[#F4F4F5]" style={{ height: `${chapters.length * 150}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Background Layers */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <BackgroundLayer
              src={backgroundImages[0]}
              scrollYProgress={scrollYProgress}
              fadeInStart={null}
              fadeInEnd={null}
              fadeOutStart={b1Start}
              fadeOutEnd={b1End}
            />
            <BackgroundLayer
              src={backgroundImages[1]}
              scrollYProgress={scrollYProgress}
              fadeInStart={b1Start}
              fadeInEnd={b1End}
              fadeOutStart={b2Start}
              fadeOutEnd={b2End}
            />
            <BackgroundLayer
              src={backgroundImages[2]}
              scrollYProgress={scrollYProgress}
              fadeInStart={b2Start}
              fadeInEnd={b2End}
              fadeOutStart={null}
              fadeOutEnd={null}
            />
          </div>

          {/* Overlay Gelap */}
          <motion.div 
            className="absolute inset-0 bg-black z-[5] pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />

          {/* Logo Saja (Kanan Bawah) - Muncul di awal saja dan diperbesar */}
          <motion.div 
            className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-20 pointer-events-none flex flex-col items-end"
            style={{ opacity: logoOpacity }}
          >
            <img src="/logo/Imagen 1.png" alt="Logo" className="w-48 md:w-64 lg:w-80 h-auto" />
          </motion.div>

          {/* Text Layer - z-index 50 */}
          <div className="absolute inset-0 z-50 pointer-events-none">
            {chapters.map((ch, i) => {
              const start = i * slot;
              const end = (i + 1) * slot;
              
              const isFirst = i === 0;
              const isLast = i === chapters.length - 1;

              const chapterProgress = useTransform(
                scrollYProgress, 
                isFirst ? [0, 0.01] : [start, end], 
                isFirst ? [1, 1] : [0, 1]
              );
              
              const buttonOpacity = useTransform(
                chapterProgress, 
                isFirst ? [0, 1] : [0.5, 0.7], 
                isFirst ? [1, 1] : [0, 1]
              );

            const blockOpacity = useTransform(
  scrollYProgress,
  isFirst 
    ? [0, slot * 0.5, slot, 1] 
    : isLast
      ? [start, start + slot * 0.05, 1]
      : [start, start + slot * 0.05, end - slot * 0.05, end],
  isFirst
    ? [1, 1, 0, 0]
    : isLast
      ? [0, 1, 1]
      : [0, 1, 1, 0]
);

              const pointerEvents = useTransform(blockOpacity, (v) => v > 0.1 ? "auto" : "none");
              
              const containerWidth = isFirst ? "w-[90%] md:w-[60%] lg:w-[50%]" : "w-[90%] md:w-[33%] lg:w-[28%]";
              const isExpanded = expandedChapters.has(i);
              const textColor = isFirst ? "#030035" : "white";

              return (
                <motion.div
                  key={i}
                  className={`absolute flex flex-col gap-2 ${containerWidth} ${ch.position} z-20`}
                  style={{ opacity: blockOpacity, pointerEvents }} 
                >
                  {ch.eyebrow && (
                    <motion.p
                      className={`font-body text-sm md:text-base tracking-[0.3em] uppercase font-semibold ${isFirst ? 'text-[#030035]' : 'text-[#E5997B]'}`}
                    >
                      {ch.eyebrow}
                    </motion.p>
                  )}

                  <h1 className="leading-[1.05] tracking-tight w-full block break-words">
                    <HybridRevealText
                      text={ch.headline}
                      progress={chapterProgress}
                      isLast={isLast}
                      className={`font-display font-medium inline break-words ${isFirst ? 'text-[4.5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem]' : 'text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem]'}`}
                      style={{ color: textColor }}
                    />

                    <motion.button
                      onClick={() => toggleChapter(i)}
                      className={`inline-flex items-center justify-center hover:text-[#E5997B] transition-colors duration-300 ml-3 sm:ml-5 cursor-pointer relative -top-[0.15em] z-50 ${isFirst ? 'text-[#030035]' : 'text-white'}`}
                      style={{ opacity: buttonOpacity }}
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      aria-label="Toggle explanation"
                    >
                      <ChevronDown 
                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-[3.5rem] md:h-[3.5rem] ${isFirst ? '' : 'drop-shadow-[0_4px_16px_rgba(255,255,255,0.8)]'}`} 
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
                          className="font-body text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-medium leading-tight w-full break-words mt-4 pb-2"
                          style={{ color: textColor }}
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
        </div>
      </div>
    </PageTransition>
  )
}