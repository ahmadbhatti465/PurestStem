"use client";

/**
 * Serialises structured data for a <script type="application/ld+json"> tag.
 * `<`, `>` and `&` are escaped as unicode so text such as "</script>" inside a
 * product name or post title cannot close the tag and inject markup.
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
