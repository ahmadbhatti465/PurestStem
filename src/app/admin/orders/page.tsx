import { prisma } from "@/lib/db";
import OrderStatusUpdate from "./order-status";
import { FadeIn } from "@/components/animations/fade-in";
import { Package, MapPin, Phone, Mail, User, CreditCard, Truck, Calendar, Hash } from "lucide-react";

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
            <p className="text-gray-600 mt-1">{orders.length} total orders</p>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-6">
        {orders.map((order) => (
          <FadeIn key={order.id} delay={0.1}>
            <div className="bg-white rounded-xl border overflow-hidden">
              {/* Order Header */}
              <div className="bg-green-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-semibold text-gray-900">#{order.id.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-700" />
                    <span className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-900">Rs {order.total.toLocaleString()}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6 grid lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-700" />
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 font-medium">{order.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">{order.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">{order.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-700" />
                    Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-900">{order.address}</p>
                    <p className="text-gray-600">{order.city}</p>
                    {order.postalCode && (
                      <p className="text-gray-600">Postal Code: {order.postalCode}</p>
                    )}
                  </div>
                  {order.notes && (
                    <div className="bg-yellow-50 rounded-lg p-3 text-sm">
                      <p className="text-yellow-800 font-medium text-xs mb-1">Order Notes:</p>
                      <p className="text-yellow-700">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-700" />
                    Payment & Shipping
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900 font-medium capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">
                        Rs {order.shippingCost?.toLocaleString() ?? 190} ({order.shippingCost === 0 ? "Free Shipping" : "Standard Shipping"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t px-6 py-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-green-700" />
                  Order Items ({order.items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b">
                        <th className="pb-2 pr-4">Product</th>
                        <th className="pb-2 pr-4">SKU</th>
                        <th className="pb-2 pr-4 text-right">Qty</th>
                        <th className="pb-2 pr-4 text-right">Unit Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 pr-4">
                            <div className="font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-xs text-gray-500">{item.product.weight}</div>
                          </td>
                          <td className="py-2 pr-4 text-gray-500 text-xs">{item.product.sku || "—"}</td>
                          <td className="py-2 pr-4 text-right">{item.quantity}</td>
                          <td className="py-2 pr-4 text-right">Rs {item.price.toLocaleString()}</td>
                          <td className="py-2 text-right font-medium">Rs {(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2">
                      <tr>
                        <td colSpan={4} className="py-2 pr-4 text-right text-gray-500">Subtotal</td>
                        <td className="py-2 text-right font-medium">Rs {(order.total - (order.shippingCost ?? 190)).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-1 pr-4 text-right text-gray-500">Shipping</td>
                        <td className="py-1 text-right">Rs {order.shippingCost?.toLocaleString() ?? 190}</td>
                      </tr>
                      <tr className="font-bold text-gray-900">
                        <td colSpan={4} className="py-2 pr-4 text-right">Grand Total</td>
                        <td className="py-2 text-right text-lg">Rs {order.total.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
