import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import HeroCurtain from "../components/home/HeroCurtain";
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
      {/*
        HeroCurtain: tinggi 200vh
        - 100vh pertama: hero terlihat full (fixed di atas)
        - 100vh kedua: panel kiri geser kanan, panel kanan ikut
        - Setelah wrapper habis di-scroll: hero sudah off screen total
      */}
      <HeroCurtain>
        <HeroSection />
      </HeroCurtain>

      {/*
        Sections dalam flow normal setelah HeroCurtain (200vh).
        Hero panels fixed menutupi viewport selama curtain animasi.
        Setelah 200vh terscroll → hero hilang → sections mulai ter-reveal.
      */}
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
    </PageTransition>
  );
}
