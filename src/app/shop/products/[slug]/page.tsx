import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Banknote, Check, Leaf, RotateCcw, Star, Truck } from "lucide-react";

import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { getProductBySlug } from "@/lib/catalog";
import { formatPrice, calculateDiscount, getPrimaryImage } from "@/lib/utils";
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
import Accordion from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SmartImage } from "@/components/ui/smart-image";
import { Container } from "@/components/layout/container";
import { AnimatedText } from "@/components/motion/animated-text";
import { ShareButtons } from "@/components/share-buttons";
import { liveProductWhere, isProductLive, livePostWhere } from "@/lib/visibility";

// Served from cache; admin edits, orders and reviews refresh it immediately.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: liveProductWhere(),
    select: { slug: true },
  });
  return products.map(({ slug }) => ({ slug }));
}

function parseJsonArray<T = unknown>(str: string | null | undefined): T[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return [];
}

const relatedProductSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  salePrice: true,
  image: true,
  images: true,
  stock: true,
  category: { select: { name: true } },
} as const;

async function getRelatedProducts(product: { id: string; categoryId: string; relatedProductIds: string | null }) {
  const ids = parseJsonArray<string>(product.relatedProductIds);
  if (ids.length > 0) {
    const explicit = await prisma.product.findMany({
      where: { id: { in: ids }, ...liveProductWhere() },
      select: relatedProductSelect,
      take: 4,
    });
    if (explicit.length > 0) return explicit;
  }

  return prisma.product.findMany({
    where: { id: { not: product.id }, ...liveProductWhere(), categoryId: product.categoryId },
    select: relatedProductSelect,
    take: 4,
  });
}

