import { cache } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";
import { readingTime, renderBlogContent } from "@/lib/blog-content";
import { Container } from "@/components/layout/container";
import { AnimatedText } from "@/components/motion/animated-text";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShareButtons } from "@/components/share-buttons";
import { SmartImage } from "@/components/ui/smart-image";
import Accordion from "@/components/ui/accordion";
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";
import { findRedirect } from "@/lib/redirects";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  FaqItem,
} from "@/lib/structured-data";
import type { Metadata } from "next";

// Served from cache; admin edits refresh it immediately (see refreshStorefront).
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { OR: [{ status: "published" }, { published: true, status: { not: "draft" } }] },
    select: { slug: true },
  });
  return posts.map(({ slug }) => ({ slug }));
}

const getBlogPostBySlug = cache((slug: string) =>
  prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  })
);

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
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
  const post = await getBlogPostBySlug(slug);

  // If not found, check 301 redirects table
  if (!post) {
    const redirectRecord = await findRedirect(`/blog/${slug}`);
    if (redirectRecord) {
      permanentRedirect(redirectRecord.targetPath);
    }
    const legacyRedirect = await findRedirect(`/shop/blog/${slug}`);
    if (legacyRedirect) {
      permanentRedirect(legacyRedirect.targetPath);
    }
    notFound();
  }

  // Drafts and future-dated posts are only viewable through the admin preview.
  const isPublished = post.status === "published" || (post.published && post.status !== "draft");
  const isDue = !post.scheduledAt || new Date(post.scheduledAt) <= new Date();
  if (!isPublished || !isDue) notFound();

  const faqs = parseJson<FaqItem[]>(post.faqs, []);
  const relatedProductIds = parseJson<string[]>(post.relatedProductIds, []);

  const productSelect = {
    id: true,
    name: true,
    slug: true,
    price: true,
    salePrice: true,
    image: true,
    images: true,
    stock: true,
    category: { select: { name: true } },
  } as const;

  const [relatedProducts, relatedArticles] = await Promise.all([
    relatedProductIds.length > 0
      ? prisma.product.findMany({
          where: { id: { in: relatedProductIds }, isActive: true },
          select: productSelect,
        })
      : post.categoryId
        ? prisma.product.findMany({
            where: { categoryId: post.categoryId, isActive: true },
            take: 3,
            select: productSelect,
          })
        : Promise.resolve([]),
    prisma.blogPost.findMany({
      where: {
        id: { not: post.id },
        status: "published",
        ...(post.categoryId ? { categoryId: post.categoryId } : {}),
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, image: true, imageAlt: true },
    }),
  ]);

  const displayDate = post.publishedAt || post.createdAt;
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category ? [{ label: post.category.name, href: `/blog?category=${post.category.slug}` }] : []),
    { label: post.title },
  ];
  const faqSchema = buildFaqSchema(faqs);
  const tagsList = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <article className="pb-16">
      <JsonLd data={buildBlogPostingSchema(post, SITE_URL)} />
      <JsonLd data={buildBreadcrumbSchema(crumbs, SITE_URL)} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <Container className="max-w-3xl pt-8 lg:pt-12">
        <Breadcrumb items={crumbs} />
        <h1 className="heading-lg mt-6 text-green-950"><AnimatedText text={post.title} /></h1>
        {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-gray-700">{post.excerpt}</p>}
        <p className="mt-5 text-sm text-gray-600">
          By <span className="font-medium text-green-950">{post.author}</span> ·{" "}
          {new Date(displayDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
          {readingTime(post.content)} min read
        </p>
      </Container>

      {post.image && (
        <Container className="mt-8 max-w-4xl">
          <figure className="enter">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-green-200">
              <SmartImage
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                preload
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
              />
            </div>
            {(post.imageCaption || post.imageCredit) && (
              <figcaption className="mt-2 flex justify-between gap-4 text-xs text-gray-600">
                <span>{post.imageCaption}</span>
                {post.imageCredit && <span>Photo: {post.imageCredit}</span>}
              </figcaption>
            )}
          </figure>
        </Container>
      )}

      <Container className="mt-10 max-w-3xl">
        <div className="prose text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: renderBlogContent(post.content) }} />

        {tagsList.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {tagsList.map((tag) => (
              <li key={tag} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-900">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-green-950">Frequently asked questions</h2>
            <div className="mt-4">
              {faqs.map((faq, i) => (
                <Accordion key={i} title={faq.question}>
                  <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                </Accordion>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-4 border-y border-line py-3">
          <span className="text-sm text-gray-600">Share this article</span>
          <ShareButtons url={`/blog/${post.slug}`} text={post.title} />
        </div>
      </Container>

      {(relatedProducts.length > 0 || relatedArticles.length > 0) && (
        <Container className="mt-14 space-y-14">
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-3xl text-green-950">Shop the routine</h2>
                <Link href="/shop/products" className="link-arrow">
                  All products <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {relatedArticles.length > 0 && (
            <section>
              <h2 className="font-display text-3xl text-green-950">Keep reading</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {relatedArticles.map((rel) => (
                  <Link key={rel.id} href={`/blog/${rel.slug}`} className="group block">
                    <div className="img-zoom relative aspect-[3/2] overflow-hidden rounded-2xl bg-green-200">
                      <SmartImage
                        src={rel.image}
                        alt={rel.imageAlt || rel.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-3 font-display text-xl leading-snug text-green-950 group-hover:text-green-800">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </Container>
      )}
    </article>
  );
}
