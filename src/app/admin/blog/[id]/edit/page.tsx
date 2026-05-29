"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.published = data.published ? "true" : "false";

    try {
      const res = await fetch(`/api/admin/blog/${(await params).id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/blog");
      } else {
        alert("Failed to update post");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input name="title" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea name="excerpt" rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea name="content" rows={10} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input name="author" defaultValue="Khan Herbals" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" value="true" defaultChecked className="rounded" />
          <label className="text-sm">Published</label>
        </div>
        <button type="submit" disabled={loading} className="bg-green-700 text-white px-6 py-2 rounded-md">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
