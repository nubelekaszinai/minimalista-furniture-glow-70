
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  status?: string;
}

export interface ProductRowData {
  ID?: string;
  Name: string;
  Description: string;
  'Price (€)': string;
  'Image URL': string;
  Category: string;
  Stock: string;
  Status: string;
}
