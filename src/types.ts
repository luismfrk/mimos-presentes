export type Category = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  sort_order: number;
  created_at?: string;
  url?: string;
};
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  category_id: string;
  published: boolean;
  available: boolean;
  featured: boolean;
  is_new: boolean;
  customizable: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
};
export type CartItem = {
  product: Product;
  quantity: number;
  personalization?: string;
};
