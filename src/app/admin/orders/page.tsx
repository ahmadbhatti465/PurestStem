import { prisma } from "@/lib/db";
import OrdersList from "./_components/orders-list";

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Date objects to ISO strings for the client component
  return orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      product: {
        name: item.product.name,
        sku: item.product.sku,
        weight: item.product.weight,
      },
    })),
  }));
}

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersList orders={orders} />;
}
