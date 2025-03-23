
import { useState } from "react";
import { Product } from "../types/product";
import { useToast } from "../hooks/use-toast";
import { createCheckoutSession } from "../api/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);
      const { url } = await createCheckoutSession(product.id);
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="product-card opacity-0 animate-fade-in p-4"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="image-container aspect-square mb-4 bg-furniture-offwhite">
        {/* Product Image with Fade-in effect */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover image-scale-effect ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-furniture-charcoal">{product.name}</h3>
        <p className="text-sm text-furniture-gray mt-1">{product.category}</p>
        <p className="mt-3 text-furniture-darkgray font-medium">€{product.price.toLocaleString()}</p>
        
        <div className="mt-4">
          <button 
            onClick={handleBuyNow} 
            className={`buy-button ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="w-4 h-4 border-2 border-furniture-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </span>
            ) : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
