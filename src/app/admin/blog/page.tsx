import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

async function getPosts() {
  return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600">Manage your blog content</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-sm text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form
                          action={`/api/admin/blog/${post.id}/delete`}
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
