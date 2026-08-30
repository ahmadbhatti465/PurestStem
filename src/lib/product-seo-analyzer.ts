/**
 * PurestStem Product Technical SEO & Content Health Analyzer.
 * Adheres strictly to Google Search Guidelines and eCommerce technical SEO best practices.
 * Evaluates technical structure, product data completeness, schema readiness,
 * image SEO accessibility, natural keyword placement, and internal linking.
 *
 * NOTE: This tool evaluates technical completeness and SEO compliance;
 * it does NOT guarantee Google #1 ranking.
 */

export interface ProductSeoCheckItem {
  id: string;
  category: "technical" | "content" | "keywords" | "images" | "data" | "schema" | "links";
  status: "pass" | "warning" | "fail";
  title: string;
  message: string;
}

export interface ProductImageMeta {
  url: string;
  alt?: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
  isDecorative?: boolean;
  sortOrder?: number;
  size?: number;
}

export interface ProductSeoInputData {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId?: string;
  categoryName?: string;
  price: number | string;
  salePrice?: number | string | null;
  stock: number | string;
  sku?: string;
  brand?: string;
  productType?: string;
  condition?: string;
  gtin?: string;
  mpn?: string;
  weight?: string;
  weightValue?: number | string;
  weightUnit?: string;
  benefits?: string[] | string;
  features?: string[] | string;
  structuredIngredients?: Array<{ name: string; description?: string }> | string;
  structuredHowToUse?: Array<{ step: number; instruction: string }> | string;
  images: string[] | ProductImageMeta[];
  primaryImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[] | string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  faqs?: Array<{ question: string; answer: string }> | string;
  relatedProductIds?: string[] | string;
  relatedBlogIds?: string[] | string;
  status?: string;
}

