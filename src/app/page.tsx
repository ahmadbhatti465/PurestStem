import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Leaf,
  Truck,
  Shield,
  Star,
  Award,
  Sparkles,
  Heart,
  BadgeCheck,
  Clock,
  Sprout,
  Phone,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { NewsletterSection } from "@/components/newsletter-form";

// Render per-request so newly added products appear immediately (no build-time cache).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PurestStem | Premium Herbal Products in Pakistan - 100% Natural",
  description:
    "Buy 100% natural herbal shampoos, hair oils, herbal teas, soaps and skin care products in Pakistan. 60+ years of trusted mountain herbalism. Cash on delivery. Free shipping over ₨ 5,000.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "PurestStem | Premium Herbal Products in Pakistan",
    description:
      "Pakistan's trusted herbal brand since 1964. Shop herbal shampoos, hair oils, teas, soaps and skincare.",
    url: SITE_URL,
    type: "website",
  },
};

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { featured: true, isActive: true },
    include: { category: true },
    take: 8,
  });
}

async function getRecentBlogPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

async function getReviews() {
  return await prisma.review.findMany({
    where: { verified: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const blogPosts = await getRecentBlogPosts();
  const reviews = await getReviews();

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
    <div className="overflow-hidden">
      <JsonLd data={structuredData} />

      {/*  Hero  */}
      <section className="relative bg-[#0e271a] overflow-hidden">
        {/* Background gradient mesh + soft glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e271a] via-[#14301f] to-[#1c4a2c]" />
          <div className="absolute -top-24 -right-24 w-[40rem] h-[40rem] rounded-full bg-emerald-500/15 blur-[150px]" />
          <div className="absolute bottom-0 -left-32 w-[34rem] h-[34rem] rounded-full bg-green-700/25 blur-[140px]" />
          <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] rounded-full bg-lime-400/10 blur-[130px]" />
          <Leaf className="absolute -right-6 top-10 w-72 h-72 text-green-300/5 rotate-12" strokeWidth={1} />
          <Leaf className="absolute right-44 -top-8 w-44 h-44 text-green-300/5 -rotate-45" strokeWidth={1} />
          <Leaf className="absolute left-1/2 top-full -translate-y-1/2 w-56 h-56 text-green-200/5" strokeWidth={1} />
        </div>

        <Container className="relative py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn className="max-w-xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-green-100 mb-6">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-green-300" />
                </span>
                100% Natural & Organic
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.12]">
                Pakistan&apos;s Trusted{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-green-300">
                  Herbal Products
                </span>{" "}
                Brand
              </h1>

              <p className="text-lg text-green-100/80 mb-8 leading-relaxed">
                Premium herbal shampoos, hair oils, herbal teas, soaps and skin care made with ancient
                mountain wisdom and modern purity. Cash on delivery across Pakistan.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/shop/products"
                  className="inline-flex items-center gap-2 bg-white text-green-900 px-7 py-3.5 rounded-full font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.03] hover:-translate-y-0.5"
                >
                  Shop Herbal Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop/about"
                  className="inline-flex items-center gap-2 border border-white/25 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  Our Story
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-white/10">
                {[
                  { value: "60+", label: "Years Experience" },
                  { value: "50K+", label: "Happy Customers" },
                  { value: "100%", label: "Natural" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-green-200/70 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1} className="hidden md:block">
              <div className="relative">
                {/* soft glow behind card */}
                <div className="absolute -inset-5 rounded-[2.5rem] bg-green-400/20 blur-3xl" />

                {/* product spotlight card */}
                <div className="relative rounded-[2rem] bg-gradient-to-b from-[#f7fbf2] via-[#eef6e2] to-[#d8eccb] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.65)] overflow-hidden">
                  <div className="absolute top-6 right-4 w-40 h-40 rounded-full bg-green-300/40 blur-3xl" />
                  <div className="absolute bottom-2 -left-12 w-48 h-48 rounded-full bg-emerald-200/60 blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-white/60 blur-2xl" />

                  <div className="relative aspect-[10/11] w-full">
                    <img
                      src="/hero-section.png"
                      alt="PurestStem premium herbal products collection in Pakistan"
                      width={934}
                      height={1024}
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_24px_28px_rgba(20,60,40,0.25)]"
                      loading="eager"
                    />
                    {/* floor shadow */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-2/3 h-10 rounded-full bg-[#1c4a2c]/20 blur-2xl" />
                  </div>
                </div>

                {/* floating rating chip */}
                <div className="absolute -top-5 -left-5 animate-float-slow bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">4.9/5</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">12,000+ reviews</p>
                  </div>
                </div>

                {/* floating certified chip */}
                <div className="absolute -bottom-5 -right-5 animate-float-slower bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 leading-tight">Certified Organic</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">100% Pure & Natural</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/*  Trust bar  */}
      <section className="py-10 bg-white border-b border-gray-100">
        <Container>
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₨ 5,000" },
              { icon: Shield, title: "100% Herbal", desc: "Pure & original products" },
              { icon: Phone, title: "Cash on Delivery", desc: "Available across Pakistan" },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/60 border border-green-100 hover:border-green-200 hover:shadow-sm transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/*  Featured products  */}
      <PageSection background="light" id="featured">
        <SectionHeader
          eyebrow="Best Sellers"
          eyebrowIcon={Award}
          title={<>
            Featured{" "}
            <span className="text-green-700">Herbal Products</span>
          </>}
          subtitle="Discover our most loved herbal products, crafted with care from the finest mountain ingredients"
          action={
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      {/*  Why choose us  */}
      <PageSection background="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left" className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/about_page.png"
                alt="PurestStem traditional herbal preparation process"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-green-800 text-white rounded-2xl p-5 shadow-xl">
              <p className="text-3xl font-bold">60+</p>
              <p className="text-sm text-green-200">Years of Excellence</p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <SectionHeader align="left" title={<>Why Choose <span className="text-green-700">PurestStem?</span></>}
              subtitle="We combine ancient herbal wisdom with modern quality standards to deliver products that truly make a difference in your daily wellness routine."
            />

            <StaggerContainer staggerDelay={0.1} className="space-y-4 mt-8">
              {[
                {
                  icon: Sprout,
                  title: "100% Natural Ingredients",
                  desc: "Sourced directly from pristine mountain regions of Pakistan.",
                },
                {
                  icon: Heart,
                  title: "Handcrafted with Love",
                  desc: "Each batch is prepared following traditional family recipes.",
                },
                {
                  icon: Shield,
                  title: "Rigorous Quality Testing",
                  desc: "Every product is lab-tested for purity and effectiveness.",
                },
                {
                  icon: Clock,
                  title: "Fast & Reliable Delivery",
                  desc: "Cash on delivery available across Pakistan with quick dispatch.",
                },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50/60 transition-colors">
                    <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
        </div>
      </PageSection>

      {/*  Testimonials  */}
      <PageSection background="green">
        <SectionHeader
          light
          eyebrow="Customer Love"
          eyebrowIcon={Star}
          title="What Our Customers Say"
          subtitle="Real reviews from verified buyers across Pakistan"
        />

        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <div className="bg-white/10 border border-white/10 p-5 rounded-2xl flex flex-col h-full">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <p className="text-white/90 text-sm mb-5 leading-relaxed flex-1">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-9 h-9 bg-green-500/30 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.name}</p>
                    {review.verified && (
                      <p className="text-xs text-green-300 flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified Buyer
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      {/*  Blog preview  */}
      <PageSection background="white">
        <SectionHeader
          eyebrow="Latest Insights"
          eyebrowIcon={Sparkles}
          title={<>
            Herbal{" "}
            <span className="text-green-700">Wellness Tips</span>
          </>}
          subtitle="Expert guides on hair care, skincare and natural wellness for Pakistani homes"
          action={
            <Link
              href="/shop/blog"
              className="inline-flex items-center gap-1 text-green-700 font-semibold hover:text-green-800 text-sm"
            >
              Read All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-3 gap-6 mt-12">
          {blogPosts.map((post) => (
            <StaggerItem key={post.id}>
              <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all h-full flex flex-col">
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
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 flex-1">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-green-700 text-sm font-medium">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageSection>

      {/*  Newsletter  */}
      <PageSection background="light" padding="md">
        <NewsletterSection variant="dark" />
      </PageSection>

      {/*  Final CTA  */}
      <PageSection background="dark" padding="xl">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <FadeIn className="relative text-center">
          <SectionHeader
            light
            eyebrow="Join 50,000+ Happy Customers"
            eyebrowIcon={Heart}
            title={<>
              Ready to Experience{" "}
              <span className="text-green-300">Natural Wellness?</span>
            </>}
            subtitle="Make the switch to herbal today. Your body will thank you. Free shipping on orders over ₨ 5,000 with cash on delivery across Pakistan."
          />
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-white text-green-900 px-7 py-3.5 rounded-full font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/shop/contact"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </FadeIn>
      </PageSection>
    </div>
  );
}
