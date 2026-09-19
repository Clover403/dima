import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCTA from './FloatingCTA'
import { useLenis, getLenis } from '../../hooks/useLenis'
import CursorTrail from './CursorTrail'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Layout() {
  useLenis()
  const location = useLocation()

  // Always land on the hero (top of page) on every route change, reset Lenis and refresh ScrollTrigger synchronously before paint
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
    ScrollTrigger.refresh()
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
      <CursorTrail />
    </div>
  )
}
