-- Order item snapshots: keep product name/SKU/weight on the order line so
-- order history and invoices survive product edits and deletion.
ALTER TABLE "OrderItem" ADD COLUMN "productName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "productSku" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "productWeight" TEXT;

UPDATE "OrderItem"
SET "productName" = (SELECT "name" FROM "Product" WHERE "Product"."id" = "OrderItem"."productId"),
    "productSku" = (SELECT "sku" FROM "Product" WHERE "Product"."id" = "OrderItem"."productId"),
    "productWeight" = (SELECT "weight" FROM "Product" WHERE "Product"."id" = "OrderItem"."productId")
WHERE "productId" IS NOT NULL AND "productName" IS NULL;

-- Scheduled products are now "active but not yet due"; visibility is decided by scheduledAt.
UPDATE "Product" SET "isActive" = 1 WHERE "status" = 'scheduled';

-- Audit log of admin actions.
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
