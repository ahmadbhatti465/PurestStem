"use client";

import { useState } from "react";
import { Globe, Smartphone, Monitor } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

interface SerpPreviewProps {
  title: string;
  slug: string;
  description: string;
  canonicalUrl?: string;
}

export default function SerpPreview({
  title,
  slug,
  description,
  canonicalUrl,
}: SerpPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const displayUrl =
    canonicalUrl || `https://pureststem.com/blog/${slug || "your-article-slug"}`;
  const displayTitle =
    title || "Your Blog Post SEO Title - Catchy & Descriptive";
  const displayDescription =
    description ||
    "Discover actionable herbal wellness and natural care tips from PurestStem. Learn remedies for hair care, skin radiance, and holistic organic living in Pakistan.";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-green-700" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Google Search SERP Preview
          </h3>
        </div>
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              device === "desktop"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              device === "mobile"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Snippet box */}
      <div
        className={`p-4 rounded-xl border border-gray-200/80 bg-white font-sans transition-all ${
          device === "mobile" ? "max-w-sm mx-auto" : "w-full"
        }`}
      >
        {/* Site info row */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-green-700 text-white flex items-center justify-center text-[10px] font-bold">
            P
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#202124] leading-none">
              {SITE_NAME}
            </div>
            <div className="text-[11px] text-[#4d5156] truncate leading-tight">
              {displayUrl}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-[#1a0dab] hover:underline cursor-pointer text-base md:text-lg font-normal leading-snug line-clamp-2 mb-1">
          {displayTitle}
        </div>

        {/* Snippet text */}
        <div className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
          {displayDescription}
        </div>
      </div>
    </div>
  );
}
