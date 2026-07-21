import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IconMacroSystem } from '../../../constants/homeProductPointIcons'

interface FinaleSectionProps {
  borderColor: MotionValue<string>
  textColor: MotionValue<string>
}

export const FinaleSection: React.FC<FinaleSectionProps> = ({
  borderColor,
  textColor,
}) => {
  return (
    <div className="flex flex-col items-center justify-end w-full h-full pb-[10vh] pt-[12vh] text-center relative px-4">
      <div className="absolute inset-0 pointer-events-none items-center justify-center opacity-10 z-0 hidden md:flex">
        <svg viewBox="0 0 800 800" className="w-[800px] h-[800px] max-w-full animate-spin-slow">
          <circle cx="400" cy="400" r="350" fill="none" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 12" />
          <circle cx="400" cy="400" r="280" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
          <path d="M 400 50 L 400 750 M 50 400 L 750 400" stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="10 10" />
          <path d="M 152 152 L 648 648 M 152 648 L 648 152" stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="10 10" />
        </svg>
      </div>
      <div className="absolute -bottom-[12vh] left-1/2 -translate-x-1/2 origin-bottom z-0 pointer-events-none scale-[3.1] md:scale-[4.1] opacity-10 text-[#f3f4f6] hidden md:block">
        <IconMacroSystem />
      </div>
      <div className="w-full flex flex-col items-center z-10 mt-auto">
        <motion.div
          style={{ borderColor }}
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-current/10 bg-current/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.45em] backdrop-blur-xl relative"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B] shadow-[0_0_18px_rgba(229,153,123,0.8)]" />
          EL FUTURO DE TU PATRIMONIO
        </motion.div>
        <h1 className="font-display text-5xl md:text-9xl lg:text-[8.2rem] leading-[0.9] tracking-[-0.04em] text-[#f3f4f6] drop-shadow-sm mb-4">
          Comienza a<br />Construir<br />Tu Legado
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed opacity-80 sm:text-lg max-w-2xl text-[#f3f4f6] font-serif">
          La precisión arquitectónica que tu capital merece. Da el siguiente paso hacia el equilibrio financiero definitivo.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 w-full justify-center">
          <Link to="/contact">
            <motion.div
              style={{ backgroundColor: '#E5997B', color: '#030035' }}
              className="inline-flex items-center justify-center rounded-full px-12 py-4 text-base font-semibold transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(3,0,53,0.15)] pointer-events-auto"
            >
              Agenda una Llamada
            </motion.div>
          </Link>
          <Link to="/about">
            <motion.div
              style={{ borderColor: textColor }}
              className="inline-flex items-center justify-center rounded-full border border-[#E5997B]/20 px-12 py-4 text-base font-semibold backdrop-blur-xl transition-opacity hover:bg-[#E5997B]/10 hover:text-white bg-[#E5997B]/5 text-[#E5997B] pointer-events-auto"
            >
              Conoce Dima
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
