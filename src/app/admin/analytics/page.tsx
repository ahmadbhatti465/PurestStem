import { prisma } from "@/lib/db";
import StatCards from "./_components/chart-cards";
import RevenueTrendChart from "./_components/revenue-trend-chart";
import StatusPieChart from "./_components/status-pie-chart";
import MonthlyRevenueChart from "./_components/monthly-revenue-chart";
import TopProductsList from "./_components/top-products-list";
import SummaryFooter from "./_components/summary-footer";
import { FadeIn } from "@/components/animations/fade-in";
import { BarChart3, DollarSign, ShoppingBag, TrendingUp, TrendingDown } from "lucide-react";

async function getAnalytics() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const products = await prisma.product.findMany();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const estimatedProfit = totalRevenue * 0.35;
  const estimatedLoss = Math.max(0, totalRevenue * 0.05);
  const netProfit = estimatedProfit - estimatedLoss;

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const statusPieData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const dailyRevenue = orders
    .filter((o) => new Date(o.createdAt) >= last30Days)
    .reduce((acc, o) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + o.total;
      return acc;
    }, {} as Record<string, number>);

  const areaData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue),
    profit: Math.round(revenue * 0.35),
  }));

  const monthlyRevenue = orders.reduce((acc, o) => {
    const month = new Date(o.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue),
    profit: Math.round(revenue * 0.35),
  }));

  const productSales = orders
    .flatMap((o) => o.items)
    .reduce((acc, item) => {
      const name = item.product.name;
      acc[name] = (acc[name] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({
      name: name.split(" ").slice(0, 3).join(" ") + "...",
      quantity,
    }));

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    estimatedProfit,
    estimatedLoss,
    netProfit,
    statusPieData,
    areaData,
    barData,
    topProducts,
    totalProducts: products.length,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  const statCards = [
    {
      label: "Total Revenue",
      value: `Rs ${Math.round(data.totalRevenue).toLocaleString()}`,
      sub: undefined,
      colorClass: "bg-emerald-500/10 text-emerald-600",
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      sub: undefined,
      colorClass: "bg-blue-500/10 text-blue-600",
      icon: ShoppingBag,
    },
    {
      label: "Avg Order Value",
      value: `Rs ${Math.round(data.avgOrderValue).toLocaleString()}`,
      sub: undefined,
      colorClass: "bg-purple-500/10 text-purple-600",
      icon: BarChart3,
    },
    {
      label: "Est. Net Profit",
      value: `Rs ${Math.round(data.netProfit).toLocaleString()}`,
      sub: `Margin: ~${data.totalRevenue > 0 ? Math.round((data.netProfit / data.totalRevenue) * 100) : 0}%`,
      colorClass: "bg-green-500/10 text-green-600",
      icon: TrendingUp,
    },
    {
      label: "Est. Overheads",
      value: `Rs ${Math.round(data.estimatedLoss).toLocaleString()}`,
      sub: undefined,
      colorClass: "bg-red-500/10 text-red-600",
      icon: TrendingDown,
    },
  ];

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sales &amp; Revenue Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Financial overview of your store performance
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <StatCards cards={statCards} />
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <FadeIn delay={0.2}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Revenue &amp; Profit Trend (Last 30 Days)
            </h2>
            <div className="h-72">
              <RevenueTrendChart data={data.areaData} />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Status Distribution
            </h2>
            <div className="h-72">
              <StatusPieChart data={data.statusPieData} />
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <FadeIn delay={0.3}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Monthly Revenue &amp; Profit
            </h2>
            <div className="h-72">
              <MonthlyRevenueChart data={data.barData} />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Top Selling Products
            </h2>
            <TopProductsList data={data.topProducts} />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.4}>
        <SummaryFooter
          totalProducts={data.totalProducts}
          totalOrders={data.totalOrders}
          netProfit={data.netProfit}
        />
      </FadeIn>
    </div>
  );
}
