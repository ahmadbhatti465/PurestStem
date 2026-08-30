"use client";

import { useState } from "react";
import { Share2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

interface SocialPreviewsProps {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  slug: string;
}

export default function SocialPreviews({
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  slug,
}: SocialPreviewsProps) {
  const [platform, setPlatform] = useState<"facebook" | "twitter">("facebook");

  const title = platform === "facebook" ? ogTitle : twitterTitle;
  const description = platform === "facebook" ? ogDescription : twitterDescription;
  const image = platform === "facebook" ? ogImage : twitterImage;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-green-700" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Social Media Share Preview
          </h3>
        </div>
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setPlatform("facebook")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              platform === "facebook"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Facebook / OG
          </button>
          <button
            type="button"
            onClick={() => setPlatform("twitter")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              platform === "twitter"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            X / Twitter
          </button>
        </div>
      </div>

      {/* Social Card Preview */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white max-w-md mx-auto shadow-sm">
        <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image} alt="Social Card" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4 text-gray-400 text-xs">
              <Share2 className="w-8 h-8 mx-auto mb-1 opacity-40" />
              <span>No image provided (Default fallback will be used)</span>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-gray-50/70 border-t border-gray-100 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
            PURESTSTEM.COM
          </div>
          <div className="font-bold text-sm text-gray-900 line-clamp-1">
            {title || "Article Title for Social Feeds"}
          </div>
          <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {description || "Engaging summary snippet that encourages clicks on social networks."}
          </div>
        </div>
      </div>

      {/* Dimension Helper */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
        {image ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        )}
        <span>
          <strong>Recommended social dimension:</strong> 1200 x 630 px (1.91:1 ratio).
        </span>
      </div>
    </div>
  );
}
