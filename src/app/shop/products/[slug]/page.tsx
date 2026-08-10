import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Shield,
  Truck,
  Leaf,
  ChevronRight,
  Lock,
  RotateCcw,
  Package,
  Sparkles,
  Heart,
  BadgeCheck,
  Banknote,
  ShieldCheck,
  HelpCircle,
  MessageCircle,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";
import ProductPurchase from "./product-purchase";
import ProductGallery from "./product-gallery";
import ReviewForm from "./review-form";
import { ProductIngredients, ProductHowToUse, ProductDescription } from "./product-detail-content";
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";
import StarRating from "@/components/ui/star-rating";
import Tooltip from "@/components/ui/tooltip";
import Accordion from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionHeader } from "@/components/ui/section-header";
import { Container } from "@/components/layout/container";
import { ShareButtons } from "@/components/share-buttons";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

const PRICE_VALID_UNTIL = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

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
      canonical: `${SITE_URL}/shop/products/${product.slug}`,
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
    image: allImages.map((url) => (url.startsWith("http") ? url : `${SITE_URL}${url}`)),
    description: product.description || undefined,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "PurestStem",
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/products/${product.slug}`,
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

  const shareUrl = `/shop/products/${product.slug}`;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f9faf5] pb-16">
      <Container className="py-6 sm:py-8 pb-24 sm:pb-8">
        <JsonLd data={structuredData} />

        <Breadcrumb
          items={[
            { label: "Products", href: "/shop/products" },
            { label: product.name },
          ]}
        />

        {/*  Main Product Section  */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-20 mt-6">
          <FadeIn className="lg:self-start">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -left-8 h-56 w-56 rounded-full bg-green-200/50 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -right-8 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-10 top-1/3 h-24 w-24 rounded-full bg-emerald-100 blur-2xl"
              />
              <div className="relative">
                <ProductGallery
                  images={allImages}
                  productName={product.name}
                  discount={discount}
                  stock={product.stock}
                />
              </div>
            </div>
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

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <StarRating rating={avgRating} size="md" />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} · {product.reviews.length}{" "}
                {product.reviews.length === 1 ? "review" : "reviews"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified Natural
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-green-700">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">
                    You save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
              <span className="text-xs text-gray-400">Tax inclusive</span>
            </div>

            {product.description && (
              <div className="relative mb-8 rounded-2xl bg-gradient-to-br from-green-50 via-white to-white border border-green-100 p-5 sm:p-6">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-green-600"
                />
                <div className="pl-4">
                  <ProductDescription text={product.description} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Availability
                </p>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      product.stock > 0 ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Net Weight
                </p>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  <Package className="h-4 w-4 shrink-0 text-green-600" />
                  {product.weight || "Standard"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Delivery
                </p>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  <Truck className="h-4 w-4 shrink-0 text-green-600" />
                  Free over ₨ 5,000
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Returns
                </p>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  <RotateCcw className="h-4 w-4 shrink-0 text-green-600" />
                  7-Day Guarantee
                </p>
              </div>
            </div>

            <p className="mb-8 text-xs text-gray-400">
              SKU: {product.sku || "N/A"} · Category: {product.category.name}
            </p>

            <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-green-900/5 sm:p-6">
              <ProductPurchase product={product} />
            </div>

            {/*  Trust row with tooltips  */}
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

            {/*  Share  */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600">Share this product</span>
                <ShareButtons url={shareUrl} text={product.name} size="sm" />
              </div>
            </div>
          </FadeIn>
        </section>

        {/*  PurestStem Promise band  */}
        <FadeIn className="mb-20">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-green-700 to-emerald-600 p-6 text-white shadow-lg sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "26px 26px",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            />
            <div className="relative grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
              {[
                {
                  icon: Truck,
                  title: "Nationwide Delivery",
                  text: "Fast, tracked shipping across Pakistan",
                },
                {
                  icon: Banknote,
                  title: "Cash on Delivery",
                  text: "Pay when your order arrives at your door",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Checkout",
                  text: "Encrypted & protected payments",
                },
                {
                  icon: Leaf,
                  title: "100% Natural",
                  text: "No sulfates, parabens or harsh chemicals",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-green-100/80 sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/*  Product Details Section  */}
        <FadeIn className="mb-20">
          <section className="max-w-5xl mx-auto">
            <SectionHeader
              title="Product Details"
              subtitle="Everything you need to know about this herbal product"
              className="mb-10"
            />

            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {product.ingredients && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <Leaf className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">Ingredients</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Key botanicals &amp; actives</p>
                    </div>
                  </div>
                  <ProductIngredients text={product.ingredients} />
                </div>
              )}

              {product.howToUse && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">How to Use</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Simple steps for best results</p>
                    </div>
                  </div>
                  <ProductHowToUse text={product.howToUse} />
                </div>
              )}
            </div>

            {/*  Mobile accordions  */}
            <div className="md:hidden space-y-3">
              {product.ingredients && (
                <Accordion title="Ingredients" icon={<Leaf className="w-5 h-5" />}>
                  <ProductIngredients text={product.ingredients} />
                </Accordion>
              )}
              {product.howToUse && (
                <Accordion title="How to Use" icon={<Sparkles className="w-5 h-5" />}>
                  <ProductHowToUse text={product.howToUse} />
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

        {/*  FAQ Section  */}
        <FadeIn className="mb-20">
          <section className="mx-auto max-w-3xl">
            <SectionHeader
              eyebrow="Good to Know"
              eyebrowIcon={HelpCircle}
              title="Frequently Asked Questions"
              subtitle="Everything you need to know before you order"
              className="mb-10"
            />
            <div className="space-y-3">
              {[
                {
                  q: "How long does delivery take?",
                  a: "We dispatch within 24 hours and deliver across Pakistan in 2 to 4 working days through our courier partners. Delivery is free on orders over ₨ 5,000.",
                },
                {
                  q: "Can I pay cash on delivery?",
                  a: "Yes. Cash on Delivery (COD) is available nationwide — you only pay when your order reaches your doorstep.",
                },
                {
                  q: "Is this product 100% natural?",
                  a: "Every PurestStem product is formulated with genuine herbal ingredients, free from sulfates, parabens and harsh chemicals.",
                },
                {
                  q: "What is your return policy?",
                  a: "We offer a 7-day hassle-free return policy. If you're not fully satisfied, contact our support team within 7 days of delivery.",
                },
              ].map((faq) => (
                <Accordion
                  key={faq.q}
                  title={faq.q}
                  icon={<MessageCircle className="h-5 w-5" />}
                >
                  <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </Accordion>
              ))}
            </div>
          </section>
        </FadeIn>

        {/*  Reviews Section  */}
        <FadeIn className="mb-20">
          <section className="max-w-5xl mx-auto">
            <SectionHeader
              title="Customer Reviews"
              subtitle={
                product.reviews.length > 0
                  ? `See what our customers say about ${product.name}`
                  : "Be the first to review this product"
              }
              className="mb-10"
            />

            {product.reviews.length > 0 && (
              <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
                  <div className="shrink-0 text-center sm:text-left">
                    <p className="text-5xl font-extrabold tracking-tight text-gray-900">
                      {avgRating.toFixed(1)}
                    </p>
                    <div className="mt-2 flex justify-center sm:justify-start">
                      <StarRating rating={avgRating} size="md" />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      {product.reviews.length} review
                      {product.reviews.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.reviews.filter(
                        (r) => r.rating === star
                      ).length;
                      const pct = Math.round(
                        (count / product.reviews.length) * 100
                      );
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-3 text-xs text-gray-500"
                        >
                          <span className="w-3 font-semibold">{star}</span>
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-green-600"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
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
                              <p className="mt-0.5 text-[11px] text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
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

        {/*  Related Products  */}
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

              {/*  Mobile horizontal scroll  */}
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
                  {relatedProducts.map((p) => (
                    <div key={p.id} className="min-w-[260px] w-[260px] snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>

              {/*  Desktop grid  */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </Container>
    </div>
  );
}
