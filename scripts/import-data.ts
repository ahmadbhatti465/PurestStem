import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  if (!fs.existsSync("data/backup.json")) {
    console.error("❌ data/backup.json not found. Run 'npm run db:export' first.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync("data/backup.json", "utf-8"));

  console.log("🔄 Importing categories...");
  for (const item of data.categories) {
    await prisma.category.create({ data: item });
  }

  console.log("🔄 Importing products...");
  for (const item of data.products) {
    await prisma.product.create({ data: item });
  }

  console.log("🔄 Importing users...");
  for (const item of data.users) {
    await prisma.user.create({ data: item });
  }

  console.log("🔄 Importing orders...");
  for (const item of data.orders) {
    await prisma.order.create({ data: item });
  }

  console.log("🔄 Importing orderItems...");
  for (const item of data.orderItems) {
    await prisma.orderItem.create({ data: item });
  }

  console.log("🔄 Importing blogPosts...");
  for (const item of data.blogPosts) {
    await prisma.blogPost.create({ data: item });
  }

  console.log("🔄 Importing cartItems...");
  for (const item of data.cartItems) {
    await prisma.cartItem.create({ data: item });
  }

  console.log("🔄 Importing reviews...");
  for (const item of data.reviews) {
    await prisma.review.create({ data: item });
  }

  console.log("🔄 Importing contactMessages...");
  for (const item of data.contactMessages) {
    await prisma.contactMessage.create({ data: item });
  }

  console.log("✅ Data imported successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
