"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 text-green-700" />
          </div>
          <h3 className="font-semibold text-gray-900">Categories</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop/products"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              !currentCategory
                ? "bg-green-700 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/products?category=${category.slug}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentCategory === category.slug
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {category.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                currentCategory === category.slug
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {category._count.products}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
