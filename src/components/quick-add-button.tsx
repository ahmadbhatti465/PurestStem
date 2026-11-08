"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface QuickAddButtonProps {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  soldOut?: boolean;
}

export function QuickAddButton({ productId, name, slug, price, image, soldOut }: QuickAddButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleAdd() {
    addItem({ productId, name, slug, price, quantity: 1, image });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={soldOut}
      aria-label={soldOut ? `${name} is sold out` : `Add ${name} to cart`}
      className="btn btn-outline w-full !px-3"
    >
      {soldOut ? (
        "Sold out"
      ) : added ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> Added
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add to cart
        </>
      )}
    </button>
  );
}
