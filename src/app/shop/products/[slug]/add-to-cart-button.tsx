"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.image || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={product.stock <= 0}
      className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all active:scale-[0.98] ${
        product.stock <= 0
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : added
          ? "bg-green-100 text-green-800"
          : "bg-green-700 text-white hover:bg-green-800 shadow-lg hover:shadow-xl"
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" /> Added
        </>
      ) : product.stock > 0 ? (
        <>
          <ShoppingCart className="w-5 h-5" /> Add to Cart
        </>
      ) : (
        <>Out of Stock</>
      )}
    </button>
  );
}
