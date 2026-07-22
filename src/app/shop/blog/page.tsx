import Link from "next/link";
import { Leaf, Calendar, Sparkles, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PurestStem Blog | Herbal Hair Care & Skincare Tips for Pakistan",
  description:
    "Read expert tips on herbal hair care, skincare, herbal teas and natural wellness. PurestStem's blog guides Pakistani families toward healthier, chemical-free living.",
  openGraph: {
    title: "PurestStem Blog | Herbal Hair Care & Skincare Tips for Pakistan",
    description:
      "Discover herbal wellness tips, DIY remedies and product guides from Pakistan's trusted herbal brand.",
    type: "website",
  },
};

async function getBlogPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <section className="relative bg-[#132e1f] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-green-700/20 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-22 relative">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-green-100 mb-5">
              <Sparkles className="w-4 h-4 text-green-300" />
              Latest Insights
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              From Our <span className="text-green-300">Blog</span>
            </h1>
            <p className="text-green-100/70 text-lg">
              Expert tips on herbal hair care, skincare, wellness teas and natural living for Pakistani homes
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <article className="group h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all flex flex-col">
                  <Link href={`/shop/blog/${post.slug}`} className="block h-full flex flex-col">
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-green-50">
                          <Leaf className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("en-PK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-medium">
                        Read Article
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </div>
  );
}