export interface ProductSeoAnalysisResult {
  healthScore: number; // 0 - 100
  wordCount: number;
  headingCounts: {
    h1: number;
    h2: number;
    h3: number;
  };
  imageCount: number;
  missingAltCount: number;
  titleLength: number;
  descLength: number;
  keywordPlacements: {
    inName: boolean;
    inSeoTitle: boolean;
    inMetaDesc: boolean;
    inSlug: boolean;
    inDescription: boolean;
    inShortDesc: boolean;
    inImageAlt: boolean;
    bodyCount: number;
  };
  checks: ProductSeoCheckItem[];
  pillarScores: {
    technical: number;
    content: number;
    keywords: number;
    images: number;
    data: number;
    schema: number;
    links: number;
  };
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeyword(kw: string): string {
  return kw.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

export function analyzeProductSeo(data: ProductSeoInputData): ProductSeoAnalysisResult {
  const checks: ProductSeoCheckItem[] = [];

  const plainDesc = stripHtml(data.description || "");
  const words = plainDesc ? plainDesc.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const rawDesc = data.description || "";
  const h1Matches = rawDesc.match(/<h1\b[^>]*>/gi) || [];
  const h2Matches = rawDesc.match(/<h2\b[^>]*>/gi) || [];
  const h3Matches = rawDesc.match(/<h3\b[^>]*>/gi) || [];

  const headingCounts = {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length,
  };

  // Image normalize
  let imagesMeta: ProductImageMeta[] = [];
  if (Array.isArray(data.images)) {
    imagesMeta = data.images.map((img) =>
      typeof img === "string" ? { url: img, alt: "" } : img
    );
  }

  let missingAltCount = 0;
  for (const img of imagesMeta) {
    if (img.url && !img.isDecorative && (!img.alt || !img.alt.trim())) {
      missingAltCount++;
    }
  }

  const primaryImg =
    data.primaryImage || (imagesMeta.length > 0 ? imagesMeta[0].url : "");

  // Keyword normalize
  const focusKw = normalizeKeyword(data.focusKeyword || "");
  const kwTokens = focusKw ? focusKw.split(/\s+/).filter(Boolean) : [];

  const productNameLower = (data.name || "").toLowerCase();
  const seoTitleLower = (data.seoTitle || "").toLowerCase();
  const seoDescLower = (data.seoDescription || "").toLowerCase();
  const slugLower = (data.slug || "").toLowerCase();
  const shortDescLower = (data.shortDescription || "").toLowerCase();
  const plainDescLower = plainDesc.toLowerCase();

  const kwInName = focusKw ? productNameLower.includes(focusKw) : false;
  const kwInSeoTitle = focusKw ? seoTitleLower.includes(focusKw) : false;
  const kwInMetaDesc = focusKw ? seoDescLower.includes(focusKw) : false;
  const kwInSlug = focusKw ? slugLower.includes(slugLower.replace(/\s+/g, "-")) && kwTokens.some((t) => slugLower.includes(t)) : false;
  const kwInShortDesc = focusKw ? shortDescLower.includes(focusKw) : false;
  const kwInDesc = focusKw ? plainDescLower.includes(focusKw) : false;

  let kwInImageAlt = false;
  for (const img of imagesMeta) {
    if (img.alt && normalizeKeyword(img.alt).includes(focusKw)) {
      kwInImageAlt = true;
      break;
    }
  }

  let kwBodyCount = 0;
  if (focusKw && plainDescLower) {
    const escapedKw = focusKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = plainDescLower.match(new RegExp(`\\b${escapedKw}\\b`, "g"));
    kwBodyCount = matches ? matches.length : 0;
  }

  const activeTitle = data.seoTitle || data.name || "";
  const activeDesc = data.seoDescription || data.shortDescription || "";
  const titleLength = activeTitle.length;
  const descLength = activeDesc.length;

  // 1. Technical SEO Checks
  if (!data.slug || !data.slug.trim()) {
    checks.push({
      id: "tech-slug",
      category: "technical",
      status: "fail",
      title: "URL Slug Missing",
      message: "A clean, lowercase, hyphen-separated URL slug is required.",
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    checks.push({
      id: "tech-slug",
      category: "technical",
      status: "warning",
      title: "URL Slug Formatting",
      message: "Slug should only contain lowercase alphanumeric characters and single hyphens.",
    });
  } else {
    checks.push({
      id: "tech-slug",
      category: "technical",
      status: "pass",
      title: "Clean URL Slug",
      message: `/shop/products/${data.slug}`,
    });
  }

  if (data.robotsIndex === false) {
    checks.push({
      id: "tech-robots",
      category: "technical",
      status: "warning",
      title: "Robots Set to Noindex",
      message: "Search engines are instructed not to index this product page.",
    });
  } else {
    checks.push({
      id: "tech-robots",
      category: "technical",
      status: "pass",
      title: "Robots Indexing Enabled",
      message: "Page is configured as index, follow for search crawlers.",
    });
  }

  if (data.canonicalUrl) {
    if (/^https?:\/\//i.test(data.canonicalUrl) && !data.canonicalUrl.includes("localhost")) {
      checks.push({
        id: "tech-canonical",
        category: "technical",
        status: "pass",
        title: "Canonical URL Configured",
        message: data.canonicalUrl,
      });
    } else {
      checks.push({
        id: "tech-canonical",
        category: "technical",
        status: "warning",
        title: "Custom Canonical URL Caution",
        message: "Canonical URL should be an absolute production URL (never localhost).",
      });
    }
  } else {
    checks.push({
      id: "tech-canonical",
      category: "technical",
      status: "pass",
      title: "Self-Referencing Canonical",
      message: "Defaults to standard product canonical URL.",
    });
  }

  // 2. Content SEO Checks
  if (!data.name || !data.name.trim()) {
    checks.push({
      id: "content-name",
      category: "content",
      status: "fail",
      title: "Product Name Missing",
      message: "Product name serves as the primary H1 heading and is required.",
    });
  } else if (data.name.length < 5) {
    checks.push({
      id: "content-name",
      category: "content",
      status: "warning",
      title: "Product Name Very Short",
      message: "Consider a descriptive name specifying product type and herbal benefits.",
    });
  } else {
    checks.push({
      id: "content-name",
      category: "content",
      status: "pass",
      title: "Descriptive Product Name",
      message: `"${data.name}" (${data.name.length} characters)`,
    });
  }

  if (headingCounts.h1 > 0) {
    checks.push({
      id: "content-h1",
      category: "content",
      status: "warning",
      title: "Extra H1 Tag in Description",
      message: "Public page already has H1 for Product Name. Use H2/H3 for description sections.",
    });
  } else {
    checks.push({
      id: "content-h1",
      category: "content",
      status: "pass",
      title: "Heading Hierarchy",
      message: "No competing H1 tags in content; product title is the single H1.",
    });
  }

  if (wordCount === 0) {
    checks.push({
      id: "content-desc",
      category: "content",
      status: "fail",
      title: "Product Description Missing",
      message: "Add helpful product details, herbal overview, and usage guidance.",
    });
  } else if (wordCount < 40) {
    checks.push({
      id: "content-desc",
      category: "content",
      status: "warning",
      title: "Description Is Brief",
      message: `Current description is ${wordCount} words. Aim for 80+ words to answer customer questions.`,
    });
  } else {
    checks.push({
      id: "content-desc",
      category: "content",
      status: "pass",
      title: "Comprehensive Description",
      message: `${wordCount} words of rich product content.`,
    });
  }

  if (data.shortDescription && data.shortDescription.trim().length > 10) {
    checks.push({
      id: "content-short-desc",
      category: "content",
      status: "pass",
      title: "Short Description Added",
      message: "Ready for product cards, SERP snippets, and social share previews.",
    });
  } else {
    checks.push({
      id: "content-short-desc",
      category: "content",
      status: "warning",
      title: "Short Description Empty",
      message: "A concise 1-2 sentence overview helps shoppers and social share snippets.",
    });
  }

  // 3. Keywords & Meta Checks
  if (!focusKw) {
    checks.push({
      id: "kw-focus",
      category: "keywords",
      status: "warning",
      title: "Focus Keyword Not Set",
      message: "Define a primary focus keyword to analyze natural content alignment.",
    });
  } else {
    checks.push({
      id: "kw-focus",
      category: "keywords",
      status: "pass",
      title: "Focus Keyword Defined",
      message: `"${data.focusKeyword}"`,
    });

    if (kwInName || kwInSeoTitle) {
      checks.push({
        id: "kw-title",
        category: "keywords",
        status: "pass",
        title: "Keyword in Title",
        message: "Focus keyword appears naturally in product or SEO title.",
      });
    } else {
      checks.push({
        id: "kw-title",
        category: "keywords",
        status: "warning",
        title: "Keyword Missing from Title",
        message: `Consider incorporating "${data.focusKeyword}" naturally into the SEO title.`,
      });
    }

    if (kwInMetaDesc) {
      checks.push({
        id: "kw-meta",
        category: "keywords",
        status: "pass",
        title: "Keyword in Meta Description",
        message: "Focus keyword appears in meta description.",
      });
    } else {
      checks.push({
        id: "kw-meta",
        category: "keywords",
        status: "warning",
        title: "Keyword Missing from Meta Description",
        message: `Consider including "${data.focusKeyword}" naturally in the meta description.`,
      });
    }
  }

  // SEO Title Length
  if (!titleLength) {
    checks.push({
      id: "meta-title",
      category: "keywords",
      status: "warning",
      title: "SEO Title Empty",
      message: "Will fallback to Product Name. Consider adding a tailored SEO Title.",
    });
  } else if (titleLength < 25) {
    checks.push({
      id: "meta-title",
      category: "keywords",
      status: "warning",
      title: "SEO Title Short",
      message: `Current: ${titleLength} chars. Recommended: 35-65 characters for search results.`,
    });
  } else if (titleLength > 70) {
    checks.push({
      id: "meta-title",
      category: "keywords",
      status: "warning",
      title: "SEO Title May Truncate",
      message: `Current: ${titleLength} chars. Search engines may truncate titles over 65-70 chars.`,
    });
  } else {
    checks.push({
      id: "meta-title",
      category: "keywords",
      status: "pass",
      title: "Optimal SEO Title Length",
      message: `${titleLength} characters (ideal 35-65 range).`,
    });
  }

  // Meta Description Length
  if (!descLength) {
    checks.push({
      id: "meta-desc",
      category: "keywords",
      status: "warning",
      title: "Meta Description Empty",
      message: "Will fallback to description excerpt. Add a compelling 120-160 char meta description.",
    });
  } else if (descLength < 50) {
    checks.push({
      id: "meta-desc",
      category: "keywords",
      status: "warning",
      title: "Meta Description Short",
      message: `Current: ${descLength} chars. Recommended: 120-160 characters.`,
    });
  } else if (descLength > 165) {
    checks.push({
      id: "meta-desc",
      category: "keywords",
      status: "warning",
      title: "Meta Description May Truncate",
      message: `Current: ${descLength} chars. Search engines may truncate beyond 160 chars.`,
    });
  } else {
    checks.push({
      id: "meta-desc",
      category: "keywords",
      status: "pass",
      title: "Optimal Meta Description Length",
      message: `${descLength} characters (ideal 120-160 range).`,
    });
  }

  // 4. Image SEO Checks
  if (!primaryImg) {
    checks.push({
      id: "img-primary",
      category: "images",
      status: "fail",
      title: "Primary Product Image Missing",
      message: "At least one high-quality product image is essential for shoppers and Google Shopping.",
    });
  } else {
    checks.push({
      id: "img-primary",
      category: "images",
      status: "pass",
      title: "Primary Product Image Uploaded",
      message: "Hero product image is present.",
    });
  }

  if (missingAltCount > 0) {
    checks.push({
      id: "img-alt",
      category: "images",
      status: "fail",
      title: `${missingAltCount} Image(s) Missing Alt Text`,
      message: "Descriptive alt text is required for image search visibility and accessibility.",
    });
  } else if (imagesMeta.length > 0) {
    checks.push({
      id: "img-alt",
      category: "images",
      status: "pass",
      title: "All Images Have Alt Text",
      message: "Every product image includes descriptive alt text or is flagged decorative.",
    });
  }

  if (imagesMeta.length >= 2) {
    checks.push({
      id: "img-gallery",
      category: "images",
      status: "pass",
      title: "Multiple Product Angles",
      message: `${imagesMeta.length} product images available for customer inspection.`,
    });
  } else {
    checks.push({
      id: "img-gallery",
      category: "images",
      status: "warning",
      title: "Single Image Only",
      message: "Adding secondary packaging/ingredient detail images improves buyer confidence.",
    });
  }

  // 5. Product Data Completeness Checks
  const numPrice = typeof data.price === "string" ? parseFloat(data.price) : data.price;
  const numSalePrice = data.salePrice !== undefined && data.salePrice !== null && data.salePrice !== "" ? (typeof data.salePrice === "string" ? parseFloat(data.salePrice) : data.salePrice) : null;
  const numStock = typeof data.stock === "string" ? parseInt(data.stock, 10) : data.stock;

  if (isNaN(numPrice) || numPrice < 0) {
    checks.push({
      id: "data-price",
      category: "data",
      status: "fail",
      title: "Invalid Product Price",
      message: "Price must be a valid non-negative number.",
    });
  } else {
    checks.push({
      id: "data-price",
      category: "data",
      status: "pass",
      title: "Product Price Configured",
      message: `Rs. ${numPrice.toLocaleString()}`,
    });
  }

  if (numSalePrice !== null && !isNaN(numSalePrice)) {
    if (numSalePrice >= numPrice) {
      checks.push({
        id: "data-saleprice",
        category: "data",
        status: "fail",
        title: "Invalid Sale Price",
        message: `Sale Price (Rs. ${numSalePrice}) must be less than regular Price (Rs. ${numPrice}).`,
      });
    } else {
      checks.push({
        id: "data-saleprice",
        category: "data",
        status: "pass",
        title: "Discount Price Configured",
        message: `Rs. ${numSalePrice.toLocaleString()} (Regular: Rs. ${numPrice.toLocaleString()})`,
      });
    }
  }

  if (isNaN(numStock) || numStock < 0) {
    checks.push({
      id: "data-stock",
      category: "data",
      status: "fail",
      title: "Invalid Stock Quantity",
      message: "Stock quantity must be zero or positive integer.",
    });
  } else {
    checks.push({
      id: "data-stock",
      category: "data",
      status: "pass",
      title: "Stock & Availability",
      message: numStock > 0 ? `${numStock} units in stock (InStock schema)` : "0 units (OutOfStock schema)",
    });
  }

  if (!data.categoryId) {
    checks.push({
      id: "data-category",
      category: "data",
      status: "fail",
      title: "Product Category Missing",
      message: "Every product must belong to a category for navigation and breadcrumbs.",
    });
  } else {
    checks.push({
      id: "data-category",
      category: "data",
      status: "pass",
      title: "Category Assigned",
      message: data.categoryName || "Category linked",
    });
  }

  if (data.sku && data.sku.trim()) {
    checks.push({
      id: "data-sku",
      category: "data",
      status: "pass",
      title: "SKU Identifier Added",
      message: `SKU: ${data.sku}`,
    });
  } else {
    checks.push({
      id: "data-sku",
      category: "data",
      status: "warning",
      title: "SKU Not Specified",
      message: "Adding a SKU helps inventory management and Merchant Center indexing.",
    });
  }

  // 6. Structured Schema & Rich Content
  checks.push({
    id: "schema-product",
    category: "schema",
    status: data.name && !isNaN(numPrice) ? "pass" : "fail",
    title: "Product & Offer Schema.org",
    message: "Generates valid Schema.org Product and Offer JSON-LD with real store values.",
  });

  checks.push({
    id: "schema-breadcrumb",
    category: "schema",
    status: data.categoryId ? "pass" : "warning",
    title: "BreadcrumbList Schema.org",
    message: "Structured breadcrumb hierarchy (Home > Products > Category > Product).",
  });

  const parsedFaqs = Array.isArray(data.faqs)
    ? data.faqs
    : typeof data.faqs === "string"
    ? (() => {
        try {
          return JSON.parse(data.faqs);
        } catch {
          return [];
        }
      })()
    : [];

  if (parsedFaqs.length > 0) {
    checks.push({
      id: "schema-faq",
      category: "schema",
      status: "pass",
      title: `${parsedFaqs.length} Product FAQ(s) Configured`,
      message: "Generates visible FAQ accordions and optional FAQPage structured data.",
    });
  }

  // 7. Internal Linking Checks
  const relatedProdCount = Array.isArray(data.relatedProductIds)
    ? data.relatedProductIds.length
    : typeof data.relatedProductIds === "string"
    ? data.relatedProductIds.split(",").filter(Boolean).length
    : 0;

  const relatedBlogCount = Array.isArray(data.relatedBlogIds)
    ? data.relatedBlogIds.length
    : typeof data.relatedBlogIds === "string"
    ? data.relatedBlogIds.split(",").filter(Boolean).length
    : 0;

  if (relatedProdCount > 0) {
    checks.push({
      id: "links-products",
      category: "links",
      status: "pass",
      title: `${relatedProdCount} Related Product(s) Linked`,
      message: "Crawlable internal links help users and search bots discover complementary items.",
    });
  } else {
    checks.push({
      id: "links-products",
      category: "links",
      status: "warning",
      title: "No Related Products Selected",
      message: "Select 2-4 related products to encourage cross-selling and internal link equity.",
    });
  }

  if (relatedBlogCount > 0) {
    checks.push({
      id: "links-blogs",
      category: "links",
      status: "pass",
      title: `${relatedBlogCount} Related Blog Article(s) Linked`,
      message: "Internal linking between herbal guides and products strengthens topical authority.",
    });
  }

  // Calculate Pillar Scores & Overall Health Score
  const categoriesList: Array<ProductSeoCheckItem["category"]> = [
    "technical",
    "content",
    "keywords",
    "images",
    "data",
    "schema",
    "links",
  ];

  const pillarScores: Record<string, number> = {};

  for (const cat of categoriesList) {
    const catChecks = checks.filter((c) => c.category === cat);
    if (catChecks.length === 0) {
      pillarScores[cat] = 100;
      continue;
    }
    const passes = catChecks.filter((c) => c.status === "pass").length;
    const warnings = catChecks.filter((c) => c.status === "warning").length;
    const fails = catChecks.filter((c) => c.status === "fail").length;

    const score = Math.round(
      ((passes * 1 + warnings * 0.5) / (passes + warnings + fails)) * 100
    );
    pillarScores[cat] = Math.max(0, Math.min(100, score));
  }

  // Weighted overall health score
  const healthScore = Math.round(
    pillarScores.data * 0.25 +
      pillarScores.content * 0.2 +
      pillarScores.technical * 0.15 +
      pillarScores.images * 0.15 +
      pillarScores.keywords * 0.1 +
      pillarScores.schema * 0.1 +
      pillarScores.links * 0.05
  );

  return {
    healthScore: Math.max(0, Math.min(100, healthScore)),
    wordCount,
    headingCounts,
    imageCount: imagesMeta.length,
    missingAltCount,
    titleLength,
    descLength,
    keywordPlacements: {
      inName: kwInName,
      inSeoTitle: kwInSeoTitle,
      inMetaDesc: kwInMetaDesc,
      inSlug: kwInSlug,
      inDescription: kwInDesc,
      inShortDesc: kwInShortDesc,
      inImageAlt: kwInImageAlt,
      bodyCount: kwBodyCount,
    },
    checks,
    pillarScores: {
      technical: pillarScores.technical || 0,
      content: pillarScores.content || 0,
      keywords: pillarScores.keywords || 0,
      images: pillarScores.images || 0,
      data: pillarScores.data || 0,
      schema: pillarScores.schema || 0,
      links: pillarScores.links || 0,
    },
  };
}
