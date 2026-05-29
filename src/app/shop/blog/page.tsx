import Link from "next/link";
import { Leaf, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

async function getBlogPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tips, guides, and stories from the world of herbal wellness
        </p>
      </FadeIn>

      <StaggerContainer
        staggerDelay={0.12}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {posts.map((post) => (
          <StaggerItem key={post.id}>
            <article className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              <Link href={`/shop/blog/${post.slug}`} className="block h-full flex flex-col">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Leaf className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-green-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
