/**
 * migrate-on-build.ts
 *
 * Runs during `npm run build` on every environment (local + Vercel).
 * Uses the DATABASE_URL environment variable directly via @libsql/client.
 * All statements are idempotent — safe to run on databases that already
 * have the columns. Catches "duplicate column" errors gracefully.
 */
import "dotenv/config";
import { createClient, type Client } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌ DATABASE_URL is not set. Skipping migration.");
  process.exit(0);
}

// Local SQLite files (file:./dev.db) are managed by prisma migrate — skip.
if (url.startsWith("file:") || url.startsWith("./") || url.startsWith("/")) {
  console.log("ℹ Local SQLite file detected — skipping build-time migration (prisma migrate handles this).");
  process.exit(0);
}

const client: Client = createClient({ url, authToken });

// Try to execute a statement, ignore known-safe errors
async function safeExec(sql: string, label: string) {
  try {
    await client.execute(sql);
    console.log(`  ✓ ${label}`);
  } catch (e: unknown) {
    const msg = (e as Error)?.message ?? String(e);
    if (
      msg.includes("duplicate column name") ||
      msg.includes("already exists") ||
      msg.includes("table already exists")
    ) {
      console.log(`  ~ ${label} (already exists, skipped)`);
    } else {
      console.error(`  ✗ ${label} FAILED: ${msg}`);
      throw e;
    }
  }
}

async function main() {
  console.log(`\n▶ Running build-time DB migration against: ${url?.split("?")[0]}\n`);

  // ── Product SEO & identity columns ─────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "shortDescription" TEXT`, "shortDescription");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "brand" TEXT`, "brand");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "productType" TEXT`, "productType");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "condition" TEXT DEFAULT 'New'`, "condition");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "gtin" TEXT`, "gtin");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "mpn" TEXT`, "mpn");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "unit" TEXT DEFAULT 'piece'`, "unit");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "weightValue" REAL`, "weightValue");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "weightUnit" TEXT DEFAULT 'ml'`, "weightUnit");

  // ── Publishing ──────────────────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "status" TEXT DEFAULT 'published'`, "status");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "publishedAt" DATETIME`, "publishedAt");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "scheduledAt" DATETIME`, "scheduledAt");

  // ── Structured rich content ─────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "structuredIngredients" TEXT`, "structuredIngredients");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "structuredHowToUse" TEXT`, "structuredHowToUse");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "benefits" TEXT`, "benefits");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "features" TEXT`, "features");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "faqs" TEXT`, "faqs");

  // ── Image metadata ──────────────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "imageMetadata" TEXT`, "imageMetadata");

  // ── SEO metadata ────────────────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "seoTitle" TEXT`, "seoTitle");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "seoDescription" TEXT`, "seoDescription");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "focusKeyword" TEXT`, "focusKeyword");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "secondaryKeywords" TEXT`, "secondaryKeywords");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "canonicalUrl" TEXT`, "canonicalUrl");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "robotsIndex" INTEGER NOT NULL DEFAULT 1`, "robotsIndex");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "robotsFollow" INTEGER NOT NULL DEFAULT 1`, "robotsFollow");

  // ── Open Graph ──────────────────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "ogTitle" TEXT`, "ogTitle");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "ogDescription" TEXT`, "ogDescription");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "ogImage" TEXT`, "ogImage");

  // ── Twitter/X ───────────────────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "twitterTitle" TEXT`, "twitterTitle");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "twitterDescription" TEXT`, "twitterDescription");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "twitterImage" TEXT`, "twitterImage");

  // ── Internal linking ────────────────────────────────────────────────────────
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "relatedProductIds" TEXT`, "relatedProductIds");
  await safeExec(`ALTER TABLE "Product" ADD COLUMN "relatedBlogIds" TEXT`, "relatedBlogIds");

  // ── BlogPost SEO columns (if blog editor was also upgraded) ─────────────────
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "seoTitle" TEXT`, "BlogPost.seoTitle");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "seoDescription" TEXT`, "BlogPost.seoDescription");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "focusKeyword" TEXT`, "BlogPost.focusKeyword");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "canonicalUrl" TEXT`, "BlogPost.canonicalUrl");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "ogTitle" TEXT`, "BlogPost.ogTitle");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "ogDescription" TEXT`, "BlogPost.ogDescription");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "ogImage" TEXT`, "BlogPost.ogImage");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "twitterTitle" TEXT`, "BlogPost.twitterTitle");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "twitterDescription" TEXT`, "BlogPost.twitterDescription");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "twitterImage" TEXT`, "BlogPost.twitterImage");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "robotsIndex" INTEGER NOT NULL DEFAULT 1`, "BlogPost.robotsIndex");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "robotsFollow" INTEGER NOT NULL DEFAULT 1`, "BlogPost.robotsFollow");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "faqs" TEXT`, "BlogPost.faqs");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "readingTime" INTEGER`, "BlogPost.readingTime");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "status" TEXT DEFAULT 'published'`, "BlogPost.status");
  await safeExec(`ALTER TABLE "BlogPost" ADD COLUMN "scheduledAt" DATETIME`, "BlogPost.scheduledAt");

  // ── Redirect table ──────────────────────────────────────────────────────────
  await safeExec(`
    CREATE TABLE IF NOT EXISTS "Redirect" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "sourcePath" TEXT NOT NULL,
      "targetPath" TEXT NOT NULL,
      "statusCode" INTEGER NOT NULL DEFAULT 301,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `, "Redirect table");

  await safeExec(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Redirect_sourcePath_key" ON "Redirect"("sourcePath")`,
    "Redirect unique index"
  );

  console.log("\n✅ Build-time migration complete.\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Build-time migration failed:", e);
    process.exit(1);
  })
  .finally(() => client.close());
