
import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "react-router-dom";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Check for success/cancelled query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    const cancelled = queryParams.get('cancelled');
    
    if (success === 'true') {
      toast({
        title: "Purchase Successful",
        description: "Thank you for your purchase! Your order has been processed.",
        duration: 5000,
      });
    } else if (cancelled === 'true') {
      toast({
        title: "Purchase Cancelled",
        description: "Your purchase was cancelled. Feel free to continue shopping.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    // Clean up URL query params
    if (success || cancelled) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search, toast]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="products" className="page-section bg-furniture-white">
      <div className="section-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-sm tracking-widest uppercase text-furniture-gray mb-3">Collection</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-furniture-charcoal">Our Products</h2>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-furniture-lightgray border-t-furniture-charcoal rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-furniture-charcoal text-white rounded hover:bg-furniture-darkgray transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-furniture-gray">No products available at the moment. Please check back soon!</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
