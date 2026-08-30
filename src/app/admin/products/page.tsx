import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import ProductTable from "./product-table";

export const dynamic = "force-dynamic";

async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminProductsPage() {
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
