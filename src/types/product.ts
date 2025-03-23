
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: string;
}

export interface ProductRowData {
  ID: string;
  Name: string;
  Description: string;
  "Price (€)": number;
  "Image URL": string;
  Category: string;
  Stock: number;
  Status: string;
}
