
import { useState } from "react";
import { Product } from "../types/product";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { ShoppingCart, Package, AlertTriangle } from "lucide-react";

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

  // Determine stock status display
  const renderStockStatus = () => {
    if (product.stock <= 0) {
      return (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Out of Stock
        </div>
      );
    } else if (product.stock <= 3) {
      return (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Only {product.stock} left
        </div>
      );
    } else {
      return (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Package className="w-3 h-3" />
          In Stock
        </div>
      );
    }
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
        
        {/* Stock status indicator */}
        {renderStockStatus()}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-furniture-charcoal">{product.name}</h3>
        <p className="text-sm text-furniture-gray mt-1">{product.category}</p>
        <p className="mt-2 text-sm text-furniture-darkgray line-clamp-2">{product.description}</p>
        <p className="mt-3 text-furniture-darkgray font-medium">€{product.price.toLocaleString()}</p>
        
        <div className="mt-4">
          <Button 
            onClick={handleBuyNow} 
            className="w-full bg-furniture-charcoal hover:bg-furniture-darkgray text-white flex items-center justify-center gap-2"
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock > 0 ? "Buy Now" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
