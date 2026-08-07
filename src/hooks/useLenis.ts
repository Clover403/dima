import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function useLenis() {
  useEffect(() => {
    if (lenisInstance) return

    // Deteksi Browser dan OS
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const isFirefox = ua.includes('firefox');
    const isLinux = ua.includes('linux') && !ua.includes('android');
    const isWindows = ua.includes('windows');

    // Linux: 0.45, Windows: 1.0 (Kembalikan ke normal)
    let baseMultiplier = 1.0;
    if (isLinux) baseMultiplier = 0.45;
    if (isWindows) baseMultiplier = 2;

    const lenis = new Lenis({
      duration: 0.8, // Naikkan dari 1 ke 1.5 agar efek berhentinya lebih panjang dan elegan
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: isFirefox ? 1 : baseMultiplier,
      touchMultiplier: isFirefox ? 1 : baseMultiplier,
    })

    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)

    ScrollTrigger.refresh()

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

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