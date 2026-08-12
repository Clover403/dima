import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ProductSequenceItem } from '../ProductSequenceItem'
import { EngravingDalioEquilibriumChart } from '../../../constants/EngravingDalioEquilibriumChart'
import { TEKS_3_PRODUCTS } from '../../../constants/homeNewContent'

interface ProductsSequenceLayerProps {
  products: any[]
  scrollYProgress: MotionValue<number>
  title3Opacity: MotionValue<number>
}

export const ProductsSequenceLayer: React.FC<ProductsSequenceLayerProps> = ({
  products,
  scrollYProgress,
  title3Opacity
}) => {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
        {products.map((product, idx) => (
          <ProductSequenceItem
            key={product.name}
            product={product}
            index={idx}
            total={products.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
      <motion.div
        style={{ opacity: title3Opacity }}
        className="absolute inset-0 flex items-center justify-center z-20 md:hidden px-6"
      >
        <div className="text-center max-w-sm">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-[#f3f4f6] mb-4">
            {TEKS_3_PRODUCTS.title}
          </h2>
          <p className="text-base text-[#f3f4f6]/70 leading-relaxed">
            {TEKS_3_PRODUCTS.description}
          </p>
        </div>
      </motion.div>
    </>
  )
}

interface ProductsForegroundProps {
  beat: any
  b2Y: MotionValue<number>
  b2PathLength: MotionValue<number>
  b2StrokeOp: MotionValue<number>
  b2FillOp: MotionValue<number>
  heroFillOp: MotionValue<number>
  b2StrokeDashoffset: MotionValue<number>
}

export const ProductsForeground: React.FC<ProductsForegroundProps> = ({
  beat,
  b2Y,
  b2PathLength,
  b2StrokeOp,
  b2FillOp,
  heroFillOp,
  b2StrokeDashoffset
}) => {
  return (
    <>
      <motion.div style={{ y: b2Y }} className="w-full relative mt-0 mb-0 -ml-1 hidden md:block">
        <EngravingDalioEquilibriumChart drawProgress={b2PathLength} strokeOpacity={b2StrokeOp} fillOpacity={b2FillOp} />
        <svg viewBox="0 0 1000 360" className="w-full h-auto max-w-[1000px] max-h-[75vh] overflow-visible">
          <motion.text x="0" y="160" textAnchor="start" className="font-display" fontSize="115" letterSpacing="-0.04em" fontWeight="400" fill="none" stroke="#f3f4f6" strokeWidth="1.2" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }}>
            <tspan x="0" dy="0">Product pages that feel</tspan>
            <tspan x="0" dy="110">like one continuous motion.</tspan>
          </motion.text>
          <motion.text x="0" y="160" textAnchor="start" className="font-display" fontSize="115" letterSpacing="-0.04em" fontWeight="400" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>
            <tspan x="0" dy="0">Product pages that feel</tspan>
            <tspan x="0" dy="110">like one continuous motion.</tspan>
          </motion.text>
          <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beat?.ctaPrimary?.to || '#'}>
            <motion.rect x="0" y="300" width="260" height="60" rx="30" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }} />
            <motion.rect x="0" y="300" width="260" height="60" rx="30" fill="#E5997B" stroke="none" style={{ opacity: heroFillOp }} />
            <motion.text x="130" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#f3f4f6" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }}>{beat?.ctaPrimary?.label}</motion.text>
            <motion.text x="130" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>{beat?.ctaPrimary?.label}</motion.text>
          </g>
          <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beat?.ctaSecondary?.to || '#'}>
            <motion.rect x="280" y="300" width="260" height="60" rx="30" fill="none" stroke="#f3f4f6" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }} />
            <motion.rect x="280" y="300" width="260" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="none" style={{ opacity: heroFillOp }} />
            <motion.text x="410" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#f3f4f6" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }}>{beat?.ctaSecondary?.label}</motion.text>
            <motion.text x="410" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>{beat?.ctaSecondary?.label}</motion.text>
          </g>
        </svg>
      </motion.div>
      {/* BEAT 2 MOBILE */}
      <div className="md:hidden w-full relative z-10 px-2">
        <h1 className="font-display text-3xl sm:text-4xl leading-[1.1] tracking-[-0.04em] text-[#f3f4f6] mb-4">
          {beat?.title}
        </h1>
        <p className="text-base text-[#f3f4f6]/70 mb-6 max-w-xs">
          {beat?.description}
        </p>
        <div className="flex flex-wrap gap-3">
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
