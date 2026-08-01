"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
  stock?: number;
}

export default function ProductGallery({
  images,
  productName,
  discount = 0,
  stock = 0,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] || images[0];

  const lowStock = stock > 0 && stock <= 5;
  const outOfStock = stock <= 0;

  return (
    <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
        <AnimatePresence mode="wait">
          {selectedImage ? (
            <motion.img
              key={selectedImage}
              src={selectedImage}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
              <Package className="w-24 h-24 opacity-30" />
            </div>
          )}
        </AnimatePresence>

        {discount > 0 && (
          <div className="absolute top-5 left-5 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}

        {lowStock && (
          <div className="absolute top-5 right-5 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
            Only {stock} left
          </div>
        )}

        {outOfStock && (
          <div className="absolute top-5 right-5 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            Out of Stock
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                i === selectedIndex
                  ? "border-green-600 ring-2 ring-green-100"
                  : "border-transparent hover:border-green-300"
              }`}
              aria-label={`View ${productName} image ${i + 1}`}
            >
              <img
                src={url}
                alt={`${productName} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
