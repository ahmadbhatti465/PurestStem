import { Suspense } from "react";
import type { Metadata } from "next";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/product-card";
import ProductFilters from "./product-filters";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop Herbal Products Online in Pakistan | PurestStem",
  description:
    "Buy 100% natural herbal shampoos, hair oils, herbal teas, soaps and skin care products online in Pakistan. Cash on delivery, free shipping over ₨ 5,000. Filter by category.",
  keywords: [
    "herbal products Pakistan",
    "buy herbal shampoo online Pakistan",
    "natural hair oil Pakistan",
    "herbal tea online Pakistan",
    "neem soap Pakistan",
    "ubtan powder Pakistan",
    "organic skincare Pakistan",
  ],
  openGraph: {
    title: "Shop Herbal Products Online in Pakistan | PurestStem",
    description:
      "Browse our complete range of 100% natural herbal products with cash on delivery across Pakistan.",
    type: "website",
    url: "http://localhost:3000/shop/products",
  },
  alternates: {
    canonical: "http://localhost:3000/shop/products",
  },
};

async function getProducts(category?: string, search?: string) {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params.category, params.search),
    getCategories(),
  ]);

  return (
    <div>
      <section className="relative bg-[#132e1f] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-green-700/20 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-emerald-600/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-22 relative">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-green-100 mb-5">
              <Sparkles className="w-4 h-4 text-green-300" />
              Premium Herbal Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Shop <span className="text-green-300">Herbal Products</span>
            </h1>
            <p className="text-green-100/70 text-lg">
              100% natural herbal shampoos, hair oils, teas, soaps and skincare delivered across Pakistan
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense
              fallback={<div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>}
            >
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 mb-4">No products found matching your criteria.</p>
                <Link
                  href="/shop/products"
                  className="inline-flex items-center gap-2 text-green-700 font-medium hover:underline"
                >
                  Clear filters <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
