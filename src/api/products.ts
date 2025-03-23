
import { Product } from "../types/product";

// Mock data as fallback in case the API fails
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Lounge Chair",
    description: "A sleek, comfortable chair perfect for modern living spaces. Made from sustainable materials with expert craftsmanship.",
    price: 899,
    image: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seating",
    stock: 5,
    status: "active"
  },
  {
    id: "2",
    name: "Sculptural Coffee Table",
    description: "An eye-catching centerpiece with clean lines and natural materials. Perfect height and proportions for any living room.",
    price: 1250,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Tables",
    stock: 3,
    status: "active"
  },
  {
    id: "3",
    name: "Modular Bookshelf",
    description: "Customize your storage solution with this adaptable bookshelf. Crafted from solid oak with adjustable components.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Storage",
    stock: 2,
    status: "active"
  },
  {
    id: "4",
    name: "Scandinavian Dining Chair",
    description: "Elegantly designed dining chair combining comfort and minimalist design. Perfect for extended dinner conversations.",
    price: 450,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seating",
    stock: 8,
    status: "active"
  },
  {
    id: "5",
    name: "Floating Bedside Table",
    description: "Space-saving wall-mounted nightstand with a drawer for essentials. Perfect for small bedrooms.",
    price: 399,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Bedroom",
    stock: 0,
    status: "active"
  },
  {
    id: "6",
    name: "Organic Form Floor Lamp",
    description: "Sculptural lighting piece that provides warm, ambient illumination. Made from hand-blown glass and brass.",
    price: 749,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Lighting",
    stock: 4,
    status: "active"
  }
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzLg2TZIUatiqA0Fls90aOEGA9k-6kMP6Dl-fVNWqWdTUte_cpExQTP5cA_VQCi7YZkcw/exec");
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verify the data structure
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data);
      return mockProducts;
    }
    
    // Map the API response to our Product interface
    // Only include products with "active" status
    const products = data
      .filter((item: any) => item.Status === "active")
      .map((item: any) => ({
        id: item.ID || String(Math.random()),
        name: item.Name || "Product Name Missing",
        description: item.Description || "No description available",
        price: parseFloat(item.Price) || 0,
        image: item.Image || "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        stock: parseInt(item.Stock) || 0,
        status: item.Status || "inactive"
      }));
    
    if (products.length === 0) {
      console.warn("No active products found in the API response");
      return mockProducts;
    }
    
    return products;
  } catch (error) {
    console.error("Error fetching products from API:", error);
    // Return mock data if the API call fails
    return mockProducts;
  }
};
