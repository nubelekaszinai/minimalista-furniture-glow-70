
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string; // Keep existing field as optional
  stock: number;
  status: string;
}
