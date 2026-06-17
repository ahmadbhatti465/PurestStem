import Link from "next/link";
import { ArrowRight, Leaf, Truck, Shield, Star, ChevronRight, Award, Sparkles, Heart, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/product-card";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

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

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-[#0f2e1c]">
        {/* Background decorative blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-700/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left" duration={0.6}>
              <div>
                {/* Floating badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-100">
                    100% Natural & Organic
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.15]">
                  60 Years of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                    Mountain Herbalism
                  </span>
                </h1>

                <p className="text-lg text-green-100/80 mb-8 max-w-lg leading-relaxed">
                  Premium herbal products crafted with ancient wisdom and modern purity.
                  Experience the healing power of nature, delivered across Pakistan.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop/products"
                    className="inline-flex items-center gap-2 bg-white text-green-900 px-7 py-3.5 rounded-full font-semibold hover:bg-green-50 transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Explore Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/shop/about"
                    className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
                  >
                    Our Story
                  </Link>
                </div>

                {/* Mini stats */}
                <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
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
            </FadeIn>

            <FadeIn direction="right" duration={0.6} delay={0.2}>
              <div className="hidden md:flex justify-center relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/30 to-emerald-400/20 rounded-[2rem] blur-2xl scale-90" />
                <div className="relative w-full max-w-lg aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border border-white/10">
                  <img
                    src="/hero-section.png"
                    alt="PurestStem Products"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certified Organic</p>
                    <p className="text-sm font-semibold text-gray-900">Pure & Trusted</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80V40C240 0 480 0 720 20C960 40 1200 20 1440 40V80H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ================= TRUST / FEATURES BAR ================= */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <StaggerItem>
              <div className="group flex items-center gap-5 p-5 rounded-2xl bg-green-50/60 hover:bg-green-50 border border-green-100 hover:border-green-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <Truck className="w-7 h-7 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                  <p className="text-sm text-gray-500">On orders over ₨ 5,000</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="group flex items-center gap-5 p-5 rounded-2xl bg-green-50/60 hover:bg-green-50 border border-green-100 hover:border-green-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <Shield className="w-7 h-7 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">100% Herbal</h3>
                  <p className="text-sm text-gray-500">Pure & original products</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="group flex items-center gap-5 p-5 rounded-2xl bg-green-50/60 hover:bg-green-50 border border-green-100 hover:border-green-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <Leaf className="w-7 h-7 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500">Available across Pakistan</p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Best Sellers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Discover our most loved herbal products, crafted with care from the finest mountain ingredients
            </p>
          </FadeIn>

          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3} className="text-center mt-12">
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3.5 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 hover:shadow-xl hover:scale-[1.02]"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/about_page.png"
                    alt="PurestStem Process"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -right-6 bg-green-800 text-white rounded-2xl p-5 shadow-xl">
                  <p className="text-3xl font-bold">60+</p>
                  <p className="text-sm text-green-200">Years of Excellence</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose{" "}
                  <span className="text-green-700">PurestStem?</span>
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We combine ancient herbal wisdom with modern quality standards to deliver products
                  that truly make a difference in your daily wellness routine.
                </p>

                <div className="space-y-5">
                  {[
                    {
                      icon: Leaf,
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
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                        <item.icon className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-green-900 text-white relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-800/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-800/40 rounded-full blur-[80px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Customer Love
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-green-200/70 max-w-xl mx-auto">
              Real reviews from verified buyers across Pakistan
            </p>
          </FadeIn>

          <StaggerContainer
            staggerDelay={0.12}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((review) => (
              <StaggerItem key={review.id}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed flex-1">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{review.name}</p>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-xs text-green-300">
                          <BadgeCheck className="w-3 h-3" />
                          Verified Buyer
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================= BLOG PREVIEW ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Latest Insights
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                From Our Blog
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg">
                Tips, guides, and stories from the world of herbal wellness
              </p>
            </div>
            <Link
              href="/shop/blog"
              className="inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800 transition-colors group"
            >
              Read All Articles
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>

          <StaggerContainer
            staggerDelay={0.15}
            className="grid md:grid-cols-3 gap-8"
          >
            {blogPosts.map((post) => (
              <StaggerItem key={post.id}>
                <article className="group h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <Link href={`/shop/blog/${post.slug}`} className="block h-full">
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-green-50">
                          <Leaf className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-medium">
                        Read More
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4a2e] via-[#2d6a4f] to-[#1a4a2e]" />
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-600/20 rounded-full blur-[100px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn direction="up" duration={0.6}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Heart className="w-4 h-4 text-green-300" />
              <span className="text-sm font-medium text-green-100">
                Join 50,000+ Happy Customers
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Experience{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Natural Wellness?
              </span>
            </h2>
            <p className="text-green-100/80 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Make the switch to herbal today. Your body will thank you. Free shipping on
              orders over ₨ 5,000 with cash on delivery across Pakistan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop/products"
                className="inline-flex items-center gap-2 bg-white text-green-900 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.03]"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/shop/contact"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
