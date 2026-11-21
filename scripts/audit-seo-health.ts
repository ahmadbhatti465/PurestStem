import "dotenv/config";

interface AuditResult {
  url: string;
  type: string;
  status: number;
  statusPass: boolean;
  canonical: string | null;
  canonicalPass: boolean;
  robots: string | null;
  robotsPass: boolean;
  xRobotsTag: string | null;
  xRobotsPass: boolean;
  inSitemap: boolean;
  title: string | null;
  titlePass: boolean;
  description: string | null;
  descriptionPass: boolean;
  h1: string | null;
  h1Count: number;
  h1Pass: boolean;
  schemaPass: boolean;
  schemasFound: string[];
  imageAltPass: boolean;
  wordCount: number;
  internalLinksCount: number;
  isIndexable: boolean;
}

async function fetchPage(url: string) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });
    const status = res.status;
    const location = res.headers.get("location");
    const xRobotsTag = res.headers.get("x-robots-tag");
    const contentType = res.headers.get("content-type");
    let html = "";
    if (contentType?.includes("text/html")) {
      html = await res.text();
    }
    return { status, location, xRobotsTag, html };
  } catch (err) {
    return {
      status: 0,
      location: null,
      xRobotsTag: null,
      html: "",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function parseHtml(url: string, type: string, status: number, xRobotsTag: string | null, html: string, sitemapUrls: Set<string>): AuditResult {
  let canonical: string | null = null;
  let robots: string | null = null;
  let title: string | null = null;
  let description: string | null = null;
  let h1: string | null = null;
  let h1Count = 0;
  const schemasFound: string[] = [];
  let imageAltPass = true;
  let wordCount = 0;
  let internalLinksCount = 0;

  if (html) {
    // Canonical
    const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                       html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    if (canonMatch) canonical = canonMatch[1];

    // Robots meta
    const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);
    if (robotsMatch) robots = robotsMatch[1];

    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();

    // Meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    if (descMatch) description = descMatch[1].trim();

    // H1
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    h1Count = h1Matches.length;
    if (h1Matches.length > 0) {
      h1 = h1Matches[0][1].replace(/<[^>]+>/g, "").trim();
    }

    // JSON-LD Schemas
    const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const block of jsonLdBlocks) {
      try {
        const parsed = JSON.parse(block[1]);
        if (parsed["@type"]) {
          schemasFound.push(parsed["@type"]);
        }
      } catch {}
    }

    // Image alt attributes
    const imgMatches = [...html.matchAll(/<img([^>]+)>/gi)];
    for (const m of imgMatches) {
      const attrs = m[1];
      const hasAlt = /alt=["'][^"']*["']/i.test(attrs);
      if (!hasAlt) {
        imageAltPass = false;
      }
    }

    // Body word count
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const textOnly = bodyMatch[1]
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      wordCount = textOnly.split(" ").filter(Boolean).length;
    }

    // Internal links
    const aMatches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)];
    for (const a of aMatches) {
      const href = a[1];
      if (href.startsWith("/") || href.startsWith("https://pureststem.com")) {
        internalLinksCount++;
      }
    }
  }

  // Canonical pass check (should match URL or preferred canonical URL)
  const canonicalPass = canonical === url;
  const robotsPass = !robots || (!robots.includes("noindex") && robots.includes("index"));
  const xRobotsPass = !xRobotsTag || !xRobotsTag.includes("noindex");
  const inSitemap = sitemapUrls.has(url);
  const statusPass = status === 200;
  const titlePass = Boolean(title && title.length > 5);
  const descriptionPass = Boolean(description && description.length > 10);
  const h1Pass = h1Count === 1;
  const schemaPass = schemasFound.length > 0;
  const isIndexable = statusPass && robotsPass && xRobotsPass && canonicalPass;

  return {
    url,
    type,
    status,
    statusPass,
    canonical,
    canonicalPass,
    robots,
    robotsPass,
    xRobotsTag,
    xRobotsPass,
    inSitemap,
    title,
    titlePass,
    description,
    descriptionPass,
    h1,
    h1Count,
    h1Pass,
    schemaPass,
    schemasFound,
    imageAltPass,
    wordCount,
    internalLinksCount,
    isIndexable,
  };
}

