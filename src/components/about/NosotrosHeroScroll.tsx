import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import HoverTrailOverlay from '../HoverTrailOverlay';
import ScrollSequence from '../ScrollSequence';
import HybridRevealText from '../HybridRevealText';

const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || '';
const nosotros1Frames = Array.from({ length: 176 }, (_, i) => `${R2_BASE_URL}/nosotros1/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
const nosotros2Frames = Array.from({ length: 144 }, (_, i) => `${R2_BASE_URL}/nosotros2/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
const nosotros3Frames = Array.from({ length: 176 }, (_, i) => `${R2_BASE_URL}/nosotros3/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
const nosotrosSequenceFrames = [...nosotros1Frames, ...nosotros2Frames, ...nosotros3Frames];

const chapters = [
  {
    eyebrow: "Nosotros",
    headline: "Arquitectos\ndel equilibrio.",
    body: "Somos una Institución de Ingeniería\nFinanciera fundada sobre la ideología\ny filosofía del economista filantrópico\nRaymond Thomas Dalio.",
    // Posisi diperkecil
    position: "bottom-16 md:bottom-24 lg:bottom-32 left-4 md:left-12 text-left items-start" 
  },
  {
    eyebrow: "Filosofía — 01",
    headline: "No somos un banco.",
    body: "Somos arquitectos de equilibrio.",
    // Posisi diperkecil
    position: "top-1/2 -translate-y-1/2 left-6 md:left-12 text-left items-start"
  },
  {
    eyebrow: "Estrategia — 02",
    headline: "Transformamos la deuda en productividad.",
    body: "Operamos con ciclos, no con intuición.",
    // Posisi diperkecil
    position: "bottom-24 md:bottom-36 lg:bottom-48 right-6 md:right-12 text-right items-end" 
  },
  {
    eyebrow: "Principio DIMA",
    headline: "Replicar para cada empresa la misma lógica de equilibrio.",
    body: "Filosofía Fundacional DIMA.",
    // PERBAIKAN: Posisi Teks 4 menjadi BAWAH TENGAH
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-1/2 -translate-x-1/2 text-center items-center"
  },
  {
    eyebrow: "Principio DIMA",
    // Tambahkan \n untuk memisah jadi 2 baris
    headline: "Replicar para cada empresa\nla misma lógica de equilibrio.",
    body: "Filosofía Fundacional DIMA.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-1/2 -translate-x-1/2 text-center items-center"
  },
  {
    eyebrow: "Filosofía fundacional — 2024",
    // Tambahkan \n untuk memisah jadi 2 baris
    headline: "El crédito no es deuda —\nes arquitectura.",
    body: "Cada institución lleva en sí misma un ciclo; nuestra labor es leerlo. Inspirados en la metodología de Raymond Thomas Dalio — adaptada de la macroeconomía al tejido vivo de la empresa.",
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-1/2 -translate-x-1/2 text-center items-center" 
  },
  {
    eyebrow: "Pilar 01 / Analytics System v1.0",
    headline: "Modelo Macroeconómico Aplicado",
    body: "Adaptamos la ingeniería económica de Ray Dalio al nivel de la empresa. No operamos con intuición — operamos con ciclos verificables.",
    // Posisi diperkecil
    position: "bottom-24 md:bottom-36 lg:bottom-48 right-6 md:right-12 text-right items-end" 
  },
  {
    eyebrow: "Pilar 02 / Solvency Protocol",
    headline: "Evaluación por Solvencia",
    body: "La elegibilidad de crédito se determina por la capacidad de pago real de la entidad — no por su escala o antigüedad superficial.",
    // Posisi diperkecil
    position: "top-1/2 -translate-y-1/2 right-6 md:right-12 text-right items-end"
  },
  {
    eyebrow: "Pilar 03 / Strategic Reconfig",
    headline: "Reconfiguración Estratégica",
    body: "Cuando una entidad no califica, se le interviene. DIMA reconfigura la estructura financiera hasta alcanzar solvencia.",
    // Posisi diperkecil
    position: "bottom-24 md:bottom-36 lg:bottom-48 left-6 md:left-12 text-left items-start" 
  },
  {
    eyebrow: "Pilar 04 / Institutional Link",
    headline: "Enlace Institucional",
    body: "DIMA opera como arquitecto técnico entre la empresa y los comités de crédito de SOFOMEs aliadas.",
    // Posisi diperkecil
    position: "top-1/2 -translate-y-1/2 left-6 md:left-12 text-left items-start"
  },
];

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

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.5, 0.5, 0]);
  const logoOpacity = useTransform(scrollYProgress, [0, slot * 0.5, slot, 1], [1, 1, 0, 0]);

  return (
      <div ref={containerRef} className="relative w-full bg-[#F4F4F5]" style={{ height: `${chapters.length * 150}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          <div className="absolute inset-0 z-0 pointer-events-none">
            <ScrollSequence 
              progress={scrollYProgress} 
              frameCount={nosotrosSequenceFrames.length} 
              imagePaths={nosotrosSequenceFrames} 
            />
          </div>

          <div className="absolute inset-0 z-[2] pointer-events-auto cursor-none">
            <HoverTrailOverlay theme="white" className="w-full h-full mix-blend-soft-light" />
          </div>

          <motion.div 
            className="absolute inset-0 bg-black z-[5] pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />

          <motion.div 
            className="absolute bottom-6 right-6 md:bottom-8 md:right-12 z-20 pointer-events-none flex flex-col items-end"
            style={{ opacity: logoOpacity }}
          >
            {/* Logo diperkecil ukurannya */}
            <img src="/logo/Imagen 1.png" alt="Logo" className="w-40 md:w-56 lg:w-72 h-auto" />
          </motion.div>

          <div className="absolute inset-0 z-50 pointer-events-none">
            {chapters.map((ch, i) => {
              const start = i * slot;
              const end = (i + 1) * slot;
              
              const isFirst = i === 0;
              const isLast = i === chapters.length - 1;
              const isCentered = i === 3 || i === 4; // Teks 4 dan 5

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
                    ? [start, start + slot * 0.05, 0.95, 1]
                    : [start, start + slot * 0.05, end - slot * 0.05, end],
                isFirst
                  ? [1, 1, 0, 0]
                  : isLast
                    ? [0, 1, 1, 0]
                    : [0, 1, 1, 0]
              );

              const pointerEvents = useTransform(blockOpacity, (v) => v > 0.1 ? "auto" : "none");
              
              // Menyesuaikan lebar kontainer. Khusus untuk elemen yang centered, berikan ruang lebih agar teks tidak terlalu terjepit.
              const containerWidth = isFirst 
                ? "w-[85%] md:w-[55%] lg:w-[45%]" 
                : isCentered 
                  ? "w-[90%] md:w-[60%] lg:w-[50%]" 
                  : "w-[85%] md:w-[30%] lg:w-[25%]";

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
                      // Eyebrow diperkecil
                      className={`font-body text-xs md:text-sm tracking-[0.3em] uppercase font-semibold ${isFirst ? 'text-[#030035]' : 'text-[#E5997B]'}`}
                    >
                      {ch.eyebrow}
                    </motion.p>
                  )}

                  <h1 className="leading-[1.05] tracking-tight w-full block break-words">
                    <HybridRevealText
                      text={ch.headline}
                      progress={chapterProgress}
                      isLast={isLast}
                      // Teks utama diperkecil 1 tingkat
                      className={`font-display font-medium inline break-words ${isFirst ? 'text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem]' : 'text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem]'}`}
                      targetColor={isFirst ? '#030035' : '#E5E5E5'}
                    />

                    <motion.button
                      onClick={() => toggleChapter(i)}
                      // Margin dan chevron icon diperkecil
                      className={`inline-flex items-center justify-center hover:text-[#E5997B] transition-colors duration-300 ml-2 sm:ml-4 cursor-pointer relative -top-[0.15em] z-50 ${isFirst ? 'text-[#030035]' : 'text-white'}`}
                      style={{ opacity: buttonOpacity }}
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      aria-label="Toggle explanation"
                    >
                      <ChevronDown 
                        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-[3rem] md:h-[3rem] ${isFirst ? '' : 'drop-shadow-[0_4px_16px_rgba(255,255,255,0.8)]'}`} 
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
                          // Teks deskripsi dan margin/padding diperkecil
                          className="font-body text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-medium leading-tight w-full break-words mt-3 pb-1"
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
  );
}