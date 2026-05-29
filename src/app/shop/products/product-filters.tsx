"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
        <h3 className="font-semibold mb-3">Categories</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/shop/products"
              className={`block text-sm ${
                !currentCategory
                  ? "text-green-700 font-medium"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              All Products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/shop/products?category=${category.slug}`}
                className={`block text-sm ${
                  currentCategory === category.slug
                    ? "text-green-700 font-medium"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                {category.name} ({category._count.products})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
