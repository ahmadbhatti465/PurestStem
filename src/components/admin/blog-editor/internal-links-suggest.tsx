"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, ExternalLink, Package, FileText } from "lucide-react";

interface SuggestionItem {
  id: string;
  title: string;
  url: string;
  type: "product" | "blog" | "category";
  subtitle?: string;
}

interface InternalLinksSuggestProps {
  content: string;
  focusKeyword: string;
  onInsertLink: (url: string, title: string) => void;
}

export default function InternalLinksSuggest({
  content,
  focusKeyword,
  onInsertLink,
}: InternalLinksSuggestProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSuggestions() {
      // Determine query from focus keyword or keywords in text
      const query = focusKeyword || "hair";
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/blog/search-links?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          const merged: SuggestionItem[] = [
            ...(data.products || []).slice(0, 3),
            ...(data.blogPosts || []).slice(0, 2),
            ...(data.categories || []).slice(0, 1),
          ];
          setSuggestions(merged);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadSuggestions, 600);
    return () => clearTimeout(timer);
  }, [content, focusKeyword]);

  if (suggestions.length === 0 && !loading) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-green-700" />
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Suggested Internal Links
        </h3>
      </div>
      <p className="text-[11px] text-gray-500">
        Relevant store pages you can reference in your article to strengthen crawl pathways:
      </p>

      <div className="space-y-2">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-green-50/50 transition-colors text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              {item.type === "product" ? (
                <Package className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              )}
              <div className="truncate">
                <span className="font-semibold text-gray-900 block truncate">{item.title}</span>
                <span className="text-[10px] text-gray-400 block truncate">{item.url}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onInsertLink(item.url, item.title)}
              className="flex-shrink-0 ml-2 inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-green-700 hover:text-white text-green-700 border border-green-200 rounded-lg text-[11px] font-semibold transition-all shadow-xs"
            >
              <Plus className="w-3 h-3" />
              Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
