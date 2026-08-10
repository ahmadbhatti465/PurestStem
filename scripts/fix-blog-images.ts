/**
 * One-off fix: backfill BlogPost.image for the seeded posts.
 * The production Turso DB has image = null on all 20 posts even though
 * the images exist at /images/blog/*.jpg. Only updates posts whose
 * image is currently null/empty, so it won't clobber admin uploads.
 *
 * Run: npx tsx scripts/fix-blog-images.ts
 */
import { config } from "dotenv";
for (const f of [".env.local", ".env"]) { try { config({ path: f }); } catch {} }

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const IMAGE_BY_SLUG: Record<string, string> = {
  "best-hair-fall-treatment-pakistan": "/images/blog/hair-loss-comb.jpg",
  "best-hair-oil-for-hair-growth-pakistan": "/images/blog/hair-growth-oil.jpg",
  "how-to-stop-hair-fall-naturally-pakistan": "/images/blog/hair-brushing.jpg",
  "best-herbal-shampoo-dandruff-pakistan": "/images/blog/herbal-shampoo.jpg",
  "amla-for-hair-benefits-pakistan": "/images/blog/amla.jpg",
  "how-to-make-hair-thicker-naturally-pakistan": "/images/blog/long-hair.jpg",
  "coconut-oil-vs-almond-oil-for-hair-pakistan": "/images/blog/coconut-oil.jpg",
  "hair-fall-in-rainy-season-pakistan": "/images/blog/rain-umbrella.jpg",
  "herbal-shampoo-vs-chemical-shampoo-pakistan": "/images/blog/natural-shampoo.jpg",
  "ubtan-for-glowing-skin-pakistan": "/images/blog/ubtan-turmeric.jpg",
  "best-herbal-face-pack-glowing-skin-pakistan": "/images/blog/face-mask.jpg",
  "how-to-remove-sun-tan-naturally-pakistan": "/images/blog/sunscreen.jpg",
  "neem-soap-benefits-for-skin-pakistan": "/images/blog/natural-soap.jpg",
  "30-day-bridal-skincare-routine-pakistan": "/images/blog/bridal.jpg",
  "multani-mitti-benefits-for-face-pakistan": "/images/blog/clay-mask.jpg",
  "best-herbal-tea-for-weight-loss-pakistan": "/images/blog/green-tea.jpg",
  "how-to-reduce-bloating-and-gas-naturally-pakistan": "/images/blog/ginger-tea.jpg",
  "detox-tea-benefits-pakistan": "/images/blog/herbal-teapot.jpg",
  "best-time-to-drink-herbal-tea-pakistan": "/images/blog/tea-cup.jpg",
  "complete-guide-herbal-products-pakistan": "/images/blog/dried-herbs.jpg",
  "power-of-mountain-herbs": "/images/blog/mountain-herbs.jpg",
  "understanding-your-hair-type": "/images/blog/hair-types.jpg",
};

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) { console.error("TURSO_DATABASE_URL not set"); process.exit(1); }
  console.log("Targeting DB:", url.split("?")[0]);

  const prisma = new PrismaClient({
    adapter: new PrismaLibSql({ url, authToken: process.env.TURSO_AUTH_TOKEN }),
  });

  const posts = await prisma.blogPost.findMany({ select: { id: true, slug: true, image: true } });
  let fixed = 0, skipped = 0, missing = 0;

  for (const post of posts) {
    const img = IMAGE_BY_SLUG[post.slug];
    if (!img) { missing++; console.log(`⚠  no mapping for slug: ${post.slug}`); continue; }
    if (post.image && post.image.trim() !== "") { skipped++; continue; }
    await prisma.blogPost.update({ where: { id: post.id }, data: { image: img } });
    fixed++;
    console.log(`✓ ${post.slug} -> ${img}`);
  }

  console.log(`\nDone. ${fixed} updated, ${skipped} already had an image, ${missing} unmapped slugs.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
