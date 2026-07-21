import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { Link } from 'react-router-dom'

interface WhoWeAreSectionProps {
  beat: any
  b1Y: MotionValue<number>
  b1StrokeDashoffset: MotionValue<number>
  b1StrokeOp: MotionValue<number>
  b1FillOp: MotionValue<number>
  heroFillOp: MotionValue<number>
}

export const WhoWeAreSection: React.FC<WhoWeAreSectionProps> = ({
  beat,
  b1Y,
  b1StrokeDashoffset,
  b1StrokeOp,
  b1FillOp,
  heroFillOp,
}) => {
  return (
    <>
      <motion.div style={{ y: b1Y }} className="w-full relative max-w-[750px] xl:max-w-[900px] z-20 flex-shrink-0 hidden md:block">
        <svg viewBox="0 0 1000 820" className="w-full h-auto max-w-full max-h-[75vh] overflow-visible drop-shadow-sm">
          <motion.text
            x="1000" y="100" textAnchor="end" className="font-display" fontSize="160" letterSpacing="-0.03em"
            fontWeight="400" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000"
            strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}
          >
            <tspan x="1000" dy="0">No somos un banco.</tspan>
            <tspan x="1000" dy="165">Somos <tspan stroke="#E5997B" fontFamily="serif">arquitectos</tspan></tspan>
            <tspan x="1000" dy="165">de equilibrio.</tspan>
          </motion.text>
          <motion.line
            x1="600" y1="450" x2="1000" y2="450" stroke="#f3f4f6" strokeWidth="2.5" strokeDasharray="1000"
            pathLength="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}
          />
          <motion.text
            x="1000" y="530" textAnchor="end" className="font-display" fontSize="95" letterSpacing="-0.02em"
            fontWeight="400" fill="none" stroke="#f3f4f6" strokeWidth="1" pathLength="1000"
            strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}
          >
            <tspan x="1000" dy="0">Transformamos la deuda</tspan>
            <tspan x="1000" dy="110">en productividad.</tspan>
          </motion.text>
          <motion.text
            x="1000" y="100" textAnchor="end" className="font-display" fontSize="160" letterSpacing="-0.03em"
            fontWeight="400" fill="#f3f4f6" stroke="none" style={{ opacity: b1FillOp }}
          >
            <tspan x="1000" dy="0">No somos un banco.</tspan>
            <tspan x="1000" dy="165">Somos <tspan fill="#E5997B" fontFamily="serif">arquitectos</tspan></tspan>
            <tspan x="1000" dy="165">de equilibrio.</tspan>
          </motion.text>
          <motion.line x1="600" y1="450" x2="1000" y2="450" stroke="#f3f4f6" strokeWidth="2.5" style={{ opacity: b1FillOp }} />
          <motion.text
            x="1000" y="530" textAnchor="end" className="font-display" fontSize="95" letterSpacing="-0.02em"
            fontWeight="400" fill="#f3f4f6" stroke="none" style={{ opacity: b1FillOp }}
          >
            <tspan x="1000" dy="0">Transformamos la deuda</tspan>
            <tspan x="1000" dy="110">en productividad.</tspan>
          </motion.text>
          <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beat?.ctaPrimary?.to || '#'}>
            <motion.rect x="460" y="720" width="260" height="60" rx="30" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }} />
            <motion.rect x="460" y="720" width="260" height="60" rx="30" fill="#f3f4f6" stroke="none" style={{ opacity: b1FillOp }} />
            <motion.text x="590" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#f3f4f6" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}>{beat?.ctaPrimary?.label}</motion.text>
            <motion.text x="590" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>{beat?.ctaPrimary?.label}</motion.text>
          </g>
          <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beat?.ctaSecondary?.to || '#'}>
            <motion.rect x="740" y="720" width="260" height="60" rx="30" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }} />
            <motion.rect x="740" y="720" width="260" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="none" style={{ opacity: heroFillOp }} />
            <motion.text x="870" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#f3f4f6" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}>{beat?.ctaSecondary?.label}</motion.text>
            <motion.text x="870" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>{beat?.ctaSecondary?.label}</motion.text>
          </g>
        </svg>
      </motion.div>
      {/* BEAT 1 MOBILE */}
      <div className="md:hidden w-full relative z-10 px-2 text-right">
        <h1 className="font-display text-3xl sm:text-4xl leading-[1.1] tracking-[-0.03em] text-[#f3f4f6] mb-4">
          No somos un banco.<br />
          Somos <span className="text-[#E5997B] font-serif">arquitectos</span><br />
          de equilibrio.
        </h1>
        <div className="w-24 h-[2px] bg-[#E5997B] ml-auto mb-4" />
        <p className="text-lg text-[#f3f4f6]/80 font-display mb-6">
          Transformamos la deuda<br />en productividad.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <Link to={beat?.ctaPrimary?.to || '#'}>
            <span className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-[#E5997B] text-[#030035]">
              {beat?.ctaPrimary?.label}
            </span>
          </Link>
          <Link to={beat?.ctaSecondary?.to || '#'}>
            <span className="inline-flex items-center justify-center rounded-full border border-[#f3f4f6]/20 px-6 py-2.5 text-sm font-semibold text-[#f3f4f6] bg-[#E5997B]/10 text-[#E5997B] border-[#E5997B]/20 backdrop-blur-xl">
              {beat?.ctaSecondary?.label}
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
