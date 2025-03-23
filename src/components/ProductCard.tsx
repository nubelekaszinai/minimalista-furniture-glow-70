
import { useState } from "react";
import { Product } from "../types/product";
import { useToast } from "../hooks/use-toast";

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
        <p className="mt-3 text-furniture-darkgray font-medium">${product.price.toLocaleString()}</p>
        
        <div className="mt-4">
          <button onClick={handleBuyNow} className="buy-button">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
