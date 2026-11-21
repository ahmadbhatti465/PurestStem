/**
 * HTML sanitizer for rich text (blog content, product descriptions).
 *
 * Uses a real HTML parser with a strict allowlist: anything not listed below
 * (tags, attributes, URL schemes) is removed. Runs on the server (API writes and
 * storefront rendering) and in the browser (admin editors).
 */
import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "h2", "h3", "h4", "p", "strong", "b", "em", "i", "u", "s", "strike", "del",
  "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td", "hr", "pre", "code", "span", "div", "br",
];

const ALLOWED_ATTRIBUTES: sanitize.IOptions["allowedAttributes"] = {
  a: ["href", "title", "target", "rel", "class", "id"],
  img: ["src", "alt", "title", "width", "height", "loading", "class", "data-credit"],
  figure: ["class"],
  figcaption: ["class"],
  table: ["class"],
  th: ["colspan", "rowspan", "scope", "class"],
  td: ["colspan", "rowspan", "class"],
  span: ["class"],
  div: ["class"],
  pre: ["class"],
  code: ["class"],
  h2: ["id", "class"],
  h3: ["id", "class"],
  h4: ["id", "class"],
  p: ["class"],
  blockquote: ["class", "cite"],
};

const OPTIONS: sanitize.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
  allowProtocolRelative: false,
  // Drop the contents of dangerous elements entirely rather than keeping their text.
  nonTextTags: ["script", "style", "textarea", "noscript", "iframe", "object", "embed", "template"],
  transformTags: {
    // Links that open a new tab must not get a handle on this window.
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        const rel = new Set((attribs.rel || "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        attribs.rel = [...rel].join(" ");
      }
      return { tagName, attribs };
    },
  },
};

const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|tel):|\/(?!\/)|#)/i;

/**
 * Check if a URL uses a safe protocol (http, https, mailto, tel, or a
 * site-relative path / fragment). Protocol-relative `//host` URLs are rejected.
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  // Browsers ignore control characters and whitespace inside a scheme.
  const trimmed = url.replace(/[\u0000- \u007f-\u009f]/g, "");
  return SAFE_URL_PATTERN.test(trimmed);
}

/** Sanitize an HTML string against the rich-text allowlist. */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return sanitize(html, OPTIONS);
}

/** Escape a value for use inside a double-quoted HTML attribute. */
export function escapeAttr(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Escape a value for use as HTML text content. */
export function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
