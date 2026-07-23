import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type SpotlightGridBackgroundProps = {
  isHighContrast?: boolean
}

export default function SpotlightGridBackground({ 
  isHighContrast = false 
}: SpotlightGridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridSweepRef = useRef<HTMLDivElement>(null)
  const dotsSweepRef = useRef<HTMLDivElement>(null)

  const gridAlpha = isHighContrast ? 0.55 : 0.35
  const gridOpacity = isHighContrast ? 1 : 0.85
  const shadowBlur = isHighContrast ? '2px' : '1px'
  const shadowAlpha = isHighContrast ? 0.3 : 0.1

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gunakan hardware-accelerated 'rotation' untuk memutar overlay
      // Ini jauh lebih ringan karena GPU yang merotasi texture tanpa perlu melukis ulang (repaint) conic-gradient setiap frame.
      if (gridSweepRef.current) {
        gsap.to(gridSweepRef.current, {
          rotation: 360,
          duration: 7,
          ease: 'none',
          repeat: -1,
        })
      }

      if (dotsSweepRef.current) {
        gsap.to(dotsSweepRef.current, {
          rotation: -360,
          duration: 7,
          ease: 'none',
          repeat: -1,
        })
      }

      // Optimasi: pause animasi saat tab tidak aktif
      const handleVisibilityChange = () => {
        if (document.hidden) {
          gsap.globalTimeline.pause()
        } else {
          gsap.globalTimeline.play()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Gradient sweep overlay yang berputar. 
  // Bagian `#030035` akan menutupi grid, sedangkan `transparent` akan menampilkan grid.
  const sweepGradient = 'conic-gradient(from -180deg at center, #030035 30deg, rgba(3,0,53,0.98) 70deg, rgba(3,0,53,0.6) 170deg, transparent 230deg, rgba(3,0,53,0.6) 290deg, rgba(3,0,53,0.98) 330deg, #030035 360deg)'

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    >
      {/* Spotlight Grid Layer */}
      <div
        className="absolute inset-0 w-full h-full z-[1]"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%)',
        }}
      >
        {/* Layer 1: The Grid Pattern */}
        <div
          className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[100vw] h-[100vh]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(211,211,211,${gridAlpha}) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(211,211,211,${gridAlpha}) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
            backgroundPosition: '36px 36px',
            maskImage: 'radial-gradient(circle at center, transparent 8px, black 12px)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 8px, black 12px)',
            maskSize: '72px 72px',
            WebkitMaskSize: '72px 72px',
            opacity: gridOpacity,
          }}
        />
        
        {/* Layer 2: The Rotating Sweep Overlay */}
        <div
          ref={gridSweepRef}
          className="absolute left-1/2 top-1/2 w-[200vw] h-[200vh] origin-center -translate-x-1/2 -translate-y-1/2"
          style={{ background: sweepGradient }}
        />
      </div>

      {/* Spotlight Dots Layer */}
      <div
        className="absolute inset-0 w-full h-full z-[2]"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%)',
        }}
      >
        {/* Layer 1: The Dots Pattern */}
        <div
          className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[100vw] h-[100vh]"
          style={{
            backgroundImage: `radial-gradient(circle at 36px 36px, rgba(211,211,211,${gridAlpha}) 1.5px, transparent 1.5px)`,
            backgroundSize: '72px 72px',
            backgroundPosition: '0px 0px',
            filter: `drop-shadow(0 0 ${shadowBlur} rgba(211,211,211,${shadowAlpha}))`,
          }}
        />

        {/* Layer 2: The Rotating Sweep Overlay */}
        <div
          ref={dotsSweepRef}
          className="absolute left-1/2 top-1/2 w-[200vw] h-[200vh] origin-center -translate-x-1/2 -translate-y-1/2"
          style={{ background: sweepGradient }}
        />
      </div>
    </div>
  )
}
