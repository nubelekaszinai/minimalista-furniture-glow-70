
import { Product } from '../types/product';

/**
 * This is a mock implementation of Google Sheets API fetching.
 * 
 * IMPORTANT: Direct Google Sheets API access from a browser is problematic because:
 * 1. Service account credentials shouldn't be exposed in client-side code
 * 2. CORS issues with direct API calls
 * 3. Node.js-specific dependencies in the Google API client libraries
 * 
 * For production use, you should:
 * - Create a backend API endpoint that fetches Google Sheets data
 * - Call that endpoint from your frontend
 * - Or use Google Sheets API with Apps Script to publish data as JSON
 */
export async function fetchProductsFromSheet(): Promise<Product[]> {
  console.log('Attempting to fetch products from Google Sheets...');
  console.log('Note: Google Sheets API direct access is not supported in browser environment');
  console.log('In production, you should use a backend service or serverless function');
  console.log('Falling back to mock data that simulates Google Sheets response');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data structure that simulates what would come from Google Sheets
  const mockSheetData: Product[] = [
    {
      id: "101",
      name: "Oslo Armchair",
      description: "Mid-century inspired armchair with natural wood legs and premium wool upholstery.",
      price: 699,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Seating",
      stock: 5,
      status: "active"
    },
    {
      id: "102",
      name: "Kyoto Dining Table",
      description: "Handcrafted solid oak dining table with minimalist Japanese-inspired design.",
      price: 1599,
      image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Tables",
      stock: 2,
      status: "active"
    },
    {
      id: "103",
      name: "Bergen Wool Throw",
      description: "Scandinavian merino wool throw blanket with geometric patterns.",
      price: 129,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Accessories",
      stock: 15,
      status: "active"
    },
    {
      id: "104",
      name: "Malmo Floor Lamp",
      description: "Adjustable brass floor lamp with marble base and linen shade.",
      price: 349,
      image: "https://images.unsplash.com/photo-1646797153559-3b61003dcb11?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Lighting",
      stock: 0,
      status: "active"
    },
    {
      id: "105",
      name: "Copenhagen Wall Shelf",
      description: "Floating wall shelf with hidden brackets and solid walnut construction.",
      price: 259,
      image: "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Storage",
      stock: 8,
      status: "active"
    },
    {
      id: "106",
      name: "Helsinki Bar Stool",
      description: "Counter-height stool with woven leather seat and black steel frame.",
      price: 289,
      image: "https://images.unsplash.com/photo-1533201357341-8d79b10dd0f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Seating",
      stock: 4,
      status: "active"
    },
    {
      id: "107",
      name: "Aarhus Side Table",
      description: "Compact side table with brass detailing and smoked glass top.",
      price: 349,
      image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Tables",
      stock: 7,
      status: "active"
    },
    {
      id: "108",
      name: "Stockholm Desk",
      description: "Home office desk with integrated cable management and drawers.",
      price: 899,
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Workspace",
      stock: 1,
      status: "active"
    }
  ];
  
  // Filter products as would be done with real sheet data:
  // - only active products with stock > 0
  // - limit to first 6 items
  return mockSheetData
    .filter(product => product.status === 'active' && product.stock > 0)
    .slice(0, 6);
}
