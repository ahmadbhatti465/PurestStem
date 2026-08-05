import Link from "next/link";
import { Leaf, Calendar, Sparkles, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageSection } from "@/components/layout/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import type { Metadata } from "next";

// Render per-request so newly published posts appear immediately (no build-time cache).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PurestStem Blog | Herbal Hair Care & Skincare Tips for Pakistan",
  description:
    "Read expert tips on herbal hair care, skincare, herbal teas and natural wellness. PurestStem's blog guides Pakistani families toward healthier, chemical-free living.",
  keywords: [
    "herbal hair care tips Pakistan",
    "natural skincare routine Pakistan",
    "hair fall solution Pakistan",
    "herbal tea benefits Pakistan",
    "ubtan benefits",
    "desi remedies Pakistan",
    "PurestStem blog",
  ],
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
    <div className="pb-16">
      <PageSection background="dark" padding="lg">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <FadeIn className="relative text-center max-w-2xl mx-auto">
          <Breadcrumb
            items={[{ label: "Blog" }]}
            className="justify-center flex mb-6"
          />
          <SectionHeader
            light
            eyebrow="Latest Insights"
            eyebrowIcon={Sparkles}
            title={<>
              From Our{" "}
              <span className="text-green-300">Blog</span>
            </>}
            subtitle="Expert tips on herbal hair care, skincare, wellness teas and natural living for Pakistani homes"
          />
        </FadeIn>
      </PageSection>

      <PageSection background="white">
        {posts.length === 0 ? (
          <EmptyState
            icon={Leaf}
            title="No articles yet"
            description="We're working on helpful herbal wellness content. Check back soon!"
            action={
              <Link
                href="/shop/products"
                className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg"
              >
                Browse Products <ChevronRight className="w-4 h-4" />
              </Link>
            }
          />
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
      </PageSection>
    </div>
  );
}
