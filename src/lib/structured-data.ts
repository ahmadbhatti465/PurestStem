import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

export interface SchemaAuthor {
  name: string;
  image?: string | null;
  bio?: string | null;
}

export interface SchemaBlogPost {
  title: string;
  slug: string;
  excerpt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  author: string;
  authorBio?: string | null;
  authorImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  tags?: string | null;
  focusKeyword?: string | null;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SchemaReview {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}

export interface SchemaProduct {
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  image?: string | null;
  images?: string | string[] | null;
  price: number;
  salePrice?: number | null;
  currency?: string;
  stock: number;
  sku?: string | null;
  gtin?: string | null;
  mpn?: string | null;
  brand?: string | null;
  condition?: string | null;
  category?: string | null;
  reviews?: SchemaReview[];
  updatedAt?: Date | string;
}

/**
 * Generate Schema.org BlogPosting JSON-LD.
 * Real database values only; no fake ratings or artificial reviews.
 */
export function buildBlogPostingSchema(post: SchemaBlogPost, siteUrl: string) {
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  const pubDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();
  const modDate = new Date(post.updatedAt).toISOString();

  const authorSchema: Record<string, unknown> = {
    "@type": "Person",
    name: post.author || "PurestStem",
  };
  if (post.authorBio) authorSchema.description = post.authorBio;
  if (post.authorImage) authorSchema.image = absoluteUrl(post.authorImage);

  const images = post.image
    ? [absoluteUrl(post.image)]
    : [`${siteUrl}/hero-section.png`];

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    image: images,
    datePublished: pubDate,
    dateModified: modDate,
    author: authorSchema,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/pureststem_logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    inLanguage: "en-PK",
  };
}

/**
 * Generate Schema.org Product & Offer JSON-LD.
 * Strictly strictly adheres to Google Search Central guidelines:
 * - Real pricing (sale price if active, regular price otherwise)
 * - Actual currency ("PKR")
 * - Real availability mapping (InStock / OutOfStock)
 * - Real itemCondition
 * - Real reviews / aggregateRating ONLY when real customer reviews exist.
 * - Never outputs fake ratings or artificial statistics.
 */
export function buildProductSchema(product: SchemaProduct, siteUrl: string = SITE_URL) {
  const pageUrl = `${siteUrl}/shop/products/${product.slug}`;
  const effectivePrice = product.salePrice && product.salePrice > 0
    ? product.salePrice
    : product.price;

  // Normalize images
  const imageList: string[] = [];
  if (product.image) {
    imageList.push(absoluteUrl(product.image));
  }
  if (product.images) {
    let parsed: string[] = [];
    if (Array.isArray(product.images)) {
      parsed = product.images;
    } else if (typeof product.images === "string") {
      try {
        const raw = JSON.parse(product.images);
        if (Array.isArray(raw)) {
          parsed = raw.map((item) => (typeof item === "string" ? item : item.url)).filter(Boolean);
        }
      } catch {
        // ignore
      }
    }
    for (const url of parsed) {
      const abs = absoluteUrl(url);
      if (!imageList.includes(abs)) {
        imageList.push(abs);
      }
    }
  }

  // Condition mapping
  let conditionUrl = "https://schema.org/NewCondition";
  if (product.condition?.toLowerCase() === "used") {
    conditionUrl = "https://schema.org/UsedCondition";
  } else if (product.condition?.toLowerCase() === "refurbished") {
    conditionUrl = "https://schema.org/RefurbishedCondition";
  }

  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const offerSchema: Record<string, unknown> = {
    "@type": "Offer",
    url: pageUrl,
    priceCurrency: product.currency || "PKR",
    price: effectivePrice,
    availability:
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: conditionUrl,
    priceValidUntil,
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seoDescription || product.shortDescription || product.description || product.name,
    image: imageList.length > 0 ? imageList : [`${siteUrl}/pureststem_logo.png`],
    brand: {
      "@type": "Brand",
      name: product.brand || "PurestStem",
    },
    offers: offerSchema,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    inLanguage: "en-PK",
  };

  if (product.sku) {
    schema.sku = product.sku;
  }
  if (product.gtin) {
    schema.gtin = product.gtin;
  }
  if (product.mpn) {
    schema.mpn = product.mpn;
  }
  if (product.category) {
    schema.category = product.category;
  }

  // Only output genuine aggregateRating if genuine reviews exist
  if (product.reviews && product.reviews.length > 0) {
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / product.reviews.length;

    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1,
    };

    schema.review = product.reviews.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.name,
      },
      datePublished: new Date(r.createdAt).toISOString().split("T")[0],
      reviewBody: r.comment,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  return schema;
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD matching visible breadcrumbs.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[], siteUrl: string = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const element: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (item.href) {
        element.item = item.href.startsWith("http")
          ? item.href
          : `${siteUrl}${item.href.startsWith("/") ? item.href : `/${item.href}`}`;
      }
      return element;
    }),
  };
}

/**
 * Generate Schema.org FAQPage JSON-LD for visible FAQs.
 */
export function buildFaqSchema(faqs: FaqItem[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.trim(),
      },
    })),
  };
}
