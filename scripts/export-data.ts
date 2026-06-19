import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";

const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("📦 Fetching all local data...");

  const data = {
    categories: await prisma.category.findMany(),
    products: await prisma.product.findMany(),
    users: await prisma.user.findMany(),
    orders: await prisma.order.findMany(),
    orderItems: await prisma.orderItem.findMany(),
    blogPosts: await prisma.blogPost.findMany(),
    cartItems: await prisma.cartItem.findMany(),
    reviews: await prisma.review.findMany(),
    contactMessages: await prisma.contactMessage.findMany(),
  };

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/backup.json", JSON.stringify(data, null, 2));
  console.log("✅ Data exported to data/backup.json");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
