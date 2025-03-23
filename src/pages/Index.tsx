
import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Navigation from "../components/Navigation";
import ProductsSection from "../components/ProductsSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-furniture-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <h1 className="font-display text-3xl text-furniture-charcoal mb-4 animate-pulse">
            minimalista
          </h1>
          <div className="w-10 h-0.5 bg-furniture-charcoal animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-furniture-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
