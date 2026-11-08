import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { getActiveProducts, getShopCategories } from "@/lib/catalog";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "@/components/json-ld";
import ProductCard from "@/components/product-card";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/layout/page-hero";
import ProductFilters from "./product-filters";
import { ProductSort } from "./product-sort";

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

type Product = Awaited<ReturnType<typeof getActiveProducts>>[number];

const effectivePrice = (product: Product) => product.salePrice || product.price;

function sortProducts(products: Product[], sort?: string) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return sorted; // already ordered featured-first by the query
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const { category, search, sort } = await searchParams;
  const [allProducts, categories] = await Promise.all([getActiveProducts(), getShopCategories()]);

  const term = search?.trim().toLowerCase();
  const products = sortProducts(
    allProducts.filter(
      (product) =>
        (!category || product.category.slug === category) &&
        (!term ||
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term))
    ),
    sort
  );

  const activeCategory = categories.find((item) => item.slug === category);
  const heading = term ? `Results for “${search?.trim()}”` : activeCategory?.name ?? "All products";

  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Products" }]}
        eyebrow="The herbal range"
        title={heading}
        subtitle="Handcrafted hair care, delivered anywhere in Pakistan. Pay when it arrives."
      />
      <Container className="py-8 lg:py-12">
      <JsonLd
        data={buildBreadcrumbSchema(
          [{ label: "Home", href: "/" }, { label: "Products" }],
          SITE_URL
        )}
      />
      <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
        <ProductFilters categories={categories} currentCategory={category} currentSearch={search} />
        <ProductSort />
      </div>

      <p className="mt-5 text-sm text-gray-600" aria-live="polite">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      {products.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No products found"
          description="Try a different search or category."
          action={
            <Link href="/shop/products" className="btn btn-primary">
              Clear filters <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          <h2 className="sr-only">Products</h2>
          {products.map((product, index) => (
            <div key={product.id} className="enter" style={{ "--i": index } as CSSProperties}>
              <ProductCard product={product} preload={index < 2} />
            </div>
          ))}
        </div>
      )}
    </Container>
    </>
  );
}
