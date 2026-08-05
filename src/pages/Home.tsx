import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/layout/PageTransition";
// import TransparantDissolve from '../components/TransparantDissolve'
import HeroSection from "../components/home/NewDesign/Hero";
import WhoWeAreSection from "../components/home/NewDesign/Whoweare";
import ScrollMEF from "../components/home/NewDesign/Mef";
import ProductsToPhotoSection from "../components/home/NewDesign/Product";
import ServicesSection from "../components/home/NewDesign/Service";
import CreditModelSection from "../components/home/NewDesign/CreditModel";
import DalioPrinciplesSection from "../components/home/NewDesign/DalioPrinciples";
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
      <ScrollMEF />
      <ServicesSection />
      <CreditModelSection />
      <DalioPrinciplesSection />
      <CTA />
    </PageTransition>
  );
}
