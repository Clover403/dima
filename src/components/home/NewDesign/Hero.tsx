import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

const chapters = [
  "La economía no es caos.",
  "Es un mecanismo — predecible, medible, replicable.",
  "Adaptamos esa misma lógica a la escala de tu empresa.",
  "Arquitectos de equilibrio.",
];

function RevealText({
  text,
  progress,
  className,
  style,
  isLast = false,
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
  style?: React.CSSProperties;
  isLast?: boolean;
}) {
  const letters = text.split('');
  return (
    <span className={className} style={style}>
      {letters.map((char, i) => {
        const start = i / letters.length;
        const end = (i + 1) / letters.length;
        return <Letter key={i} char={char} progress={progress} start={start} end={end} isLast={isLast} />;
      })}
    </span>
  );
}

function Letter({
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
  const revealStart = start * 0.4;
  const revealEnd = end * 0.4;
  const hideStart = 0.6 + start * 0.4;
  const hideEnd = 0.6 + end * 0.4;

  const opacity = useTransform(
    progress,
    isLast
      ? [start * 0.6, end * 0.6]
      : [revealStart, revealEnd, hideStart, hideEnd],
    isLast ? [0, 1] : [0, 1, 1, 0]
  );

  return <motion.span style={{ opacity }}>{char === ' ' ? '\u00A0' : char}</motion.span>;
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const INTRO_END = 0.12;
  const TEXT_END = 0.7;

  const backgroundY = useTransform(scrollYProgress, [TEXT_END, 1], ['0%', '-5%']);
  const backgroundX = useTransform(scrollYProgress, [TEXT_END, 1], ['0%', '3%']);
  const foregroundY = useTransform(scrollYProgress, [TEXT_END, 1], ['0%', '15%']);
  const foregroundX = useTransform(scrollYProgress, [TEXT_END, 1], ['0%', '-3%']);

  // Animasi Wordmark "DIMA FINANCE" (Hanya Fade-Out pas discroll tanpa bergeser)
  const introOpacity = useTransform(
    scrollYProgress,
    [0, INTRO_END * 0.8, INTRO_END],
    [1, 1, 0]
  );

  const n = chapters.length;
  const chapterSpan = TEXT_END - INTRO_END;
  const slot = chapterSpan / n;

  const textBlockOpacity = useTransform(scrollYProgress, [TEXT_END - 0.05, TEXT_END + 0.05], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[550vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#F4F4F5] flex">

        {/* Background — statis sampai TEXT_END */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-0 pointer-events-none flex justify-center h-[105%]"
          style={{ y: backgroundY, x: backgroundX }}
        >
          <img src="/illustration-compressed/home/temple6.webp" alt="Temple Background" className="w-full h-full object-cover object-bottom" />
        </motion.div>

        {/* 
          DIMA: Z-10 (Belakang foreground) 
          - Dibuat 2 Baris (DIMA <br /> FINANCE)
          - Dikecilkan sedikit (text-[17vw])
          - Digeser ke atas (top-[15%])
          - Tanpa animasi geser kiri/kanan
        */}
       {/* DIMA & FINANCE: Z-10 - Geser Berlawanan saat Scroll */}
        <motion.div
          className="absolute z-10 top-[15%] md:top-[16%] left-0 w-full pointer-events-none select-none pl-6 md:pl-12 lg:pl-16"
        >
          {/* DIMA - Geser ke Kiri */}
          <motion.div 
            style={{ 
              opacity: introOpacity,
              x: useTransform(scrollYProgress, [0, INTRO_END], ['0%', '-50%']) 
            }}
          >
            <h1
              className="leading-[0.8] tracking-tighter font-normal text-[24vw] md:text-[20vw] lg:text-[17vw]"
              style={{ fontFamily: "'Playfair Display', serif", color: '#030035' }}
            >
              DIMA
            </h1>
          </motion.div>

          {/* FINANCE - Geser ke Kanan */}
          <motion.div 
            style={{ 
              opacity: introOpacity,
              x: useTransform(scrollYProgress, [0, INTRO_END], ['0%', '50%']) 
            }}
          >
            <h1
              className="leading-[0.8] tracking-tighter font-normal text-[24vw] md:text-[20vw] lg:text-[17vw]"
              style={{ fontFamily: "'Playfair Display', serif", color: '#030035' }}
            >
              FINANCE
            </h1>
          </motion.div>
        </motion.div>

        {/* 
          Text Layer: chapter narasi 
          - Batas lebar maksimal 55% layar (berhenti di tengah lalu turun ke bawah)
          - Teks dibesarkan (6.2vw)
          - Muncul per huruf -> Tahan -> Hilang per huruf dari kiri ke kanan
        */}
        <motion.div
          className="absolute z-10 top-24 left-6 md:top-32 md:left-12 lg:top-36 lg:left-16 w-[90%] md:w-[65%] lg:w-[55%] max-w-none lg:max-w-[55vw]"
          style={{ opacity: textBlockOpacity }}
        >
          {chapters.map((text, i) => {
            const start = INTRO_END + i * slot;
            const end = start + slot;
            const isLast = i === n - 1;

            const chapterProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

            const chapterOpacity = useTransform(
              scrollYProgress,
              [Math.max(0, start - 0.02), start],
              [0, 1]
            );

            return (
              <motion.div key={i} className="absolute top-0 left-0 w-full" style={{ opacity: chapterOpacity }}>
                <RevealText
                  text={text}
                  progress={chapterProgress}
                  isLast={isLast}
                  className="block leading-[1.0] tracking-tight font-normal drop-shadow-lg text-[3rem] sm:text-[4rem] md:text-[5.5vw] lg:text-[6.2vw] break-words"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: isLast ? '#E5997B' : '#030035',
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Foreground — statis sampai TEXT_END */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center h-[105%]"
          style={{ y: foregroundY, x: foregroundX }}
        >
          <img src="/illustration-compressed/home/temple9.webp" alt="Temple Foreground" className="w-full h-full object-cover object-bottom" />
        </motion.div>
      </div>
    </div>
  );
}