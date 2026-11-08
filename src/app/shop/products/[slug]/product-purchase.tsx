"use client";

import AddToCartButton, {
  QuantityStepper,
  useAddToCart,
  type PurchasableProduct,
} from "./add-to-cart-button";
import { formatPrice } from "@/lib/utils";

export default function ProductPurchase({ product }: { product: PurchasableProduct }) {
  const { quantity, increase, decrease, handleAdd, added } = useAddToCart(product);

  return (
    <>
      <div className="hidden items-center gap-3 sm:flex">
        <QuantityStepper quantity={quantity} increase={increase} decrease={decrease} stock={product.stock} />
        <AddToCartButton stock={product.stock} handleAdd={handleAdd} added={added} className="flex-1" />
      </div>

      {/* Sticky buy bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white px-4 py-3 sm:hidden">
        <p className="shrink-0 text-base font-semibold text-green-950">
          {formatPrice(product.salePrice || product.price)}
        </p>
        <AddToCartButton stock={product.stock} handleAdd={handleAdd} added={added} className="flex-1" />
      </div>
    </>
  );
}
