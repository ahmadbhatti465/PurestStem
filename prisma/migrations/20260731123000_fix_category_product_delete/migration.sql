-- Cascade delete products when their category is deleted.

-- SQLite does not support altering foreign-key constraints, so recreate the table.
CREATE TABLE "Product_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "salePrice" REAL,
    "image" TEXT,
    "images" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "weight" TEXT,
    "ingredients" TEXT,
    "howToUse" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Product_new" (
    "id", "name", "slug", "description", "price", "salePrice", "image", "images",
    "stock", "sku", "weight", "ingredients", "howToUse", "featured", "isActive",
    "categoryId", "createdAt", "updatedAt"
)
SELECT
    "id", "name", "slug", "description", "price", "salePrice", "image", "images",
    "stock", "sku", "weight", "ingredients", "howToUse", "featured", "isActive",
    "categoryId", "createdAt", "updatedAt"
FROM "Product";

DROP TABLE "Product";

ALTER TABLE "Product_new" RENAME TO "Product";

-- Recreate unique indexes that were dropped with the old table.
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
