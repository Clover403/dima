import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const backgroundImages = [
  "/illustration-compressed/models/modelo1.webp",
  "/illustration-compressed/models/modelo2.webp",
  "/illustration-compressed/models/modelo4.webp"
];

const chapters = [
  {
    eyebrow: "01 — Fundamento Teórico",
    headline: "Simple. Mecánica. Predecible.",
    body: "Tres fuerzas mueven toda la economía. Entenderlas es entender nuestro modelo.",
    position: "bottom-12 md:bottom-24 right-8 md:right-16 text-right items-end"
  },
  {
    eyebrow: "02 — La Transacción",
    headline: "Dinero por valor. Así comienza todo.",
    body: "Un comprador entrega dinero o crédito; un vendedor entrega bienes o servicios.",
    position: "top-1/2 -translate-y-1/2 left-8 md:left-16 text-left items-start"
  },
  {
    eyebrow: "03 — El Gasto",
    headline: "Tu gasto es el ingreso de alguien más.",
    body: "Gastar más impulsa a otros a ganar más — y así crece la economía.",
    position: "bottom-12 md:bottom-24 left-1/2 -translate-x-1/2 text-center items-center"
  },
  {
    eyebrow: "04 — El Crédito",
    headline: "El crédito amplifica lo que la economía puede gastar.",
    body: "Más ingreso permite pedir prestado. Más crédito, más gasto, más economía.",
    position: "bottom-12 md:bottom-24 left-8 md:left-16 text-left items-start"
  }
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

function CrossfadeImage({
  src,
  index,
  scrollYProgress,
  slot,
  total,
  flip = false
}: {
  src: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  slot: number;
  total: number;
  flip?: boolean;
}) {
  const windowHalf = slot * 0.15; 
  
  const startFadeIn = index * slot - windowHalf;
  const endFadeIn = index * slot + windowHalf;
  
  const startFadeOut = (index + 1) * slot - windowHalf;
  const endFadeOut = (index + 1) * slot + windowHalf;

  let rangeMap = [startFadeIn, endFadeIn, startFadeOut, endFadeOut];
  let opacityMap = [0, 1, 1, 0];

  if (index === 0) {
    rangeMap = [0, 0, startFadeOut, endFadeOut];
    opacityMap = [1, 1, 1, 0];
  } else if (index === total - 1) {
    rangeMap = [startFadeIn, endFadeIn, 1, 1];
    opacityMap = [0, 1, 1, 1];
  }

  const opacity = useTransform(scrollYProgress, rangeMap, opacityMap);

  return (
    <motion.img 
      src={src}
      className={`absolute inset-0 w-full h-full object-cover object-center ${flip ? '-scale-x-100' : ''}`}
      style={{ opacity }}
    />
  );
}

export default function ModeloHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const slot = 1 / chapters.length;
  const imageSlot = 1 / backgroundImages.length;

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

  const logoOpacity = useTransform(scrollYProgress, [0, 0.015, 1], [1, 0, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.6, 0.7, 0]);

  return (
    <div ref={containerRef} className="relative h-[650vh] w-full bg-[#F4F4F5]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Background Images Crossfading */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {backgroundImages.map((src, i) => (
            <CrossfadeImage 
              key={i} 
              src={src} 
              index={i} 
              scrollYProgress={scrollYProgress} 
              slot={imageSlot}
              total={backgroundImages.length}
              flip={i === 2}
            />
          ))}
        </div>

        {/* Overlay Gelap Transparan */}
        <motion.div 
          className="absolute inset-0 bg-black z-[5] pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

      {/* Logo & Teks DIMA FINANCE (z-20) */}
<motion.div 
  className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
  style={{ opacity: logoOpacity }}
>
  {/* Logo (diatur ke skala sedang: w-52 / w-68 / w-80) */}
  <img src="/logo/Imagen 1.png" alt="Logo" className="w-52 md:w-68 lg:w-80 h-auto mb-7 md:mb-8" />          
  
  {/* Teks persis seperti gambar */}
  <div className="flex flex-col items-start text-white font-sans">
    {/* DIMA (menggunakan font-medium) */}
    <span className="text-7xl md:text-8xl lg:text-[9rem] font-normal leading-[0.85] tracking-tight">
      DIMA
    </span>
    {/* FINANCE (diatur seimbang di bawah DIMA) */}
    <span className="text-4xl md:text-6xl lg:text-[4.4rem] font-semibold leading-none tracking-widest mt-1.5 ml-1.5 md:ml-2.5">
      FINANCE
    </span>
  </div>
</motion.div>

        {/* Text Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {chapters.map((ch, i) => {
            const start = i * slot;
            const end = (i + 1) * slot;
            const isLast = i === chapters.length - 1;

            const chapterProgress = useTransform(scrollYProgress, [start, end], [0, 1]);
            const buttonOpacity = useTransform(chapterProgress, [0.5, 0.7], [0, 1]);
            
            // Ubah bagian blockOpacity menjadi ini:
const blockOpacity = useTransform(
  scrollYProgress,
  isLast 
    ? [start, start + slot * 0.05, 1] // Tambahkan 1 di sini
    : [start, start + slot * 0.05, end - slot * 0.05, end],
  isLast 
    ? [0, 1, 1] // Tambahkan 1 di sini
    : [0, 1, 1, 0]
);

            const eyebrowOpacity = useTransform(
              chapterProgress,
              isLast 
                ? [0.15, 0.35, 1, 1] 
                : [0.15, 0.35, 0.65, 0.85],
              isLast
                ? [0, 1, 1, 1]
                : [0, 1, 1, 0]
            );

            const containerWidth = i === 2 
              ? "w-[95%] max-w-7xl" 
              : "w-[90%] md:w-[80%] lg:w-[70%] max-w-6xl";
              
            const isExpanded = expandedChapters.has(i);

            return (
              <motion.div 
                key={i} 
                className={`absolute flex flex-col gap-2 ${containerWidth} ${ch.position}`}
                style={{ opacity: blockOpacity }}
              >
                {ch.eyebrow && (
                  <motion.p 
                    className="font-body text-[#E5997B] text-base md:text-lg tracking-[0.3em] uppercase font-semibold relative z-10"
                    style={{ opacity: eyebrowOpacity }}
                  >
                    {ch.eyebrow}
                  </motion.p>
                )}
                
                {/* Judul + Toggle Button */}
                <h1 className="leading-[1.05] tracking-tight w-full block break-words relative z-10">
                  <HybridRevealText
                    text={ch.headline}
                    progress={chapterProgress}
                    isLast={isLast}
                    className="font-display font-medium text-[4.2rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] inline break-words"
                    style={{ color: isLast ? "#030035" : "white" }}
                  />
                  
                  <motion.button
                    onClick={() => toggleChapter(i)}
                    className={`inline-flex items-center justify-center hover:text-[#E5997B] transition-colors duration-300 ml-3 sm:ml-5 pointer-events-auto cursor-pointer relative -top-[0.15em] ${isLast ? 'text-[#030035]' : 'text-white'}`}
                    style={{ opacity: buttonOpacity }}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    aria-label="Toggle explanation"
                  >
                    <ChevronDown 
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-[4.5rem] md:h-[4.5rem]" 
                      strokeWidth={3} 
                    />
                  </motion.button>
                </h1>
                
                {/* Animasi Body Text Dropdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-full pointer-events-auto overflow-hidden relative z-10"
                    >
                      <p 
                        className={`font-body text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-medium leading-tight w-full break-words mt-4 pb-2 ${isLast ? 'text-[#030035]' : 'text-white'}`}
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
  )
}