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
  shortDescription?: string | null;
  brand?: string | null;
  productType?: string | null;
  condition?: string | null;
  gtin?: string | null;
  mpn?: string | null;
  unit?: string | null;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  images?: string | null;
  imageMetadata?: string | null;
  stock: number;
  sku?: string | null;
  weight?: string | null;
  weightValue?: number | null;
  weightUnit?: string | null;
  ingredients?: string | null;
  structuredIngredients?: string | null;
  howToUse?: string | null;
  structuredHowToUse?: string | null;
  benefits?: string | null;
  features?: string | null;
  featured: boolean;
  isActive: boolean;
  status?: string | null;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string | null;
  canonicalUrl?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  faqs?: string | null;
  relatedProductIds?: string | null;
  relatedBlogIds?: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
