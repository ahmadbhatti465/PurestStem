import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import { getBlogCategories, getPublishedPosts } from "@/lib/catalog";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/layout/page-hero";
import { SmartImage } from "@/components/ui/smart-image";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { readingTime } from "@/lib/blog-content";
import JsonLd from "@/components/json-ld";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

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

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [allPosts, categories] = await Promise.all([getPublishedPosts(), getBlogCategories()]);
  const posts = category ? allPosts.filter((post) => post.category?.slug === category) : allPosts;
  const [lead, ...rest] = posts;

  const pill = "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
  const pillState = (active: boolean) =>
    active ? "bg-green-900 text-white" : "bg-white text-gray-700 ring-1 ring-inset ring-line hover:text-green-900";

  return (
    <>
      <PageHero
        crumbs={[{ label: "Blog" }]}
        eyebrow="The journal"
        title="Herbal guides for healthy hair and skin"
        accent={["healthy"]}
      />
      <Container className="py-8 lg:py-12">
      <JsonLd
        data={buildBreadcrumbSchema(
          [
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            ...(category ? [{ label: `Category: ${category}` }] : []),
          ],
          SITE_URL
        )}
      />
      {categories.length > 0 && (
        <nav aria-label="Blog categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 sm:mx-0 sm:px-0.5">
          <Link href="/blog" aria-current={!category ? "page" : undefined} className={cn(pill, pillState(!category))}>
            All articles
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              aria-current={category === cat.slug ? "page" : undefined}
              className={cn(pill, pillState(category === cat.slug))}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}

      {!lead ? (
        <EmptyState
          icon={Leaf}
          title="No articles found"
          description="We're preparing new guides for this section."
          action={
            <Link href="/shop/products" className="btn btn-primary">
              Browse products <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
      ) : (
        <>
          <article className="enter group mt-10 border-b border-line pb-12">
            <Link href={`/blog/${lead.slug}`} className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="img-zoom relative aspect-[3/2] overflow-hidden rounded-3xl bg-green-200">
                <SmartImage
                  src={lead.image}
                  alt={lead.imageAlt || lead.title}
                  fill
                  preload
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {lead.category?.name && <span className="font-medium text-green-800">{lead.category.name} · </span>}
                  {readingTime(lead.content)} min read
                </p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-green-950 group-hover:text-green-800 sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-3 line-clamp-3 leading-relaxed text-gray-600">
                  {lead.excerpt || lead.seoDescription}
                </p>
                <p className="mt-4 text-sm text-gray-600">{formatDate(lead.publishedAt || lead.createdAt)}</p>
              </div>
            </Link>
          </article>

          {rest.length > 0 && (
            <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <article key={post.id} className="reveal group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="img-zoom relative aspect-[3/2] overflow-hidden rounded-2xl bg-green-200">
                      <SmartImage
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      {post.category?.name && <span className="font-medium text-green-800">{post.category.name} · </span>}
                      {readingTime(post.content)} min read
                    </p>
                    <h2 className="mt-1.5 font-display text-xl leading-snug text-green-950 group-hover:text-green-800">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {post.excerpt || post.seoDescription}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
    </>
  );
}
