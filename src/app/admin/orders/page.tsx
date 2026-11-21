import { prisma } from "@/lib/db";
import { getSectionSession } from "@/lib/admin-auth";
import { isOrderStatus, ORDER_STATUSES, REVENUE_STATUSES } from "@/lib/order-status";
import type { Prisma } from "@/generated/prisma/client";
import OrdersList from "./_components/orders-list";
import AccessDenied from "../access-denied";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  if (!(await getSectionSession("orders"))) return <AccessDenied />;

  const params = await searchParams;
  const status = isOrderStatus(params.status) ? params.status : "all";
  const q = (params.q ?? "").trim().slice(0, 100);
  const requestedPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where: Prisma.OrderWhereInput = {};
  if (status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { id: { contains: q.toLowerCase() } },
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { city: { contains: q } },
      { invoiceNumber: { contains: q.toUpperCase() } },
      { awbNumber: { contains: q } },
      { trackingNumber: { contains: q } },
      { items: { some: { productName: { contains: q } } } },
    ];
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [matching, statusGroups, revenueAgg, todayCount] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.order.aggregate({ where: { status: { in: REVENUE_STATUSES } }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: { select: { name: true, sku: true, weight: true } } } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const counts: Record<string, number> = { all: 0 };
  for (const s of ORDER_STATUSES) counts[s] = 0;
  for (const g of statusGroups) {
    counts[g.status] = g._count;
    counts.all += g._count;
  }

  // Serialize Date objects to ISO strings for the client component
  const rows = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    invoiceGeneratedAt: order.invoiceGeneratedAt?.toISOString() ?? null,
    awbGeneratedAt: order.awbGeneratedAt?.toISOString() ?? null,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        name: item.productName || item.product?.name || "Deleted product",
        sku: item.productSku || item.product?.sku || null,
        weight: item.productWeight || item.product?.weight || null,
      },
    })),
  }));

  return (
    <OrdersList
      // Re-mount when the query changes so local status edits don't leak across pages.
      key={`${status}|${q}|${page}`}
      orders={rows}
      counts={counts}
      totalRevenue={revenueAgg._sum.total ?? 0}
      todayCount={todayCount}
      filter={status}
      search={q}
      page={page}
      totalPages={totalPages}
      matching={matching}
    />
  );
}
