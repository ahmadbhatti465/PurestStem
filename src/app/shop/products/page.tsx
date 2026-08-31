import { Suspense } from "react";
import type { Metadata } from "next";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import ProductCard from "@/components/product-card";
import ProductFilters from "./product-filters";
import { ProductSort } from "./product-sort";
import { ArrowRight, Sparkles, SearchX } from "lucide-react";
import Link from "next/link";
import { PageSection } from "@/components/layout/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { FadeIn } from "@/components/animations/fade-in";

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
    url: `${SITE_URL}/shop/products`,
  },
  alternates: {
    canonical: `${SITE_URL}/shop/products`,
  },
};

async function getProducts(category?: string, search?: string, sort?: string) {
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

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }];
  switch (sort) {
    case "price-asc":
      orderBy = [{ salePrice: { sort: "asc", nulls: "last" } }, { price: "asc" }];
      break;
    case "price-desc":
      orderBy = [{ salePrice: { sort: "desc", nulls: "last" } }, { price: "desc" }];
      break;
    case "name-asc":
      orderBy = [{ name: "asc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    default:
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
      break;
  }

  return await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
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
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params.category, params.search, params.sort),
    getCategories(),
  ]);

  return (
    <div className="pb-16">
      <PageSection background="dark" padding="lg">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />

        <FadeIn className="relative text-center max-w-2xl mx-auto">
          <Breadcrumb
            items={[{ label: "Products" }]}
            className="justify-center flex mb-6"
          />
          <SectionHeader
            titleAs="h1"
            light
            eyebrow="Premium Herbal Collection"
            eyebrowIcon={Sparkles}
            title={<>
              Shop{" "}
              <span className="text-green-300">Herbal Products</span>
            </>}
            subtitle="100% natural herbal shampoos, hair oils, teas, soaps and skincare delivered across Pakistan"
          />
        </FadeIn>
      </PageSection>

      <PageSection background="white" padding="md">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense
              fallback={<div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>}
            >
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">{products.length}</span>{" "}
                product{products.length !== 1 && "s"}
              </p>
              <ProductSort />
            </div>

            {products.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No products found"
                description="Try adjusting your search or category filter to find what you're looking for."
                action={
                  <Link
                    href="/shop/products"
                    className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg"
                  >
                    Clear filters <ArrowRight className="w-4 h-4" />
                  </Link>
                }
              />
            ) : (
              <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </PageSection>
    </div>
  );
}
