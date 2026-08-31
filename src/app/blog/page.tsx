import Link from "next/link";
import { Leaf, Calendar, Sparkles, ChevronRight, Clock, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageSection } from "@/components/layout/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";
import { readingTime } from "@/lib/blog-content";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PurestStem Blog | Herbal Hair Care & Skincare Tips for Pakistan",
  description:
    "Read expert tips on herbal hair care, organic skincare routines, herbal teas and holistic wellness. PurestStem guides Pakistani families toward chemical-free living.",
  keywords: [
    "herbal hair care tips Pakistan",
    "natural skincare routine Pakistan",
    "hair fall solution Pakistan",
    "herbal tea benefits Pakistan",
    "ubtan benefits",
    "desi remedies Pakistan",
    "PurestStem blog",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "PurestStem Blog | Herbal Hair Care & Skincare Tips for Pakistan",
    description:
      "Discover herbal wellness tips, DIY remedies, and holistic product guides from Pakistan's trusted herbal brand.",
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/hero-section.png`, alt: "PurestStem Herbal Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PurestStem Blog | Herbal Hair Care & Skincare Tips for Pakistan",
    description: "Read expert tips on herbal hair care, skincare, and natural wellness in Pakistan.",
    images: [`${SITE_URL}/hero-section.png`],
  },
};

async function getPublishedBlogPosts(categorySlug?: string) {
  const now = new Date();
  const where: Record<string, unknown> = {
    AND: [
      {
        OR: [
          { status: "published" },
          { published: true, status: { not: "draft" } },
        ],
      },
      {
        OR: [
          { scheduledAt: null },
          { scheduledAt: { lte: now } },
        ],
      },
    ],
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  return await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPublishedBlogPosts(category),
    getCategories(),
  ]);

  const breadcrumbsSchema = buildBreadcrumbSchema(
    [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      ...(category ? [{ label: `Category: ${category}` }] : []),
    ],
    SITE_URL
  );

  return (
    <div className="pb-16">
      <JsonLd data={breadcrumbsSchema} />

      {/* Hero Header */}
      <PageSection background="dark" padding="lg">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <FadeIn className="relative text-center max-w-3xl mx-auto">
          <Breadcrumb items={[{ label: "Blog" }]} className="justify-center flex mb-6 text-white/70" />
          <SectionHeader
            titleAs="h1"
            light
            eyebrow="Herbal Insights & Wellness Guides"
            eyebrowIcon={Sparkles}
            title={
              <>
                From Our <span className="text-green-300">Blog</span>
              </>
            }
            subtitle="Scientifically backed and traditionally rooted advice on hair repair, glowing skin, digestive herbal teas, and natural living."
          />

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <Link
                href="/blog"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  !category
                    ? "bg-green-400 text-green-950 shadow-md scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                All Articles
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    category === cat.slug
                      ? "bg-green-400 text-green-950 shadow-md scale-105"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </FadeIn>
      </PageSection>

      {/* Blog Cards Grid */}
      <PageSection background="white">
        {posts.length === 0 ? (
          <EmptyState
            icon={Leaf}
            title="No articles found"
            description="We're currently preparing new guides for this section. Explore our herbal products in the meantime!"
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
            {posts.map((post) => {
              const displayDate = post.publishedAt || post.createdAt;
              const readTime = readingTime(post.content);

              return (
                <StaggerItem key={post.id}>
                  <article className="group h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all flex flex-col">
                    <Link href={`/blog/${post.slug}`} className="block h-full flex flex-col">
                      {/* Featured Image */}
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.imageAlt || post.title}
                            width={post.imageWidth || 600}
                            height={post.imageHeight || 375}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-green-50">
                            <Leaf className="w-10 h-10 text-green-600/40" />
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-3 left-3 bg-green-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                            {post.category.name}
                          </span>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(displayDate).toLocaleDateString("en-PK", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {readTime} min read
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                            {post.excerpt || post.seoDescription}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-green-700">
                          <div className="flex items-center gap-1.5 text-gray-600 font-normal">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[120px]">{post.author}</span>
                          </div>
                          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read Article <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </PageSection>
    </div>
  );
}
