"use client";

import { useState, useEffect } from "react";
import { Link2, Search, ExternalLink, Package, FileText, Folder, X, Check } from "lucide-react";

export interface LinkData {
  url: string;
  text: string;
  targetBlank: boolean;
  rel: string; // "" | "nofollow" | "sponsored" | "ugc" | "nofollow sponsored"
}

interface InternalItem {
  id: string;
  title: string;
  url: string;
  type: "product" | "blog" | "category";
  subtitle?: string;
  image?: string | null;
}

interface LinkModalProps {
  isOpen: boolean;
  initialData?: LinkData;
  onClose: () => void;
  onInsert: (data: LinkData) => void;
}

export default function LinkModal({
  isOpen,
  initialData,
  onClose,
  onInsert,
}: LinkModalProps) {
  const [activeTab, setActiveTab] = useState<"internal" | "custom">("internal");
  const [url, setUrl] = useState(initialData?.url || "");
  const [text, setText] = useState(initialData?.text || "");
  const [targetBlank, setTargetBlank] = useState(initialData?.targetBlank ?? false);
  const [relType, setRelType] = useState(initialData?.rel || "");

  // Internal search state
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    products: InternalItem[];
    blogPosts: InternalItem[];
    categories: InternalItem[];
  }>({ products: [], blogPosts: [], categories: [] });

  async function fetchInternalLinks(q: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/search-links?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Load the initial suggestions when the modal opens. (The parent mounts the
  // modal fresh each time, so the form fields start from initialData.)
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => fetchInternalLinks(""), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearchQuery(val);
    fetchInternalLinks(val);
  }

  function selectInternalItem(item: InternalItem) {
    setUrl(item.url);
    if (!text) {
      setText(item.title);
    }
    setTargetBlank(false);
    setRelType(""); // standard follow for internal links
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    let finalRel = relType;
    if (targetBlank && !finalRel.includes("noopener")) {
      finalRel = (finalRel ? `${finalRel} noopener noreferrer` : "noopener noreferrer").trim();
    }

    onInsert({
      url: url.trim(),
      text: text.trim() || url.trim(),
      targetBlank,
      rel: finalRel,
    });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Link2 className="w-5 h-5 text-green-700" />
            <span>Insert / Edit Link</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "internal"
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Search className="w-4 h-4" />
            Internal Store Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "custom"
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Custom / External URL
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Internal search section */}
          {activeTab === "internal" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search products, blog posts, or categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-2 bg-gray-50/50 divide-y divide-gray-100">
                {loading ? (
                  <p className="text-xs text-gray-400 p-2 text-center">Searching store content...</p>
                ) : results.products.length === 0 &&
                  results.blogPosts.length === 0 &&
                  results.categories.length === 0 ? (
                  <p className="text-xs text-gray-400 p-2 text-center">No matching content found.</p>
                ) : (
                  <>
                    {results.products.length > 0 && (
                      <div className="pt-1 first:pt-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
                          Products
                        </span>
                        {results.products.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectInternalItem(item)}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-green-50 transition-colors ${
                              url === item.url ? "bg-green-100 font-medium text-green-900" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Package className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                              <span className="truncate">{item.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{item.subtitle}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {results.blogPosts.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
                          Articles
                        </span>
                        {results.blogPosts.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectInternalItem(item)}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-green-50 transition-colors ${
                              url === item.url ? "bg-green-100 font-medium text-green-900" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              <span className="truncate">{item.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{item.url}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {results.categories.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
                          Categories
                        </span>
                        {results.categories.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectInternalItem(item)}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between hover:bg-green-50 transition-colors ${
                              url === item.url ? "bg-green-100 font-medium text-green-900" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Folder className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                              <span className="truncate">{item.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">Category</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* URL and Text inputs */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Destination URL *</label>
            <input
              type="text"
              required
              placeholder="e.g. /shop/products/hair-shampoo or https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Link Anchor Text</label>
            <input
              type="text"
              placeholder="e.g. PurestStem Herbal Shampoo"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* SEO & Link Attributes */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/70 space-y-2.5">
            <label className="flex items-center gap-2 text-xs text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={targetBlank}
                onChange={(e) => setTargetBlank(e.target.checked)}
                className="rounded text-green-700 focus:ring-green-600"
              />
              <span>Open in new tab (target=&quot;_blank&quot;)</span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link Relation (rel attribute)
              </label>
              <select
                value={relType}
                onChange={(e) => setRelType(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Normal Editorial Follow (Standard for internal & verified citations)</option>
                <option value="nofollow">rel=&quot;nofollow&quot; (Untrusted or paid content)</option>
                <option value="sponsored">rel=&quot;sponsored&quot; (Sponsored / Affiliate links)</option>
                <option value="ugc">rel=&quot;ugc&quot; (User-Generated Content)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
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
              Insert Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
