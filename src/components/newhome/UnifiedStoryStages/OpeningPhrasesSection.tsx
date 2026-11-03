import type { MutableRefObject } from 'react';
import { type MotionValue } from 'framer-motion';
import { HERO_STAGE_DATA } from '../newHomeData';
import HybridRevealText from '../../HybridRevealText';

interface OpeningPhrasesSectionProps {
  phaseRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  phrase1Progress: MotionValue<number>;
  phrase2Progress: MotionValue<number>;
  phrase3Progress: MotionValue<number>;
}

export default function OpeningPhrasesSection({
  phaseRefs,
  phrase1Progress,
  phrase2Progress,
  phrase3Progress,
}: OpeningPhrasesSectionProps) {
  return (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* PHASE 0: Opening Phrase 1 ("La economía\nno es caos.") - Kanan Atas */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={(el) => { phaseRefs.current[0] = el; }}
        className="absolute right-8 sm:right-12 lg:right-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[70%] lg:w-[45vw] lg:max-w-[36vw] text-right flex flex-col items-end pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
        style={{ opacity: 0 }}
      >
        <h2
          className="block leading-[1.08] lg:leading-[5.6vw] tracking-tight font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-[2.5rem] sm:text-[3.2rem] md:text-[4.5vw] lg:text-[5.2vw] break-words text-white text-right"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <HybridRevealText
            text={HERO_STAGE_DATA.openingPhrases[0]}
            progress={phrase1Progress}
            targetColor="#FFFFFF"
          />
        </h2>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PHASE 1: Opening Phrase 2 ("Es un mecanismo — predecible...") - Kanan Atas (Posisi sama dengan Frasa 1) */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={(el) => { phaseRefs.current[1] = el; }}
        className="absolute right-8 sm:right-12 lg:right-[4.17vw] top-20 sm:top-24 lg:top-[10.5vh] w-[90%] sm:w-[70%] lg:w-[45vw] lg:max-w-[36vw] text-right flex flex-col items-end pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
        style={{ opacity: 0 }}
      >
        <h2
          className="block leading-[1.08] lg:leading-[5.2vw] tracking-tight font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-[2.5rem] sm:text-[3rem] md:text-[4.2vw] lg:text-[4.8vw] break-words text-white text-right"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <HybridRevealText
            text={HERO_STAGE_DATA.openingPhrases[1]}
            progress={phrase2Progress}
            targetColor="#FFFFFF"
          />
        </h2>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PHASE 2: Opening Phrase 3 ("Adaptamos esa misma lógica...") - Kanan Bawah */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={(el) => { phaseRefs.current[2] = el; }}
        className="absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-16 sm:bottom-20 lg:bottom-[8.9vh] w-[90%] sm:w-[70%] lg:w-[48vw] lg:max-w-[38vw] text-right flex flex-col items-end pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
        style={{ opacity: 0 }}
      >
        <h2
          className="block leading-[1.08] lg:leading-[5.2vw] tracking-tight font-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-[2.5rem] sm:text-[3rem] md:text-[4.2vw] lg:text-[4.8vw] break-words text-white text-right"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <HybridRevealText
            text={HERO_STAGE_DATA.openingPhrases[2]}
            progress={phrase3Progress}
            targetColor="#FFFFFF"
          />
        </h2>
      </div>
    </>
  );
}
