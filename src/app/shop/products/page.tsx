import { Suspense } from "react";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/product-card";
import ProductFilters from "./product-filters";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Browse our complete collection of herbal products</p>
        </div>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl"></div>}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <FadeIn>
              <div className="text-center py-16">
                <p className="text-gray-500">No products found matching your criteria.</p>
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
    </div>
  );
}
