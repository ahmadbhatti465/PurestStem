import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
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
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <FadeIn direction="left">
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>
        </FadeIn>

        <FadeIn direction="right" delay={0.15}>
          <div>
            <p className="text-sm text-green-600 font-medium mb-2">{product.category.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-green-700">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            <StaggerContainer staggerDelay={0.08} className="space-y-3 mb-6">
              {product.weight && (
                <StaggerItem>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Size: {product.weight}</span>
                  </div>
                </StaggerItem>
              )}
              {product.sku && (
                <StaggerItem>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>SKU: {product.sku}</span>
                  </div>
                </StaggerItem>
              )}
              <StaggerItem>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}</span>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <AddToCartButton product={product} />

            <div className="mt-8 border-t pt-6 space-y-4">
              {product.ingredients && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Ingredients</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients}</p>
                </div>
              )}
              {product.howToUse && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">How to Use</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.howToUse}</p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8 mb-12">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Customer Reviews</h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn direction="left" delay={0.1}>
            <div>
              <ReviewForm productId={product.id} />
            </div>
          </FadeIn>

          <div className="space-y-4">
            <StaggerContainer staggerDelay={0.1}>
              {product.reviews.map((review) => (
                <StaggerItem key={review.id}>
                  <div className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{review.name}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-8">
          <FadeIn>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">You May Also Like</h2>
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
