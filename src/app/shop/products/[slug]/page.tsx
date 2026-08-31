import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
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
  Check,
  FileText,
  Tag,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { formatPrice, calculateDiscount, getPrimaryImage, slugify } from "@/lib/utils";
import { buildProductSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import { findRedirect } from "@/lib/redirects";
import ProductPurchase from "./product-purchase";
import ProductGallery from "./product-gallery";
import ReviewForm from "./review-form";
import ViewContentTracker from "./view-content-tracker";
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

function parseJsonArray<T = any>(str: string | null | undefined): T[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
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

async function getRelatedProducts(product: any) {
  // If explicitly selected relatedProductIds
  if (product.relatedProductIds) {
    const ids = parseJsonArray<string>(product.relatedProductIds);
    if (ids.length > 0) {
      const explicit = await prisma.product.findMany({
        where: { id: { in: ids }, isActive: true },
        include: { category: true },
      });
      if (explicit.length > 0) return explicit;
    }
  }

  // Fallback to same category products
  return await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isActive: true,
      categoryId: product.categoryId,
    },
    include: { category: true },
    take: 4,
  });
}

async function getRelatedBlogPosts(product: any) {
  if (product.relatedBlogIds) {
    const ids = parseJsonArray<string>(product.relatedBlogIds);
    if (ids.length > 0) {
      return await prisma.blogPost.findMany({
        where: { id: { in: ids }, published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          publishedAt: true,
        },
        take: 3,
      });
    }
  }

  // Fallback to category blog posts
  return await prisma.blogPost.findMany({
    where: {
      categoryId: product.categoryId,
      published: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      publishedAt: true,
    },
    take: 3,
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

  const metaTitle =
    product.seoTitle ||
    `${product.name} | Buy Online in Pakistan | ${product.brand || "PurestStem"}`;

  const metaDescription =
    product.seoDescription ||
    product.shortDescription ||
    (product.description
      ? product.description.replace(/<[^>]+>/g, " ").slice(0, 155).trim()
      : `Buy genuine ${product.name} online in Pakistan. 100% pure herbal formulation with fast cash on delivery delivery.`);

  const canonical =
    product.canonicalUrl || `${SITE_URL}/shop/products/${product.slug}`;

  const primaryImage = getPrimaryImage(product.image, product.images);

  const keywordsList = product.secondaryKeywords
    ? product.secondaryKeywords.split(",").map((s) => s.trim()).filter(Boolean)
    : [
        product.name,
        product.category.name,
        "herbal products Pakistan",
        `${product.category.name.toLowerCase()} Pakistan`,
        "buy online Pakistan",
        "cash on delivery",
      ];

  const ogTitle = product.ogTitle || product.seoTitle || product.name;
  const ogDescription =
    product.ogDescription || product.seoDescription || product.shortDescription || metaDescription;
  const ogImage = product.ogImage || primaryImage || "/pureststem_logo.png";

  const isIndexable = Boolean(
    product.robotsIndex && product.isActive && product.status !== "draft"
  );
  const isFollow = Boolean(product.robotsFollow);

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordsList,
    alternates: {
      canonical,
    },
    robots: {
      index: isIndexable,
      follow: isFollow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "PurestStem",
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.twitterTitle || ogTitle,
      description: product.twitterDescription || ogDescription,
      images: [
        product.twitterImage
          ? product.twitterImage.startsWith("http")
            ? product.twitterImage
            : `${SITE_URL}${product.twitterImage}`
          : ogImage.startsWith("http")
          ? ogImage
          : `${SITE_URL}${ogImage}`,
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = await getProduct(slug);

  // Check 301 redirects if product slug changed
  if (!product) {
    const redirectRecord = await findRedirect(`/shop/products/${slug}`);
    if (redirectRecord) {
      permanentRedirect(redirectRecord.targetPath);
    }
    const legacyRedirect = await findRedirect(`/products/${slug}`);
    if (legacyRedirect) {
      permanentRedirect(legacyRedirect.targetPath);
    }
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);
  const relatedBlogs = await getRelatedBlogPosts(product);
  const discount = calculateDiscount(product.price, product.salePrice);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const imageUrls = parseJsonArray<string>(product.images);
  const primaryImage = getPrimaryImage(product.image, product.images);
  const allImages = primaryImage
    ? imageUrls.includes(primaryImage)
      ? imageUrls
      : [primaryImage, ...imageUrls]
    : imageUrls;

  // Parse structured data items
  const benefitsList = parseJsonArray<string>(product.benefits);
  const featuresList = parseJsonArray<string>(product.features);
  const structuredIngredientsList = parseJsonArray<{ name: string; description?: string }>(
    product.structuredIngredients
  );
  const structuredHowToUseList = parseJsonArray<{ step: number; instruction: string }>(
    product.structuredHowToUse
  );
  const faqsList = parseJsonArray<{ question: string; answer: string }>(product.faqs);

  // Build Structured Data (JSON-LD)
  const productSchema = buildProductSchema(
    {
      name: product.name,
      slug: product.slug,
      description: product.seoDescription || product.shortDescription || product.description,
      shortDescription: product.shortDescription,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      image: primaryImage,
      images: allImages,
      price: product.price,
      salePrice: product.salePrice,
      currency: "PKR",
      stock: product.stock,
      sku: product.sku,
      gtin: product.gtin,
      mpn: product.mpn,
      brand: product.brand || "PurestStem",
      condition: product.condition,
      category: product.category.name,
      reviews: product.reviews,
      updatedAt: product.updatedAt,
    },
    SITE_URL
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/shop/products" },
    {
      label: product.category.name,
      href: `/shop/products?category=${product.category.slug}`,
    },
    { label: product.name },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems, SITE_URL);
  const faqSchema = buildFaqSchema(faqsList);

  const shareUrl = `/shop/products/${product.slug}`;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f9faf5] pb-16">
      <article>
        <Container className="py-6 sm:py-8 pb-24 sm:pb-8">
          <ViewContentTracker product={product} />
          <JsonLd data={productSchema} />
          <JsonLd data={breadcrumbSchema} />
          {faqSchema && <JsonLd data={faqSchema} />}

          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "Products", href: "/shop/products" },
              {
                label: product.category.name,
                href: `/shop/products?category=${product.category.slug}`,
              },
              { label: product.name },
            ]}
          />

          {/* Main Product Hero Section */}
          <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16 mt-6">
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
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href={`/shop/products?category=${product.category.slug}`}
                  className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
                >
                  <Leaf className="w-3.5 h-3.5" />
                  {product.category.name}
                </Link>

                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 rounded-full px-3 py-1.5 text-xs font-bold">
                  {product.brand || "PurestStem"}
                </span>

                {product.featured && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 rounded-full px-3 py-1.5 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured
                  </span>
                )}

                {product.stock > 0 && product.stock <= 5 && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 rounded-full px-3 py-1.5 text-xs font-bold">
                    Low Stock ({product.stock} left)
                  </span>
                )}
              </div>

              {/* Single Product H1 */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Reviews & Verification */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm text-gray-500">
                  {avgRating.toFixed(1)} · {product.reviews.length}{" "}
                  {product.reviews.length === 1 ? "review" : "reviews"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified Pure Botanical
                </span>
              </div>

              {/* Price Row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-green-700">
                  {formatPrice(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.salePrice > 0 && (
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

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-sm text-gray-600 leading-relaxed mb-6 bg-gradient-to-br from-green-50/70 to-white p-4 rounded-2xl border border-green-100">
                  {product.shortDescription}
                </p>
              )}

              {/* Quick Specs Grid */}
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
                    Net Weight / Volume
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <Package className="h-4 w-4 shrink-0 text-green-600" />
                    {product.weight || (product.weightValue ? `${product.weightValue}${product.weightUnit}` : "Standard")}
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
                    Condition
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
                    {product.condition || "New"}
                  </p>
                </div>
              </div>

              <p className="mb-8 text-xs text-gray-400">
                SKU: {product.sku || "N/A"} · Category: {product.category.name}
              </p>

              {/* Purchase Card */}
              <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-green-900/5 sm:p-6">
                <ProductPurchase product={product} />
              </div>

              {/* Trust Row */}
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
                  <Tooltip content="Pay when your order arrives at your door anywhere in Pakistan">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors cursor-help">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5 text-green-700" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Cash on Delivery</span>
                    </div>
                  </Tooltip>
                </StaggerItem>
                <StaggerItem>
                  <Tooltip content="Made with 100% pure herbal botanicals, no harsh sulfates">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors cursor-help">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5 text-green-700" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">100% Botanical</span>
                    </div>
                  </Tooltip>
                </StaggerItem>
              </StaggerContainer>

              {/* Share */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-600">Share this product</span>
                  <ShareButtons url={shareUrl} text={product.name} size="sm" />
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Key Features Badges Strip */}
          {featuresList.length > 0 && (
            <FadeIn className="mb-16">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-center gap-3">
                {featuresList.map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-green-50 text-green-900 border border-green-200 px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    {feature}
                  </span>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Product Benefits Section */}
          {benefitsList.length > 0 && (
            <FadeIn className="mb-16">
              <section className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Key Botanical Benefits
                    </h2>
                    <p className="text-xs text-gray-500">
                      Why PurestStem herbal formulation works for your daily routine
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {benefitsList.map((benefit, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-green-50/50 border border-green-100 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm font-medium text-gray-800 leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          )}

          {/* Full Product Description */}
          {product.description && (
            <FadeIn className="mb-16">
              <section className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <SectionHeader
                  title="Product Overview & Details"
                  subtitle="In-depth information and natural characteristics"
                  className="mb-8"
                />
                <ProductDescription text={product.description} />
              </section>
            </FadeIn>
          )}

          {/* Ingredients & How to Use Details Section */}
          {(structuredIngredientsList.length > 0 || product.ingredients || structuredHowToUseList.length > 0 || product.howToUse) && (
            <FadeIn className="mb-16">
              <section className="max-w-5xl mx-auto">
                <SectionHeader
                  title="Botanical Actives & Application"
                  subtitle="Pure herbal ingredients and simple daily steps"
                  className="mb-8"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ingredients Card */}
                  {(structuredIngredientsList.length > 0 || product.ingredients) && (
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                          <Leaf className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">Ingredients</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Key botanicals &amp; active herbs</p>
                        </div>
                      </div>
                      <ProductIngredients
                        text={product.ingredients}
                        structured={structuredIngredientsList}
                      />
                    </div>
                  )}

                  {/* How to Use Card */}
                  {(structuredHowToUseList.length > 0 || product.howToUse) && (
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">How to Use</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Simple steps for best results</p>
                        </div>
                      </div>
                      <ProductHowToUse
                        text={product.howToUse}
                        structured={structuredHowToUseList}
                      />
                    </div>
                  )}
                </div>
              </section>
            </FadeIn>
          )}

          {/* FAQs Section */}
          {faqsList.length > 0 && (
            <FadeIn className="mb-16">
              <section className="mx-auto max-w-3xl">
                <SectionHeader
                  eyebrow="Questions & Answers"
                  eyebrowIcon={HelpCircle}
                  title="Frequently Asked Questions"
                  subtitle="Everything you need to know about this product"
                  className="mb-8"
                />
                <div className="space-y-3">
                  {faqsList.map((faq, i) => (
                    <Accordion
                      key={i}
                      title={faq.question}
                      icon={<MessageCircle className="h-5 w-5" />}
                    >
                      <p className="text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                    </Accordion>
                  ))}
                </div>
              </section>
            </FadeIn>
          )}

          {/* Customer Reviews Section */}
          <FadeIn className="mb-16">
            <section className="max-w-5xl mx-auto">
              <SectionHeader
                title="Customer Reviews"
                subtitle={
                  product.reviews.length > 0
                    ? `See what customers say about ${product.name}`
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
                        const count = product.reviews.filter((r) => r.rating === star).length;
                        const pct = Math.round((count / product.reviews.length) * 100);
                        return (
                          <div key={star} className="flex items-center gap-3 text-xs text-gray-500">
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
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
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
                                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <FadeIn className="mb-16">
              <section>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
                      Complementary Herbal Products
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Recommended to use together</p>
                  </div>
                  <Link
                    href={`/shop/products?category=${product.category.slug}`}
                    className="hidden sm:inline-flex items-center gap-1 text-green-700 font-semibold hover:text-green-800 text-sm"
                  >
                    View Category
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            </FadeIn>
          )}

          {/* Related Blog Guides Section (Internal Linking) */}
          {relatedBlogs.length > 0 && (
            <FadeIn>
              <section className="max-w-5xl mx-auto pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900">
                      Related Herbal Guides &amp; Articles
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                      Expert herbal wellness insights for healthy living
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-green-700 font-semibold hover:text-green-800 text-xs sm:text-sm"
                  >
                    All Articles
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedBlogs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/blog/${b.slug}`}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                        {b.image ? (
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FileText className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-green-800 line-clamp-2 leading-snug">
                          {b.title}
                        </h3>
                        {b.excerpt && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                            {b.excerpt}
                          </p>
                        )}
                        <span className="text-[11px] font-semibold text-green-700 inline-flex items-center gap-1 mt-auto pt-2">
                          Read Guide →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </FadeIn>
          )}
        </Container>
      </article>
    </main>
  );
}
