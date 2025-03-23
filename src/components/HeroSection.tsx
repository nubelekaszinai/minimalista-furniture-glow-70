
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className={`w-full h-full bg-furniture-charcoal transition-opacity duration-[1200ms] ${
            isLoaded ? "opacity-10" : "opacity-0"
          }`}
        />
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1200ms] ${
            isLoaded ? "opacity-80" : "opacity-0"
          }`}
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=2000&auto=format&fit=crop&q=80&ixlib=rb-4.0.3')` 
          }}
        />
      </div>
      
      {/* Content */}
      <div className="section-container relative z-10">
        <div className="max-w-2xl">
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight text-furniture-white opacity-0 transform translate-y-8 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : ""
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            Timeless design for modern living
          </h1>
          
          <p 
            className={`mt-6 text-xl text-furniture-white text-opacity-90 opacity-0 transform translate-y-8 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : ""
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            Elevate your space with furniture that balances form and function
          </p>
          
          <div 
            className={`mt-10 opacity-0 transform translate-y-8 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : ""
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <a 
              href="#products"
              className="buy-button"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#products')?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Collection
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-1000 ${
          isLoaded ? "opacity-70" : ""
        }`}
        style={{ transitionDelay: "1200ms" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-furniture-white text-sm tracking-widest mb-2">SCROLL</span>
          <div className="w-0.5 h-10 bg-furniture-white opacity-50 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
