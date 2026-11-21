import type { BlogPost, Prisma } from "@/generated/prisma/client";
import { sanitizeHtml } from "@/lib/html-sanitizer";
import { slugify } from "@/lib/slugify";
import {
  bool,
  jsonField,
  keywordList,
  optionalDate,
  optionalInt,
  publishStatus,
  safeUrl,
  str,
} from "@/lib/admin-input";

type BlogInputResult =
  | { ok: true; data: Prisma.BlogPostUncheckedCreateInput }
  | { ok: false; error: string };

/**
 * Validates and normalises a blog post create/update body. On update, any
 * field missing from the body keeps its existing value.
 */
export function buildBlogData(body: Record<string, unknown>, existing?: BlogPost): BlogInputResult {
  const has = (key: string) => body[key] !== undefined;
  /** Parsed value from the body if present, otherwise the existing value. */
  function pick<T>(key: string, parse: (v: unknown) => T, current: T): T {
    return has(key) || !existing ? parse(body[key]) : current;
  }

  const title = pick("title", (v) => str(v, 300), existing?.title ?? null);
  if (!title) return { ok: false, error: "Title is required" };

  const slug = slugify(str(body.slug) || (existing ? existing.slug : title));
  if (!slug) return { ok: false, error: "A valid slug is required" };

  // Legacy clients send only `published`; map that onto a status.
  const status =
    publishStatus(body.status) ??
    (has("published") ? (bool(body.published, false) ? "published" : "draft") : null) ??
    (existing ? publishStatus(existing.status) ?? "published" : "draft");

  const scheduled = optionalDate(body.scheduledAt);
  if (!scheduled.ok) return { ok: false, error: "Scheduled date is not a valid date." };
  if (status === "scheduled" && !scheduled.value) {
    return { ok: false, error: "Please choose a date and time to publish this post." };
  }

  const publishedInput = optionalDate(body.publishedAt);
  if (!publishedInput.ok) return { ok: false, error: "Published date is not a valid date." };

  let publishedAt: Date | null = existing?.publishedAt ?? null;
  if (publishedInput.value) publishedAt = publishedInput.value;
  if (status === "published" && !publishedAt) publishedAt = new Date();
  if (status === "scheduled") publishedAt = scheduled.value;

  const width = optionalInt(body.imageWidth);
  const height = optionalInt(body.imageHeight);
  if (!width.ok || !height.ok) return { ok: false, error: "Image width/height must be whole numbers." };

  const faqs = jsonField(body.faqs);
  const related = jsonField(body.relatedProductIds);
  if (!faqs.ok || !related.ok) return { ok: false, error: "FAQ or related product data is invalid." };

  const content = pick("content", (v) => sanitizeHtml(str(v, 500_000) ?? ""), existing?.content ?? "");

  return {
    ok: true,
    data: {
      title,
      slug,
      content,
      excerpt: pick("excerpt", (v) => str(v, 2000), existing?.excerpt ?? null),
      image: pick("image", safeUrl, existing?.image ?? null),
      imageAlt: pick("imageAlt", (v) => str(v, 300), existing?.imageAlt ?? null),
      imageCaption: pick("imageCaption", (v) => str(v, 500), existing?.imageCaption ?? null),
      imageCredit: pick("imageCredit", (v) => str(v, 300), existing?.imageCredit ?? null),
      imageWidth: has("imageWidth") || !existing ? width.value : existing.imageWidth,
      imageHeight: has("imageHeight") || !existing ? height.value : existing.imageHeight,
      author: pick("author", (v) => str(v, 120) ?? "PurestStem", existing?.author ?? "PurestStem"),
      authorBio: pick("authorBio", (v) => str(v, 2000), existing?.authorBio ?? null),
      authorImage: pick("authorImage", safeUrl, existing?.authorImage ?? null),
      categoryId: pick("categoryId", (v) => str(v), existing?.categoryId ?? null),
      tags: pick("tags", keywordList, existing?.tags ?? null),
      status,
      published: status === "published",
      publishedAt,
      scheduledAt: status === "scheduled" ? scheduled.value : null,
      seoTitle: pick("seoTitle", (v) => str(v, 300), existing?.seoTitle ?? null),
      seoDescription: pick("seoDescription", (v) => str(v, 1000), existing?.seoDescription ?? null),
      focusKeyword: pick("focusKeyword", (v) => str(v, 200), existing?.focusKeyword ?? null),
      secondaryKeywords: pick("secondaryKeywords", keywordList, existing?.secondaryKeywords ?? null),
      canonicalUrl: pick("canonicalUrl", safeUrl, existing?.canonicalUrl ?? null),
      robotsIndex: pick("robotsIndex", (v) => bool(v, true), existing?.robotsIndex ?? true),
      robotsFollow: pick("robotsFollow", (v) => bool(v, true), existing?.robotsFollow ?? true),
      ogTitle: pick("ogTitle", (v) => str(v, 300), existing?.ogTitle ?? null),
      ogDescription: pick("ogDescription", (v) => str(v, 1000), existing?.ogDescription ?? null),
      ogImage: pick("ogImage", safeUrl, existing?.ogImage ?? null),
      twitterTitle: pick("twitterTitle", (v) => str(v, 300), existing?.twitterTitle ?? null),
      twitterDescription: pick("twitterDescription", (v) => str(v, 1000), existing?.twitterDescription ?? null),
      twitterImage: pick("twitterImage", safeUrl, existing?.twitterImage ?? null),
      faqs: has("faqs") || !existing ? faqs.value : existing.faqs,
      relatedProductIds: has("relatedProductIds") || !existing ? related.value : existing.relatedProductIds,
    },
  };
}
