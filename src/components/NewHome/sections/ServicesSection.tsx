import React from 'react'
import { motion, AnimatePresence, MotionValue } from 'framer-motion'
import { GreekEngravingBackground } from '../../NewHome/GreekEngravingBackground'
import {
  ServiceIconStructuration,
  ServiceIconRisk,
  ServiceIconSacredGeometry,
} from '../../../constants/homeServiceIcons'

interface ServiceItem {
  number: string
  name: string
  description: string
}

interface ServicesSectionProps {
  services: ServiceItem[]
  openIndex: number | null
  serviceOffsets: string[]
  servicesOp: MotionValue<number>
  fgX: MotionValue<number>
  fgY: MotionValue<number>
  handlePointClick: (idx: number) => void
  scrollYProgress: MotionValue<number>
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  openIndex,
  serviceOffsets,
  servicesOp,
  fgX,
  fgY,
  handlePointClick,
  scrollYProgress
}) => {
  return (
    <>
      {/* ── SERVICES DESKTOP ── */}
      <div className="hidden lg:block">
        <div className="absolute top-1/2 left-[30vw] lg:left-[25vw] w-full max-w-[400px] md:max-w-[450px] pointer-events-none z-30 -translate-y-1/2">
          {services.map((service, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={idx}
                style={{ y: serviceOffsets[idx], opacity: servicesOp }}
                className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-auto"
              >
                <motion.div style={{ x: fgX, y: fgY }}>
                  <div
                    onClick={() => handlePointClick(idx)}
                    className="relative cursor-pointer group p-4 transition-all duration-500"
                  >
                    <motion.div
                      initial={false}
                      animate={{ opacity: isOpen ? 0.3 : 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-[#ffffff] blur-[50px] rounded-full pointer-events-none"
                    />
                    <h3
                      className={`relative z-10 text-3xl md:text-5xl font-display font-medium tracking-tight leading-none transition-all duration-500 ${
                        isOpen ? 'text-[#f3f4f6] opacity-100 scale-105' : 'text-transparent opacity-40 hover:opacity-100'
                      }`}
                      style={{ WebkitTextStroke: isOpen ? '0px' : '1.5px #030035' }}
                    >
                      {service.name}
                    </h3>
                    <p
                      className={`relative z-10 font-sans font-bold text-xs tracking-[0.2em] mt-3 transition-all duration-500 ${
                        isOpen ? 'opacity-100 text-[#f3f4f6]' : 'opacity-0 text-[#f3f4f6]'
                      }`}
                    >
                      0{service.number} — SECTION
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
        <motion.div
          style={{ opacity: servicesOp }}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          <GreekEngravingBackground scrollYProgress={scrollYProgress} />
          {/* WRAPPER DIPISAH AGAR TRANSLATE-Y TAILWIND TIDAK RUSAK OLEH FRAMER MOTION */}
          <div className="absolute top-1/2 right-[5vw] lg:right-[8vw] w-full max-w-[600px] lg:max-w-[700px] -translate-y-1/2 pointer-events-auto">
            <motion.div style={{ x: fgX, y: fgY }} className="w-full">
              <AnimatePresence mode="wait">
                {openIndex !== null && services[openIndex] && (
                  <motion.div
                    key={openIndex}
                    initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col text-left"
                  >
                    <div className="relative w-full p-8 md:p-12 rounded-[1.5rem] border border-[#f3f4f6]/10 bg-[#f3f4f6]/5 backdrop-blur-md shadow-[0_20px_40px_rgba(3,0,53,0.05)] overflow-hidden">
                      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#f3f4f6]/30" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#f3f4f6]/30" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#f3f4f6]/30" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#f3f4f6]/30" />
                      <div className="flex items-center gap-4 mb-8 justify-center">
                        <span className="h-[1px] flex-1 bg-[#030035]/20" />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-[#f3f4f6] uppercase">
                          Capítulo 0{openIndex + 1}
                        </span>
                        <span className="h-[1px] flex-1 bg-[#030035]/20" />
                      </div>
                      <div className="w-full flex justify-center mb-8 relative z-10">
                        {openIndex === 0 && <ServiceIconStructuration isOpen={true} />}
                        {openIndex === 1 && <ServiceIconRisk isOpen={true} />}
                        {openIndex === 2 && <ServiceIconSacredGeometry isOpen={true} />}
                      </div>
                      <div className="relative z-10">
                        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#f3f4f6] font-serif font-medium">
                          <span className="float-left text-[3.5rem] md:text-[4rem] leading-[0.8] mr-3 mt-1 text-[#f3f4f6] font-display opacity-90 drop-shadow-sm">
                            {services[openIndex].description.charAt(0)}
                          </span>
                          {services[openIndex].description.slice(1)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* ── SERVICES MOBILE SIMPLIFIED ── */}
      <motion.div
        style={{ opacity: servicesOp }}
        className="absolute inset-0 flex items-center justify-center z-30 lg:hidden px-6 py-12"
      >
        <div className="w-full max-w-sm space-y-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#f3f4f6]/5 backdrop-blur-md rounded-xl p-5 border border-[#f3f4f6]/10 shadow-sm"
            >
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#f3f4f6]/60 uppercase mb-1">
                0{service.number} — SECTION
              </p>
              <h3 className="text-xl font-display font-medium text-[#f3f4f6] mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-[#f3f4f6]/80 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}
