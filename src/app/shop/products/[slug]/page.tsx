import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShoppingCart, ArrowLeft, Check, Shield, Truck, Leaf, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";
import ReviewForm from "./review-form";
import ProductCard from "@/components/product-card";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

async function getProduct(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
}

async function getRelatedProducts(categoryId: string, currentId: string) {
  return await prisma.product.findMany({
    where: { categoryId, id: { not: currentId }, isActive: true },
    include: { category: true },
    take: 4,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const discount = calculateDiscount(product.price, product.salePrice);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn>
        <Link
          href="/shop/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <FadeIn direction="left">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{discount}%
              </div>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Only {product.stock} left
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn direction="right" delay={0.15}>
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium mb-3">
              <Leaf className="w-3 h-3" />
              {product.category.name}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews.length} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-green-700">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm">
                <Check className="w-4 h-4 text-green-600" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
              </div>
              {product.weight && (
                <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm">
                  <Shield className="w-4 h-4 text-green-600" />
                  {product.weight}
                </div>
              )}
              <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                Free shipping over ₨ 5,000
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        </FadeIn>
      </div>

      {/* Details Tabs */}
      <div className="grid lg:grid-cols-3 gap-10 mb-16">
        <div className="lg:col-span-2">
          <FadeIn>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {product.ingredients && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-green-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Ingredients</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients}</p>
                  </div>
                )}
                {product.howToUse && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">How to Use</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.howToUse}</p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="right" delay={0.1}>
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-4">Why You'll Love It</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                100% natural ingredients sourced from mountain regions
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                Traditional recipes passed down through generations
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                Lab-tested for purity and effectiveness
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                Cash on delivery across Pakistan
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>

      {/* Reviews Section */}
      <div className="mb-16">
        <FadeIn>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-green-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <span className="text-sm text-gray-500">({product.reviews.length})</span>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn direction="left" delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <ReviewForm productId={product.id} />
            </div>
          </FadeIn>

          <div className="space-y-4">
            <StaggerContainer staggerDelay={0.1}>
              {product.reviews.map((review) => (
                <StaggerItem key={review.id}>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{review.name}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link
                href="/shop/products"
                className="inline-flex items-center gap-1 text-green-700 font-medium hover:text-green-800 text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {relatedProducts.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}
    </div>
  );
}
