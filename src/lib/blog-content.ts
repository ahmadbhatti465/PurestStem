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
