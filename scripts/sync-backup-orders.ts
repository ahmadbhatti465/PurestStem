import "dotenv/config";
import { prisma } from "../src/lib/db";
import fs from "fs";

async function main() {
  const data = JSON.parse(fs.readFileSync("data/backup.json", "utf-8"));

  console.log("Checking and importing orders from backup...");
  for (const order of data.orders) {
    const existing = await prisma.order.findUnique({ where: { id: order.id } });
    if (!existing) {
      console.log(`Creating order ${order.id}...`);
      await prisma.order.create({ data: order });
    }
  }

  const products = await prisma.product.findMany();
  console.log("Current DB Products:", products.map((p) => ({ id: p.id, slug: p.slug, name: p.name })));
  const backupProducts = data.products as { id: string; slug: string; name: string }[];

  for (const item of data.orderItems) {
    const existing = await prisma.orderItem.findUnique({ where: { id: item.id } });
    if (!existing) {
      // Find matching product by backup product ID or slug
      const backupProd = backupProducts.find((bp) => bp.id === item.productId);
      const matchedProd = products.find((p) => p.slug === backupProd?.slug || p.id === item.productId) || products[0];

      console.log(`Creating orderItem ${item.id} with product ${matchedProd?.name}...`);
      await prisma.orderItem.create({
        data: {
          id: item.id,
          orderId: item.orderId,
          productId: matchedProd ? matchedProd.id : null,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }
  }

  const count = await prisma.order.count();
  console.log(`✅ Total orders in database: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
