
import { Product } from "../types/product";
import { fetchProductsFromSheet } from "../utils/googleSheets";

// Mock data as fallback if the API call fails
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Minimalist Lounge Chair",
    description: "A sleek, comfortable chair perfect for modern living spaces. Made from sustainable materials with expert craftsmanship.",
    price: 899,
    image: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seating",
    stock: 10,
    status: "active"
  },
  {
    id: "2",
    name: "Sculptural Coffee Table",
    description: "An eye-catching centerpiece with clean lines and natural materials. Perfect height and proportions for any living room.",
    price: 1250,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Tables",
    stock: 5,
    status: "active"
  },
  {
    id: "3",
    name: "Modular Bookshelf",
    description: "Customize your storage solution with this adaptable bookshelf. Crafted from solid oak with adjustable components.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Storage",
    stock: 8,
    status: "active"
  },
  {
    id: "4",
    name: "Scandinavian Dining Chair",
    description: "Elegantly designed dining chair combining comfort and minimalist design. Perfect for extended dinner conversations.",
    price: 450,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seating",
    stock: 20,
    status: "active"
  },
  {
    id: "5",
    name: "Floating Bedside Table",
    description: "Space-saving wall-mounted nightstand with a drawer for essentials. Perfect for small bedrooms.",
    price: 399,
    image: "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Bedroom",
    stock: 12,
    status: "active"
  },
  {
    id: "6",
    name: "Organic Form Floor Lamp",
    description: "Sculptural lighting piece that provides warm, ambient illumination. Made from hand-blown glass and brass.",
    price: 749,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Lighting",
    stock: 7,
    status: "active"
  }
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    // Try to fetch products from Google Sheets
    // Note: In browser environments, this will likely fail due to CORS or Node.js dependency issues
    const sheetProducts = await fetchProductsFromSheet();
    
    // If we got products from the sheet, return them
    if (sheetProducts && sheetProducts.length > 0) {
      return sheetProducts;
    } else {
      // Fallback to mock data if no products were found or error occurred
      console.log('Falling back to mock product data');
      return mockProducts;
    }
  } catch (error) {
    console.error('Error getting products:', error);
    // Fallback to mock data in case of error
    return mockProducts;
  }
};
