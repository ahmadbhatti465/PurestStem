"use client";

import { useState } from "react";
import { Globe, Smartphone, Monitor } from "lucide-react";
import { SITE_URL } from "@/lib/site";

interface SerpPreviewProps {
  title: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  price?: number | string;
  salePrice?: number | string | null;
  stock?: number | string;
  brand?: string;
}

export default function SerpPreview({
  title,
  slug,
  description,
  seoTitle,
  seoDescription,
  price,
  salePrice,
  stock,
  brand = "PurestStem",
}: SerpPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const displayTitle = seoTitle || (title ? `${title} | Buy Online in Pakistan | ${brand}` : `Product Title | ${brand}`);
  const displayUrl = `${SITE_URL}/shop/products/${slug || "product-url-slug"}`;
  const displayDesc =
    seoDescription ||
    (description
      ? description.replace(/<[^>]+>/g, "").slice(0, 155)
      : "Discover PurestStem 100% natural herbal formula made with premium ingredients in Pakistan. Fast nationwide delivery with cash on delivery available.");

  const numPrice = salePrice && Number(salePrice) > 0 ? Number(salePrice) : Number(price) || 0;
  const inStock = Number(stock) > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-green-700" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Google Search Preview (SERP)
          </h3>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
              device === "desktop" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Monitor className="w-3 h-3" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
              device === "mobile" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Mobile
          </button>
        </div>
      </div>

      {/* Google Preview Container */}
      <div
        className={`bg-white rounded-xl border border-gray-200 p-4 font-sans text-left transition-all ${
          device === "mobile" ? "max-w-[375px] mx-auto shadow-sm" : "w-full"
        }`}
      >
        {/* Favicon & Breadcrumb */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            P
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#202124] leading-none">
              {brand}
            </div>
            <div className="text-[11px] text-[#4d5156] truncate leading-none mt-0.5 font-mono">
              {displayUrl}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-[#1a0dab] hover:underline text-[16px] font-normal leading-snug cursor-pointer line-clamp-2">
          {displayTitle}
        </div>

        {/* Rich Snippets (Price, Availability) */}
        {numPrice > 0 && (
          <div className="text-[12px] text-[#4d5156] font-medium my-0.5 flex items-center gap-2">
            <span className="text-gray-900 font-semibold">PKR {numPrice.toLocaleString()}</span>
            <span>·</span>
            <span className={inStock ? "text-green-700" : "text-red-600"}>
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>
        )}

        {/* Description */}
        <div className="text-[12px] text-[#4d5156] leading-normal line-clamp-2 mt-0.5">
          {displayDesc}
        </div>
      </div>
    </div>
  );
}
