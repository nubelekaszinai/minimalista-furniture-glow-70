
import { google } from 'googleapis';
import { Product } from '../types/product';

// Initialize the Google Sheets API client with browser compatibility
const auth = new google.auth.GoogleAuth({
  keyFile: './config/my-project-1495795620978-89212454248a.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Spreadsheet ID from the URL
const SPREADSHEET_ID = '1dp6e2meB2xC9fm_Q6SgAlydqzANQz3YWTruSjqVTzq8';
const RANGE = 'Products!A2:I'; // Assuming headers are in row 1

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    console.log('Attempting to fetch products from Google Sheets...');
    
    // This will likely fail in browser environment, so we'll catch and use mock data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in the spreadsheet.');
      return [];
    }

    // Map the rows to product objects
    const products: Product[] = rows.map((row, index) => {
      return {
        id: (index + 1).toString(), // Generate ID based on row position
        name: row[0] || '',
        description: row[1] || '',
        price: parseFloat(row[2]) || 0,
        category: row[3] || '',
        image: row[4] || '',
        stock: parseInt(row[5]) || 0,
        status: row[6] || ''
      };
    });

    // Filter products: only those with stock > 0 and status = "active"
    const activeProducts = products.filter(product => 
      product.stock > 0 && product.status.toLowerCase() === 'active'
    );

    // Return only the first 6 active products
    return activeProducts.slice(0, 6);
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    console.log('Falling back to mock data in getProducts()');
    return [];
  }
}
