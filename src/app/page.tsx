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
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";

export const metadata: Metadata = {
  title: "PurestStem | Premium Herbal Products in Pakistan - 100% Natural",
  description:
    "Buy 100% natural herbal shampoos, hair oils, herbal teas, soaps and skin care products in Pakistan. 60+ years of trusted mountain herbalism. Cash on delivery. Free shipping over ₨ 5,000.",
  alternates: {
    canonical: "http://localhost:3000",
  },
  openGraph: {
    title: "PurestStem | Premium Herbal Products in Pakistan",
    description:
      "Pakistan's trusted herbal brand since 1964. Shop herbal shampoos, hair oils, teas, soaps and skincare.",
    url: "http://localhost:3000",
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
    url: "http://localhost:3000",
    logo: "http://localhost:3000/pureststem_logo.png",
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
    <div>
      <JsonLd data={structuredData} />

      {/* Hero */}
      <section className="relative bg-[#132e1f] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-green-700/20 rounded-full blur-[140px] translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-green-100 mb-5">
                <Sparkles className="w-4 h-4 text-green-300" />
                100% Natural & Organic
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-[1.1]">
                Pakistan&apos;s Trusted{" "}
                <span className="text-green-300">Herbal Products</span> Brand
              </h1>

              <p className="text-lg text-green-100/80 mb-8 leading-relaxed">
                Premium herbal shampoos, hair oils, herbal teas, soaps and skin care made with ancient
                mountain wisdom and modern purity. Cash on delivery across Pakistan.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/shop/products"
                  className="inline-flex items-center gap-2 bg-white text-green-900 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-lg"
                >
                  Shop Herbal Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop/about"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  Our Story
                </Link>
              </div>

              <div className="flex gap-8 pt-6 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-white">60+</p>
                  <p className="text-sm text-green-200/70">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">50K+</p>
                  <p className="text-sm text-green-200/70">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-green-200/70">Natural</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/5]">
                <img
                  src="/hero-section.png"
                  alt="PurestStem premium herbal products collection in Pakistan"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Certified Organic</p>
                  <p className="text-sm font-semibold text-gray-900">Pure & Trusted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₨ 5,000" },
              { icon: Shield, title: "100% Herbal", desc: "Pure & original products" },
              { icon: Phone, title: "Cash on Delivery", desc: "Available across Pakistan" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/60 border border-green-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 bg-[#f9faf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Best Sellers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Featured Herbal Products</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Discover our most loved herbal products, crafted with care from the finest mountain ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-7 py-3 rounded-full font-medium hover:bg-green-800 transition-colors shadow-lg"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
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
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-green-700">PurestStem?</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We combine ancient herbal wisdom with modern quality standards to deliver products
                that truly make a difference in your daily wellness routine.
              </p>

              <div className="space-y-4">
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
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#132e1f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Customer Love
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
            <p className="text-green-200/70 max-w-xl mx-auto">Real reviews from verified buyers across Pakistan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/10 border border-white/10 p-5 rounded-2xl flex flex-col"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <p className="text-white/90 text-sm mb-5 leading-relaxed flex-1">&ldquo;{review.comment}&rdquo;</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Latest Insights
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Herbal Wellness Tips</h2>
              <p className="text-gray-500 mt-2 max-w-lg">
                Expert guides on hair care, skincare and natural wellness for Pakistani homes
              </p>
            </div>
            <Link
              href="/shop/blog"
              className="inline-flex items-center gap-1 text-green-700 font-medium hover:text-green-800"
            >
              Read All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article key={post.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <Link href={`/shop/blog/${post.slug}`} className="block h-full">
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
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-green-700 text-sm font-medium">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a4a2e] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-green-100 mb-5">
            <Heart className="w-4 h-4 text-green-300" />
            Join 50,000+ Happy Customers
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to Experience <span className="text-green-300">Natural Wellness?</span>
          </h2>
          <p className="text-green-100/80 mb-9 max-w-2xl mx-auto text-lg leading-relaxed">
            Make the switch to herbal today. Your body will thank you. Free shipping on orders over
            ₨ 5,000 with cash on delivery across Pakistan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-white text-green-900 px-7 py-3.5 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-lg"
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
        </div>
      </section>
    </div>
  );
}
