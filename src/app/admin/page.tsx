import { prisma } from "@/lib/db";
import {
  Package, Users, ShoppingBag, DollarSign, Mail, ArrowRight, TrendingUp, TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

async function getStats() {
  const [totalOrders, totalProducts, totalUsers, totalRevenue, unreadMessages] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: totalRevenue._sum.total || 0,
    unreadMessages,
  };
}

async function getRecentOrders() {
  return await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

async function getRecentMessages() {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminPage() {
  const stats = await getStats();
  const recentOrders = await getRecentOrders();
  const recentMessages = await getRecentMessages();

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "bg-blue-500/10 text-blue-600",
      trend: "up",
    },
    {
      label: "Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
      color: "bg-green-500/10 text-green-600",
      trend: "up",
    },
    {
      label: "Users",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500/10 text-purple-600",
      trend: "up",
    },
    {
      label: "Revenue",
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      href: "/admin/analytics",
      color: "bg-emerald-500/10 text-emerald-600",
      trend: "up",
    },
    {
      label: "Messages",
      value: stats.unreadMessages,
      icon: Mail,
      href: "/admin/messages",
      color: "bg-orange-500/10 text-orange-600",
      trend: "down",
    },
  ];

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your store performance</p>
        </div>
      </FadeIn>

      <StaggerContainer
        staggerDelay={0.1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8"
      >
        {statCards.map((stat) => (
          <StaggerItem key={stat.label}>
            <Link
              href={stat.href}
              className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm text-green-700 font-medium hover:text-green-800 inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-green-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-900">{order.name}</div>
                      <div className="text-xs text-gray-400">{order.email}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {order.items.length} items
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      Rs {order.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {recentMessages.length > 0 && (
        <FadeIn delay={0.4}>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-6">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
              </div>
              <Link
                href="/admin/messages"
                className="text-sm text-green-700 font-medium hover:text-green-800 inline-flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-green-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{msg.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{msg.email}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{msg.subject || "—"}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            msg.read
                              ? "bg-gray-100 text-gray-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {msg.read ? "Read" : "New"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
