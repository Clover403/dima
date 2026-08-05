import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function useLenis() {
  useEffect(() => {
    if (lenisInstance) return

   // Deteksi Firefox
    const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');

    const lenis = new Lenis({
  duration: 1.3,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  
  wheelMultiplier: isFirefox ? 1.6 : 0.45,
  touchMultiplier: isFirefox ? 1.6 : 0.45,
})

    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)

    // Recalculate trigger positions after Lenis attaches.
    ScrollTrigger.refresh()

    // Disable browser scroll restoration so reloads always start at the hero.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Single one-shot refresh after BOTH fonts have settled and the window
    // has finished loading all assets. This catches the production case
    // where useLayoutEffect ran before the layout was final, while avoiding
    // mid-scroll refreshes that would re-fire pin onLeave callbacks and
    // destabilize animations (e.g. TransparantDissolve clearing triangles).
    let cancelled = false
    let didFinalRefresh = false
    const finalRefresh = () => {
      if (cancelled || didFinalRefresh) return
      didFinalRefresh = true
      ScrollTrigger.refresh()
    }

    const fontsReady = (document as Document & {
      fonts?: { ready?: Promise<unknown> }
    }).fonts?.ready ?? Promise.resolve()

    const windowLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>(res => window.addEventListener('load', () => res(), { once: true }))

    Promise.all([fontsReady, windowLoaded]).then(() => {
      if (cancelled) return
      // One frame after both signals so layout has flushed.
      requestAnimationFrame(finalRefresh)
    })

    return () => {
      cancelled = true
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisInstance
}
