
import { useEffect } from "react";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navigation from "../components/Navigation";
import ProductsSection from "../components/ProductsSection";
import { setupMockApiHandler } from "../api/mock-api-handler";

const Index = () => {
  useEffect(() => {
    // Setup our mock API handler to intercept fetch calls
    setupMockApiHandler();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <ProductsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
