import { revalidatePath, revalidateTag } from "next/cache";

export const CATALOG_TAG = "catalog";
export const BLOG_TAG = "blog";

/** How long a storefront page may be served from cache, in seconds. */
export const STOREFRONT_REVALIDATE_SECONDS = 300;

/**
 * Call after any write the storefront displays (products, categories, blog
 * posts, reviews, stock) so the change is live on the next page view. A failed
 * refresh must never fail the write that triggered it.
 */
export function refreshStorefront() {
  try {
    revalidateTag(CATALOG_TAG, { expire: 0 });
    revalidateTag(BLOG_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Failed to refresh storefront cache:", error);
  }
}
