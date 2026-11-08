/**
 * Helpers for parsing the markdown-lite blog content used across the site.
 *
 * The content format is simple (paragraphs split on blank lines):
 *   - `## Heading`        → H2
 *   - `### Heading`       → H3
 *   - `- item` lines      → unordered list
 *   - `1. item` lines     → ordered list
 *   - everything else     → paragraph
 *
 * An AEO/GEO "Frequently Asked Questions" section is written as:
 *
 *   ## Frequently Asked Questions
 *
 *   ### Does this really work?
 *   A short, direct answer paragraph.
 *
 * The FAQ parser below converts that section into schema.org FAQPage
 * entities so Google can render rich results (people-also-ask style).
 */

import { isSafeUrl, sanitizeHtml } from "@/lib/html-sanitizer";

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_HEADING = /^##\s+(faq|frequently asked questions|common questions)/i;
const TOP_LEVEL_HEADING = /^##\s/;
const QUESTION_HEADING = /^###\s+/;

/** Extract question/answer pairs from the FAQ section of a blog post. */
export function parseFaq(content: string): FaqItem[] {
  const blocks = content.split(/\n\s*\n/);
  const faqStart = blocks.findIndex((b) => FAQ_HEADING.test(b.trim()));
  if (faqStart === -1) return [];

  const items: FaqItem[] = [];
  let current: FaqItem | null = null;

  for (const raw of blocks.slice(faqStart + 1)) {
    const block = raw.trim();
    if (!block) continue;

    if (TOP_LEVEL_HEADING.test(block)) break; // next major section ends the FAQ

    if (QUESTION_HEADING.test(block)) {
      if (current && current.question && current.answer) items.push(current);
      // Question and answer may live in the same block ("### Q\nAnswer")
      // or the answer may follow as a separate paragraph.
      const lines = block.split("\n");
      const question = (lines[0] || "").replace(QUESTION_HEADING, "").trim();
      const inlineAnswer = lines
        .slice(1)
        .map((l) => l.replace(/^A:\s*/i, "").trim())
        .join(" ")
        .trim();
      current = {
        question: question.endsWith("?") ? question : `${question}?`,
        answer: inlineAnswer,
      };
      continue;
    }

    if (current) {
      const answerPart = block.replace(/^A:\s*/i, "").trim();
      current.answer += (current.answer ? " " : "") + answerPart;
    }
  }

  if (current && current.question && current.answer) items.push(current);
  return items;
}

/** Approximate reading time in minutes for a content string. */
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, url: string) =>
      isSafeUrl(url) ? `<a href="${url}">${label}</a>` : label
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(content: string): string {
  const html: string[] = [];
  let paragraph: string[] = [];
  let listTag: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (listTag) html.push(`</${listTag}>`);
    listTag = null;
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+\.\s+(.+)$/);

    if (!line) {
      flushParagraph();
      closeList();
    } else if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
    } else if (bullet || numbered) {
      flushParagraph();
      const tag = bullet ? "ul" : "ol";
      if (listTag !== tag) {
        closeList();
        html.push(`<${tag}>`);
        listTag = tag;
      }
      html.push(`<li>${renderInline((bullet ?? numbered)![1])}</li>`);
    } else {
      closeList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  closeList();
  return html.join("\n");
}

/**
 * Article bodies are saved either as HTML (rich editor) or as the markdown-lite
 * format described above (imported posts). Returns safe HTML for both.
 */
export function renderBlogContent(content: string): string {
  return /^\s*</.test(content) ? sanitizeHtml(content) : markdownToHtml(content);
}
