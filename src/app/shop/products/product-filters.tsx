"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Tag, Search, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search");

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 text-green-700" />
          </div>
          <h3 className="font-semibold text-gray-900">Categories</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={currentSearch ? `/shop/products?search=${encodeURIComponent(currentSearch)}` : "/shop/products"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              !currentCategory
                ? "bg-green-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/products?category=${category.slug}${currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentCategory === category.slug
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {category.name}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  currentCategory === category.slug
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {category._count.products}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <form action="/shop/products" method="GET" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-green-700" />
          </div>
          <h3 className="font-semibold text-gray-900">Search</h3>
        </div>
        <div className="relative">
          <input
            name="search"
            defaultValue={currentSearch || ""}
            placeholder="Search products..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
          {currentSearch ? (
            <Link
              href={currentCategory ? `/shop/products?category=${currentCategory}` : "/shop/products"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Link>
          ) : null}
        </div>
        {currentCategory ? (
          <input type="hidden" name="category" value={currentCategory} />
        ) : null}
      </form>
    </div>
  );
}
