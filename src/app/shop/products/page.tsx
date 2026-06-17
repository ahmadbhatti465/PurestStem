import { Suspense } from "react";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/product-card";
import ProductFilters from "./product-filters";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

async function getProducts(category?: string, search?: string) {
  const where: any = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f2e1c]">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-green-700/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10">
          <FadeIn className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-100">
                Premium Herbal Collection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Collection
              </span>
            </h1>
            <p className="text-green-100/70 max-w-xl mx-auto">
              Browse our complete range of 100% natural herbal products crafted with mountain wisdom
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80V40C240 0 480 0 720 20C960 40 1200 20 1440 40V80H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl"></div>}>
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <FadeIn>
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-400 mb-4">No products found matching your criteria.</p>
                  <Link
                    href="/shop/products"
                    className="inline-flex items-center gap-2 text-green-700 font-medium hover:underline"
                  >
                    Clear filters
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            ) : (
              <StaggerContainer
                staggerDelay={0.08}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
