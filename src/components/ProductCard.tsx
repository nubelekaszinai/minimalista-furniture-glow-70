
import { useState } from "react";
import { Product } from "../types/product";
import { useToast } from "../hooks/use-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = async () => {
    setIsLoading(true);
    
    try {
      // Call our secure checkout endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product.id,
          productName: product.name,
          price: product.price,
          image: product.image
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Could not process payment. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isInStock = product.stock > 0;

  return (
    <div 
      className="product-card opacity-0 animate-fade-in p-4"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="image-container relative aspect-square mb-4 bg-furniture-offwhite">
        {/* Product Image with Fade-in effect */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover image-scale-effect ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Stock status indicator */}
        <div className="absolute top-3 right-3">
          {isInStock ? (
            <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <CheckCircle size={14} className="mr-1" />
              In Stock: {product.stock}
            </div>
          ) : (
            <div className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              Out of Stock
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-furniture-charcoal">{product.name}</h3>
        {product.category && <p className="text-sm text-furniture-gray mt-1">{product.category}</p>}
        <p className="mt-2 text-sm text-furniture-darkgray line-clamp-2">{product.description}</p>
        <p className="mt-3 text-furniture-darkgray font-medium">${product.price.toLocaleString()}</p>
        
        <div className="mt-4">
          <Button 
            onClick={handleBuyNow} 
            disabled={!isInStock || isLoading}
            className={`w-full ${!isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            variant="default"
          >
            {isLoading ? 'Processing...' : isInStock ? 'Buy Now' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
