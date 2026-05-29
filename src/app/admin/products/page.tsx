import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium">
                          {product.image ? "IMG" : "No img"}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.category.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-medium text-gray-900">Rs {product.salePrice || product.price}</span>
                      {product.salePrice && (
                        <span className="text-gray-400 line-through ml-2">Rs {product.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      {product.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 ml-2">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form
                          action={`/api/admin/products/${product.id}/delete`}
                          method="POST"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            onClick={(e) => {
                              if (!confirm("Are you sure?")) e.preventDefault();
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
