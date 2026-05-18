import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCTA from './FloatingCTA'
import { useLenis } from '../hooks/useLenis'
import CursorTrail from './CursorTrail'

export default function Layout() {
  useLenis()
  const location = useLocation()

  // Always land on the hero (top of page) on every route change.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
      <CursorTrail />
    </div>
  )
}
