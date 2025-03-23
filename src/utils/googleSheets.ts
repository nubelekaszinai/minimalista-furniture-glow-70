
import { Product } from '../types/product';

// Mock fetch function to simulate Google Sheets API call
export async function fetchProductsFromSheet(): Promise<Product[]> {
  console.log('Attempting to fetch products from Google Sheets...');
  console.log('Note: Google Sheets API direct access is not supported in browser environment');
  console.log('Falling back to mock data');
  
  // Return empty array to trigger fallback to mock data
  return [];
}
