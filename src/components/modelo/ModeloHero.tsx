import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import HoverTrailOverlay from '../HoverTrailOverlay' 
import ScrollSequence from '../ScrollSequence'
import HybridRevealText from '../HybridRevealText'

const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || '';
const models1Frames = Array.from({ length: 136 }, (_, i) => `${R2_BASE_URL}/models1_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
const models2Frames = Array.from({ length: 136 }, (_, i) => `${R2_BASE_URL}/models2_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
const heroSequenceFrames = [...models1Frames, ...models2Frames];

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

export default function ModeloHero() {
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

  const logoOpacity = useTransform(scrollYProgress, [0, 0.015, 1], [1, 0, 0]);
  
  // Overlay diturunkan ke 0.5 - 0.6
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.5, 0.6, 0]);

  return (
    <div ref={containerRef} className="relative h-[650vh] w-full bg-[#F4F4F5]">
      <div className="sticky top-0 h-screen w-full overflow-hidden cursor-none">
        
        {/* Scroll Sequence Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ScrollSequence 
            progress={scrollYProgress} 
            frameCount={heroSequenceFrames.length} 
            imagePaths={heroSequenceFrames} 
          />
        </div>

        {/* Overlay Gelap Transparan */}
        <motion.div 
          className="absolute inset-0 bg-black z-[5] pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Hover Trail Overlay - Diubah temanya agar lebih pop-up */}
        <HoverTrailOverlay 
          theme="white" 
          className="absolute inset-0 z-15 w-full h-full" 
        />

        {/* Logo & Teks DIMA FINANCE (z-20) */}
        <motion.div 
          className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
          style={{ opacity: logoOpacity }}
        >
          <img src="/logo/Imagen 1.png" alt="Logo" className="w-52 md:w-68 lg:w-80 h-auto mb-7 md:mb-8" />          
          
          <div className="flex flex-col items-center mt-4">
            <h1
              className="relative -left-1 lg:-left-2 leading-[0.85] tracking-tighter font-normal text-[5.5rem] md:text-[4.5rem] lg:text-[7rem]"
              style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#ffffffff', letterSpacing: '0.02em' }}
            >
              DIMA
            </h1>
            
            <h1
              className="leading-[0.85] tracking-normal font-medium text-[3.2rem] md:text-[3.8rem] lg:text-[4rem]"
              style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#ffffffff', letterSpacing: '0.05em' }}
            >
              FINANCE
            </h1>
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
            
            const blockOpacity = useTransform(
              scrollYProgress,
              isLast 
                ? [start, start + slot * 0.05, 1] 
                : [start, start + slot * 0.05, end - slot * 0.05, end],
              isLast 
                ? [0, 1, 1] 
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
                    className="font-body text-[#E5997B] text-xs md:text-sm tracking-[0.3em] uppercase font-semibold relative z-10"
                    style={{ opacity: eyebrowOpacity }}
                  >
                    {ch.eyebrow}
                  </motion.p>
                )}
                
                <h1 className="leading-[1.05] tracking-tight w-full block break-words relative z-10">
                  <HybridRevealText
                    text={ch.headline}
                    progress={chapterProgress}
                    isLast={isLast}
                    className="font-display font-medium text-[3.2rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] inline break-words"
                    targetColor={isLast ? "#030035" : "#E5E5E5"} 
                  />
                  
                  <motion.button
                    onClick={() => toggleChapter(i)}
                    className={`inline-flex items-center justify-center hover:text-[#E5997B] transition-colors duration-300 ml-3 sm:ml-5 pointer-events-auto cursor-pointer relative -top-[0.15em] ${isLast ? 'text-[#030035]' : 'text-white'}`}
                    style={{ opacity: buttonOpacity }}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    aria-label="Toggle explanation"
                  >
                    <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 md:w-[3rem] md:h-[3rem]" strokeWidth={3} />
                  </motion.button>
                </h1>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-full pointer-events-auto overflow-hidden relative z-10"
                    >
                      <p className="font-body text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-medium leading-tight w-full break-words mt-4 pb-2">
                        <HybridRevealText
                          text={ch.body}
                          progress={chapterProgress}
                          isLast={isLast}
                          targetColor={isLast ? "#030035" : "#E5E5E5"}
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