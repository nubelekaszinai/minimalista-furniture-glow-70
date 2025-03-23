
import { Product } from "../types/product";

// API base URL - change this to your server URL in production
const API_BASE_URL = 'http://localhost:3001/api';

// Fetch products from the API
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data if the API fails
    return mockProducts;
  }
};

// Create a checkout session for a product
export const createCheckoutSession = async (productId: string): Promise<{ url: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create checkout session: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { url: data.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Mock data for fallback
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Lounge Chair",
    description: "A sleek, comfortable chair perfect for modern living spaces. Made from sustainable materials with expert craftsmanship.",
    price: 899,
    image: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seating"
  },
  {
    id: "2",
    name: "Sculptural Coffee Table",
    description: "An eye-catching centerpiece with clean lines and natural materials. Perfect height and proportions for any living room.",
    price: 1250,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Tables"
  },
  {
    id: "3",
    name: "Modular Bookshelf",
    description: "Customize your storage solution with this adaptable bookshelf. Crafted from solid oak with adjustable components.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Storage"
  },
  {
    id: "4",
    name: "Scandinavian Dining Chair",
    description: "Elegantly designed dining chair combining comfort and minimalist design. Perfect for extended dinner conversations.",
    price: 450,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seating"
  },
  {
    id: "5",
    name: "Floating Bedside Table",
    description: "Space-saving wall-mounted nightstand with a drawer for essentials. Perfect for small bedrooms.",
    price: 399,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Bedroom"
  },
  {
    id: "6",
    name: "Organic Form Floor Lamp",
    description: "Sculptural lighting piece that provides warm, ambient illumination. Made from hand-blown glass and brass.",
    price: 749,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Lighting"
  }
];
