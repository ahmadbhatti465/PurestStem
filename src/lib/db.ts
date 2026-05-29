import { PrismaClient } from "@prisma/client";
import { PrismaSqlite } from "prisma-adapter-sqlite";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaSqlite({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
