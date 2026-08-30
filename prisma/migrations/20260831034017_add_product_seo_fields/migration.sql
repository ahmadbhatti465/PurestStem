-- Migration: Add SEO and structured content fields to Product
-- This migration is safe to run on existing databases with data.
-- All new columns are nullable / have defaults so no data is lost.

-- Product SEO & identity fields
ALTER TABLE "Product" ADD COLUMN "shortDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "brand" TEXT;
ALTER TABLE "Product" ADD COLUMN "productType" TEXT;
ALTER TABLE "Product" ADD COLUMN "condition" TEXT DEFAULT 'New';
ALTER TABLE "Product" ADD COLUMN "gtin" TEXT;
ALTER TABLE "Product" ADD COLUMN "mpn" TEXT;
ALTER TABLE "Product" ADD COLUMN "unit" TEXT DEFAULT 'piece';
ALTER TABLE "Product" ADD COLUMN "weightValue" REAL;
ALTER TABLE "Product" ADD COLUMN "weightUnit" TEXT DEFAULT 'ml';

-- Product status & publishing
ALTER TABLE "Product" ADD COLUMN "status" TEXT DEFAULT 'published';
ALTER TABLE "Product" ADD COLUMN "publishedAt" DATETIME;
ALTER TABLE "Product" ADD COLUMN "scheduledAt" DATETIME;

-- Structured rich content (stored as JSON strings)
ALTER TABLE "Product" ADD COLUMN "structuredIngredients" TEXT;
ALTER TABLE "Product" ADD COLUMN "structuredHowToUse" TEXT;
ALTER TABLE "Product" ADD COLUMN "benefits" TEXT;
ALTER TABLE "Product" ADD COLUMN "features" TEXT;
ALTER TABLE "Product" ADD COLUMN "faqs" TEXT;

-- Image metadata (JSON array with alt text, dimensions, sortOrder)
ALTER TABLE "Product" ADD COLUMN "imageMetadata" TEXT;

-- SEO metadata fields
ALTER TABLE "Product" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN "seoDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "focusKeyword" TEXT;
ALTER TABLE "Product" ADD COLUMN "secondaryKeywords" TEXT;
ALTER TABLE "Product" ADD COLUMN "canonicalUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN "robotsIndex" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Product" ADD COLUMN "robotsFollow" BOOLEAN NOT NULL DEFAULT true;

-- Open Graph social metadata
ALTER TABLE "Product" ADD COLUMN "ogTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN "ogDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "ogImage" TEXT;

-- Twitter/X card metadata
ALTER TABLE "Product" ADD COLUMN "twitterTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN "twitterDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "twitterImage" TEXT;

-- Internal cross-linking (JSON arrays of related IDs)
ALTER TABLE "Product" ADD COLUMN "relatedProductIds" TEXT;
ALTER TABLE "Product" ADD COLUMN "relatedBlogIds" TEXT;

-- Redirect table for 301 slug redirects (create if not exists)
CREATE TABLE IF NOT EXISTS "Redirect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourcePath" TEXT NOT NULL,
    "targetPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Unique index on sourcePath (safe: CREATE UNIQUE INDEX IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS "Redirect_sourcePath_key" ON "Redirect"("sourcePath");
