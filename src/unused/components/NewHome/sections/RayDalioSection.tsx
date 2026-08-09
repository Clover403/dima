import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { RayDalioFilmRoll } from '../RayDalioFilmRoll'
import { DalioEconomicChart } from '../DalioEconomicChart'
import { TEKS_RAY_DALIO, RAY_DALIO_ASSETS } from '../../../constants/rayDalioContent'

interface RayDalioSectionProps {
  dalioOp: MotionValue<number>
  dalioFilmY: MotionValue<string>
  dalioDraw: MotionValue<number>
  dalioFillOp: MotionValue<number>
  bgX: MotionValue<number>
  bgY: MotionValue<number>
  fgX: MotionValue<number>
  fgY: MotionValue<number>
  borderColor: MotionValue<string>
}

export const RayDalioSection: React.FC<RayDalioSectionProps> = ({
  dalioOp,
  dalioFilmY,
  dalioDraw,
  dalioFillOp,
  bgX,
  bgY,
  fgX,
  fgY,
  borderColor,
}) => {
  return (
    <>
      {/* ── RAY DALIO DESKTOP ── */}
      <motion.div
        style={{ opacity: dalioOp }}
        className="absolute inset-0 pointer-events-none z-30 hidden md:block"
      >
        <div className="w-full h-full max-w-[1800px] mx-auto relative px-6 lg:px-24 overflow-hidden">
          <motion.div
            style={{ x: bgX, y: bgY }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <div className="w-full h-full pointer-events-auto">
              <RayDalioFilmRoll
                assets={
                  RAY_DALIO_ASSETS as Array<{ type: 'photo' | 'quote'; src?: string; text?: string }>
                }
                filmY={dalioFilmY}
              />
            </div>
          </motion.div>
          <div className="absolute top-0 right-0 w-full lg:w-[45%] h-32 md:h-48 bg-gradient-to-b from-[#030035] via-[#030035]/90 to-transparent z-40 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-full lg:w-[45%] h-32 md:h-48 bg-gradient-to-t from-[#030035] via-[#030035]/90 to-transparent z-40 pointer-events-none" />
          <motion.div
            style={{ x: fgX, y: fgY }}
            className="absolute bottom-12 left-[10vw] lg:left-[11vw] w-full max-w-[850px] md:max-w-[950px] lg:max-w-[1100px] xl:max-w-[1250px] flex flex-col items-start text-left pointer-events-auto z-0"
          >
            <motion.div className="w-full max-w-[900px] md:max-w-[1050px] lg:max-w-[1300px] mb-6 z-20 relative -ml-28 lg:-ml-44 xl:-ml-60 pointer-events-none">
              <DalioEconomicChart drawProgress={dalioDraw} fillOpacity={dalioFillOp} />
            </motion.div>
            <motion.div style={{ opacity: dalioOp, borderColor }} className="pointer-events-auto">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-current/10 bg-current/5 px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.45em] backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B] shadow-[0_0_18px_rgba(229,153,123,0.8)]" />
                {TEKS_RAY_DALIO.eyebrow}
              </div>
              <svg
                viewBox="0 0 600 180"
                className="w-full h-auto max-h-[30vh] overflow-visible drop-shadow-sm mb-4 max-w-[500px]"
              >
                <motion.text
                  x="0"
                  y="40"
                  textAnchor="start"
                  dominantBaseline="hanging"
                  className="font-display"
                  fontSize="75"
                  fontWeight="400"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="2.5"
                  style={{ pathLength: dalioDraw, opacity: dalioOp }}
                >
                  <tspan x="0" dy="0">La Máquina</tspan>
                  <tspan x="0" dy="85">Económica</tspan>
                </motion.text>
                <motion.text
                  x="0"
                  y="40"
                  textAnchor="start"
                  dominantBaseline="hanging"
                  className="font-display"
                  fontSize="75"
                  fontWeight="400"
                  fill="#030035"
                  stroke="none"
                  style={{ opacity: dalioFillOp }}
                >
                  <tspan x="0" dy="0">La Máquina</tspan>
                  <tspan x="0" dy="85">Económica</tspan>
                </motion.text>
              </svg>
              <p className="text-2xl lg:text-3xl leading-[1.3] text-[#f3f4f6] font-serif max-w-2xl lg:max-w-4xl mt-2">
                "{TEKS_RAY_DALIO.description}"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {/* ── RAY DALIO MOBILE SIMPLIFIED ── */}
      <motion.div
        style={{ opacity: dalioOp }}
        className="absolute inset-0 flex items-center justify-center z-30 md:hidden px-6"
      >
        <div className="max-w-sm w-full">
          <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-[#f3f4f6]/10 bg-[#f3f4f6]/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.45em] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B]" />
            {TEKS_RAY_DALIO.eyebrow}
          </div>
          <h2 className="font-display text-3xl leading-tight text-[#f3f4f6] mb-4">
            La Máquina<br />Económica
          </h2>
          <p className="text-base text-[#f3f4f6]/80 leading-relaxed font-serif">
            "{TEKS_RAY_DALIO.description}"
          </p>
        </div>
      </motion.div>
    </>
  )
}
