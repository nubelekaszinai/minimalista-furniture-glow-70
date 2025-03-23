
import { useState, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-furniture-charcoal text-furniture-white py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-xl mb-4">minimalista</h3>
            <p className="text-sm text-furniture-lightgray">
              Timeless furniture for modern living spaces. Designed with purpose, crafted with care.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4">Navigate</h4>
            <ul className="space-y-2">
              {["Home", "Products", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(" ", "-")}`} 
                    className="text-sm text-furniture-lightgray hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Help */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2">
              {["Shipping & Returns", "FAQ", "Warranty", "Care Guide"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-furniture-lightgray hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-sm text-furniture-lightgray mb-4">
              Subscribe to our newsletter for new releases and design inspiration.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-furniture-white bg-opacity-10 px-4 py-2 text-sm flex-grow focus:outline-none focus:bg-opacity-20 transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-furniture-white text-furniture-charcoal px-4 py-2 text-sm font-medium hover:bg-opacity-90 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-furniture-white border-opacity-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-furniture-lightgray">
            © {year} Minimalista. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-furniture-lightgray hover:text-white transition-colors duration-300">
              Terms
            </a>
            <a href="#" className="text-furniture-lightgray hover:text-white transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="text-furniture-lightgray hover:text-white transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
