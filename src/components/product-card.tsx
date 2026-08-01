"use client";

import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string | null;
    images?: string | null;
    category: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = calculateDiscount(product.price, product.salePrice);
  const primaryImage = getPrimaryImage(product.image, product.images);
  const productUrl = `/shop/products/${encodeURIComponent(slugify(product.slug || product.name))}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: primaryImage || undefined,
    });
  };

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link href={productUrl} className="block relative">
        <div className="aspect-square bg-gradient-to-br from-green-50/80 to-gray-50 flex items-center justify-center relative overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ShoppingCart className="w-8 h-8 mb-2 opacity-40" />
              <span className="text-xs">No Image</span>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}

          {/* Quick Add - appears on hover (desktop), always visible on mobile */}
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-green-800 hover:scale-110"
            aria-label={`Quick add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
          {product.category.name}
        </p>
        <Link href={productUrl}>
          <h3 className="font-display font-semibold text-[15px] text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-lg font-bold text-green-700">
            {formatPrice(product.salePrice || product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={productUrl}
            className="w-full flex items-center justify-center gap-2 bg-white text-green-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors border border-green-100"
          >
            <Eye className="w-4 h-4" />
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
