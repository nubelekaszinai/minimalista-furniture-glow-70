
import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          </div>
        )}

        {!isLoading && !error && (
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
