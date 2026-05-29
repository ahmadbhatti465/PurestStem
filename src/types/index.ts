export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  images?: string | null;
  stock: number;
  sku?: string | null;
  weight?: string | null;
  ingredients?: string | null;
  howToUse?: string | null;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
