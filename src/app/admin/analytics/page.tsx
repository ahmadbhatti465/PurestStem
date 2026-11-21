import { prisma } from "@/lib/db";
import { getSectionSession } from "@/lib/admin-auth";
import { REVENUE_STATUSES } from "@/lib/order-status";
import StatCards from "./_components/chart-cards";
import RevenueTrendChart from "./_components/revenue-trend-chart";
import StatusPieChart from "./_components/status-pie-chart";
import MonthlyRevenueChart from "./_components/monthly-revenue-chart";
import TopProductsList from "./_components/top-products-list";
import SummaryFooter from "./_components/summary-footer";
import { FadeIn } from "@/components/animations/fade-in";
import AccessDenied from "../access-denied";

export const dynamic = "force-dynamic";

/** All dates are grouped in the store's time zone, not the server's (UTC on Vercel). */
const TIME_ZONE = "Asia/Karachi";

function dayKey(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: TIME_ZONE }); // YYYY-MM-DD
}
function dayLabel(d: Date) {
  return d.toLocaleDateString("en-US", { timeZone: TIME_ZONE, month: "short", day: "numeric" });
}
function monthKey(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit" });
}
function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { timeZone: TIME_ZONE, month: "short", year: "numeric" });
}

const MONTHS_SHOWN = 12;

async function getAnalytics() {
  const now = new Date();
  const since = new Date(now);
  since.setMonth(since.getMonth() - MONTHS_SHOWN);

  const [statusGroups, revenueAgg, completedAgg, totalProducts, recentOrders, itemSales] =
    await Promise.all([
      prisma.order.groupBy({ by: ["status"], _count: true }),
      prisma.order.aggregate({
        where: { status: { in: REVENUE_STATUSES } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.aggregate({ where: { status: "completed" }, _sum: { total: true } }),
      prisma.product.count(),
      prisma.order.findMany({
        where: { createdAt: { gte: since }, status: { in: REVENUE_STATUSES } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.orderItem.findMany({
        where: { order: { status: { in: REVENUE_STATUSES } } },
        select: { quantity: true, price: true, productName: true, product: { select: { name: true } } },
      }),
    ]);

  const totalOrders = statusGroups.reduce((sum, g) => sum + g._count, 0);
  const revenueOrders = revenueAgg._count;
  const totalRevenue = revenueAgg._sum.total ?? 0;
  const completedRevenue = completedAgg._sum.total ?? 0;
  const pipelineRevenue = totalRevenue - completedRevenue;
  const avgOrderValue = revenueOrders > 0 ? totalRevenue / revenueOrders : 0;
  const cancelledCount = statusGroups.find((g) => g.status === "cancelled")?._count ?? 0;

  const statusPieData = statusGroups.map((g) => ({
    name: g.status.charAt(0).toUpperCase() + g.status.slice(1),
    value: g._count,
  }));

  // Last 30 days, one point per day including days with no orders.
  const daily = new Map<string, { date: string; revenue: number; orders: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    daily.set(dayKey(d), { date: dayLabel(d), revenue: 0, orders: 0 });
  }
  // Last 12 months, oldest first.
  const monthly = new Map<string, { month: string; revenue: number; orders: number }>();
  for (let i = MONTHS_SHOWN - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
    monthly.set(monthKey(d), { month: monthLabel(d), revenue: 0, orders: 0 });
  }
  for (const order of recentOrders) {
    const day = daily.get(dayKey(order.createdAt));
    if (day) {
      day.revenue += order.total;
      day.orders += 1;
    }
    const month = monthly.get(monthKey(order.createdAt));
    if (month) {
      month.revenue += order.total;
      month.orders += 1;
    }
  }
  const round = <T extends { revenue: number }>(rows: T[]) =>
    rows.map((r) => ({ ...r, revenue: Math.round(r.revenue) }));

  const productSales = new Map<string, { quantity: number; revenue: number }>();
  for (const item of itemSales) {
    const name = item.productName || item.product?.name || "Deleted product";
    const entry = productSales.get(name) ?? { quantity: 0, revenue: 0 };
    entry.quantity += item.quantity;
    entry.revenue += item.quantity * item.price;
    productSales.set(name, entry);
  }
  const topProducts = [...productSales.entries()]
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5)
    .map(([name, { quantity }]) => ({
      name: name.length > 32 ? `${name.slice(0, 30)}…` : name,
      quantity,
    }));

  return {
    totalOrders,
    totalRevenue,
    completedRevenue,
    pipelineRevenue,
    avgOrderValue,
    cancelledCount,
    statusPieData,
    areaData: round([...daily.values()]),
    barData: round([...monthly.values()]),
    topProducts,
    totalProducts,
  };
}

const rs = (n: number) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export default async function AnalyticsPage() {
  if (!(await getSectionSession("analytics"))) return <AccessDenied />;
  const data = await getAnalytics();

  const statCards = [
    {
      label: "Revenue",
      value: rs(data.totalRevenue),
      sub: "All orders except cancelled",
      colorClass: "bg-emerald-500/10 text-emerald-600",
      iconName: "DollarSign",
    },
    {
      label: "Collected",
      value: rs(data.completedRevenue),
      sub: "Completed orders",
      colorClass: "bg-green-500/10 text-green-600",
      iconName: "TrendingUp",
    },
    {
      label: "In Progress",
      value: rs(data.pipelineRevenue),
      sub: "Pending, processing, shipped",
      colorClass: "bg-blue-500/10 text-blue-600",
      iconName: "ShoppingBag",
    },
    {
      label: "Avg Order Value",
      value: rs(data.avgOrderValue),
      sub: undefined,
      colorClass: "bg-purple-500/10 text-purple-600",
      iconName: "BarChart3",
    },
    {
      label: "Cancelled",
      value: data.cancelledCount.toLocaleString(),
      sub:
        data.totalOrders > 0
          ? `${Math.round((data.cancelledCount / data.totalOrders) * 100)}% of all orders`
          : undefined,
      colorClass: "bg-red-500/10 text-red-600",
      iconName: "TrendingDown",
    },
  ];

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales &amp; Revenue Analytics</h1>
          <p className="text-gray-500 mt-1">
            Based on recorded orders. Cancelled orders are excluded from revenue. Times in Pakistan time.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <StatCards cards={statCards} />
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <FadeIn delay={0.2}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Daily Revenue (Last 30 Days)</h2>
            <div className="h-72">
              <RevenueTrendChart data={data.areaData} />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status Distribution</h2>
            <div className="h-72">
              <StatusPieChart data={data.statusPieData} />
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <FadeIn delay={0.3}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue (Last 12 Months)</h2>
            <div className="h-72">
              <MonthlyRevenueChart data={data.barData} />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h2>
            <TopProductsList data={data.topProducts} />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.4}>
        <SummaryFooter
          totalProducts={data.totalProducts}
          totalOrders={data.totalOrders}
          avgOrderValue={data.avgOrderValue}
        />
      </FadeIn>
    </div>
  );
}
