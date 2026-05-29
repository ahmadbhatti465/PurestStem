"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();

  return (
    <Button
      size="lg"
      onClick={() =>
        addItem({
          productId: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          quantity: 1,
          image: product.image || undefined,
        })
      }
      disabled={product.stock <= 0}
      className="w-full md:w-auto"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
