/**
 * SlideUpReveal.tsx
 *
 * Section naik dari bawah menutupi section sebelumnya.
 * Pakai position:fixed saat animasi agar presisi.
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SlideUpReveal({ children }: { children: ReactNode }) {
  const outerRef  = useRef<HTMLDivElement>(null)
  const panelRef  = useRef<HTMLDivElement>(null)
  const [settled, setSettled] = useState(false)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const panel = panelRef.current
    if (!outer || !panel) return

    // Reset
    setSettled(false)
    gsap.set(panel, { y: '100vh', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 20 })

    const st = ScrollTrigger.create({
      trigger: outer,
      start: 'top bottom',
      end:   'top top',
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(panel, { y: `${(1 - progress) * 100}vh` })

        // Saat fully settled (progress = 1), ubah ke position:relative
        if (progress >= 0.999 && !settled) {
          setSettled(true)
          gsap.set(panel, {
            position: 'relative',
            top: 'auto', left: 'auto', width: 'auto',
            y: 0, zIndex: 'auto',
          })
        } else if (progress < 0.999 && settled) {
          setSettled(false)
          gsap.set(panel, { position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 20 })
        }
      },
    })

    return () => st.kill()
  }, [])

  return (
    // Outer: tinggi 100vh sebagai "trigger zone" + tinggi konten
    // marginTop negatif agar tidak ada gap antara section 2 dan section 3
    <div ref={outerRef} style={{ position: 'relative' }}>
      {/* Spacer — setinggi trigger zone (100vh) agar scroll space ada */}
      <div style={{ height: '100vh', pointerEvents: 'none' }} />

      <div ref={panelRef}>
        {children}
      </div>
    </div>
  )
}