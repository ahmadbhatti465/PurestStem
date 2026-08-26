"use client";

import { useEffect, useRef } from "react";
import { trackViewContent } from "@/lib/meta/pixel";

interface ViewContentTrackerProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    category?: {
      name: string;
    } | null;
  };
}

export default function ViewContentTracker({ product }: ViewContentTrackerProps) {
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackedRef.current === product.id) return;
    trackedRef.current = product.id;

    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      category: product.category?.name,
    });
  }, [product.id, product.name, product.price, product.salePrice, product.category?.name]);

  return null;
}
