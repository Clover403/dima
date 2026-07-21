import React from 'react'
import { motion, AnimatePresence, MotionValue } from 'framer-motion'
import DimaDiamond3D from '../../NewHome/DimaDiamond3D'

interface BackgroundLayerProps {
  bgX: MotionValue<number>
  bgY: MotionValue<any>
  fgX: MotionValue<number>
  fgY: MotionValue<number>
  insideDiamondOpacity: MotionValue<number>
  insideDiamondScale: MotionValue<number>
  t4HeaderOp: MotionValue<number>
  t4HeaderY: MotionValue<number>
  diamondX: MotionValue<any>
  diamondY: MotionValue<any>
  diamondZ: MotionValue<any>
  diamondScale: MotionValue<number>
  diamondRotate: MotionValue<number>
  fig1Y: MotionValue<any>
  fig2Y: MotionValue<any>
  figOpacity: MotionValue<number>
  midX: MotionValue<number>
  midY: MotionValue<number>
  tiltX: MotionValue<number>
  tiltY: MotionValue<number>
  ornamentOpacity: MotionValue<number>
  ornamentDraw: MotionValue<number>
  activeBeat: number
  b1Y: MotionValue<any>
  b1StrokeOp: MotionValue<number>
  b1PathLength: MotionValue<number>
  b1FillOp: MotionValue<number>
  handlePointClick: (idx: number) => void
  teks4Services: { eyebrow: string; title: string; description: string }
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  bgX,
  bgY,
  fgX,
  fgY,
  insideDiamondOpacity,
  insideDiamondScale,
  t4HeaderOp,
  t4HeaderY,
  diamondX,
  diamondY,
  diamondZ,
  diamondScale,
  diamondRotate,
  fig1Y,
  fig2Y,
  figOpacity,
  midX,
  midY,
  tiltX,
  tiltY,
  ornamentOpacity,
  ornamentDraw,
  activeBeat,
  b1Y,
  b1StrokeOp,
  b1PathLength,
  b1FillOp,
  handlePointClick,
  teks4Services
}) => {
  return (
    <>
      <motion.div
        style={{
          opacity: insideDiamondOpacity,
          scale: insideDiamondScale,
          x: bgX,
          y: bgY,
          backgroundImage: `repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(3,0,53,0.06) 30px, rgba(3,0,53,0.06) 32px), repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(3,0,53,0.06) 30px, rgba(3,0,53,0.06) 32px)`,
          backgroundColor: '#E5997B',
        }}
        className="absolute inset-[-50%] pointer-events-none z-10"
      />
      <motion.div
        style={{ opacity: t4HeaderOp, y: t4HeaderY }}
        className="absolute inset-0 flex items-center justify-end px-4 sm:px-6 lg:px-24 pointer-events-none z-30"
      >
        <motion.div
          style={{ x: fgX, y: fgY }}
          className="w-full max-w-[80vw] md:max-w-[500px] lg:max-w-[600px] text-right flex flex-col items-end"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#f3f4f6]/10 bg-[#f3f4f6]/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.45em] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B]" />
            {teks4Services.eyebrow}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-[-0.04em] text-[#f3f4f6]">
            {teks4Services.title}
          </h1>
          <p className="mt-4 md:mt-6 text-sm sm:text-base leading-relaxed opacity-75 md:text-lg max-w-md text-[#f3f4f6]">
            {teks4Services.description}
          </p>
        </motion.div>
      </motion.div>
      {/* ── BERLIAN 3D DENGAN PARALLAX + TILT ── */}
      <motion.div
        style={{ x: diamondX, y: diamondY, zIndex: diamondZ }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          style={{ scale: diamondScale, rotateZ: diamondRotate }}
          className="absolute origin-center pointer-events-auto cursor-pointer flex justify-center items-center"
          onClick={() => handlePointClick(1)}
        >
          <motion.div
            style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
            className="w-[36rem] h-[36rem] max-w-[70vw] max-h-[70vh] aspect-square drop-shadow-2xl flex justify-center items-center"
          >
            <DimaDiamond3D />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: fig1Y, scale: diamondScale, rotateZ: diamondRotate, opacity: figOpacity }}
          className="absolute origin-center pointer-events-auto cursor-pointer flex justify-center items-center"
          onClick={() => handlePointClick(0)}
        >
          <motion.div
            style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
            className="w-[36rem] h-[36rem] max-w-[70vw] max-h-[70vh] aspect-square drop-shadow-2xl flex justify-center items-center"
          >
            <DimaDiamond3D />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: fig2Y, scale: diamondScale, rotateZ: diamondRotate, opacity: figOpacity }}
          className="absolute origin-center pointer-events-auto cursor-pointer flex justify-center items-center"
          onClick={() => handlePointClick(2)}
        >
          <motion.div
            style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
            className="w-[36rem] h-[36rem] max-w-[70vw] max-h-[70vh] aspect-square drop-shadow-2xl flex justify-center items-center"
          >
            <DimaDiamond3D />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        style={{ opacity: ornamentOpacity }}
        className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block"
      >
        {/* KIRI ATAS */}
        <div className="absolute top-0 left-0 w-[500px] h-[200px] lg:w-[650px] lg:h-[250px] text-[#f3f4f6] opacity-60">
          <svg
            viewBox="0 0 600 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full drop-shadow-sm"
          >
            <motion.path d="M 0 0 C 150 40, 300 80, 450 150 T 600 250" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 0 30 C 120 70, 250 90, 380 180" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 70 30 C 40 10, 15 40, 35 60 C 55 80, 85 55, 75 30 C 65 10, 35 20, 42 45 C 46 55, 65 52, 58 38" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 110 40 C 90 15, 55 25, 70 50 C 85 75, 120 50, 100 30 C 85 15, 65 30, 75 45" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 20 10 C 5 5, 0 18, 10 22 C 20 26, 25 12, 20 10" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 40 15 Q 20 30, 12 15" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 50 10 Q 70 25, 55 35" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 200 70 C 150 50, 130 110, 160 130 C 190 150, 230 110, 215 80 C 200 50, 170 70, 180 100 C 185 115, 198 110, 192 95" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 320 100 C 270 80, 250 140, 280 160 C 310 180, 350 140, 335 110 C 320 80, 290 100, 300 130 C 305 145, 318 140, 312 125" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 130 50 C 150 30, 175 42, 165 25 C 190 38, 195 62, 175 70" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 250 75 C 270 55, 295 67, 285 50 C 310 63, 315 87, 295 95" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 90 75 C 70 90, 80 110, 62 102 C 75 120, 100 122, 108 105" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 450 160 C 500 130, 520 180, 495 210 C 460 240, 420 200, 435 165 C 445 135, 475 145, 468 175" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 520 170 C 550 155, 565 180, 555 195 C 540 205, 525 190, 520 170" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 160 85 Q 130 65, 115 78" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 280 115 Q 250 95, 235 108" style={{ pathLength: ornamentDraw }} />
            <motion.circle cx="45" cy="35" r="2" fill="currentColor" />
            <motion.circle cx="185" cy="95" r="2" fill="currentColor" />
            <motion.circle cx="305" cy="125" r="2" fill="currentColor" />
            <motion.circle cx="460" cy="170" r="2.5" fill="currentColor" />
          </svg>
        </div>
        {/* KANAN BAWAH */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[200px] lg:w-[650px] lg:h-[250px] text-[#f3f4f6] opacity-60 rotate-180">
          <svg
            viewBox="0 0 600 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full drop-shadow-sm"
          >
            <motion.path d="M 0 0 C 150 40, 300 80, 450 150 T 600 250" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 0 30 C 120 70, 250 90, 380 180" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 70 30 C 40 10, 15 40, 35 60 C 55 80, 85 55, 75 30 C 65 10, 35 20, 42 45 C 46 55, 65 52, 58 38" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 110 40 C 90 15, 55 25, 70 50 C 85 75, 120 50, 100 30 C 85 15, 65 30, 75 45" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 20 10 C 5 5, 0 18, 10 22 C 20 26, 25 12, 20 10" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 40 15 Q 20 30, 12 15" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 50 10 Q 70 25, 55 35" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 200 70 C 150 50, 130 110, 160 130 C 190 150, 230 110, 215 80 C 200 50, 170 70, 180 100 C 185 115, 198 110, 192 95" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 320 100 C 270 80, 250 140, 280 160 C 310 180, 350 140, 335 110 C 320 80, 290 100, 300 130 C 305 145, 318 140, 312 125" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 130 50 C 150 30, 175 42, 165 25 C 190 38, 195 62, 175 70" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 250 75 C 270 55, 295 67, 285 50 C 310 63, 315 87, 295 95" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 90 75 C 70 90, 80 110, 62 102 C 75 120, 100 122, 108 105" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 450 160 C 500 130, 520 180, 495 210 C 460 240, 420 200, 435 165 C 445 135, 475 145, 468 175" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 520 170 C 550 155, 565 180, 555 195 C 540 205, 525 190, 520 170" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 160 85 Q 130 65, 115 78" style={{ pathLength: ornamentDraw }} />
            <motion.path d="M 280 115 Q 250 95, 235 108" style={{ pathLength: ornamentDraw }} />
            <motion.circle cx="45" cy="35" r="2" fill="currentColor" />
            <motion.circle cx="185" cy="95" r="2" fill="currentColor" />
            <motion.circle cx="305" cy="125" r="2" fill="currentColor" />
            <motion.circle cx="460" cy="170" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </motion.div>
      {/* ── TIMBANGAN DESKTOP DENGAN PARALLAX + TILT ── */}
      <AnimatePresence>
        {activeBeat === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -40, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, y: -40 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute bottom-10 left-10 lg:bottom-16 lg:left-16 xl:bottom-24 xl:left-24 w-64 lg:w-[500px] xl:w-[650px] max-h-[60vh] z-10 pointer-events-none hidden md:block"
            style={{ y: b1Y }}
          >
            <motion.div style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }} className="w-full h-full">
              <motion.svg
                viewBox="0 0 240 240"
                className="w-full h-full max-h-[60vh] text-[#f3f4f6]"
                style={{ opacity: b1StrokeOp }}
              >
                <defs>
                  <pattern id="hatch-b1" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#f3f4f6" strokeWidth="0.5" opacity="0.4" />
                  </pattern>
                  <pattern id="hatch-bronze" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#E5997B" strokeWidth="0.5" opacity="0.5" />
                  </pattern>
                </defs>
                <g stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <motion.circle cx="120" cy="120" r="110" strokeWidth="0.3" opacity="0.3" strokeDasharray="2 4" style={{ pathLength: b1PathLength }} />
                  <motion.circle cx="120" cy="120" r="90" strokeWidth="0.3" opacity="0.2" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M120 10 L120 230 M10 120 L230 120" strokeWidth="0.3" opacity="0.2" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 60 160 A 80 80 0 0 1 180 160" strokeWidth="0.8" opacity="0.6" strokeDasharray="1 3" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 70 150 A 65 65 0 0 1 170 150" strokeWidth="1.2" opacity="0.5" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 120 85 L 120 75 M 100 89 L 95 80 M 140 89 L 145 80 M 80 102 L 72 96 M 160 102 L 168 96" strokeWidth="0.8" opacity="0.5" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 115 40 L 50 190 L 60 190 L 120 50 Z" fill="url(#hatch-b1)" strokeWidth="1" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.path d="M 115 40 L 50 190" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 55 190 L 45 210 L 50 210 Z" strokeWidth="1" fill="currentColor" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.path d="M 125 40 L 190 190 L 180 190 L 120 50 Z" fill="url(#hatch-b1)" strokeWidth="1" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.path d="M 125 40 L 190 190" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 185 190 L 195 210 L 190 210 Z" strokeWidth="1" fill="currentColor" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.circle cx="120" cy="40" r="12" strokeWidth="1.5" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.circle cx="120" cy="40" r="6" strokeWidth="1" fill="url(#hatch-bronze)" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.circle cx="120" cy="40" r="2" fill="#E5997B" stroke="none" style={{ fillOpacity: b1FillOp }} />
                  <motion.path d="M 115 28 L 115 15 L 125 15 L 125 28 Z" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.circle cx="120" cy="10" r="5" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 30 100 L 210 100" stroke="#E5997B" strokeWidth="2.5" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 120 85 L 115 100 L 125 100 Z" fill="#E5997B" stroke="none" style={{ fillOpacity: b1FillOp }} />
                  <motion.circle cx="120" cy="100" r="3" fill="#f3f4f6" stroke="none" style={{ fillOpacity: b1FillOp }} />
                  <motion.circle cx="30" cy="100" r="4" stroke="#E5997B" strokeWidth="2" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.circle cx="210" cy="100" r="4" stroke="#E5997B" strokeWidth="2" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.path d="M 30 104 L 10 160 M 30 104 L 30 160 M 30 104 L 50 160" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 5 160 Q 30 190 55 160 Z" fill="url(#hatch-b1)" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.path d="M 5 160 L 55 160" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 210 104 L 190 160 M 210 104 L 210 160 M 210 104 L 230 160" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 185 160 Q 210 190 235 160 Z" fill="url(#hatch-b1)" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                  <motion.path d="M 185 160 L 235 160" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                  <motion.path d="M 20 180 Q 30 200 40 180 M 200 180 Q 210 200 220 180" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                  <motion.circle cx="30" cy="190" r="2" fill="#f3f4f6" stroke="none" style={{ fillOpacity: b1FillOp }} />
                  <motion.circle cx="210" cy="190" r="2" fill="#f3f4f6" stroke="none" style={{ fillOpacity: b1FillOp }} />
                </g>
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── TIMBANGAN MOBILE ── */}
      <AnimatePresence>
        {activeBeat === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-48 opacity-40 z-0 pointer-events-none md:hidden"
          >
            <motion.svg
              viewBox="0 0 240 240"
              className="w-full h-auto text-[#f3f4f6]"
              style={{ opacity: b1StrokeOp }}
            >
              <defs>
                <pattern id="hatch-b1-mobile" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="4" stroke="#f3f4f6" strokeWidth="0.5" opacity="0.4" />
                </pattern>
                <pattern id="hatch-bronze-mobile" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#E5997B" strokeWidth="0.5" opacity="0.5" />
                </pattern>
              </defs>
              <g stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <motion.circle cx="120" cy="120" r="110" strokeWidth="0.3" opacity="0.3" strokeDasharray="2 4" style={{ pathLength: b1PathLength }} />
                <motion.circle cx="120" cy="120" r="90" strokeWidth="0.3" opacity="0.2" style={{ pathLength: b1PathLength }} />
                <motion.path d="M120 10 L120 230 M10 120 L230 120" strokeWidth="0.3" opacity="0.2" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 60 160 A 80 80 0 0 1 180 160" strokeWidth="0.8" opacity="0.6" strokeDasharray="1 3" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 70 150 A 65 65 0 0 1 170 150" strokeWidth="1.2" opacity="0.5" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 120 85 L 120 75 M 100 89 L 95 80 M 140 89 L 145 80 M 80 102 L 72 96 M 160 102 L 168 96" strokeWidth="0.8" opacity="0.5" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 115 40 L 50 190 L 60 190 L 120 50 Z" fill="url(#hatch-b1-mobile)" strokeWidth="1" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.path d="M 115 40 L 50 190" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 55 190 L 45 210 L 50 210 Z" strokeWidth="1" fill="currentColor" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.path d="M 125 40 L 190 190 L 180 190 L 120 50 Z" fill="url(#hatch-b1-mobile)" strokeWidth="1" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.path d="M 125 40 L 190 190" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 185 190 L 195 210 L 190 210 Z" strokeWidth="1" fill="currentColor" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.circle cx="120" cy="40" r="12" strokeWidth="1.5" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.circle cx="120" cy="40" r="6" strokeWidth="1" fill="url(#hatch-bronze-mobile)" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.circle cx="120" cy="40" r="2" fill="#E5997B" stroke="none" style={{ fillOpacity: b1FillOp }} />
                <motion.path d="M 115 28 L 115 15 L 125 15 L 125 28 Z" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.circle cx="120" cy="10" r="5" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 30 100 L 210 100" stroke="#E5997B" strokeWidth="2.5" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 120 85 L 115 100 L 125 100 Z" fill="#E5997B" stroke="none" style={{ fillOpacity: b1FillOp }} />
                <motion.circle cx="120" cy="100" r="3" fill="#f3f4f6" stroke="none" style={{ fillOpacity: b1FillOp }} />
                <motion.circle cx="30" cy="100" r="4" stroke="#E5997B" strokeWidth="2" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.circle cx="210" cy="100" r="4" stroke="#E5997B" strokeWidth="2" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.path d="M 30 104 L 10 160 M 30 104 L 30 160 M 30 104 L 50 160" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 5 160 Q 30 190 55 160 Z" fill="url(#hatch-b1-mobile)" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.path d="M 5 160 L 55 160" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 210 104 L 190 160 M 210 104 L 210 160 M 210 104 L 230 160" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 185 160 Q 210 190 235 160 Z" fill="url(#hatch-b1-mobile)" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                <motion.path d="M 185 160 L 235 160" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                <motion.path d="M 20 180 Q 30 200 40 180 M 200 180 Q 210 200 220 180" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                <motion.circle cx="30" cy="190" r="2" fill="#f3f4f6" stroke="none" style={{ fillOpacity: b1FillOp }} />
                <motion.circle cx="210" cy="190" r="2" fill="#f3f4f6" stroke="none" style={{ fillOpacity: b1FillOp }} />
              </g>
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
