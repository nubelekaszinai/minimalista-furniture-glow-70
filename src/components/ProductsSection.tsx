
import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="p-4">
        <Skeleton className="aspect-square mb-4" />
        <Skeleton className="h-6 mb-2 w-3/4" />
        <Skeleton className="h-4 mb-2 w-1/2" />
        <Skeleton className="h-4 mb-4 w-full" />
        <Skeleton className="h-5 mb-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
    ));
  };

  return (
    <section id="products" className="page-section bg-furniture-white">
      <div className="section-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-sm tracking-widest uppercase text-furniture-gray mb-3">Collection</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-furniture-charcoal">Our Products</h2>
          <p className="text-furniture-gray mt-4 max-w-2xl mx-auto">
            Discover our curated collection of furniture pieces. Updated regularly with new arrivals.
          </p>
          <div className="mt-6">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              className="text-furniture-charcoal border-furniture-lightgray"
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Products'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-furniture-charcoal text-white rounded-md hover:bg-furniture-darkgray"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            renderSkeletons()
          ) : (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-furniture-gray">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
