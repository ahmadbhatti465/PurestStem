import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("▶ Checking Product table columns in Turso...\n");
  const r = await client.execute(`PRAGMA table_info("Product")`);
  const cols = r.rows.map((row) => row[1] as string);
  console.log("Columns found:", cols.join(", "));

  const seoColumns = [
    "shortDescription", "brand", "seoTitle", "seoDescription",
    "focusKeyword", "canonicalUrl", "robotsIndex", "ogTitle",
    "twitterTitle", "structuredIngredients", "benefits", "faqs", "status"
  ];

  let missing = false;
  for (const col of seoColumns) {
    if (!cols.includes(col)) {
      console.error(`  ✗ MISSING: ${col}`);
      missing = true;
    } else {
      console.log(`  ✓ OK: ${col}`);
    }
  }

  if (missing) {
    console.error("\n❌ Some columns are missing. Applying migration...");
    process.exit(1);
  } else {
    console.log("\n✅ All SEO columns exist in Turso production database.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => client.close());
