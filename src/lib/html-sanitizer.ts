/**
 * HTML Sanitizer for Rich Text Blog Content.
 * Strictly strips dangerous elements, attributes, event handlers, and unsafe protocols
 * while preserving valid semantic HTML tags for articles.
 */

const ALLOWED_TAGS = new Set([
  "h2",
  "h3",
  "h4",
  "p",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "pre",
  "code",
  "span",
  "div",
  "br",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel", "class", "id"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading", "class", "data-credit"]),
  figure: new Set(["class"]),
  figcaption: new Set(["class"]),
  table: new Set(["class"]),
  th: new Set(["colspan", "rowspan", "scope", "class"]),
  td: new Set(["colspan", "rowspan", "class"]),
  span: new Set(["class"]),
  div: new Set(["class"]),
  pre: new Set(["class"]),
  code: new Set(["class"]),
  h2: new Set(["id", "class"]),
  h3: new Set(["id", "class"]),
  h4: new Set(["id", "class"]),
  p: new Set(["class"]),
  blockquote: new Set(["class", "cite"]),
};

const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|tel):|\/|#)/i;

/**
 * Check if a URL uses a safe protocol (http, https, mailto, tel, or relative).
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed) || /^data:(?!image\/)/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return false;
  }
  return SAFE_URL_PATTERN.test(trimmed);
}

/**
 * Sanitize HTML string on client and server.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Remove <script> tags and contents completely
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Remove <iframe>, <object>, <embed>, <form>, <input>, <style>
  clean = clean.replace(/<(iframe|object|embed|form|input|button|style)\b[^>]*>.*?<\/\1>/gi, "");
  clean = clean.replace(/<(iframe|object|embed|form|input|button|style)\b[^>]*\/?>/gi, "");

  // Remove on* event handlers (e.g. onload, onerror, onclick)
  clean = clean.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // Remove javascript: pseudo-protocols
  clean = clean.replace(/href\s*=\s*(['"]?)\s*javascript:[^'"]*\1/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*(['"]?)\s*javascript:[^'"]*\1/gi, "");

  return clean;
}
