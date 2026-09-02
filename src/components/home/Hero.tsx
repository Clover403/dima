import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import HoverTrailOverlay from '../HoverTrailOverlay';
import ScrollSequence from '../ScrollSequence';
import HybridRevealText from '../HybridRevealText';
import { homeSequenceFrames } from '../../lib/sequences';
const chapters = [
  "La economía no es caos.",
  "Es un mecanismo — predecible, medible, replicable.",
  "Adaptamos esa misma lógica a la escala de tu empresa.",
  "Arquitectos de equilibrio.",
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const SEQUENCE_END = 0.75;
  const PARALLAX_START = 0.75;

  // Sequence controls
  const sequenceProgress = useTransform(scrollYProgress, [0, SEQUENCE_END], [0, 1]);
  const sequenceOpacity = useTransform(scrollYProgress, (v) => v >= SEQUENCE_END ? 0 : 1);
  const textBlockOpacity = useTransform(scrollYProgress, [SEQUENCE_END - 0.05, SEQUENCE_END], [1, 0]);
  const textBlockVisibility = useTransform(scrollYProgress, (v) => v >= SEQUENCE_END ? "hidden" : "visible");
  const overlayOpacity = useTransform(scrollYProgress, [0, SEQUENCE_END - 0.1, SEQUENCE_END], [0.3, 0.3, 0]);

  // Parallax controls
  const parallaxOpacity = useTransform(scrollYProgress, (v) => v >= SEQUENCE_END ? 1 : 0);
  const backgroundY = useTransform(scrollYProgress, [PARALLAX_START, 1], ['0%', '10%']);
  const backgroundScale = useTransform(scrollYProgress, [PARALLAX_START, 1], [1.05, 1.25]);
  const foregroundY = useTransform(scrollYProgress, [PARALLAX_START, 1], ['0%', '15%']);
  const foregroundX = useTransform(scrollYProgress, [PARALLAX_START, 1], ['0%', '3%']);

  // DIMA FINANCE Text controls
  const dimaOpacity = useTransform(
    scrollYProgress,
    [PARALLAX_START, PARALLAX_START + 0.05, PARALLAX_START + 0.10, PARALLAX_START + 0.20, 1],
    [0, 1, 1, 0, 0]
  );
  const dimaLeftX = useTransform(
    scrollYProgress,
    [PARALLAX_START + 0.10, PARALLAX_START + 0.20],
    ['0%', '-50%']
  );
  const dimaRightX = useTransform(
    scrollYProgress,
    [PARALLAX_START + 0.10, PARALLAX_START + 0.20],
    ['0%', '50%']
  );

  const n = chapters.length;
  const slot = SEQUENCE_END / n;

  // Initial logo that fades out as soon as user starts scrolling
  const initialLogoOpacity = useTransform(scrollYProgress, [0, 0.015, 1], [1, 0, 0]);

  return (
    <div ref={containerRef} className="relative h-[650vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#F4F4F5] flex">

        {/* 1. Scroll Sequence Layer (z-0) */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-0 flex justify-center h-[105%] bg-[#F4F4F5] cursor-none"
          style={{ opacity: sequenceOpacity }}
        >
          <ScrollSequence
            progress={sequenceProgress}
            frameCount={homeSequenceFrames.length}
            imagePaths={homeSequenceFrames}
            className="object-cover md:object-contain object-bottom contrast-105"
          />
          <HoverTrailOverlay
            theme="lightgray"
            className="absolute inset-0 w-full h-full z-[2]"
          />
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none z-[3]"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>

        {/* Initial Logo & Text (z-15) */}
        <motion.div
          className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none flex flex-col items-center"
          style={{ opacity: initialLogoOpacity }}
        >
          <img src="/logo/Imagen 1.png" alt="Logo" className="w-60 md:w-80 lg:w-[20rem] h-auto mb-5 md:mb-6" />

          <div className="flex flex-col items-center mt-3">
            <h1
              className="relative -left-1 lg:-left-2 leading-[0.85] tracking-tight font-normal text-[4rem] md:text-[5rem] lg:text-[7.5rem]"
              style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#ffffffff', letterSpacing: '-0.02em' }}
            >
              DIMA
            </h1>
            <h1
              className="leading-[0.85] tracking-normal font-medium text-[2.5rem] md:text-[3.2rem] lg:text-[4rem]"
              style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#ffffffff', letterSpacing: '0.06em' }}
            >
              FINANCE
            </h1>
          </div>
        </motion.div>

        {/* 2. Text Layer: chapter narasi (z-10) */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: textBlockOpacity, visibility: textBlockVisibility }}
        >
          {chapters.map((text, i) => {
            const start = i * slot;
            const end = start + slot;
            const isLast = i === n - 1;
            const isBottom = i < 2;

            const chapterProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

            let opacityInput, opacityOutput;
            if (isLast) {
              opacityInput = [start - 0.001, start];
              opacityOutput = [0, 1];
            } else if (i === 0) {
              opacityInput = [0, end - 0.05, end];
              opacityOutput = [1, 1, 0];
            } else {
              opacityInput = [start - 0.02, start, end - 0.05, end];
              opacityOutput = [0, 1, 1, 0];
            }
            const chapterOpacity = useTransform(scrollYProgress, opacityInput, opacityOutput);
            const chapterVisibility = useTransform(chapterOpacity, (v) => v > 0 ? "visible" : "hidden");

            return (
              <motion.div
                key={i}
                className={`absolute left-6 md:left-12 lg:left-16 w-[90%] md:w-[65%] lg:w-[55%] max-w-none lg:max-w-[55vw] ${isBottom ? 'bottom-24 md:bottom-32 lg:bottom-36' : 'top-32 md:top-40 lg:top-48'}`}
                style={{ opacity: chapterOpacity, visibility: chapterVisibility }}
              >
                <HybridRevealText
                  text={text}
                  progress={chapterProgress}
                  isLast={isLast}
                  className="block leading-[1.0] tracking-tight font-normal drop-shadow-lg text-[2.5rem] sm:text-[3rem] md:text-[4.5vw] lg:text-[5.2vw] break-words"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                  }}
                  targetColor={isLast ? '#030035' : 'white'}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* 3. Parallax Layer (z-20) */}
        <div className="absolute inset-0 z-20 pointer-events-none">

          {/* Parallax Background */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-0 flex justify-center h-[105%] origin-bottom"
            style={{ opacity: parallaxOpacity, y: backgroundY, scale: backgroundScale }}
          >
            <img src="/illustration-compressed/home/temple6.webp" alt="Temple Background" className="w-full h-full object-cover md:object-contain object-bottom" />
          </motion.div>

          {/* DIMA & FINANCE Text Parallax */}
          <motion.div
            className="absolute z-10 top-[15%] md:top-[16%] left-0 w-full pl-6 md:pl-12 lg:pl-16"
          >
            <motion.div style={{ opacity: dimaOpacity, x: dimaLeftX }}>
              <h1
                className="leading-[0.8] tracking-tight font-normal text-[24vw] md:text-[20vw] lg:text-[17vw]"
                style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#030035', letterSpacing: '-0.02em' }}
              >
                DIMA
              </h1>
            </motion.div>

            <motion.div style={{ opacity: dimaOpacity, x: dimaRightX }}>
              <h1
                className="leading-[0.8] tracking-tight font-normal text-[24vw] md:text-[20vw] lg:text-[17vw]"
                style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", color: '#030035', letterSpacing: '-0.02em' }}
              >
                FINANCE
              </h1>
            </motion.div>
          </motion.div>

          {/* Parallax Foreground */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-20 flex justify-center h-[105%]"
            style={{ opacity: parallaxOpacity, y: foregroundY, x: foregroundX }}
          >
            <img src="/illustration-compressed/home/temple9.webp" alt="Temple Foreground" className="w-full h-full object-cover md:object-contain object-bottom" />
          </motion.div>
        </div>

      </div>
    </div>
  );
}