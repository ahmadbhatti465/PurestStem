"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Pencil,
  ImageIcon,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Layers,
} from "lucide-react";
import DeleteButton from "@/components/admin/delete-button";
import { getPrimaryImage, formatPrice } from "@/lib/utils";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string | null;
  weight: string | null;
  brand: string | null;
  condition: string | null;
  status: string | null;
  isActive: boolean;
  featured: boolean;
  robotsIndex: boolean;
  image: string | null;
  images: string | null;
  scheduledAt: string | null;
  updatedAt: Date | string;
  /** Computed on the server (see products/page.tsx). */
  seoHealthScore: number;
  missingAlt: boolean;
  missingSeo: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductTableProps {
  products: ProductRow[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // SEO scores arrive precomputed from the server.
  const productsWithSeo = products;

  // Filter & search logic
  const filteredProducts = useMemo(() => {
    return productsWithSeo.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku?.toLowerCase().includes(q);
        const matchCat = p.category.name.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchCat && !matchSlug) return false;
      }

      // Filter Tabs
      if (filter === "published") return p.isActive && p.status === "published";
      if (filter === "draft") return p.status === "draft" || !p.isActive;
      if (filter === "scheduled") return p.isActive && p.status === "scheduled";
      if (filter === "outOfStock") return p.stock <= 0;
      if (filter === "missingSeo") return p.missingSeo;
      if (filter === "missingAlt") return p.missingAlt;
      if (filter === "noindex") return !p.robotsIndex;
      if (filter === "featured") return p.featured;

      return true;
    });
  }, [productsWithSeo, filter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, SKU, or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: "all", label: `All (${products.length})` },
            { id: "published", label: "Published" },
            { id: "draft", label: "Draft" },
            { id: "scheduled", label: "Scheduled" },
            { id: "outOfStock", label: "Out of Stock" },
            { id: "missingSeo", label: "Missing SEO" },
            { id: "missingAlt", label: "Missing Alt Text" },
            { id: "noindex", label: "Noindex" },
            { id: "featured", label: "Featured" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? "bg-green-700 text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Stock</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Indexable</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">SEO Health</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const src = getPrimaryImage(p.image, p.images);
                  const isPublished = p.status === "published" || (p.isActive && p.status !== "draft");

                  let healthBadgeColor = "bg-green-100 text-green-800 border-green-200";
                  if (p.seoHealthScore < 50) {
                    healthBadgeColor = "bg-red-100 text-red-800 border-red-200";
                  } else if (p.seoHealthScore < 80) {
                    healthBadgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                  }

                  return (
                    <tr key={p.id} className="hover:bg-green-50/40 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                            {src ? (
                              <img src={src} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-gray-900 truncate">{p.name}</div>
                            <div className="text-[11px] text-gray-400 font-mono truncate">
                              {p.sku || "No SKU"} · /shop/products/{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 text-gray-700 font-medium">
                        {p.category.name}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-gray-900">
                          {formatPrice(p.salePrice || p.price)}
                        </span>
                        {p.salePrice && (
                          <span className="text-gray-400 line-through ml-1.5 text-[11px]">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            p.stock > 5
                              ? "text-gray-900"
                              : p.stock > 0
                              ? "text-amber-700"
                              : "text-red-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.stock > 5 ? "bg-green-500" : p.stock > 0 ? "bg-amber-500" : "bg-red-500"
                            }`}
                          />
                          {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex px-2 py-0.5 text-[11px] font-bold rounded-md ${
                              isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                          {p.featured && (
                            <span className="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Indexable */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {p.robotsIndex && isPublished ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Indexable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                            <XCircle className="w-3 h-3" />
                            Noindex
                          </span>
                        )}
                      </td>

                      {/* SEO Content Health Score */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-lg border ${healthBadgeColor}`}
                        >
                          {p.seoHealthScore}/100
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/shop/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Public Store Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product CMS"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteButton
                            apiUrl={`/api/admin/products/${p.id}`}
                            redirectPath="/admin/products"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
