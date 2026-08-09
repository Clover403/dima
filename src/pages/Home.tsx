import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/layout/PageTransition";
// import TransparantDissolve from '../components/TransparantDissolve'
import HeroSection from "../components/home/Hero";
import WhoWeAreSection from "../components/home/Whoweare";
import ScrollMEF from "../components/home/Mef";
import ProductsToPhotoSection from "../components/home/Product";
import ServicesSection from "../components/home/Service";
import CreditModelSection from "../components/home/CreditModel";
import DalioPrinciplesSection from "../components/home/DalioPrinciples";
import CTA from "../components/layout/CTA";

export default function HomeLegacy() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <PageTransition>
      <HeroSection />
      <WhoWeAreSection />
      <ProductsToPhotoSection />
      <div className="hidde n lg:block">
        <ScrollMEF />
      </div>
      <ServicesSection />
      <CreditModelSection />
      <DalioPrinciplesSection />
      <CTA />
    </PageTransition>
  );
}
