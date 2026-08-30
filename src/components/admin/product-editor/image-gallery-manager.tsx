"use client";

import { useState } from "react";
import {
  Upload,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
} from "lucide-react";

export interface ProductImageItem {
  url: string;
  alt: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
  isDecorative?: boolean;
  sortOrder?: number;
  size?: number;
  filename?: string;
}

interface ImageGalleryManagerProps {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
  productName: string;
}

export default function ImageGalleryManager({
  images,
  onChange,
  productName,
}: ImageGalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(images.length > 0 ? 0 : null);
  const [urlInput, setUrlInput] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    const newItems: ProductImageItem[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files (JPG, PNG, WebP, AVIF) are supported.");
        continue;
      }

      // Check file size (> 2MB warning)
      const sizeInMb = file.size / (1024 * 1024);

      // Measure dimensions
      let width = 800;
      let height = 800;
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = () => {
            width = img.naturalWidth;
            height = img.naturalHeight;
            resolve(true);
          };
          img.onerror = () => resolve(false);
        });
      } catch {
        // ignore
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          // Default alt text suggestion based on product name and sequence
          const count = images.length + newItems.length + 1;
          const defaultAlt = count === 1
            ? `${productName || "PurestStem Product"} bottle packaging`
            : `${productName || "PurestStem Product"} view ${count}`;

          newItems.push({
            url: data.url,
            alt: defaultAlt,
            title: productName || "PurestStem Product",
            caption: "",
            width,
            height,
            isDecorative: false,
            sortOrder: images.length + newItems.length,
            size: file.size,
            filename: file.name,
          });
        } else {
          setUploadError(data.error || "Upload failed");
        }
      } catch {
        setUploadError("Network error while uploading image.");
      }
    }

    if (newItems.length > 0) {
      const updated = [...images, ...newItems];
      onChange(updated);
      if (selectedIndex === null) {
        setSelectedIndex(0);
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  function handleAddUrl() {
    if (!urlInput.trim()) return;
    const count = images.length + 1;
    const newItem: ProductImageItem = {
      url: urlInput.trim(),
      alt: count === 1 ? `${productName || "PurestStem Product"} packaging` : `${productName || "PurestStem Product"} view ${count}`,
      title: productName || "PurestStem Product",
      caption: "",
      width: 800,
      height: 800,
      isDecorative: false,
      sortOrder: images.length,
    };
    const updated = [...images, newItem];
    onChange(updated);
    setUrlInput("");
    if (selectedIndex === null) setSelectedIndex(0);
  }

  function handleUpdateItem(index: number, patch: Partial<ProductImageItem>) {
    const updated = images.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(updated);
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    if (selectedIndex !== null) {
      if (selectedIndex >= updated.length) {
        setSelectedIndex(updated.length > 0 ? updated.length - 1 : null);
      }
    }
  }

  function handleMove(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    // Update sortOrder
    const normalized = reordered.map((item, i) => ({ ...item, sortOrder: i }));
    onChange(normalized);
    setSelectedIndex(target);
  }

  function setAsPrimary(index: number) {
    if (index === 0) return;
    const reordered = [...images];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);
    const normalized = reordered.map((item, i) => ({ ...item, sortOrder: i }));
    onChange(normalized);
    setSelectedIndex(0);
  }

  const selectedItem = selectedIndex !== null && images[selectedIndex] ? images[selectedIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-green-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Product Images & Image SEO
          </h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {images.length} {images.length === 1 ? "Image" : "Images"} Uploaded
        </span>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError("")} className="text-red-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grid of image thumbnails */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const isPrimary = idx === 0;
            const hasAlt = item.isDecorative || (item.alt && item.alt.trim().length > 0);

            return (
              <div
                key={`${item.url}-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                className={`group relative rounded-xl border-2 overflow-hidden bg-gray-50 cursor-pointer transition-all ${
                  isSelected
                    ? "border-green-600 ring-2 ring-green-600/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-square relative flex items-center justify-center overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || "Product image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Primary Badge */}
                  {isPrimary ? (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      Primary
                    </span>
                  ) : (
                    <span className="absolute top-2 left-2 bg-gray-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                  )}

                  {/* SEO status icon */}
                  <span
                    className={`absolute bottom-2 left-2 p-1 rounded-md text-[10px] backdrop-blur-xs ${
                      hasAlt ? "bg-green-700/80 text-white" : "bg-red-600/90 text-white"
                    }`}
                    title={hasAlt ? "Alt text configured" : "Missing Alt Text"}
                  >
                    {hasAlt ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  </span>

                  {/* Quick Action Overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm"
                      title="Delete Image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-2 bg-white border-t border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-800 truncate">
                    {item.alt || <span className="text-red-500 italic">No Alt Text</span>}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Upload Button Card */}
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-green-600 bg-gray-50/50 hover:bg-green-50/30 flex flex-col items-center justify-center p-4 cursor-pointer transition-all text-center group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-green-800">
              {uploading ? "Uploading..." : "Add Images"}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP</span>
          </label>
        </div>

        {/* Enter External URL alternative */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Or enter image URL (https://... or /uploads/...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-semibold border border-gray-300"
          >
            Add URL
          </button>
        </div>
      </div>

      {/* Detail Image SEO Inspector for Selected Image */}
      {selectedItem && selectedIndex !== null && (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-700" />
              <h3 className="text-xs font-bold text-gray-900 uppercase">
                Image #{selectedIndex + 1} SEO & Metadata Inspector
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {selectedIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setAsPrimary(selectedIndex)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-green-700 hover:bg-green-50 border border-green-300 rounded-lg text-[11px] font-semibold transition-all shadow-2xs"
                >
                  <Star className="w-3 h-3" />
                  Make Primary
                </button>
              )}
              <button
                type="button"
                disabled={selectedIndex === 0}
                onClick={() => handleMove(selectedIndex, "up")}
                className="p-1 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg disabled:opacity-40"
                title="Move Earlier"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={selectedIndex === images.length - 1}
                onClick={() => handleMove(selectedIndex, "down")}
                className="p-1 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg disabled:opacity-40"
                title="Move Later"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Image Preview & Stats */}
            <div className="md:col-span-4 space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-2xs">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.alt || "Selected preview"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[11px] text-gray-500 font-mono space-y-0.5">
                {selectedItem.width && selectedItem.height && (
                  <div>
                    Resolution: {selectedItem.width} × {selectedItem.height} px
                  </div>
                )}
                {selectedItem.size && (
                  <div>File size: {(selectedItem.size / 1024).toFixed(1)} KB</div>
                )}
                <div className="truncate text-gray-400">Path: {selectedItem.url}</div>
              </div>
            </div>

            {/* SEO Form Inputs */}
            <div className="md:col-span-8 space-y-3">
              {/* Alt Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Alt Text (Image Description) {!selectedItem.isDecorative && <span className="text-red-500">*</span>}
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedItem.isDecorative}
                      onChange={(e) =>
                        handleUpdateItem(selectedIndex, {
                          isDecorative: e.target.checked,
                          alt: e.target.checked ? "" : selectedItem.alt || productName,
                        })
                      }
                      className="rounded text-green-700 focus:ring-green-600"
                    />
                    <span>Decorative only (alt=&quot;&quot;)</span>
                  </label>
                </div>

                <input
                  type="text"
                  disabled={selectedItem.isDecorative}
                  value={selectedItem.isDecorative ? "" : selectedItem.alt || ""}
                  onChange={(e) => handleUpdateItem(selectedIndex, { alt: e.target.value })}
                  placeholder="e.g. PurestStem Hair Repairing Shampoo 250ml front bottle view"
                  className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100 ${
                    !selectedItem.isDecorative && (!selectedItem.alt || !selectedItem.alt.trim())
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-300 bg-white"
                  }`}
                />

                <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-green-50/80 rounded-lg text-[11px] text-green-900 border border-green-200/60">
                  <Info className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                  <span>
                    Accurately describe the visible product, bottle, texture, or angle. Avoid keyword stuffing.
                  </span>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Image Title</label>
                  <input
                    type="text"
                    value={selectedItem.title || ""}
                    onChange={(e) => handleUpdateItem(selectedIndex, { title: e.target.value })}
                    placeholder="e.g. PurestStem Hair Shampoo"
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Caption</label>
                  <input
                    type="text"
                    value={selectedItem.caption || ""}
                    onChange={(e) => handleUpdateItem(selectedIndex, { caption: e.target.value })}
                    placeholder="Optional public caption"
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
