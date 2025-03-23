
import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="page-section bg-furniture-offwhite"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            className={`opacity-0 transform translate-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : ""
            }`}
          >
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                alt="Our workshop"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div
            className={`opacity-0 transform translate-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : ""
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="inline-block text-sm tracking-widest uppercase text-furniture-gray mb-3">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-furniture-charcoal mb-6">About Us</h2>
            
            <div className="space-y-4 text-furniture-darkgray">
              <p>
                Founded in 2018, Minimalista was born from a passion for timeless design and sustainable craftsmanship. We believe furniture should be both beautiful and functional, enhancing the spaces where life unfolds.
              </p>
              <p>
                Each piece in our collection is thoughtfully designed and expertly crafted using sustainable materials and ethical production methods. We work closely with skilled artisans who share our commitment to quality and attention to detail.
              </p>
              <p>
                Our approach combines traditional techniques with modern innovation, creating furniture that stands the test of time in both durability and design. We're driven by the belief that well-designed spaces contribute to wellbeing and inspiration.
              </p>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <div className="border-l-2 border-furniture-charcoal pl-4">
                <p className="text-2xl font-medium text-furniture-charcoal">5+</p>
                <p className="text-sm text-furniture-gray">Years of experience</p>
              </div>
              <div className="border-l-2 border-furniture-charcoal pl-4">
                <p className="text-2xl font-medium text-furniture-charcoal">100%</p>
                <p className="text-sm text-furniture-gray">Sustainable materials</p>
              </div>
              <div className="border-l-2 border-furniture-charcoal pl-4">
                <p className="text-2xl font-medium text-furniture-charcoal">500+</p>
                <p className="text-sm text-furniture-gray">Happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