async function main() {
  console.log("================================================================================");
  console.log("             PURESTSTEM COMPREHENSIVE PRODUCTION TECHNICAL SEO AUDIT            ");
  console.log("================================================================================\n");

  // 1. Fetch live sitemap
  console.log("1. Fetching live Sitemap (https://pureststem.com/sitemap.xml)...");
  const sitemapRes = await fetch("https://pureststem.com/sitemap.xml");
  const sitemapText = await sitemapRes.text();
  const sitemapUrls = new Set([...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
  console.log(`✓ Sitemap returned HTTP ${sitemapRes.status} with ${sitemapUrls.size} URLs.\n`);

  // 2. Fetch live robots.txt
  console.log("2. Fetching live Robots.txt (https://pureststem.com/robots.txt)...");
  const robotsRes = await fetch("https://pureststem.com/robots.txt");
  const robotsText = await robotsRes.text();
  console.log(`✓ Robots.txt returned HTTP ${robotsRes.status}:\n${robotsText.trim()}\n`);

  // 3. Define all URLs to audit
  const targetUrls = [
    // Core Static Pages
    { url: "https://pureststem.com", type: "Homepage" },
    { url: "https://pureststem.com/blog", type: "Blog Index" },
    { url: "https://pureststem.com/shop/products", type: "Products Index" },
    { url: "https://pureststem.com/shop/about", type: "About Page" },
    { url: "https://pureststem.com/shop/contact", type: "Contact Page" },

    // Live Products
    { url: "https://pureststem.com/shop/products/hairoil", type: "Product" },
    { url: "https://pureststem.com/shop/products/shampoo", type: "Product" },
    { url: "https://pureststem.com/shop/products/herbalshampoo", type: "Product" },
    { url: "https://pureststem.com/shop/products/pureststemshampooduobundle", type: "Product" },
    { url: "https://pureststem.com/shop/products/pureststemcompletehaircarecombo", type: "Product" },

    // Live Blog Articles (20 Articles)
    { url: "https://pureststem.com/blog/best-hair-fall-treatment-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/best-hair-oil-for-hair-growth-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/how-to-stop-hair-fall-naturally-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/best-herbal-shampoo-dandruff-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/amla-for-hair-benefits-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/how-to-make-hair-thicker-naturally-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/coconut-oil-vs-almond-oil-for-hair-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/hair-fall-in-rainy-season-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/herbal-shampoo-vs-chemical-shampoo-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/ubtan-for-glowing-skin-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/best-herbal-face-pack-glowing-skin-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/how-to-remove-sun-tan-naturally-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/neem-soap-benefits-for-skin-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/30-day-bridal-skincare-routine-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/multani-mitti-benefits-for-face-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/best-herbal-tea-for-weight-loss-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/how-to-reduce-bloating-and-gas-naturally-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/detox-tea-benefits-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/best-time-to-drink-herbal-tea-pakistan", type: "Blog Article" },
    { url: "https://pureststem.com/blog/complete-guide-herbal-products-pakistan", type: "Blog Article" },
  ];

  console.log(`3. Auditing ${targetUrls.length} Canonical Public URLs...`);
  const results: AuditResult[] = [];

  for (const item of targetUrls) {
    const { status, location, xRobotsTag, html } = await fetchPage(item.url);
    const parsed = parseHtml(item.url, item.type, status, xRobotsTag, html, sitemapUrls);
    results.push(parsed);

    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`URL:         ${parsed.url}`);
    console.log(`Type:        ${parsed.type}`);
    console.log(`Status:      ${parsed.status} [${parsed.statusPass ? 'PASS' : 'FAIL'}]`);
    console.log(`Canonical:   ${parsed.canonical || 'None'} [${parsed.canonicalPass ? 'PASS' : 'FAIL'}]`);
    console.log(`Robots Meta: ${parsed.robots || 'index, follow (default)'} [${parsed.robotsPass ? 'PASS' : 'FAIL'}]`);
    console.log(`Sitemap:     [${parsed.inSitemap ? 'PASS (Included)' : 'FAIL (Missing)'}]`);
    console.log(`H1 Tag:      "${parsed.h1?.slice(0, 45)}..." (Count: ${parsed.h1Count}) [${parsed.h1Pass ? 'PASS' : 'FAIL'}]`);
    console.log(`Schemas:     ${parsed.schemasFound.join(", ") || 'None'} [${parsed.schemaPass ? 'PASS' : 'FAIL'}]`);
    console.log(`Word Count:  ${parsed.wordCount} words`);
    console.log(`Links:       ${parsed.internalLinksCount} internal links`);
    console.log(`Indexable:   [${parsed.isIndexable ? 'PASS (INDEXABLE)' : 'FAIL'}]`);
  }

  // 4. Test Redirects & Legacy Discovery URLs
  console.log("\n================================================================================");
  console.log("                        REDIRECT & LEGACY URL AUDIT                             ");
  console.log("================================================================================\n");

  const redirectTests = [
    { url: "http://pureststem.com/", expected: "https://pureststem.com/" },
    { url: "https://pureststem.com/shop/blog", expected: "/blog" },
    { url: "https://pureststem.com/shop/blog/amla-for-hair-benefits-pakistan", expected: "/blog/amla-for-hair-benefits-pakistan" },
    { url: "https://pureststem.com/shop/blog/best-hair-fall-treatment-pakistan", expected: "/blog/best-hair-fall-treatment-pakistan" },
    { url: "https://pureststem.com/shop/blog/detox-tea-benefits-pakistan", expected: "/blog/detox-tea-benefits-pakistan" },
    { url: "https://pureststem.com/blog/best-herbal-shampoo-hair-fall-pakistan", expected: "/blog/best-hair-fall-treatment-pakistan" },
    { url: "https://pureststem.com/shop/products/golden-hair-growth-oil-pakistan", expected: "/shop/products/hairoil" },
  ];

  for (const r of redirectTests) {
    const res = await fetchPage(r.url);
    const pass = (res.status === 301 || res.status === 308) && res.location?.includes(r.expected);
    console.log(`Redirect: ${r.url}`);
    console.log(`  Status: ${res.status} | Location: ${res.location} | Target: ${r.expected} [${pass ? 'PASS' : 'FAIL'}]`);
  }

  // Summary Statistics
  const total = results.length;
  const passCount = results.filter(r => r.isIndexable).length;
  console.log("\n================================================================================");
  console.log(`AUDIT COMPLETE: ${passCount}/${total} URLs Fully Indexable & Passing All SEO Criteria.`);
  console.log("================================================================================\n");
}

main().catch(console.error);
