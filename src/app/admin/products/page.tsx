import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import ProductTable from "./product-table";
import { getSectionSession } from "@/lib/admin-auth";
import AccessDenied from "../access-denied";
import { analyzeProductSeo } from "@/lib/product-seo-analyzer";

export const dynamic = "force-dynamic";

async function getProducts() {
  const products = await prisma.product.findMany({
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Scores are computed here so full description HTML never ships to the browser.
  return products.map((p) => {
    let images: { url: string; alt?: string; isDecorative?: boolean }[] = [];
    try {
      const raw = JSON.parse(p.imageMetadata || p.images || "[]");
      if (Array.isArray(raw)) {
        images = raw
          .map((item) => (typeof item === "string" ? { url: item, alt: "" } : item))
          .filter((item) => item && typeof item.url === "string");
      }
    } catch {
      // malformed JSON: treat as no images
    }

    const seo = analyzeProductSeo({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      shortDescription: p.shortDescription || "",
      categoryId: p.category.id,
      categoryName: p.category.name,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stock,
      sku: p.sku || "",
      brand: p.brand || "PurestStem",
      images,
      primaryImage: p.image || images[0]?.url || "",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      focusKeyword: p.focusKeyword || "",
      robotsIndex: p.robotsIndex,
      status: p.status || (p.isActive ? "published" : "draft"),
    } as Parameters<typeof analyzeProductSeo>[0]);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stock,
      sku: p.sku,
      weight: p.weight,
      brand: p.brand,
      condition: p.condition,
      status: p.status,
      isActive: p.isActive,
      featured: p.featured,
      robotsIndex: p.robotsIndex,
      image: p.image,
      images: p.images,
      scheduledAt: p.scheduledAt ? p.scheduledAt.toISOString() : null,
      updatedAt: p.updatedAt.toISOString(),
      category: p.category,
      seoHealthScore: seo.healthScore,
      missingAlt: images.some((img) => !img.isDecorative && !img.alt?.trim()),
      missingSeo: !p.seoTitle || !p.seoDescription || !p.focusKeyword,
    };
  });
}

export default async function AdminProductsPage() {
  if (!(await getSectionSession("products"))) return <AccessDenied />;
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Catalog</h1>
            <p className="text-gray-500 mt-1">
              Manage product listings, inventory, and technical SEO health
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <ProductTable products={products} />
      </FadeIn>
    </div>
  );
}
