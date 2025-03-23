
import { useState } from "react";
import { Product } from "../types/product";
import { useToast } from "../hooks/use-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { redirectToCheckout } from "../utils/stripe";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = async () => {
    if (!isInStock || isProcessing) return;
    
    setIsProcessing(true);
    
    toast({
      title: "Processing payment",
      description: `Redirecting to checkout for ${product.name}...`,
      duration: 3000,
    });
    
    try {
      await redirectToCheckout(product.id);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Could not redirect to checkout. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
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
          <button 
            onClick={handleBuyNow} 
            className={`buy-button ${!isInStock || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isInStock || isProcessing}
          >
            {isProcessing ? 'Processing...' : isInStock ? 'Buy Now' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
