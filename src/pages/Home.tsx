import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import HeroSection from '../components/home/HeroSection'
import WhoWeAreSection from '../components/home/WhoWeAreSection'
import ProductsSection from '../components/home/ProductsSection'
import PhotoBreakSection from '../components/home/PhotoBreakSection'
import ServicesSection from '../components/home/ServicesSection'
import CreditModelSection from '../components/home/CreditModelSection'
import DalioPrinciplesSection from '../components/home/DalioPrinciplesSection'
import FinaleSection from '../components/home/FinaleSection'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    // ── Selalu mulai dari atas ─────────────────────────────────
    // Ini penting untuk WhoWeAreSection — animasinya bergantung
    // pada scroll dimulai dari posisi 0.
    // Berlaku untuk:
    // 1. Reload halaman Home dari posisi manapun
    // 2. Navigasi dari halaman lain ke Home
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])  // re-run setiap kali path berubah ke '/'

  return (
    <PageTransition>
      {/* Section 1 — Hero */}
      <HeroSection />
      {/* Section 2 — Who We Are */}
      <WhoWeAreSection />
      {/* Section 3 — Products */}
      <ProductsSection />
      {/* Section 4 — Photo Break */}
      <PhotoBreakSection />
      {/* Section 5 — Services */}
      <ServicesSection />
      {/* Section 6 — Credit Model */}
      <CreditModelSection />
      {/* Section 7 — Dalio Principles */}
      <DalioPrinciplesSection />
      {/* Section 8 — Finale */}
      <FinaleSection />
    </PageTransition>
  )
}