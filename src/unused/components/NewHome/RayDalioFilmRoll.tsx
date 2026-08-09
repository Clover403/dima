import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

interface FilmRollProps {
  assets: Array<{ type: 'photo' | 'quote'; src?: string; text?: string }>
  filmY: any
}

// Sub-komponen Card dengan Efek 3D Press MURNI
function FilmCard({ asset }: { asset: any }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useTransform(y, [0, 1], [12, -12])
  const rotateY = useTransform(x, [0, 1], [-12, 12])

  const smoothRotateX = useSpring(rotateX, { damping: 20, stiffness: 150 })
  const smoothRotateY = useSpring(rotateY, { damping: 20, stiffness: 150 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // PURE HANYA MENGECIL SAAT DI-HOVER
      whileHover={{ scale: 0.95 }}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 1000,
      }}
      // Pastikan background di layer ini transparan agar nyaru dengan baik
      className="w-full h-full relative cursor-pointer bg-transparent"
    >
      {/* STYLE BAWAAN LU SEPENUHNYA DIKEMBALIKAN */}
      {asset.type === 'photo' ? (
        <img 
          src={asset.src} 
          alt="Ray Dalio Film" 
          className="w-full h-full object-cover object-center rounded-[2rem] pointer-events-none"
        />
      ) : (
        <div className="w-full h-full bg-[#FCF8F1] rounded-[2rem] p-8 md:p-12 flex flex-col justify-center items-center text-center border border-[#FCF8F1] pointer-events-none">
          <p className="text-[14px] font-semibold uppercase tracking-[0.3em] text-[#E5997B] mb-4">
            PRINCIPLE
          </p>
          <p className="font-serif text-[#030035] text-2xl md:text-3xl leading-snug">
            "{asset.text}"
          </p>
        </div>
      )}
    </motion.div>
  )
}

export function RayDalioFilmRoll({ assets, filmY }: FilmRollProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  
  useEffect(() => {
    const unsubscribe = filmY?.onChange?.((value: any) => {
      const normalized = Math.abs(value) / 1.7 
      const idx = Math.round(normalized) % assets.length
      setActiveIdx(Math.max(0, Math.min(idx, assets.length - 1)))
    })
    return () => unsubscribe?.()
  }, [filmY, assets.length])
  
  return (
    <div className="absolute top-0 right-[2%] lg:right-[5%] h-full w-[35%] max-w-[450px] pointer-events-auto flex justify-center overflow-visible">
      <motion.div 
        className="flex flex-col gap-4 w-full py-[20vh]"
        style={{ y: filmY }}
      >
        {[...assets, ...assets, ...assets].map((asset, idx) => {
          const itemIdx = idx % assets.length
          const isCenter = itemIdx === activeIdx
          
          return (
            <motion.div 
              key={idx} 
              // BUNGKUS LUAR DI-KAMUFLASE: Warna ngikutin background (#f3f4f6), dibikin rounded, tanpa shadow/border
              className="w-full aspect-square relative flex-shrink-0 bg-[#f3f4f6] rounded-[2rem] shadow-none border-none outline-none"
              animate={{ 
                scale: isCenter ? 1.04 : 0.94,
                opacity: 1,
                zIndex: isCenter ? 2 : 1
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <FilmCard asset={asset} />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}