async function getRelatedBlogPosts(product: { categoryId: string; relatedBlogIds: string | null }) {
  const select = { id: true, title: true, slug: true, excerpt: true, image: true } as const;
  const ids = parseJsonArray<string>(product.relatedBlogIds);

  return prisma.blogPost.findMany({
    where:
      ids.length > 0
        ? { id: { in: ids }, ...livePostWhere() }
        : { categoryId: product.categoryId, ...livePostWhere() },
    select,
    take: 3,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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
    product.robotsIndex && isProductLive(product)
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
  const product = await getProductBySlug(slug);

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

  if (!isProductLive(product)) notFound();

  const [relatedProducts, relatedBlogs] = await Promise.all([
    getRelatedProducts(product),
    getRelatedBlogPosts(product),
  ]);

  const discount = calculateDiscount(product.price, product.salePrice);
  const reviewCount = product.reviews.length;
  const avgRating = reviewCount
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  // Guards against non-image links saved in the gallery (e.g. a social profile URL).
  const imageUrls = parseJsonArray<string>(product.images).filter(
    (url) => /blob\.vercel-storage\.com|^\/|\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(url)
  );
  const primaryImage = getPrimaryImage(product.image, product.images);
  const allImages = primaryImage
    ? imageUrls.includes(primaryImage)
      ? imageUrls
      : [primaryImage, ...imageUrls]
    : imageUrls;

  const benefitsList = parseJsonArray<string>(product.benefits);
  const featuresList = parseJsonArray<string>(product.features);
  const structuredIngredientsList = parseJsonArray<{ name: string; description?: string }>(
    product.structuredIngredients
  );
  const structuredHowToUseList = parseJsonArray<{ step: number; instruction: string }>(
    product.structuredHowToUse
  );
  const faqsList = parseJsonArray<{ question: string; answer: string }>(product.faqs);

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
    { label: product.category.name, href: `/shop/products?category=${product.category.slug}` },
    { label: product.name },
  ];

  const faqSchema = buildFaqSchema(faqsList);
  const hasIngredients = structuredIngredientsList.length > 0 || Boolean(product.ingredients);
  const hasHowToUse = structuredHowToUseList.length > 0 || Boolean(product.howToUse);
  const size = product.weight || (product.weightValue ? `${product.weightValue}${product.weightUnit}` : null);

  const sectionTitle = "font-display text-3xl text-green-950";

  return (
    <article className="overflow-x-clip pb-24 sm:pb-16">
      <ViewContentTracker product={product} />
      <JsonLd data={productSchema} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems, SITE_URL)} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <Container className="pt-6 lg:pt-8">
        <Breadcrumb items={breadcrumbItems} className="enter" />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="enter">
            <ProductGallery
              images={allImages}
              productName={product.name}
              discount={discount}
              stock={product.stock}
            />
          </div>

          <div>
            <Link
              href={`/shop/products?category=${product.category.slug}`}
              className="text-sm font-medium text-green-800 hover:underline"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-green-950 lg:text-5xl">
              <AnimatedText text={product.name} />
            </h1>

            {reviewCount > 0 && (
              <a href="#reviews" className="mt-3 flex items-center gap-2 text-sm text-gray-600 hover:text-green-900">
                <StarRating rating={avgRating} size="sm" />
                {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </a>
            )}

            <p className="enter mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1" style={{ "--i": 4 } as CSSProperties}>
              <span className="text-3xl font-semibold text-green-950">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="text-sm font-medium text-green-800">
                    You save {formatPrice(product.price - (product.salePrice ?? product.price))}
                  </span>
                </>
              )}
            </p>

            {product.shortDescription && (
              <p className="enter mt-5 leading-relaxed text-gray-700" style={{ "--i": 5 } as CSSProperties}>{product.shortDescription}</p>
            )}

            <dl className="enter mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ "--i": 6 } as CSSProperties}>
              <div>
                <dt className="text-gray-600">Availability</dt>
                <dd className="font-medium text-gray-900">
                  {product.stock <= 0 ? "Sold out" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
                </dd>
              </div>
              {size && (
                <div>
                  <dt className="text-gray-600">Size</dt>
                  <dd className="font-medium text-gray-900">{size}</dd>
                </div>
              )}
              {product.sku && (
                <div>
                  <dt className="text-gray-600">SKU</dt>
                  <dd className="font-medium text-gray-900">{product.sku}</dd>
                </div>
              )}
            </dl>

            <div className="mt-7">
              <ProductPurchase product={product} />
            </div>

            <ul className="enter mt-7 space-y-3 border-t border-line pt-6 text-sm text-gray-700" style={{ "--i": 8 } as CSSProperties}>
              <li className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-green-800" strokeWidth={1.5} aria-hidden="true" />
                Cash on delivery anywhere in Pakistan
              </li>
              <li className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-800" strokeWidth={1.5} aria-hidden="true" />
                Free shipping on orders over Rs 5,000
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-green-800" strokeWidth={1.5} aria-hidden="true" />
                <Link href="/shop/shipping-returns#returns" className="underline-offset-4 hover:underline">
                  7-day replacement if damaged or defective
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-green-800" strokeWidth={1.5} aria-hidden="true" />
                100% botanical, no harsh sulfates
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 border-t border-line pt-3">
              <span className="text-sm text-gray-600">Share</span>
              <ShareButtons url={`/shop/products/${product.slug}`} text={product.name} />
            </div>
          </div>
        </div>
      </Container>

      <Container className="mt-16 space-y-16 lg:mt-24 lg:space-y-20">
        {(benefitsList.length > 0 || featuresList.length > 0) && (
          <section className="reveal grid gap-6 lg:grid-cols-12">
            <h2 className={`${sectionTitle} lg:col-span-4`}>Why it works</h2>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-8">
              {[...benefitsList, ...featuresList].map((item, i) => (
                <li key={i} className="reveal flex items-start gap-3 leading-relaxed text-gray-700" style={{ "--i": i } as CSSProperties}>
                  <Check className="mt-1 h-4 w-4 shrink-0 text-green-700" strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {product.description && (
          <section className="reveal grid gap-6 border-t border-line pt-12 lg:grid-cols-12">
            <h2 className={`${sectionTitle} lg:col-span-4`}>About this product</h2>
            <div className="lg:col-span-8">
              <ProductDescription text={product.description} />
            </div>
          </section>
        )}

        {(hasIngredients || hasHowToUse) && (
          <section className="reveal grid gap-10 border-t border-line pt-12 md:grid-cols-2 md:gap-12">
            {hasIngredients && (
              <div>
                <h2 className={sectionTitle}>Ingredients</h2>
                <div className="mt-6">
                  <ProductIngredients text={product.ingredients} structured={structuredIngredientsList} />
                </div>
              </div>
            )}
            {hasHowToUse && (
              <div>
                <h2 className={sectionTitle}>How to use</h2>
                <div className="mt-6">
                  <ProductHowToUse text={product.howToUse} structured={structuredHowToUseList} />
                </div>
              </div>
            )}
          </section>
        )}

        {faqsList.length > 0 && (
          <section className="reveal grid gap-6 border-t border-line pt-12 lg:grid-cols-12">
            <h2 className={`${sectionTitle} lg:col-span-4`}>Questions</h2>
            <div className="lg:col-span-8">
              {faqsList.map((faq, i) => (
                <Accordion key={i} title={faq.question}>
                  <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                </Accordion>
              ))}
            </div>
          </section>
        )}

        <section id="reviews" className="grid scroll-mt-28 gap-8 border-t border-line pt-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className={sectionTitle}>Customer reviews</h2>
            {reviewCount > 0 && (
              <>
                <p className="mt-5 font-display text-5xl text-green-950">{avgRating.toFixed(1)}</p>
                <StarRating rating={avgRating} className="mt-1" />
                <p className="mt-1 text-sm text-gray-600">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </p>
                <div className="mt-5 max-w-xs space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = Math.round(
                      (product.reviews.filter((r) => r.rating === star).length / reviewCount) * 100
                    );
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="flex w-6 items-center gap-0.5">
                          {star}
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-green-100">
                          <div className="h-full rounded-full bg-green-800" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="grid gap-8 lg:col-span-8 xl:grid-cols-2">
            <div className="divide-y divide-line">
              {reviewCount === 0 && (
                <p className="text-gray-600">No reviews yet. Be the first to share your experience.</p>
              )}
              {product.reviews.map((review) => (
                <div key={review.id} className="py-5 first:pt-0">
                  <StarRating rating={review.rating} size="sm" />
                  <p className="mt-2 leading-relaxed text-gray-700">{review.comment}</p>
                  <p className="mt-2 text-sm font-medium text-green-950">
                    {review.name}
                    {review.verified && <span className="ml-2 text-xs font-normal text-green-800">Verified buyer</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="surface h-fit p-6">
              <h3 className="mb-4 font-display text-xl text-green-950">Write a review</h3>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="border-t border-line pt-12">
            <h2 className={sectionTitle}>Goes well with</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {relatedBlogs.length > 0 && (
          <section className="border-t border-line pt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className={sectionTitle}>Related guides</h2>
              <Link href="/blog" className="link-arrow">
                All articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {relatedBlogs.map((b) => (
                <Link key={b.id} href={`/blog/${b.slug}`} className="group block">
                  <div className="img-zoom relative aspect-[3/2] overflow-hidden rounded-2xl bg-green-200">
                    <SmartImage src={b.image} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <h3 className="mt-3 font-display text-lg leading-snug text-green-950 group-hover:text-green-800">
                    {b.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
