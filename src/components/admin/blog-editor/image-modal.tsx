"use client";

import { useState } from "react";
import { ImageIcon, Upload, Info, X, Check } from "lucide-react";

export interface ImageData {
  url: string;
  alt: string;
  title?: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
  isDecorative?: boolean;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (data: ImageData) => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  onInsert,
}: ImageModalProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [credit, setCredit] = useState("");
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [isDecorative, setIsDecorative] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "blog");

    try {
      // Extract dimensions locally first
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setUrl(data.url);
      } else {
        setError(data.error || "Image upload failed");
      }
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please provide an image URL or upload an image file.");
      return;
    }

    if (!isDecorative && !alt.trim()) {
      setError("Alt text is required for accessibility and SEO. If the image is decorative, mark it below.");
      return;
    }

    onInsert({
      url: url.trim(),
      alt: isDecorative ? "" : alt.trim(),
      title: title.trim() || undefined,
      caption: caption.trim() || undefined,
      credit: credit.trim() || undefined,
      width,
      height,
      isDecorative,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <ImageIcon className="w-5 h-5 text-green-700" />
            <span>Insert Image with SEO Metadata</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Image source & preview */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700">Image Source *</label>
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                {url ? (
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="cursor-pointer inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-800 transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? "Uploading Image..." : "Upload Image File"}
                  </span>
                </label>
                <div className="text-[11px] text-gray-400">or enter image URL directly:</div>
                <input
                  type="text"
                  placeholder="https://... or /uploads/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </div>

          {/* Alt Text Section */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Image Alt Text {!isDecorative && <span className="text-red-500">*</span>}
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDecorative}
                  onChange={(e) => setIsDecorative(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Decorative image (alt="")</span>
              </label>
            </div>

            <input
              type="text"
              disabled={isDecorative}
              placeholder={isDecorative ? 'Marked as decorative (alt="")' : "e.g. PurestStem Hair Repairing Shampoo Bottle on wooden table"}
              value={isDecorative ? "" : alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
            />

            {/* SEO Helper */}
            <div className="flex items-start gap-2 p-2.5 bg-green-50/70 border border-green-200/60 rounded-xl text-green-800 text-xs">
              <Info className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>SEO Best Practice:</strong> Describe what is actually shown in the image. Do not keyword stuff.
              </span>
            </div>
          </div>

          {/* Image Caption & Credit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Visible Caption</label>
              <input
                type="text"
                placeholder="Caption displayed below image"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image Credit / Source</label>
              <input
                type="text"
                placeholder="e.g. PurestStem Studio"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Dimensions to prevent CLS */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Width (px)</label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={width || ""}
                onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Height (px)</label>
              <input
                type="number"
                placeholder="e.g. 630"
                value={height || ""}
                onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Insert Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
