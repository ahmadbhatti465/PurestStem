import { prisma } from "@/lib/db";
import OrderStatusUpdate from "./order-status";
import { FadeIn } from "@/components/animations/fade-in";

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900">{order.name}</div>
                      <div className="text-gray-500 text-xs">{order.phone}</div>
                      <div className="text-gray-500 text-xs">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-xs text-gray-700">
                            {item.product.name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Rs {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
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
