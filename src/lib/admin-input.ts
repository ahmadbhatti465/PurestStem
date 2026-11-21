/**
 * Small, dependency-free parsers for admin API request bodies. Each returns a
 * clean value or null, so routes never pass NaN, Invalid Date or non-strings
 * through to Prisma (which would surface as a generic 500).
 */

/** Trimmed string, or null when empty / not a string. */
export function str(value: unknown, maxLength = 10_000): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export function bool(value: unknown, fallback: boolean): boolean {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
}

export type Parsed<T> = { ok: true; value: T } | { ok: false };

/** Optional finite number. Empty values give null; garbage gives { ok: false }. */
export function optionalNumber(value: unknown): Parsed<number | null> {
  if (value === undefined || value === null || value === "") return { ok: true, value: null };
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? { ok: true, value: n } : { ok: false };
}

/** Optional whole number >= 0. */
export function optionalInt(value: unknown): Parsed<number | null> {
  const parsed = optionalNumber(value);
  if (!parsed.ok || parsed.value === null) return parsed;
  return Number.isInteger(parsed.value) && parsed.value >= 0 ? parsed : { ok: false };
}

/** Optional date. Empty gives null; an unparseable value gives { ok: false }. */
export function optionalDate(value: unknown): Parsed<Date | null> {
  if (value === undefined || value === null || value === "") return { ok: true, value: null };
  if (typeof value !== "string" && typeof value !== "number") return { ok: false };
  const d = new Date(value);
  return isNaN(d.getTime()) ? { ok: false } : { ok: true, value: d };
}

/**
 * Serialises an array/object field to a JSON string for storage. Accepts an
 * already-serialised string only if it parses as JSON.
 */
export function jsonField(value: unknown): Parsed<string | null> {
  if (value === undefined || value === null || value === "") return { ok: true, value: null };
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return { ok: true, value };
    } catch {
      return { ok: false };
    }
  }
  if (typeof value === "object") return { ok: true, value: JSON.stringify(value) };
  return { ok: false };
}

/** Comma-separated keywords from an array or string. */
export function keywordList(value: unknown): string | null {
  if (Array.isArray(value)) {
    const items = value.map((v) => str(v, 200)).filter(Boolean);
    return items.length ? items.join(", ") : null;
  }
  return str(value, 2000);
}

/**
 * An image/link URL stored in a structured field (not rich text): must be
 * http(s) or a site-relative path. Anything else is dropped.
 */
export function safeUrl(value: unknown): string | null {
  const s = str(value, 2048);
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  return null;
}

export const PUBLISH_STATUSES = ["published", "draft", "scheduled"] as const;
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export function publishStatus(value: unknown): PublishStatus | null {
  return typeof value === "string" && (PUBLISH_STATUSES as readonly string[]).includes(value)
    ? (value as PublishStatus)
    : null;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
