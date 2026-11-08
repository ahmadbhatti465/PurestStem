import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { getShowcaseProducts } from "@/lib/catalog";
import JsonLd from "@/components/json-ld";
import { Hero } from "@/components/home/hero";
import { IngredientRibbon } from "@/components/home/ingredient-ribbon";
import { Bestsellers } from "@/components/home/bestsellers";
import { Difference } from "@/components/home/difference";
import { Craft } from "@/components/home/craft";
import { Heritage } from "@/components/home/heritage";
import { Routine } from "@/components/home/routine";
import { Testimonials } from "@/components/home/testimonials";
import { Journal } from "@/components/home/journal";
import { Faq } from "@/components/home/faq";
import { NatureCta } from "@/components/home/nature-cta";

// Served from cache; admin edits refresh it immediately (see refreshStorefront).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "PurestStem | Pakistan's Trusted Herbal Hair & Skin Care Since 1964",
  description:
    "Buy 100% natural herbal shampoos, hair oils, herbal teas, soaps and skin care products in Pakistan. 60+ years of trusted mountain herbalism. Cash on delivery nationwide. Free shipping over ₨ 5,000.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "PurestStem | Pakistan's Trusted Herbal Products Brand",
    description:
      "Pakistan's trusted herbal brand since 1964. Shop herbal shampoos, hair repairing oils, teas, soaps and organic skincare.",
    url: SITE_URL,
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PurestStem",
  url: SITE_URL,
  logo: `${SITE_URL}/pureststem_logo.png`,
  description:
    "Pakistan's trusted herbal brand offering 100% natural shampoos, hair oils, herbal teas, soaps and skincare products.",
  foundingDate: "1964",
  sameAs: ["https://facebook.com/pureststem", "https://instagram.com/pureststem"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-333-4117668",
    contactType: "customer service",
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
};

export default async function HomePage() {
  const [products, posts, reviews, reviewStats] = await Promise.all([
    getShowcaseProducts(6),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, image: true, imageAlt: true },
    }),
    prisma.review.findMany({
      where: { rating: { gte: 4 } },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, comment: true, rating: true, verified: true },
    }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  ]);

  const startingPrice = products.length
    ? Math.min(...products.map((product) => product.salePrice || product.price))
    : undefined;

  return (
    <>
      <JsonLd data={structuredData} />
      <Hero startingPrice={startingPrice} />
      <IngredientRibbon />
      <Bestsellers products={products} />
      <Difference />
      <Craft />
      <Heritage />
      <Routine />
      <Testimonials
        reviews={reviews}
        averageRating={reviewStats._avg.rating ?? 0}
        reviewCount={reviewStats._count}
      />
      <Journal posts={posts} />
      <Faq />
      <NatureCta />
    </>
  );
}
