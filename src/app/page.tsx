import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Leaf, Sparkles, BookOpen, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/json-ld";
import { ScrollProgress } from "@/components/home/scroll-progress";
import { DynamicHero } from "@/components/home/dynamic-hero";
import { TickerMarquee } from "@/components/home/ticker-marquee";
import { TrustComparison } from "@/components/home/trust-comparison";
import { AppleFeatures } from "@/components/home/apple-features";
import { AnimatedProductsSection } from "@/components/home/animated-products-section";
import { HeritageStory } from "@/components/home/heritage-story";
import { AnimatedStats } from "@/components/home/animated-stats";
import { RoutineSteps } from "@/components/home/routine-steps";
import { AnimatedTestimonials } from "@/components/home/animated-testimonials";
import { FaqAccordion } from "@/components/home/faq-accordion";

// Render per-request so newly added products appear immediately
export const dynamic = "force-dynamic";

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

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 12,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getRecentBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function getReviews() {
  try {
    return await prisma.review.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export default async function HomePage() {
  const [products, blogPosts, reviews] = await Promise.all([
    getFeaturedProducts(),
    getRecentBlogPosts(),
    getReviews(),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PurestStem",
    url: SITE_URL,
    logo: `${SITE_URL}/pureststem_logo.png`,
    description:
      "Pakistan's trusted herbal brand offering 100% natural shampoos, hair oils, herbal teas, soaps and skincare products.",
    foundingDate: "1964",
    sameAs: [
      "https://facebook.com/pureststem",
      "https://instagram.com/pureststem",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-333-4117668",
      contactType: "customer service",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
  };

  return (
    <div className="overflow-hidden bg-[#faf8f5]">
      <JsonLd data={structuredData} />

      {/* Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* 1. Dynamic Hero Section (Light Luxury Botanical Theme) */}
      <DynamicHero products={products} />

      {/* 2. Scrolltide-Style Emerald Marquee Ribbon */}
      <TickerMarquee />

      {/* 3. Formal Side-by-Side Trust & Quality Comparison Table */}
      <TrustComparison />

      {/* 4. Apple-Style "The Botanical Architecture" (4-Pillar Interactive Showcase) */}
      <AppleFeatures />

      {/* 5. Animated Featured Products with 3D Tilt & Category Pills */}
      <AnimatedProductsSection products={products} />

      {/* 6. Authentic 60-Year Mountain Heritage Story (1964-2026) */}
      <HeritageStory />

      {/* 7. Apple-Style "By The Numbers" Animated Counters */}
      <AnimatedStats />

      {/* 8. The Purest 3-Step Routine (Transformation Timeline) */}
      <RoutineSteps />

      {/* 9. Scrolltide-Style Verified Customer Reviews Wall */}
      <AnimatedTestimonials reviews={reviews} />

      {/* 10. Herbal Insights & Wellness Blog Preview (High-End Magazine Layout) */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-3 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Herbal Wellness Journal
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight">
                  Ancient Wisdom, <span className="text-green-800 italic">Modern Wellness</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-green-900 hover:text-green-700 transition-colors"
              >
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-[#fbfcf9] rounded-3xl overflow-hidden border border-gray-200/90 hover:border-green-300 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-700 bg-green-100/60">
                        <Leaf className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-emerald-900 border border-white/60 shadow-xs flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-emerald-700" />
                      <span>Herbal Guide</span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-700" /> 4 min read
                        </span>
                        <span>•</span>
                        <span>Verified by Herbalists</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-green-800 transition-colors line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-green-900">
                      <span>Read Complete Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. Frequently Asked Questions (Spring Accordion) */}
      <FaqAccordion />
    </div>
  );
}
