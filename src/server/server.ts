
import express from 'express';
import cors from 'cors';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import { Product, ProductRowData } from '../types/product';
import * as fs from 'fs';
import * as path from 'path';

// Constants
const PORT = process.env.PORT || 3001;
const SPREADSHEET_ID = '1dp6e2meB2xC9fm_Q6SgAlydqzANQz3YWTruSjqVTzq8';
const STRIPE_SECRET_KEY = 'sk_test_51R5cdT2K3ie3J8HoQb8YdLr06na5UxJaSTIZCvZeoHd8HvmZYRfImpe7LFCGY52lWlItRWg8PwtNdm0MN7yQmzYa006fw6AjC0';
const SERVICE_ACCOUNT_FILE_PATH = path.resolve(__dirname, '../../config/my-project-1495795620978-89212454248a.json');
const PRODUCTS_SHEET_INDEX = 0;

// Initialize Express app
const app = express();

app.use(cors({
  origin: '*',  // Allow all origins for testing
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

// Initialize Google Sheets
async function getSpreadsheet() {
  try {
    // Load service account credentials
    const credentials = JSON.parse(
      fs.readFileSync(SERVICE_ACCOUNT_FILE_PATH, 'utf8')
    );

    // Create a JWT auth client
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    
    // Load document properties and worksheets
    await doc.loadInfo();
    
    return doc;
  } catch (error) {
    console.error('Error initializing spreadsheet:', error);
    throw error;
  }
}

// Helper function to get active products
async function getActiveProducts() {
  try {
    const doc = await getSpreadsheet();
    const sheet = doc.sheetsByIndex[PRODUCTS_SHEET_INDEX];
    
    // Load all rows
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    // Filter and map active products
    const products: Product[] = [];
    
    for (const row of rows) {
      const rowData = row.toObject() as unknown as ProductRowData;
      
      // Only include products with stock > 0 and status = "active"
      if (rowData.Stock > 0 && rowData.Status === 'active') {
        products.push({
          id: rowData.ID,
          name: rowData.Name,
          description: rowData.Description,
          price: rowData["Price (€)"],
          image: rowData["Image URL"],
          category: rowData.Category,
          stock: rowData.Stock,
          status: rowData.Status
        });
        
        // Limit to 6 products
        if (products.length >= 6) {
          break;
        }
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw error;
  }
}

// Helper function to find a product by ID
async function findProductById(productId: string): Promise<{ product: Product, row: any } | null> {
  try {
    const doc = await getSpreadsheet();
    const sheet = doc.sheetsByIndex[PRODUCTS_SHEET_INDEX];
    
    // Load all rows
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    for (const row of rows) {
      const rowData = row.toObject() as unknown as ProductRowData;
      
      if (rowData.ID === productId) {
        const product: Product = {
          id: rowData.ID,
          name: rowData.Name,
          description: rowData.Description,
          price: rowData["Price (€)"],
          image: rowData["Image URL"],
          category: rowData.Category,
          stock: rowData.Stock,
          status: rowData.Status
        };
        
        return { product, row };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error finding product with ID ${productId}:`, error);
    throw error;
  }
}

// Helper function to update product stock
async function updateProductStock(productId: string, newStock: number): Promise<boolean> {
  try {
    const productData = await findProductById(productId);
    
    if (!productData) {
      console.error(`Product with ID ${productId} not found for stock update`);
      return false;
    }
    
    const { row } = productData;
    
    // Update stock
    row.Stock = newStock;
    
    // If stock is 0, update status to "sold"
    if (newStock <= 0) {
      row.Status = 'sold';
    }
    
    // Save changes
    await row.save();
    
    console.log(`Updated stock for product ${productId} to ${newStock}`);
    return true;
  } catch (error) {
    console.error(`Error updating stock for product ${productId}:`, error);
    return false;
  }
}

// API endpoints
// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get active products
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products from Google Sheets...');
    const products = await getActiveProducts();
    console.log(`Found ${products.length} active products`);
    res.json({ products });
  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Find the product
    const productData = await findProductById(productId);
    
    if (!productData) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const { product } = productData;
    
    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}?success=true&session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
      cancel_url: `${req.headers.origin}?canceled=true`,
      metadata: {
        productId: productId,
      },
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook for handling successful payments
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      'whsec_your_webhook_signing_secret' // Replace with your actual webhook signing secret
    );
    
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const productId = session.metadata?.productId;
      
      if (productId) {
        // Find the product
        const productData = await findProductById(productId);
        
        if (productData) {
          const { product } = productData;
          
          // Decrease stock by 1
          const newStock = product.stock - 1;
          await updateProductStock(productId, newStock);
          
          console.log(`Stock updated for product ${productId}. New stock: ${newStock}`);
        }
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
