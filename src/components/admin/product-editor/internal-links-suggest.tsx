"use client";

import { useState, useEffect } from "react";
import { Search, Link2, Package, FileText, FolderTree, Plus, ExternalLink } from "lucide-react";

interface SearchLinkItem {
  id: string;
  title: string;
  url: string;
  type: "product" | "blog" | "category";
  subtitle?: string;
  image?: string | null;
}

interface InternalLinksSuggestProps {
  onInsertLink?: (url: string, title: string) => void;
}

export default function InternalLinksSuggest({ onInsertLink }: InternalLinksSuggestProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    products: SearchLinkItem[];
    blogPosts: SearchLinkItem[];
    categories: SearchLinkItem[];
  }>({
    products: [],
    blogPosts: [],
    categories: [],
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/blog/search-links?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (e) {
        console.error("Link search failed", e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-green-700" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Internal Link Explorer
          </h3>
        </div>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, blog guides, or categories..."
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-4 text-xs text-gray-400">Searching catalog...</div>
      ) : (
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {/* Products */}
          {results.products.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Products
              </span>
              <div className="space-y-1">
                {results.products.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 hover:bg-gray-50 rounded-lg flex items-center justify-between gap-2 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Package className="w-3.5 h-3.5 text-green-700 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{item.url}</p>
                      </div>
                    </div>
                    {onInsertLink && (
                      <button
                        type="button"
                        onClick={() => onInsertLink(item.url, item.title)}
                        className="px-2 py-0.5 bg-green-50 text-green-700 hover:bg-green-100 rounded text-[11px] font-semibold shrink-0"
                      >
                        + Insert
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog Posts */}
          {results.blogPosts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Herbal Guides & Articles
              </span>
              <div className="space-y-1">
                {results.blogPosts.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 hover:bg-gray-50 rounded-lg flex items-center justify-between gap-2 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{item.url}</p>
                      </div>
                    </div>
                    {onInsertLink && (
                      <button
                        type="button"
                        onClick={() => onInsertLink(item.url, item.title)}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold shrink-0"
                      >
                        + Insert
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Categories
              </span>
              <div className="space-y-1">
                {results.categories.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 hover:bg-gray-50 rounded-lg flex items-center justify-between gap-2 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FolderTree className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{item.url}</p>
                      </div>
                    </div>
                    {onInsertLink && (
                      <button
                        type="button"
                        onClick={() => onInsertLink(item.url, item.title)}
                        className="px-2 py-0.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded text-[11px] font-semibold shrink-0"
                      >
                        + Insert
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
