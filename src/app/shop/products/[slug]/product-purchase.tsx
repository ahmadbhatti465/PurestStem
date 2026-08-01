"use client";

import AddToCartButton, {
  QuantityStepper,
  useAddToCart,
} from "./add-to-cart-button";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
  images?: string | null;
}

interface ProductPurchaseProps {
  product: Product;
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const { quantity, increase, decrease, handleAdd, added } = useAddToCart(product);

  return (
    <>
      {/* Desktop inline purchase block */}
      <div className="hidden sm:block">
        <AddToCartButton
          product={product}
          quantity={quantity}
          increase={increase}
          decrease={decrease}
          handleAdd={handleAdd}
          added={added}
        />
      </div>

      {/* Mobile sticky bottom CTA bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
            </span>
            <span className="text-lg font-bold text-green-700">
              {formatPrice(product.salePrice || product.price)}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <QuantityStepper
              quantity={quantity}
              increase={increase}
              decrease={decrease}
              stock={product.stock}
              compact
            />
            <AddToCartButton
              product={product}
              variant="sticky"
              handleAdd={handleAdd}
              added={added}
            />
          </div>
        </div>
      </div>
    </>
  );
}
