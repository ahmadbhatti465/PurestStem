"use client";

import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { getPrimaryImage } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
  images?: string | null;
}

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "sticky";
  quantity?: number;
  increase?: () => void;
  decrease?: () => void;
  handleAdd?: () => void;
  added?: boolean;
}

export function useAddToCart(product: Product) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const increase = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrease = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAdd = () => {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity,
      image: getPrimaryImage(product.image, product.images) || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return { quantity, increase, decrease, handleAdd, added };
}

export function QuantityStepper({
  quantity,
  increase,
  decrease,
  stock,
  compact = false,
}: {
  quantity: number;
  increase: () => void;
  decrease: () => void;
  stock: number;
  compact?: boolean;
}) {
  const size = compact ? "px-2.5 py-2" : "px-4 py-3";

  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= 1 || stock <= 0}
        className={`${size} text-gray-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className={`${compact ? "w-9" : "w-12"} text-center font-semibold text-gray-900 select-none`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={quantity >= stock || stock <= 0}
        className={`${size} text-gray-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AddToCartButton({
  product,
  variant = "default",
  quantity: externalQuantity,
  increase: externalIncrease,
  decrease: externalDecrease,
  handleAdd: externalHandleAdd,
  added: externalAdded,
}: AddToCartButtonProps) {
  const hook = useAddToCart(product);
  const quantity = externalQuantity ?? hook.quantity;
  const increase = externalIncrease ?? hook.increase;
  const decrease = externalDecrease ?? hook.decrease;
  const handleAdd = externalHandleAdd ?? hook.handleAdd;
  const added = externalAdded ?? hook.added;

  if (variant === "sticky") {
    return (
      <motion.button
        onClick={handleAdd}
        disabled={product.stock <= 0}
        whileTap={product.stock > 0 ? { scale: 0.96 } : undefined}
        className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
          product.stock <= 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-100 text-green-800"
            : "bg-green-700 text-white hover:bg-green-800 shadow-lg"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" /> Added
          </>
        ) : product.stock > 0 ? (
          <>
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </>
        ) : (
          <>Out of Stock</>
        )}
      </motion.button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <QuantityStepper
        quantity={quantity}
        increase={increase}
        decrease={decrease}
        stock={product.stock}
      />

      <motion.button
        onClick={handleAdd}
        disabled={product.stock <= 0}
        whileTap={product.stock > 0 ? { scale: 0.96 } : undefined}
        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all ${
          product.stock <= 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-100 text-green-800"
            : "bg-green-700 text-white hover:bg-green-800 shadow-lg hover:shadow-xl"
        }`}
      >
        {added ? (
          <motion.span
            key="added"
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="w-5 h-5" /> Added
          </motion.span>
        ) : product.stock > 0 ? (
          <>
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </>
        ) : (
          <>Out of Stock</>
        )}
      </motion.button>
    </div>
  );
}
