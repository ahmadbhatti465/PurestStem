import { prisma } from "@/lib/db";
import OrderStatusUpdate from "./order-status";
import { FadeIn } from "@/components/animations/fade-in";
import {
  Package, MapPin, Phone, Mail, User, CreditCard, Truck, Calendar, Hash, ArrowRight,
} from "lucide-react";

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
            <p className="text-gray-500 mt-1">{orders.length} total orders</p>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-6">
        {orders.map((order) => (
          <FadeIn key={order.id} delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-[#0f2e1c] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Hash className="w-4 h-4 text-green-300" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      #{order.id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-200/70">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-200/60">Total</p>
                  <p className="text-xl font-bold text-white">
                    Rs {order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6 grid lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 font-medium">{order.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-500">{order.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-500">{order.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-900">{order.address}</p>
                    <p className="text-gray-500">{order.city}</p>
                    {order.postalCode && (
                      <p className="text-gray-500">Postal: {order.postalCode}</p>
                    )}
                  </div>
                  {order.notes && (
                    <div className="bg-yellow-50 rounded-xl p-3 text-sm border border-yellow-100">
                      <p className="text-yellow-800 font-medium text-xs mb-1">Order Notes:</p>
                      <p className="text-yellow-700">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    Payment &amp; Shipping
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-900 font-medium capitalize">
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-500">
                        Rs {order.shippingCost?.toLocaleString() ?? 190} ({order.shippingCost === 0 ? "Free Shipping" : "Standard Shipping"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-100 px-6 py-5">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4 text-sm">
                  <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  Order Items ({order.items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                        <th className="pb-2 pr-4 font-medium">Product</th>
                        <th className="pb-2 pr-4 font-medium">SKU</th>
                        <th className="pb-2 pr-4 text-right font-medium">Qty</th>
                        <th className="pb-2 pr-4 text-right font-medium">Unit</th>
                        <th className="pb-2 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 pr-4">
                            <div className="font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-xs text-gray-400">{item.product.weight}</div>
                          </td>
                          <td className="py-3 pr-4 text-gray-400 text-xs">{item.product.sku || "—"}</td>
                          <td className="py-3 pr-4 text-right">{item.quantity}</td>
                          <td className="py-3 pr-4 text-right">Rs {item.price.toLocaleString()}</td>
                          <td className="py-3 text-right font-medium">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-100">
                      <tr>
                        <td colSpan={4} className="py-3 pr-4 text-right text-gray-500 text-sm">Subtotal</td>
                        <td className="py-3 text-right font-medium">Rs {(order.total - (order.shippingCost ?? 190)).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="py-1 pr-4 text-right text-gray-500 text-sm">Shipping</td>
                        <td className="py-1 text-right text-sm">Rs {order.shippingCost?.toLocaleString() ?? 190}</td>
                      </tr>
                      <tr className="font-bold text-gray-900">
                        <td colSpan={4} className="py-3 pr-4 text-right">Grand Total</td>
                        <td className="py-3 text-right text-lg">Rs {order.total.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}

        {orders.length === 0 && (
          <FadeIn>
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
              <p className="text-gray-500">Orders will appear here when customers place them.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
