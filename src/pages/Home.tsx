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
  return (
    <PageTransition>
      {/* Section 1 — Hero: pinned, full-bleed brand-corporate.jpg */}
      <HeroSection />

      {/* Section 2 — Who We Are: split, brand-stationery.jpg left */}
      <WhoWeAreSection />

      {/* Section 3 — Products: horizontal scroll, 6 cards with illust photos */}
      <ProductsSection />

      {/* Section 4 — Photo Break: cinematic, brand-nature.jpg */}
      <PhotoBreakSection />

      {/* Section 5 — Services: split, brand-documents.jpg right */}
      <ServicesSection />

      {/* Section 6 — Credit Model: animated SVG chart */}
      <CreditModelSection />

      {/* Section 7 — Dalio Principles: pinned crossfade, navy bg */}
      <DalioPrinciplesSection />

      {/* Section 8 — Finale: counters + CTA */}
      <FinaleSection />
    </PageTransition>
  )
}
