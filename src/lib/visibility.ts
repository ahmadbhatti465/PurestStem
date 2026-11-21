import type { Prisma } from "@/generated/prisma/client";

/**
 * Storefront visibility rules, shared by every public query so drafts and
 * not-yet-due scheduled items never leak and scheduled items go live on time.
 *
 * Products: `isActive` is false only for drafts (or a manual deactivation).
 * A scheduled product is active but hidden until its `scheduledAt` passes.
 */
export function liveProductWhere(now: Date = new Date()): Prisma.ProductWhereInput {
  return {
    isActive: true,
    NOT: [
      { status: "draft" },
      { status: "scheduled", OR: [{ scheduledAt: null }, { scheduledAt: { gt: now } }] },
    ],
  };
}

export function isProductLive(
  product: { isActive: boolean; status: string | null; scheduledAt: Date | string | null },
  now: Date = new Date()
): boolean {
  if (!product.isActive || product.status === "draft") return false;
  if (product.status === "scheduled") {
    return !!product.scheduledAt && new Date(product.scheduledAt) <= now;
  }
  return true;
}

/**
 * Blog posts: published, or scheduled with a due `scheduledAt`. Legacy rows
 * that only set `published: true` (no status) still count as published.
 */
export function livePostWhere(now: Date = new Date()): Prisma.BlogPostWhereInput {
  return {
    OR: [
      { status: "published", OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }] },
      { status: "scheduled", scheduledAt: { lte: now } },
      {
        published: true,
        status: { notIn: ["draft", "scheduled", "published"] },
        OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
      },
    ],
  };
}

export function isPostLive(
  post: { status: string | null; published: boolean; scheduledAt: Date | string | null },
  now: Date = new Date()
): boolean {
  const due = !post.scheduledAt || new Date(post.scheduledAt) <= now;
  if (post.status === "draft") return false;
  if (post.status === "scheduled") return !!post.scheduledAt && due;
  if (post.status === "published") return due;
  return post.published && due;
}

/**
 * Formats a date for an <input type="datetime-local"> in the browser's local
 * time zone. (`toISOString().slice(0, 16)` gives UTC, which shifts the value
 * by the UTC offset every time the form is saved.)
 */
export function toDateTimeLocalValue(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
