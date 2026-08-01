import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Check,
  Shield,
  Truck,
  Leaf,
  ChevronRight,
  Lock,
  RotateCcw,
  Package,
  Sparkles,
  Heart,
  Info,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";
import ProductPurchase from "./product-purchase";
import ProductGallery from "./product-gallery";
import ReviewForm from "./review-form";
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";
import StarRating from "@/components/ui/star-rating";
import Tooltip from "@/components/ui/tooltip";
import Accordion from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

const PRICE_VALID_UNTIL = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function parseImages(images: string | null): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

async function getProduct(slug: string) {
  const normalizedSlug = slugify(slug);
  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  return products.find((p) => slugify(p.slug) === normalizedSlug) || null;
}

async function getRelatedProducts(currentId: string) {
  return await prisma.product.findMany({
    where: { id: { not: currentId }, isActive: true },
    include: { category: true },
    take: 4,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | PurestStem",
    };
  }

  const description = product.description
    ? product.description.length > 155
      ? `${product.description.slice(0, 152)}...`
      : product.description
    : undefined;

  return {
    title: `${product.name} | Buy Online in Pakistan | PurestStem`,
    description,
    keywords: [
      product.name,
      product.category.name,
      "herbal products Pakistan",
      `${product.category.name.toLowerCase()} Pakistan`,
      "buy online Pakistan",
      "cash on delivery",
    ],
    openGraph: {
      title: product.name,
      description,
      images: getPrimaryImage(product.image, product.images)
        ? [{ url: getPrimaryImage(product.image, product.images)!, alt: product.name }]
        : [],
    },
    alternates: {
      canonical: `http://localhost:3000/shop/products/${product.slug}`,
    },
  };
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

  const relatedProducts = await getRelatedProducts(product.id);
  const discount = calculateDiscount(product.price, product.salePrice);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const imageUrls = parseImages(product.images);
  const primaryImage = getPrimaryImage(product.image, product.images);
  const allImages = primaryImage
    ? imageUrls.includes(primaryImage)
      ? imageUrls
      : [primaryImage, ...imageUrls]
    : imageUrls;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: allImages.map((url) => (url.startsWith("http") ? url : `http://localhost:3000${url}`)),
    description: product.description || undefined,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "PurestStem",
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `http://localhost:3000/shop/products/${product.slug}`,
      priceCurrency: "PKR",
      price: product.salePrice || product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: PRICE_VALID_UNTIL,
    },
    aggregateRating: product.reviews.length
      ? {
          "@type": "AggregateRating",
          ratingValue: avgRating.toFixed(1),
          reviewCount: product.reviews.length,
        }
      : undefined,
  };

  const shareUrl = `http://localhost:3000/shop/products/${product.slug}`;
  const shareText = `Check out ${product.name} - ${shareUrl}`;

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-8">
        <JsonLd data={structuredData} />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-green-700 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href="/shop/products" className="hover:text-green-700 transition-colors">
                Products
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        <Link
          href="/shop/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Main Product Section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          <FadeIn className="lg:self-start">
            <ProductGallery
              images={allImages}
              productName={product.name}
              discount={discount}
              stock={product.stock}
            />
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={`/shop/products?category=${product.category.slug}`}
                className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
              >
                <Leaf className="w-3.5 h-3.5" />
                {product.category.name}
              </Link>
              {product.featured && (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 rounded-full px-3 py-1.5 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured
                </span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 rounded-full px-3 py-1.5 text-xs font-bold">
                  Low Stock
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={avgRating} size="md" />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} ({product.reviews.length}{" "}
                {product.reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-green-700">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-8 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <Check className="w-4 h-4 text-green-600" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
              </span>
              {product.weight && (
                <span className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                  <Package className="w-4 h-4 text-green-600" />
                  {product.weight}
                </span>
              )}
              <span className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <Truck className="w-4 h-4 text-green-600" />
                Free shipping over ₨ 5,000
              </span>
              <span className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <RotateCcw className="w-4 h-4 text-green-600" />
                7-Day Returns
              </span>
            </div>

            <div className="mb-10">
              <ProductPurchase product={product} />
            </div>

            {/* Trust row with tooltips */}
            <StaggerContainer className="grid grid-cols-3 gap-3 mb-8">
              <StaggerItem>
                <Tooltip content="Your payment information is always protected">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors cursor-help">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Secure Checkout</span>
                  </div>
                </Tooltip>
              </StaggerItem>
              <StaggerItem>
                <Tooltip content="Pay when your order arrives at your door">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors cursor-help">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Cash on Delivery</span>
                  </div>
                </Tooltip>
              </StaggerItem>
              <StaggerItem>
                <Tooltip content="Made with pure herbal ingredients, no harsh chemicals">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors cursor-help">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">100% Natural</span>
                  </div>
                </Tooltip>
              </StaggerItem>
            </StaggerContainer>

            {/* Share */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600">Share this product</span>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] hover:scale-110 transition-all shadow-md"
                    aria-label="Share on WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:bg-[#0d65d9] hover:scale-110 transition-all shadow-md"
                    aria-label="Share on Facebook"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0F1419] text-white hover:bg-gray-800 hover:scale-110 transition-all shadow-md"
                    aria-label="Share on Twitter"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Product Details Section */}
        <FadeIn className="mb-20">
          <section className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Info className="w-5 h-5 text-green-700" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Product Details</h2>
            </div>

            {/* Desktop: two-column grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {product.ingredients && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Ingredients
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {product.howToUse && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    How to Use
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.howToUse}
                  </p>
                </div>
              )}
            </div>

            {/* Mobile: accordions */}
            <div className="md:hidden space-y-3">
              {product.ingredients && (
                <Accordion
                  title="Ingredients"
                  icon={<Leaf className="w-5 h-5" />}
                >
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.ingredients}
                  </p>
                </Accordion>
              )}
              {product.howToUse && (
                <Accordion
                  title="How to Use"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.howToUse}
                  </p>
                </Accordion>
              )}
            </div>

            <StaggerContainer className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: "Quality Guarantee", text: "Premium herbal ingredients with strict quality checks." },
                { icon: Leaf, title: "100% Natural", text: "Free from harmful chemicals and artificial additives." },
                { icon: Truck, title: "Fast Delivery", text: "Quick shipping across Pakistan with COD available." },
                { icon: RotateCcw, title: "Easy Returns", text: "7-day hassle-free return policy for your peace of mind." },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="text-center p-5 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-green-700" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeIn>

        {/* Reviews Section */}
        <FadeIn className="mb-20">
          <section className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <p className="text-gray-500">
                {product.reviews.length > 0
                  ? `See what our customers say about ${product.name}`
                  : "Be the first to review this product"}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                <ReviewForm productId={product.id} />
              </div>

              <div className="space-y-4">
                <StaggerContainer staggerDelay={0.08} className="space-y-4">
                  {product.reviews.map((review) => (
                    <StaggerItem key={review.id}>
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 transition-all hover:border-green-200 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 ring-2 ring-white shadow-sm">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{review.name}</p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <FadeIn>
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">You May Also Like</h2>
                  <p className="text-gray-500 text-sm mt-1">More products you&apos;ll love</p>
                </div>
                <Link
                  href="/shop/products"
                  className="hidden sm:inline-flex items-center gap-1 text-green-700 font-semibold hover:text-green-800 text-sm"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mobile horizontal scroll */}
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
                  {relatedProducts.map((p) => (
                    <div key={p.id} className="min-w-[260px] w-[260px] snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
