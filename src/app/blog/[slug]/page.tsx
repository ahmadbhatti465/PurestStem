import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Sparkles,
  Clock,
  ChevronRight,
  Package,
  HelpCircle,
  Share2,
  Tag,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { notFound, redirect, RedirectType } from "next/navigation";
import { prisma } from "@/lib/db";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";
import { readingTime } from "@/lib/blog-content";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShareButtons } from "@/components/share-buttons";
import JsonLd from "@/components/json-ld";
import { FadeIn } from "@/components/animations/fade-in";
import { findRedirect } from "@/lib/redirects";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  FaqItem,
} from "@/lib/structured-data";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getBlogPostBySlug(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | PurestStem Blog",
      robots: { index: false, follow: false },
    };
  }

  const pageUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
  const isLive = post.status === "published" || (post.published && post.status !== "draft");
  const isIndexable = post.robotsIndex && isLive;

  const metaTitle = post.seoTitle || `${post.title} | PurestStem`;
  const metaDescription = post.seoDescription || post.excerpt || `${post.title} - PurestStem Natural Wellness`;

  const ogImgUrl = post.ogImage || post.image ? absoluteUrl(post.ogImage || post.image!) : `${SITE_URL}/hero-section.png`;
  const twitterImgUrl = post.twitterImage || ogImgUrl;

  const pubDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();
  const modDate = new Date(post.updatedAt).toISOString();

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      post.focusKeyword || "",
      post.title,
      ...(post.tags ? post.tags.split(",").map((t) => t.trim()) : []),
      "PurestStem Pakistan",
      "herbal remedies Pakistan",
    ].filter(Boolean),
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: isIndexable,
      follow: post.robotsFollow ?? true,
      googleBot: {
        index: isIndexable,
        follow: post.robotsFollow ?? true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: post.ogTitle || metaTitle,
      description: post.ogDescription || metaDescription,
      type: "article",
      url: pageUrl,
      siteName: SITE_NAME,
      publishedTime: pubDate,
      modifiedTime: modDate,
      authors: [post.author],
      images: [
        {
          url: ogImgUrl,
          alt: post.imageAlt || post.title,
          width: post.imageWidth || 1200,
          height: post.imageHeight || 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || metaTitle,
      description: post.twitterDescription || metaDescription,
      images: [twitterImgUrl],
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = await getBlogPostBySlug(slug);

  // If not found, check 301 redirects table
  if (!post) {
    const redirectRecord = await findRedirect(`/blog/${slug}`);
    if (redirectRecord) {
      redirect(redirectRecord.targetPath, RedirectType.replace);
    }
    const legacyRedirect = await findRedirect(`/shop/blog/${slug}`);
    if (legacyRedirect) {
      redirect(legacyRedirect.targetPath, RedirectType.replace);
    }
    notFound();
  }

  // Parse FAQs
  let faqs: FaqItem[] = [];
  if (post.faqs) {
    try {
      faqs = typeof post.faqs === "string" ? JSON.parse(post.faqs) : post.faqs;
    } catch {}
  }

  // Parse Related Products
  let relatedProductIds: string[] = [];
  if (post.relatedProductIds) {
    try {
      relatedProductIds =
        typeof post.relatedProductIds === "string"
          ? JSON.parse(post.relatedProductIds)
          : post.relatedProductIds;
    } catch {}
  }

  const relatedProducts =
    relatedProductIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: relatedProductIds } },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            image: true,
            category: { select: { name: true } },
          },
        })
      : post.categoryId
      ? await prisma.product.findMany({
          where: { categoryId: post.categoryId },
          take: 3,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            image: true,
            category: { select: { name: true } },
          },
        })
      : [];

  // Related Articles
  const relatedArticles = await prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      status: "published",
      ...(post.categoryId ? { categoryId: post.categoryId } : {}),
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      image: true,
      imageAlt: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  const pageUrl = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
  const shareUrl = `/blog/${post.slug}`;
  const readTime = readingTime(post.content);
  const displayDate = post.publishedAt || post.createdAt;
  const isUpdated =
    post.updatedAt &&
    new Date(post.updatedAt).getTime() - new Date(displayDate).getTime() > 86400000;

  // Structured Data
  const articleSchema = buildBlogPostingSchema(post, SITE_URL);
  const breadcrumbsSchema = buildBreadcrumbSchema(
    [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      ...(post.category ? [{ label: post.category.name, href: `/blog?category=${post.category.slug}` }] : []),
      { label: post.title },
    ],
    SITE_URL
  );
  const faqSchema = buildFaqSchema(faqs);

  const tagsList = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="pb-20">
      {/* Structured Data JSON-LD */}
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbsSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* Semantic Article Wrapper */}
      <article className="min-h-screen">
        {/* Article Hero Header */}
        <section className="relative bg-gradient-to-b from-[#0f2419] to-[#173826] text-white pt-12 pb-16 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <Container className="relative max-w-4xl mx-auto">
            <FadeIn>
              {/* Visible Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="mb-6">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Blog", href: "/blog" },
                    ...(post.category
                      ? [{ label: post.category.name, href: `/blog?category=${post.category.slug}` }]
                      : []),
                    { label: post.title },
                  ]}
                  className="text-white/70"
                />
              </nav>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>

              {/* Single H1 on Page */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt Lead */}
              {post.excerpt && (
                <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center text-green-300 font-bold text-sm">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{post.author}</div>
                    <div className="text-[11px] text-white/60">
                      {post.authorBio || "PurestStem Herbal Health Research"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-green-400" />
                    Published:{" "}
                    {new Date(displayDate).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {isUpdated && (
                    <span className="flex items-center gap-1 text-white/50">
                      <RefreshCw className="w-3 h-3" /> Updated:{" "}
                      {new Date(post.updatedAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-green-400" />
                    {readTime} min read
                  </span>
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* Featured Hero Image (Outside header, with priority) */}
        {post.image && (
          <Container className="max-w-4xl mx-auto -mt-8 relative z-10">
            <FadeIn delay={0.1}>
              <figure className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    width={post.imageWidth || 1200}
                    height={post.imageHeight || 675}
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>
                {(post.imageCaption || post.imageCredit) && (
                  <figcaption className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 flex items-center justify-between">
                    <span>{post.imageCaption}</span>
                    {post.imageCredit && (
                      <span className="text-[11px] text-gray-400 italic">Photo: {post.imageCredit}</span>
                    )}
                  </figcaption>
                )}
              </figure>
            </FadeIn>
          </Container>
        )}

        {/* Article Body Container */}
        <Container className="max-w-4xl mx-auto py-12">
          <FadeIn delay={0.15}>
            {/* Rich Text HTML Content */}
            <div
              className="prose prose-lg prose-green max-w-none text-gray-800 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(post.content),
              }}
            />

            {/* Article Tags */}
            {tagsList.length > 0 && (
              <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">Tags:</span>
                {tagsList.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-green-50 hover:text-green-800 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Visible FAQ Accordion Section */}
            {faqs.length > 0 && (
              <section className="mt-16 bg-green-50/60 rounded-3xl p-8 border border-green-200/60 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-xs text-gray-600">Expert answers to common wellness questions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white border border-green-100 shadow-sm space-y-2"
                    >
                      <h3 className="text-base font-bold text-gray-900">{faq.question}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio Card */}
            <section className="mt-12 p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center text-green-800 font-bold text-2xl flex-shrink-0">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-bold text-gray-900 text-base">{post.author}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                    <ShieldCheck className="w-3 h-3 text-green-700" /> Verified Author
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {post.authorBio ||
                    "PurestStem Herbal Health Research Team specializes in chemical-free botanical formulations, desi skincare secrets, and holistic organic hair care remedies in Pakistan."}
                </p>
              </div>
            </section>

            {/* Social Share Bar */}
            <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Share2 className="w-4 h-4 text-green-700" />
                <span>Found this helpful? Share with friends:</span>
              </div>
              <ShareButtons url={shareUrl} text={post.title} size="sm" />
            </div>

            {/* Related Products eCommerce Section */}
            {relatedProducts.length > 0 && (
              <section className="mt-16 pt-12 border-t border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Featured Herbal Products</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      100% natural, chemical-free solutions referenced in this article.
                    </p>
                  </div>
                  <Link
                    href="/shop/products"
                    className="text-xs font-semibold text-green-700 hover:underline flex items-center gap-1"
                  >
                    View All Products <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                    >
                      <Link href={`/shop/products/${product.slug}`} className="block">
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-12 h-12 opacity-40" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {product.category && (
                            <span className="text-[10px] text-green-700 font-semibold uppercase tracking-wider">
                              {product.category.name}
                            </span>
                          )}
                          <Link href={`/shop/products/${product.slug}`}>
                            <h3 className="font-bold text-sm text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="text-sm font-bold text-gray-900 mt-1">
                            Rs. {product.price.toLocaleString()}
                          </div>
                        </div>

                        <Link
                          href={`/shop/products/${product.slug}`}
                          className="w-full py-2 bg-green-50 text-green-800 hover:bg-green-700 hover:text-white rounded-xl text-xs font-semibold text-center transition-all block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="mt-16 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                        {rel.image ? (
                          <img
                            src={rel.image}
                            alt={rel.imageAlt || rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-50 flex items-center justify-center text-green-600">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                          {rel.title}
                        </h3>
                        <span className="text-xs text-green-700 font-semibold mt-3 flex items-center gap-1">
                          Read Guide <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Back to Blog CTA */}
            <div className="mt-16 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Explore More PurestStem Articles
              </Link>
            </div>
          </FadeIn>
        </Container>
      </article>
    </div>
  );
}
