import Link from "next/link";
import { ArrowRight, Leaf, Truck, Shield, Star } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative bg-green-50 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <FadeIn direction="left" duration={0.6}>
              <div>
                <div className="flex items-center gap-2 text-green-700 mb-4">
                  <span className="text-sm font-medium">100% Natural & Organic</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-6 leading-tight">
                  60 Years of Mountain Herbalism
                  <span className="block text-green-700">Delivered Across Pakistan</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  Premium herbal products crafted with ancient wisdom and modern purity.
                  Experience the healing power of nature.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop/products"
                    className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/shop/about"
                    className="inline-flex items-center gap-2 border border-green-700 text-green-700 px-6 py-3 rounded-md font-medium hover:bg-green-50 transition-colors"
                  >
                    Our Story
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" duration={0.6} delay={0.2}>
              <div className="hidden md:flex justify-center">
                <div className="relative w-[32rem] h-[32rem] rounded-2xl overflow-hidden">
                  <img
                    src="/hero-section.png"
                    alt="PurestStem Products"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <StaggerItem className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over ₨ 5,000</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Herbal</h3>
                <p className="text-sm text-gray-500">Pure & original products</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">Available across Pakistan</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our best-selling herbal products, crafted with care from the finest mountain ingredients
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

          <FadeIn delay={0.3} className="text-center mt-10">
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 border border-green-700 text-green-700 px-6 py-3 rounded-md font-medium hover:bg-green-50 transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real reviews from verified buyers</p>
          </FadeIn>

          <StaggerContainer
            staggerDelay={0.12}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((review) => (
              <StaggerItem key={review.id}>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-xs">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.name}</p>
                      {review.verified && (
                        <p className="text-xs text-green-600">Verified Buyer</p>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">From Our Blog</h2>
            <p className="text-gray-600">Tips, guides, and stories from the world of herbal wellness</p>
          </FadeIn>

          <StaggerContainer
            staggerDelay={0.15}
            className="grid md:grid-cols-3 gap-8"
          >
            {blogPosts.map((post) => (
              <StaggerItem key={post.id}>
                <article className="group h-full">
                  <Link href={`/shop/blog/${post.slug}`} className="block h-full">
                    <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden shadow-sm">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Leaf className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-green-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn direction="up" duration={0.6}>
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Natural Wellness?</h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made the switch to herbal.
              Your body will thank you.
            </p>
            <Link
              href="/shop/products"
              className="inline-flex items-center gap-2 bg-white text-green-800 px-8 py-3 rounded-md font-medium hover:bg-green-100 transition-colors shadow-lg"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
