/**
 * Generate a clean, SEO-friendly slug from text.
 * - Lowercase
 * - Hyphen-separated
 * - No special characters
 * - No duplicate hyphens or slashes
 * - Strips leading/trailing hyphens
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace accented characters
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]+/g, "-")
    // Remove consecutive hyphens
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Validate whether a slug is well-formed for SEO.
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  // Must only contain lowercase alphanumeric characters and single hyphens
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
