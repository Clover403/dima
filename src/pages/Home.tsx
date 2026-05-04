import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import TransparantDissolve from "../components/TransparantDissolve";
import HeroSection from "../components/home/HeroSection";
import WhoWeAreSection from "../components/home/WhoWeAreSection";
import ProductsToPhotoSection from "../components/home/ProductsToPhotoSection";
import ServicesSection from "../components/home/ServicesSection";
import CreditModelSection from "../components/home/CreditModelSection";
import DalioPrinciplesSection from "../components/home/DalioPrinciplesSection";
import FinaleSection from "../components/home/FinaleSection";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <PageTransition>
      <TransparantDissolve>
        <HeroSection />
        {/* WhoWeAre sticky → diam di tempat waktu Products naik nutupin */}
        <WhoWeAreSection />
        <ProductsToPhotoSection />
        {/* ServicesSection overlap ProductsToPhoto — langsung nyambung setelah dissolve */}
        <div style={{ marginTop: "-400vh", position: "relative", zIndex: 1 }}>
          <ServicesSection />
        </div>
        {/* // Home.tsx */}

        {/* Bungkus CreditModelSection dengan sticky wrapper */}
        <div style={{ height: "200vh", position: "relative", zIndex: 1 }}>
          <div style={{ position: "sticky", top: 0 }}>
            <CreditModelSection />
          </div>
        </div>

        {/* DalioPrinciplesSection slide up nutup 100vh terakhir dari wrapper di atas */}
        <DalioPrinciplesSection />
        <FinaleSection />
      </TransparantDissolve>
    </PageTransition>
  );
}
