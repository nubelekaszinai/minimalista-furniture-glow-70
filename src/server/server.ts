
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

// Initialize server
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load Google Service Account credentials
const CREDENTIALS_PATH = path.join(__dirname, '../../config/my-project-1495795620978-89212454248a.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

// Initialize Google Spreadsheet
const SPREADSHEET_ID = '1dp6e2meB2xC9fm_Q6SgAlydqzANQz3YWTruSjqVTzq8';
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

// Initialize Stripe
const stripe = new Stripe('sk_test_51R5cdT2K3ie3J8HoQb8YdLr06na5UxJaSTIZCvZeoHd8HvmZYRfImpe7LFCGY52lWlItRWg8PwtNdm0MN7yQmzYa006fw6AjC0', {
  apiVersion: '2023-10-16',
});

// Connect to Google Sheets
const connectToGoogleSheets = async () => {
  try {
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });
    await doc.loadInfo();
    console.log('Connected to Google Sheets: ' + doc.title);
  } catch (error) {
    console.error('Error connecting to Google Sheets:', error);
  }
};

// Define type for row data to make TypeScript happy
interface ProductRowData {
  ID?: string;
  Name: string;
  Description: string;
  'Price (€)': string;
  'Image URL': string;
  Category: string;
  Stock: string;
  Status: string;
}

// Helper function to extract product data from a row
const extractProductData = (row: GoogleSpreadsheetRow) => {
  const rowData = row.toObject() as ProductRowData;
  return {
    id: rowData.ID || row.rowIndex.toString(),
    name: rowData.Name,
    description: rowData.Description,
    price: parseFloat(rowData['Price (€)']),
    image: rowData['Image URL'],
    category: rowData.Category,
    stock: parseInt(rowData.Stock),
    status: rowData.Status
  };
};

// API Routes
// Get products
app.get('/api/products', async (req, res) => {
  try {
    await connectToGoogleSheets();
    
    const sheet = doc.sheetsByIndex[0]; // Assuming products are on the first sheet
    const rows = await sheet.getRows();
    
    const products = rows
      .filter(row => {
        const rowData = row.toObject() as ProductRowData;
        return parseInt(rowData.Stock) > 0 && rowData.Status === 'active';
      })
      .slice(0, 6) // Only get the first 6 active products
      .map(row => extractProductData(row));
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Get product details from Google Sheets
    await connectToGoogleSheets();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const productRow = rows.find(row => {
      const rowData = row.toObject() as ProductRowData;
      return rowData.ID === productId || row.rowIndex.toString() === productId;
    });
    
    if (!productRow) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const productData = productRow.toObject() as ProductRowData;
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productData.Name,
              description: productData.Description,
              images: [productData['Image URL']],
            },
            unit_amount: parseFloat(productData['Price (€)']) * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?success=true&productId=${productId}`,
      cancel_url: `${req.headers.origin}/?cancelled=true`,
    });
    
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook for Stripe events
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    // Note: In production, you should set a webhook secret
    event = stripe.webhooks.constructEvent(payload, sig, 'whsec_your_webhook_secret');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Extract product ID from success URL
    const url = new URL(session.success_url);
    const productId = url.searchParams.get('productId');
    
    if (productId) {
      try {
        // Update product stock in Google Sheets
        await connectToGoogleSheets();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        
        const productRow = rows.find(row => {
          const rowData = row.toObject() as ProductRowData;
          return rowData.ID === productId || row.rowIndex.toString() === productId;
        });
        
        if (productRow) {
          const productData = productRow.toObject() as ProductRowData;
          // Decrease stock by 1
          const newStock = parseInt(productData.Stock) - 1;
          
          // Update the row data
          await productRow.set('Stock', newStock.toString());
          
          // If stock reaches 0, mark as sold
          if (newStock <= 0) {
            await productRow.set('Status', 'sold');
          }
          
          await productRow.save();
          console.log(`Updated stock for product ${productId}. New stock: ${newStock}`);
        }
      } catch (error) {
        console.error('Error updating product stock:', error);
      }
    }
  }

  res.status(200).send('Received');
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
    
    await connectToGoogleSheets();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const productRow = rows.find(row => {
      const rowData = row.toObject() as ProductRowData;
      return rowData.ID === id || row.rowIndex.toString() === id;
    });
    
    if (!productRow) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product fields
    if (name) await productRow.set('Name', name);
    if (description) await productRow.set('Description', description);
    if (price) await productRow.set('Price (€)', price.toString());
    if (image) await productRow.set('Image URL', image);
    
    await productRow.save();
    
    const updatedData = productRow.toObject() as ProductRowData;
    
    res.json({
      id: updatedData.ID || productRow.rowIndex.toString(),
      name: updatedData.Name,
      description: updatedData.Description,
      price: parseFloat(updatedData['Price (€)']),
      image: updatedData['Image URL'],
      category: updatedData.Category,
      stock: parseInt(updatedData.Stock),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    
    await connectToGoogleSheets();
    const sheet = doc.sheetsByIndex[0];
    
    // Add new row
    await sheet.addRow({
      Name: name,
      Description: description,
      'Price (€)': price.toString(),
      'Image URL': image,
      Category: category,
      Stock: stock.toString(),
      Status: 'active',
    });
    
    res.status(201).json({
      name,
      description,
      price: parseFloat(price.toString()),
      image,
      category,
      stock: parseInt(stock.toString()),
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await connectToGoogleSheets();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    const productRow = rows.find(row => {
      const rowData = row.toObject() as ProductRowData;
      return rowData.ID === id || row.rowIndex.toString() === id;
    });
    
    if (!productRow) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await productRow.delete();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for importing in other files
export default app;
