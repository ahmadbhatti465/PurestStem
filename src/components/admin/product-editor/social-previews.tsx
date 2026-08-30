"use client";

import { useState } from "react";
import { Share2, ImageIcon } from "lucide-react";
import { SITE_URL } from "@/lib/site";

interface SocialPreviewsProps {
  title: string;
  description: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  slug?: string;
  price?: number | string;
}

export default function SocialPreviews({
  title,
  description,
  imageUrl,
  seoTitle,
  seoDescription,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SocialPreviewsProps) {
  const [platform, setPlatform] = useState<"facebook" | "twitter">("facebook");

  const activeTitle =
    (platform === "facebook" ? ogTitle : twitterTitle) ||
    seoTitle ||
    title ||
    "PurestStem Herbal Product";

  const activeDesc =
    (platform === "facebook" ? ogDescription : twitterDescription) ||
    seoDescription ||
    (description ? description.replace(/<[^>]+>/g, "").slice(0, 150) : "PurestStem 100% natural herbal products in Pakistan.");

  const activeImg =
    (platform === "facebook" ? ogImage : twitterImage) ||
    imageUrl ||
    "/pureststem_logo.png";

  const hostUrl = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-green-700" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Social Share Preview
          </h3>
        </div>

        {/* Platform Toggle */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setPlatform("facebook")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              platform === "facebook"
                ? "bg-white text-blue-600 shadow-2xs font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Facebook / OG
          </button>
          <button
            type="button"
            onClick={() => setPlatform("twitter")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              platform === "twitter"
                ? "bg-white text-gray-900 shadow-2xs font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            X (Twitter)
          </button>
        </div>
      </div>

      {platform === "facebook" ? (
        /* Facebook / Open Graph Card */
        <div className="border border-[#dadde1] rounded-xl overflow-hidden bg-[#f0f2f5] max-w-[420px] mx-auto text-left shadow-2xs">
          <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden flex items-center justify-center">
            {activeImg ? (
              <img src={activeImg} alt={activeTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-center p-4">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <span className="text-xs">No image selected</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-[#f0f2f5] space-y-0.5">
            <div className="text-[11px] uppercase tracking-wider text-[#65676b] font-medium font-mono">
              {hostUrl}
            </div>
            <div className="text-[14px] font-semibold text-[#050505] leading-tight line-clamp-2">
              {activeTitle}
            </div>
            <div className="text-[12px] text-[#65676b] leading-normal line-clamp-2">
              {activeDesc}
            </div>
          </div>
        </div>
      ) : (
        /* Twitter / X Large Summary Card */
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-black max-w-[420px] mx-auto text-left shadow-2xs text-white">
          <div className="aspect-[2/1] bg-gray-900 relative overflow-hidden flex items-center justify-center">
            {activeImg ? (
              <img src={activeImg} alt={activeTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-500 text-center p-4">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <span className="text-xs">No image selected</span>
              </div>
            )}
          </div>
          <div className="p-3 space-y-1 bg-[#16181c]">
            <div className="text-[12px] text-gray-400 font-mono">
              {hostUrl}
            </div>
            <div className="text-[14px] font-bold text-white leading-tight line-clamp-1">
              {activeTitle}
            </div>
            <div className="text-[12px] text-gray-300 line-clamp-2 leading-relaxed">
              {activeDesc}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
