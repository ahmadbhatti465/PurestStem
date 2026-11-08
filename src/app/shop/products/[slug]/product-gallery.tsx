"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selectedImage = images[selectedIndex] ?? images[0];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightboxOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  return (
    <div className="lg:sticky lg:top-28">
      <div className="surface group relative aspect-square overflow-hidden">
        <SmartImage
          key={selectedImage}
          src={selectedImage}
          alt={productName}
          fill
          preload={selectedIndex === 0}
          sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
          className="bottle-float object-contain p-4 mix-blend-multiply brightness-[1.04] sm:p-8"
        />

        {selectedImage && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Enlarge image of ${productName}`}
            className="absolute inset-0 flex cursor-zoom-in items-end justify-end p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-950 shadow-md">
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        )}

        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-green-900 px-3 py-1.5 text-xs font-semibold text-white">
            Save {discount}%
          </span>
        )}
        {stock <= 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1} of ${productName}`}
              aria-current={i === selectedIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-white transition-colors",
                i === selectedIndex ? "border-green-900 ring-1 ring-green-900" : "border-line hover:border-green-600"
              )}
            >
              <SmartImage src={url} alt="" fill sizes="110px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image`}
          className="fixed inset-0 z-[60] bg-green-950/95"
          onClick={() => setLightboxOpen(false)}
        >
          <SmartImage src={selectedImage} alt={productName} fill sizes="100vw" className="object-contain p-6" />
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image"
            autoFocus
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
