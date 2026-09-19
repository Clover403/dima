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

    // Windows & Linux calibration: keep multiplier at 1.0 to prevent jerky wheel impulses
    let baseMultiplier = 1.0;
    if (isLinux) baseMultiplier = 0.65;
    if (isWindows) baseMultiplier = 1.0;

    const lenis = new Lenis({
      duration: 1.1, // Smooth cinematic glide without abrupt braking
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

    // Lock scrolling while loader is active so user cannot scroll before the curtain is completely open
    if (typeof window !== 'undefined' && !(window as any).isLoaderFinished) {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);

      const unlockScroll = () => {
        lenis.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
        lenis.start();
        ScrollTrigger.refresh();
      };

      window.addEventListener('loaderFinished', unlockScroll, { once: true });
    }

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

export function getLenis(): Lenis | null {
  return lenisInstance
}