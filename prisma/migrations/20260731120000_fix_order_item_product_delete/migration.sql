-- Allow OrderItem rows to remain when their product is deleted by setting productId to NULL.

-- SQLite does not support dropping foreign-key constraints directly, so recreate the table.
CREATE TABLE "OrderItem_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "OrderItem_new" ("id", "orderId", "productId", "quantity", "price")
SELECT "id", "orderId", "productId", "quantity", "price" FROM "OrderItem";

DROP TABLE "OrderItem";

ALTER TABLE "OrderItem_new" RENAME TO "OrderItem";
