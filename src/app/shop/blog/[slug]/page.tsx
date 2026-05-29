import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/db";

async function getBlogPost(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/shop/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <article>
        <div className="aspect-video bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
          {post.image ? (
            <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

        <div className="prose prose-green max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={i} className="list-disc list-inside space-y-1 mb-4">
                  {paragraph.split("\n").map((item, j) => (
                    <li key={j} className="text-gray-700">{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\.\s/.test(paragraph)) {
              return (
                <ol key={i} className="list-decimal list-inside space-y-1 mb-4">
                  {paragraph.split("\n").map((item, j) => (
                    <li key={j} className="text-gray-700">{item.replace(/^\d+\.\s/, "")}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={i} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
