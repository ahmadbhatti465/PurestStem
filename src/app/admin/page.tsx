import { prisma } from "@/lib/db";
import { Package, Users, ShoppingBag, DollarSign } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";

async function getStats() {
  const [totalOrders, totalProducts, totalUsers, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
  ]);

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: totalRevenue._sum.total || 0,
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

export default async function AdminPage() {
  const stats = await getStats();
  const recentOrders = await getRecentOrders();

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store</p>
        </div>
      </FadeIn>

      <StaggerContainer
        staggerDelay={0.1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StaggerItem>
          <Link href="/admin/orders" className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow duration-300 block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <Link href="/admin/products" className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow duration-300 block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <Link href="/admin/users" className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow duration-300 block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white p-6 rounded-xl border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs {stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-green-700 hover:underline font-medium"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900">{order.name}</div>
                      <div className="text-gray-500 text-xs">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Rs {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
