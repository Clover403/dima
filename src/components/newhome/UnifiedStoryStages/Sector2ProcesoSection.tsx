import { motion, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type SectorData } from '../newHomeData';
import HybridRevealText from '../../HybridRevealText';

interface Sector2ProcesoSectionProps {
  phaseRef: (el: HTMLDivElement | null) => void;
  data: SectorData;
  contentY: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
  titleOpacity: MotionValue<number>;
  titleProgress: MotionValue<number>;
  descOpacity: MotionValue<number>;
}

export default function Sector2ProcesoSection({
  phaseRef,
  data,
  contentY,
  overlayOpacity,
  titleOpacity,
  titleProgress,
  descOpacity,
}: Sector2ProcesoSectionProps) {
  return (
    <div
      ref={phaseRef}
      className="absolute inset-0 pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
      style={{ opacity: 0 }}
    >
      {/* Content Block (Judul, Tombol CTA & Seluruh Deskripsi Utuh) - Tengah (Presisi Seimbang Gap Atas & Bawah) */}
      <motion.div
        style={{
          y: contentY,
        }}
        className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-0 mx-auto top-[24vh] sm:top-[28vh] md:top-[30vh] lg:top-[31.5vh] xl:top-[32vh] w-[92%] sm:w-[82%] md:w-[70%] lg:w-[48vw] xl:w-[44vw] max-w-4xl text-center pointer-events-auto flex flex-col items-center space-y-3.5 sm:space-y-4 lg:space-y-[1.2vh] z-10"
      >
        {/* Backdrop Fog: Ultra-Blur Halus 4-Lapisan Menyatu Total ke Video Konstruksi */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 pointer-events-none -z-10 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
          aria-hidden="true"
        >
          <div
            style={{
              transform: 'var(--overlay-transform, none)',
              transformOrigin: '50% 50%',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* 1. LAYER 1: Halo atmosferik terluar ekstra luas menyatu ke video (Blur 280px) */}
            <div
              className="absolute -top-[42vh] -bottom-[42vh] -left-[44vw] -right-[44vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 135% 120% at 50% 50%, rgba(244, 244, 246, 0.58) 0%, rgba(244, 244, 246, 0.35) 42%, rgba(244, 244, 246, 0.10) 72%, rgba(244, 244, 246, 0.02) 90%, transparent 100%)',
                filter: 'blur(280px)',
              }}
            />

            {/* 2. LAYER 2: Difusi transisi medium sangat lembut (Blur 200px) */}
            <div
              className="absolute -top-32 -bottom-32 -left-28 -right-28 sm:-top-40 sm:-bottom-40 sm:-left-36 sm:-right-36 lg:-top-[26vh] lg:-bottom-[26vh] lg:-left-[24vw] lg:-right-[24vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 118% 105% at 50% 50%, rgba(244, 244, 246, 0.70) 0%, rgba(244, 244, 246, 0.42) 48%, rgba(244, 244, 246, 0.12) 78%, transparent 100%)',
                filter: 'blur(200px)',
              }}
            />

            {/* 3. LAYER 3: Penopang bodi kabut halus tanpa garis kontur (Blur 135px) */}
            <div
              className="absolute -top-20 -bottom-20 -left-20 -right-20 sm:-top-24 sm:-bottom-24 sm:-left-24 sm:-right-24 lg:-top-[16vh] lg:-bottom-[16vh] lg:-left-[14vw] lg:-right-[14vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 102% 90% at 50% 50%, rgba(246, 246, 248, 0.80) 0%, rgba(246, 246, 248, 0.58) 52%, rgba(244, 244, 246, 0.18) 82%, transparent 100%)',
                filter: 'blur(135px)',
              }}
            />

            {/* 4. LAYER 4: Inti putih pelindung kontras teks lebih halus & terbaur (Blur 85px) */}
            <div
              className="absolute -top-12 -bottom-12 -left-12 -right-12 sm:-top-16 sm:-bottom-16 sm:-left-16 sm:-right-16 lg:-top-20 lg:-bottom-20 lg:-left-20 lg:-right-20 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 95% 85% at 50% 50%, rgba(248, 248, 250, 0.88) 0%, rgba(246, 246, 248, 0.75) 52%, rgba(244, 244, 246, 0.24) 80%, transparent 100%)',
                filter: 'blur(85px)',
              }}
            />
          </div>
        </motion.div>

        {/* Title (Hilang Kedua, Setelah Deskripsi) */}
        <motion.h2
          style={{ opacity: titleOpacity }}
          className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[2.6vw] xl:text-[2.85vw] lg:leading-[2.9vw] xl:leading-[3.15vw] text-[#030035] font-normal leading-[1.12] tracking-tight text-center w-full"
        >
          <HybridRevealText
            text={data.title}
            progress={titleProgress}
            className="inline break-words text-[#030035]"
            targetColor="#030035"
          />
        </motion.h2>

        {/* Description & CTA (Hilang Pertama Sebelum Judul & Overlay) */}
        <motion.div
          style={{ opacity: descOpacity }}
          className="relative z-10 flex flex-col items-center space-y-3.5 sm:space-y-4 lg:space-y-[1.2vh] w-full"
        >
          {/* CTA Button */}
          <div className="pt-0.5 sm:pt-1 lg:pt-[0.2vh] flex justify-center w-full">
            <Link
              to={data.linkTo}
              className="inline-flex items-center justify-center px-6 py-2.5 lg:px-[1.25vw] lg:py-[0.9vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs lg:text-[0.68vw] lg:leading-[1vw] tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
            >
              {data.linkText}
            </Link>
          </div>

          {/* United Description Paragraphs */}
          <div className="space-y-2.5 sm:space-y-3.5 lg:space-y-[1.1vh] pt-1 sm:pt-1.5 flex flex-col items-center w-full">
            {data.body.map((paragraphText, idx) => {
              if (idx === 1) {
                return (
                  <p
                    key={idx}
                    className="font-body font-normal text-[15px] sm:text-base md:text-[17px] lg:text-[0.98vw] xl:text-[1.04vw] lg:leading-[1.52vw] xl:leading-[1.60vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center"
                  >
                    <span className="font-bold">Distinguido por nuestro protocolo Iterar</span> —si una empresa presenta indicadores subóptimos durante su evaluación inicial, el proceso no concluye con un rechazo. En su lugar alineamos con las variables técnicas que requiere cualquier financiamiento con el fin de otorgarle a la entidad la acreditabilidad que exigen los comités institucionales—, <span className="font-bold">nuestro proceso busca, a través de una combinación entre tecnología y metodología, potenciar la gestión con velocidad, fluidez y precisión analítica que un proceso convencional difícilmente puede alcanzar.</span>
                  </p>
                );
              }
              return (
                <p
                  key={idx}
                  className="font-body font-normal text-[15px] sm:text-base md:text-[17px] lg:text-[0.98vw] xl:text-[1.04vw] lg:leading-[1.52vw] xl:leading-[1.60vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center"
                >
                  {paragraphText}
                </p>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
