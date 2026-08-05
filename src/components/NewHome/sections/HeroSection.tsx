import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { Link } from 'react-router-dom'

interface HeroSectionProps {
  beat: any
  b0Y: MotionValue<number>
  heroStrokeDashoffset: MotionValue<number>
  heroStrokeOp: MotionValue<number>
  heroFillOp: MotionValue<number>
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  beat,
  b0Y,
  heroStrokeDashoffset,
  heroStrokeOp,
  heroFillOp,
}) => {
  return (
    <>
      <motion.div style={{ y: b0Y }} className="w-full relative mt-2 mb-4 -ml-1 hidden md:block">
        <svg
          viewBox="0 0 800 720"
          className="w-full h-auto max-h-[75vh] max-w-[100%] md:max-w-[900px] object-contain object-left overflow-visible"
        >
          <motion.text
            x="0" y="80" textAnchor="start" className="font-display" fontSize="130" letterSpacing="-0.04em"
            fontWeight="400" fill="none" stroke="#f3f4f6" strokeWidth="1.2" pathLength="1000"
            strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }}
          >
            <tspan x="0" dy="0">{beat?.title?.split(' ')[0]}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ')[1]}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ').slice(2, 5).join(' ')}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ').slice(5, 7).join(' ')}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ').slice(7).join(' ')}</tspan>
          </motion.text>
          <motion.text
            x="0" y="80" textAnchor="start" className="font-display" fontSize="130" letterSpacing="-0.04em"
            fontWeight="400" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}
          >
            <tspan x="0" dy="0">{beat?.title?.split(' ')[0]}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ')[1]}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ').slice(2, 5).join(' ')}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ').slice(5, 7).join(' ')}</tspan>
            <tspan x="0" dy="117">{beat?.title?.split(' ').slice(7).join(' ')}</tspan>
          </motion.text>
          <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beat?.ctaPrimary?.to || '#'}>
            <motion.rect x="0" y="630" width="260" height="60" rx="30" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }} />
            <motion.rect x="0" y="630" width="260" height="60" rx="30" fill="#E5997B" stroke="none" style={{ opacity: heroFillOp }} />
            <motion.text x="130" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#f3f4f6" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }}>{beat?.ctaPrimary?.label}</motion.text>
            <motion.text x="130" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>{beat?.ctaPrimary?.label}</motion.text>
          </g>
          <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beat?.ctaSecondary?.to || '#'}>
            <motion.rect x="280" y="630" width="260" height="60" rx="30" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }} />
            <motion.rect x="280" y="630" width="260" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="none" style={{ opacity: heroFillOp }} />
            <motion.text x="410" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#f3f4f6" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }}>{beat?.ctaSecondary?.label}</motion.text>
            <motion.text x="410" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>{beat?.ctaSecondary?.label}</motion.text>
          </g>
        </svg>
      </motion.div>
      {/* HERO MOBILE */}
      <div className="md:hidden w-full relative z-10 px-2">
        <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-[-0.04em] text-[#f3f4f6] mb-6">
          {beat?.title}
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link to={beat?.ctaPrimary?.to || '#'}>
            <span className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold bg-[#E5997B] text-[#030035]">
              {beat?.ctaPrimary?.label}
            </span>
          </Link>
          <Link to={beat?.ctaSecondary?.to || '#'}>
            <span className="inline-flex items-center justify-center rounded-full border border-[#f3f4f6]/20 px-8 py-3 text-sm font-semibold text-[#f3f4f6] bg-[#E5997B]/10 text-[#E5997B] border-[#E5997B]/20 backdrop-blur-xl">
              {beat?.ctaSecondary?.label}
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
