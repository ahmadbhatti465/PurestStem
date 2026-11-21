import type { Prisma } from "@/generated/prisma/client";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { slugify } from "@/lib/slugify";
import {
  bool,
  jsonField,
  keywordList,
  optionalDate,
  optionalInt,
  optionalNumber,
  publishStatus,
  safeUrl,
  str,
} from "@/lib/admin-input";

type ExistingProduct = {
  status: string;
  publishedAt: Date | null;
  categoryId: string;
};

type ProductInputResult =
  | { ok: true; data: Prisma.ProductUncheckedCreateInput }
  | { ok: false; error: string };

/** Turns a parsed image list into clean metadata + URL list, dropping unsafe URLs. */
function parseImages(body: Record<string, unknown>) {
  let raw: unknown = body.imageMetadata ?? body.images;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = [];
    }
  }
  const items = Array.isArray(raw) ? raw : [];

  const metadata = items
    .map((item, index) => {
      if (typeof item === "string") {
        const url = safeUrl(item);
        return url ? { url, alt: "", sortOrder: index } : null;
      }
      if (item && typeof item === "object") {
        const rec = item as Record<string, unknown>;
        const url = safeUrl(rec.url);
        if (!url) return null;
        return {
          url,
          alt: str(rec.alt, 300) ?? "",
          title: str(rec.title, 300) ?? "",
          caption: str(rec.caption, 500) ?? "",
          width: typeof rec.width === "number" ? rec.width : undefined,
          height: typeof rec.height === "number" ? rec.height : undefined,
          isDecorative: rec.isDecorative === true,
          sortOrder: typeof rec.sortOrder === "number" ? rec.sortOrder : index,
          size: typeof rec.size === "number" ? rec.size : undefined,
          filename: str(rec.filename, 300) ?? undefined,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const urls = metadata.map((m) => m.url);
  return {
    imageMetadata: metadata.length ? JSON.stringify(metadata) : null,
    images: urls.length ? JSON.stringify(urls) : null,
    primary: safeUrl(body.image) ?? urls[0] ?? null,
  };
}

/**
 * Validates and normalises a product create/update body. Returns a friendly
 * error for anything the admin needs to fix instead of letting Prisma throw.
 */
export function buildProductData(
  body: Record<string, unknown>,
  existing?: ExistingProduct
): ProductInputResult {
  const name = str(body.name, 300);
  if (!name) return { ok: false, error: "Product Name is required." };

  const slug = slugify(str(body.slug) || name);
  if (!slug) return { ok: false, error: "URL Slug is required." };

  const categoryId = str(body.categoryId) ?? existing?.categoryId;
  if (!categoryId) return { ok: false, error: "Category is required." };

  const price = optionalNumber(body.price);
  if (!price.ok || price.value === null || price.value < 0) {
    return { ok: false, error: "Valid non-negative price is required." };
  }

  const salePrice = optionalNumber(body.salePrice);
  if (!salePrice.ok || (salePrice.value !== null && salePrice.value < 0)) {
    return { ok: false, error: "Sale price must be a valid non-negative number." };
  }
  if (salePrice.value !== null && salePrice.value >= price.value) {
    return {
      ok: false,
      error: `Sale price (Rs. ${salePrice.value}) must be less than regular price (Rs. ${price.value}).`,
    };
  }

  const stock = optionalInt(body.stock ?? 0);
  if (!stock.ok) return { ok: false, error: "Stock must be a whole number of 0 or more." };

  const weightValue = optionalNumber(body.weightValue);
  if (!weightValue.ok || (weightValue.value !== null && weightValue.value < 0)) {
    return { ok: false, error: "Weight must be a valid number." };
  }

  const status = publishStatus(body.status) ?? (existing?.status as ReturnType<typeof publishStatus>) ?? "published";

  const scheduled = optionalDate(body.scheduledAt);
  if (!scheduled.ok) return { ok: false, error: "Scheduled date is not a valid date." };
  if (status === "scheduled" && !scheduled.value) {
    return { ok: false, error: "Please choose a date and time to publish this product." };
  }

  const jsonFields = {
    structuredIngredients: jsonField(body.structuredIngredients),
    structuredHowToUse: jsonField(body.structuredHowToUse),
    benefits: jsonField(body.benefits),
    features: jsonField(body.features),
    faqs: jsonField(body.faqs),
    relatedProductIds: jsonField(body.relatedProductIds),
    relatedBlogIds: jsonField(body.relatedBlogIds),
  };
  for (const [key, parsed] of Object.entries(jsonFields)) {
    if (!parsed.ok) return { ok: false, error: `Field "${key}" is not valid JSON.` };
  }
  const json = (key: keyof typeof jsonFields) => {
    const parsed = jsonFields[key];
    return parsed.ok ? parsed.value : null;
  };

  const images = parseImages(body);

  let publishedAt: Date | null = existing?.publishedAt ?? null;
  if (status === "published" && !publishedAt) publishedAt = new Date();
  if (status === "scheduled") publishedAt = scheduled.value;

  const description = str(body.description, 200_000);

  return {
    ok: true,
    data: {
      name,
      slug,
      categoryId,
      description: description ? sanitizeHtml(description) : null,
      shortDescription: str(body.shortDescription, 1000),
      brand: str(body.brand, 120) ?? "PurestStem",
      productType: str(body.productType, 200),
      condition: str(body.condition, 40) ?? "New",
      gtin: str(body.gtin, 50),
      mpn: str(body.mpn, 100),
      unit: str(body.unit, 40) ?? "piece",
      price: price.value,
      salePrice: salePrice.value,
      stock: stock.value ?? 0,
      sku: str(body.sku, 100),
      weight: str(body.weight, 60),
      weightValue: weightValue.value,
      weightUnit: str(body.weightUnit, 20) ?? "ml",
      ingredients: str(body.ingredients, 20_000),
      structuredIngredients: json("structuredIngredients"),
      howToUse: str(body.howToUse, 20_000),
      structuredHowToUse: json("structuredHowToUse"),
      benefits: json("benefits"),
      features: json("features"),
      image: images.primary,
      images: images.images,
      imageMetadata: images.imageMetadata,
      featured: bool(body.featured, false),
      // Only drafts are inactive. Scheduled products are active and become
      // visible once scheduledAt passes (see lib/visibility.ts).
      isActive: status !== "draft",
      status,
      publishedAt,
      scheduledAt: status === "scheduled" ? scheduled.value : null,
      seoTitle: str(body.seoTitle, 300),
      seoDescription: str(body.seoDescription, 1000),
      focusKeyword: str(body.focusKeyword, 200),
      secondaryKeywords: keywordList(body.secondaryKeywords),
      canonicalUrl: safeUrl(body.canonicalUrl),
      robotsIndex: bool(body.robotsIndex, true),
      robotsFollow: bool(body.robotsFollow, true),
      ogTitle: str(body.ogTitle, 300),
      ogDescription: str(body.ogDescription, 1000),
      ogImage: safeUrl(body.ogImage),
      twitterTitle: str(body.twitterTitle, 300),
      twitterDescription: str(body.twitterDescription, 1000),
      twitterImage: safeUrl(body.twitterImage),
      faqs: json("faqs"),
      relatedProductIds: json("relatedProductIds"),
      relatedBlogIds: json("relatedBlogIds"),
    },
  };
}
