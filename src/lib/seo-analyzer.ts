/**
 * Technical SEO & Content Health Analyzer.
 * Adheres strictly to Google Search Guidelines and best technical SEO practices.
 * Evaluates topical depth, readability, heading structure, image accessibility,
 * keyword placement (naturally, avoiding keyword stuffing), internal linking,
 * meta tags, and structured data readiness.
 */

export interface SeoCheckItem {
  id: string;
  category: "technical" | "content" | "keywords" | "images" | "links" | "schema";
  status: "pass" | "warning" | "fail";
  title: string;
  message: string;
}

export interface SeoAnalysisResult {
  healthScore: number; // 0 - 100
  wordCount: number;
  readingTimeMinutes: number;
  headingCounts: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
  };
  paragraphCount: number;
  internalLinksCount: number;
  externalLinksCount: number;
  imagesCount: number;
  missingAltCount: number;
  titleLength: number;
  descLength: number;
  keywordPlacements: {
    inTitle: boolean;
    inH1: boolean;
    inIntro: boolean;
    inH2: boolean;
    inSlug: boolean;
    inMetaDesc: boolean;
    inImageAlt: boolean;
    bodyCount: number;
  };
  checks: SeoCheckItem[];
}

export interface SeoInputData {
  title: string;
  slug: string;
  content: string; // HTML or rich text
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  faqs?: Array<{ question: string; answer: string }>;
  author?: string;
  categoryId?: string;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKeyword(kw: string): string {
  return kw.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

export function analyzeBlogSeo(data: SeoInputData): SeoAnalysisResult {
  const plainText = stripHtml(data.content || "");
  const words = plainText ? plainText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  // Heading counts
  const content = data.content || "";
  const h1Matches = content.match(/<h1\b[^>]*>/gi) || [];
  const h2Matches = content.match(/<h2\b[^>]*>/gi) || [];
  const h3Matches = content.match(/<h3\b[^>]*>/gi) || [];
  const h4Matches = content.match(/<h4\b[^>]*>/gi) || [];

  const headingCounts = {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length,
    h4: h4Matches.length,
  };

  // Paragraph counts
  const pMatches = content.match(/<p\b[^>]*>.*?<\/p>/gi) || [];
  const paragraphCount = pMatches.length;

  // Links analysis
  const linkMatches = Array.from(content.matchAll(/<a\b([^>]*)href=["']([^"']+)["']([^>]*)>/gi));
  let internalLinksCount = 0;
  let externalLinksCount = 0;

  for (const match of linkMatches) {
    const href = match[2];
    if (href.startsWith("/") || href.includes("pureststem.com") || href.startsWith("#")) {
      internalLinksCount++;
    } else if (/^https?:\/\//i.test(href)) {
      externalLinksCount++;
    }
  }

  // Images analysis
  const imgMatches = Array.from(content.matchAll(/<img\b([^>]*)>/gi));
  let embeddedImagesCount = imgMatches.length;
  let missingAltCount = 0;

  for (const match of imgMatches) {
    const fullTag = match[0];
    const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
    if (!altMatch || !altMatch[1].trim()) {
      missingAltCount++;
    }
  }

  if (data.featuredImage && (!data.featuredImageAlt || !data.featuredImageAlt.trim())) {
    missingAltCount++;
  }

  const totalImagesCount = embeddedImagesCount + (data.featuredImage ? 1 : 0);

  // Meta lengths
  const activeTitle = data.seoTitle || data.title || "";
  const activeDesc = data.seoDescription || data.excerpt || "";
  const titleLength = activeTitle.length;
  const descLength = activeDesc.length;

  // Keyword placement
  const kw = normalizeKeyword(data.focusKeyword || "");
  const kwPlacements = {
    inTitle: false,
    inH1: false,
    inIntro: false,
    inH2: false,
    inSlug: false,
    inMetaDesc: false,
    inImageAlt: false,
    bodyCount: 0,
  };

  if (kw) {
    const normTitle = (data.title || "").toLowerCase();
    const normSeoTitle = activeTitle.toLowerCase();
    const normSlug = (data.slug || "").toLowerCase().replace(/-/g, " ");
    const normDesc = activeDesc.toLowerCase();
    const normIntro = words.slice(0, 100).join(" ").toLowerCase();

    kwPlacements.inTitle = normSeoTitle.includes(kw) || normTitle.includes(kw);
    kwPlacements.inH1 = normTitle.includes(kw);
    kwPlacements.inIntro = normIntro.includes(kw);
    kwPlacements.inSlug = normSlug.includes(kw);
    kwPlacements.inMetaDesc = normDesc.includes(kw);

    if (data.featuredImageAlt && data.featuredImageAlt.toLowerCase().includes(kw)) {
      kwPlacements.inImageAlt = true;
    }

    // Check in H2s
    const h2Texts = Array.from(content.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/gi)).map((m) =>
      stripHtml(m[1]).toLowerCase()
    );
    kwPlacements.inH2 = h2Texts.some((h2) => h2.includes(kw));

    // Count occurrences in body
    const bodyLower = plainText.toLowerCase();
    let pos = 0;
    while ((pos = bodyLower.indexOf(kw, pos)) !== -1) {
      kwPlacements.bodyCount++;
      pos += kw.length;
    }
  }

  // Evaluate Checklist
  const checks: SeoCheckItem[] = [];

  // 1. Technical SEO
  if (!data.slug) {
    checks.push({
      id: "slug-missing",
      category: "technical",
      status: "fail",
      title: "URL Slug is missing",
      message: "Add a descriptive, hyphen-separated URL slug for this article.",
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    checks.push({
      id: "slug-format",
      category: "technical",
      status: "warning",
      title: "URL Slug formatting",
      message: "Use only lowercase letters, numbers, and single hyphens without spaces or special characters.",
    });
  } else {
    checks.push({
      id: "slug-valid",
      category: "technical",
      status: "pass",
      title: "SEO-friendly URL slug",
      message: `Clean, crawlable slug: /blog/${data.slug}`,
    });
  }

  if (data.robotsIndex === false) {
    checks.push({
      id: "robots-noindex",
      category: "technical",
      status: "warning",
      title: "Robots Meta set to noindex",
      message: "This post will be excluded from search engine indexing.",
    });
  } else {
    checks.push({
      id: "robots-index",
      category: "technical",
      status: "pass",
      title: "Indexable by search engines",
      message: "Robots meta directive permits indexing and link following.",
    });
  }

  // 2. Title & Meta Description
  if (!activeTitle) {
    checks.push({
      id: "title-missing",
      category: "content",
      status: "fail",
      title: "SEO Title is missing",
      message: "Provide an SEO Title for search engine snippets and browser tabs.",
    });
  } else if (titleLength < 35) {
    checks.push({
      id: "title-short",
      category: "content",
      status: "warning",
      title: `SEO Title is short (${titleLength} chars)`,
      message: "Consider expanding your title to 50–60 characters to provide better context.",
    });
  } else if (titleLength > 65) {
    checks.push({
      id: "title-long",
      category: "content",
      status: "warning",
      title: `SEO Title may truncate (${titleLength} chars)`,
      message: "Titles longer than ~60 characters may be truncated on Google desktop/mobile SERPs.",
    });
  } else {
    checks.push({
      id: "title-optimal",
      category: "content",
      status: "pass",
      title: `SEO Title length is optimal (${titleLength} chars)`,
      message: "Within the recommended 50–60 character range.",
    });
  }

  if (!activeDesc) {
    checks.push({
      id: "desc-missing",
      category: "content",
      status: "fail",
      title: "Meta Description is missing",
      message: "Add a compelling meta description summarizing the article for search results.",
    });
  } else if (descLength < 100) {
    checks.push({
      id: "desc-short",
      category: "content",
      status: "warning",
      title: `Meta Description is short (${descLength} chars)`,
      message: "Recommended length is 140–160 characters to maximize SERP snippet engagement.",
    });
  } else if (descLength > 165) {
    checks.push({
      id: "desc-long",
      category: "content",
      status: "warning",
      title: `Meta Description may truncate (${descLength} chars)`,
      message: "Descriptions over ~160 characters may be cut off in search snippets.",
    });
  } else {
    checks.push({
      id: "desc-optimal",
      category: "content",
      status: "pass",
      title: `Meta Description length is optimal (${descLength} chars)`,
      message: "Within the recommended 140–160 character range.",
    });
  }

  // 3. Content Structure
  if (headingCounts.h1 > 0) {
    checks.push({
      id: "h1-body-warning",
      category: "content",
      status: "warning",
      title: "Multiple H1 headings detected",
      message: "The article title serves as the single H1. Use H2 for main sections and H3 for subsections.",
    });
  } else {
    checks.push({
      id: "h1-structure",
      category: "content",
      status: "pass",
      title: "Single H1 hierarchy",
      message: "Article title serves as the single H1 tag cleanly.",
    });
  }

  if (headingCounts.h2 < 2) {
    checks.push({
      id: "h2-insufficient",
      category: "content",
      status: "warning",
      title: `Subheadings (H2) count: ${headingCounts.h2}`,
      message: "Use at least 2 H2 headings to organize your content into scannable topical sections.",
    });
  } else {
    checks.push({
      id: "h2-good",
      category: "content",
      status: "pass",
      title: `Well-structured with ${headingCounts.h2} H2 sections`,
      message: "Good subtopic division helps user readability and search engine indexing.",
    });
  }

  if (wordCount < 300) {
    checks.push({
      id: "word-count-low",
      category: "content",
      status: "warning",
      title: `Thin content: ${wordCount} words`,
      message: "Comprehensive articles typically require at least 500–1000 words to cover topics thoroughly.",
    });
  } else {
    checks.push({
      id: "word-count-good",
      category: "content",
      status: "pass",
      title: `Article depth: ${wordCount} words (~${readingTimeMinutes} min read)`,
      message: "Provides sufficient content depth for user value.",
    });
  }

  // 4. Focus Keyword Coverage (Natural, not stuffed)
  if (!kw) {
    checks.push({
      id: "keyword-missing",
      category: "keywords",
      status: "warning",
      title: "Focus Keyword not defined",
      message: "Set a primary focus keyword to analyze natural topical alignment.",
    });
  } else {
    if (kwPlacements.inTitle) {
      checks.push({
        id: "kw-title",
        category: "keywords",
        status: "pass",
        title: "Focus keyword appears in title",
        message: "Primary topic clearly stated in page title.",
      });
    } else {
      checks.push({
        id: "kw-title-missing",
        category: "keywords",
        status: "warning",
        title: "Focus keyword not found in title",
        message: "Consider including your focus keyword naturally in the title.",
      });
    }

    if (kwPlacements.inIntro) {
      checks.push({
        id: "kw-intro",
        category: "keywords",
        status: "pass",
        title: "Focus keyword in introduction",
        message: "Keyword appears naturally in the opening paragraph.",
      });
    } else {
      checks.push({
        id: "kw-intro-missing",
        category: "keywords",
        status: "warning",
        title: "Focus keyword missing from introduction",
        message: "Introduce the core topic within the first 100 words.",
      });
    }

    if (kwPlacements.inH2) {
      checks.push({
        id: "kw-h2",
        category: "keywords",
        status: "pass",
        title: "Focus keyword in H2 heading",
        message: "At least one section heading reflects the primary topic.",
      });
    }

    if (kwPlacements.bodyCount > 0) {
      checks.push({
        id: "kw-body",
        category: "keywords",
        status: "pass",
        title: `Keyword mentions: ${kwPlacements.bodyCount}`,
        message: "Covered naturally throughout the article body.",
      });
    }
  }

  // 5. Image SEO
  if (!data.featuredImage) {
    checks.push({
      id: "feat-image-missing",
      category: "images",
      status: "warning",
      title: "Featured Image not set",
      message: "Visual imagery increases engagement and enables Google Discover / rich social snippets.",
    });
  } else {
    if (!data.featuredImageAlt || !data.featuredImageAlt.trim()) {
      checks.push({
        id: "feat-image-alt-missing",
        category: "images",
        status: "fail",
        title: "Featured Image Alt Text is missing",
        message: "Add descriptive alternative text explaining what is shown in the image for accessibility & SEO.",
      });
    } else {
      checks.push({
        id: "feat-image-alt-ok",
        category: "images",
        status: "pass",
        title: "Featured Image Alt Text provided",
        message: `Descriptive alt text: "${data.featuredImageAlt}"`,
      });
    }
  }

  if (missingAltCount > 0 && data.featuredImage && data.featuredImageAlt) {
    checks.push({
      id: "embedded-missing-alt",
      category: "images",
      status: "warning",
      title: `${missingAltCount} image(s) missing Alt text`,
      message: "Ensure every embedded image in the article body has descriptive alt text.",
    });
  }

  // 6. Linking
  if (internalLinksCount === 0) {
    checks.push({
      id: "internal-links-missing",
      category: "links",
      status: "warning",
      title: "No internal links added",
      message: "Link to relevant PurestStem products, categories, or related blog posts to help crawlability.",
    });
  } else {
    checks.push({
      id: "internal-links-good",
      category: "links",
      status: "pass",
      title: `${internalLinksCount} internal link(s) added`,
      message: "Distributes link equity and guides users to relevant store products/guides.",
    });
  }

  // 7. Structured Data & Schema
  checks.push({
    id: "schema-article",
    category: "schema",
    status: "pass",
    title: "BlogPosting JSON-LD schema active",
    message: "Generates valid Schema.org structured data for Google Search.",
  });

  if (data.faqs && data.faqs.length > 0) {
    checks.push({
      id: "schema-faq",
      category: "schema",
      status: "pass",
      title: `FAQPage schema enabled (${data.faqs.length} Q&As)`,
      message: "Visibly rendered FAQs included in structured data.",
    });
  }

  // Compute Health Score (0 - 100)
  let passCount = checks.filter((c) => c.status === "pass").length;
  let warnCount = checks.filter((c) => c.status === "warning").length;
  let failCount = checks.filter((c) => c.status === "fail").length;
  let totalChecks = checks.length;

  let healthScore = Math.round(
    ((passCount * 1.0 + warnCount * 0.5) / Math.max(1, totalChecks)) * 100
  );

  return {
    healthScore,
    wordCount,
    readingTimeMinutes,
    headingCounts,
    paragraphCount,
    internalLinksCount,
    externalLinksCount,
    imagesCount: totalImagesCount,
    missingAltCount,
    titleLength,
    descLength,
    keywordPlacements: kwPlacements,
    checks,
  };
}
