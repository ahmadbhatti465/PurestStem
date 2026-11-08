"use client";

import { useRef, useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { getPrimaryImage } from "@/lib/utils";

export interface PurchasableProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
  images?: string | null;
}

export function useAddToCart(product: PurchasableProduct) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const increase = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrease = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAdd = () => {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      quantity,
      image: getPrimaryImage(product.image, product.images) || undefined,
    });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1500);
  };

  return { quantity, increase, decrease, handleAdd, added };
}

export function QuantityStepper({
  quantity,
  increase,
  decrease,
  stock,
}: {
  quantity: number;
  increase: () => void;
  decrease: () => void;
  stock: number;
}) {
  const button =
    "flex h-12 w-11 items-center justify-center text-green-950 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded-full border border-line bg-white">
      <button type="button" onClick={decrease} disabled={quantity <= 1 || stock <= 0} className={button} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-7 select-none text-center font-medium" aria-live="polite">
        {quantity}
      </span>
      <button type="button" onClick={increase} disabled={quantity >= stock || stock <= 0} className={button} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function AddToCartButton({
  stock,
  handleAdd,
  added,
  className = "",
}: {
  stock: number;
  handleAdd: () => void;
  added: boolean;
  className?: string;
}) {
  return (
    <button type="button" onClick={handleAdd} disabled={stock <= 0} className={`btn btn-primary ${className}`}>
      {stock <= 0 ? (
        "Sold out"
      ) : added ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> Added to cart
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add to cart
        </>
      )}
    </button>
  );
}
