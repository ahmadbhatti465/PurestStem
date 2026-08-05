/**
 * Central site configuration.
 * Override the production URL via NEXT_PUBLIC_SITE_URL env variable.
 * All canonical URLs, sitemap entries and structured data must use SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://pureststem.com";

export const SITE_NAME = "PurestStem";
export const SITE_TAGLINE = "Premium Herbal Products in Pakistan – 100% Natural";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
