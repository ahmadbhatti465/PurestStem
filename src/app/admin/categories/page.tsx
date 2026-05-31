import { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/admin/delete-button";
import { Plus, Pencil } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

async function getCategories() {
  return await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage product categories</p>
          </div>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Products</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-sm text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{category._count.products}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{category.description || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteButton
                          apiUrl={`/api/admin/categories/${category.id}`}
                          redirectPath="/admin/categories"
                        />
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
