"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selectedImage = images[selectedIndex] || images[0];

  const lowStock = stock > 0 && stock <= 5;
  const outOfStock = stock <= 0;

  function handleImageError(url: string) {
    setImgError((prev) => ({ ...prev, [url]: true }));
  }

  function renderImage(url: string | undefined, alt: string, className?: string) {
    if (!url || imgError[url]) {
      return (
        <div className={cn("flex flex-col items-center justify-center text-gray-300 bg-gray-50", className)}>
          <Package className="w-16 h-16 opacity-30 mb-2" />
          <span className="text-sm">No image available</span>
        </div>
      );
    }
    return (
      <img
        src={url}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => handleImageError(url)}
      />
    );
  }

  return (
    <>
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
          <AnimatePresence mode="wait">
            {selectedImage ? (
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                {renderImage(selectedImage, productName, "w-full h-full object-cover")}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </motion.div>
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
                {renderImage(url, `${productName} ${i + 1}`, "w-full h-full object-cover")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*  Lightbox  */}
      {lightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 min-w-[44px] min-h-[44px] bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt={productName}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
