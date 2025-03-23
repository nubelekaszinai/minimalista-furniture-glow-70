
import { useState } from "react";
import { Product } from "../types/product";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div 
      className="product-card opacity-0 animate-fade-in p-4"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="image-container aspect-square mb-4 bg-furniture-offwhite relative">
        {/* Product Image with Fade-in effect */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover image-scale-effect ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Show stock indicator */}
        {product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-furniture-charcoal">{product.name}</h3>
        <p className="text-sm text-furniture-gray mt-1">{product.category}</p>
        <p className="mt-3 text-furniture-darkgray font-medium">€{product.price.toLocaleString()}</p>
        
        <div className="mt-4">
          <Button 
            onClick={handleBuyNow} 
            className="w-full bg-furniture-charcoal hover:bg-furniture-darkgray text-white"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
