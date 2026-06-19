"use client";

import { useState, useMemo } from "react";
import {
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Truck,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Hash,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    sku: string | null;
    weight: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  shippingCost: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string | null;
  notes: string | null;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: typeof AlertCircle }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertCircle,
  },
  processing: {
    label: "Processing",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: Loader2,
  },
  shipped: {
    label: "Shipped",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: Truck,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
  },
};

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    full: date.toLocaleDateString("en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function isNewOrder(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  return now.getTime() - date.getTime() < 24 * 60 * 60 * 1000;
}

function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setStatus(currentStatus);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none text-xs font-semibold rounded-lg pl-2.5 pr-7 py-1.5 border focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer transition-all bg-white ${
          loading ? "opacity-50" : ""
        }`}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    const todayCount = orders.filter(
      (o) => new Date(o.createdAt) >= todayStart
    ).length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    return { total: orders.length, pending, processing, shipped, todayCount, totalRevenue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (filter !== "all") {
      result = result.filter((o) => o.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.items.some((i) => i.product.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [orders, filter, search]);

  const statusFilters = [
    { key: "all", label: "All Orders", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "processing", label: "Processing", count: stats.processing },
    { key: "shipped", label: "Shipped", count: stats.shipped },
    { key: "completed", label: "Completed", count: 0 },
    { key: "cancelled", label: "Cancelled", count: 0 },
  ];

  // Update counts for completed and cancelled
  statusFilters[4].count = orders.filter((o) => o.status === "completed").length;
  statusFilters[5].count = orders.filter((o) => o.status === "cancelled").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                Rs {Math.round(stats.totalRevenue).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Today</p>
              <p className="text-xl font-bold text-gray-900">{stats.todayCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {statusFilters.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                filter === s.key
                  ? "bg-[#1a4a2e] text-white border-[#1a4a2e]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {s.label}
              <span
                className={`ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-xs font-semibold ${
                  filter === s.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 text-sm">
              {search ? "Try adjusting your search or filters" : "Orders will appear here when customers place them"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredOrders.map((order) => {
              const dt = formatDateTime(order.createdAt);
              const _new = isNewOrder(order.createdAt);
              const expanded = expandedId === order.id;
              const shortId = order.id.slice(-6).toUpperCase();
              const shipping = order.shippingCost ?? 190;

              return (
                <div key={order.id} className="group">
                  {/* Row */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-50/60 transition-colors flex items-center gap-4"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Hash className="w-4 h-4 text-gray-500" />
                    </div>

                    <div className="min-w-[90px] shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900">#{shortId}</span>
                        {_new && (
                          <span className="px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(order.createdAt)}
                      </div>
                    </div>

                    <div className="hidden md:block min-w-[160px] shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {dt.date}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{dt.time}</div>
                    </div>

                    <div className="flex-1 min-w-0 hidden sm:block">
                      <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium truncate">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{order.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{order.email}</span>
                        </span>
                      </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 text-xs text-gray-500 shrink-0 w-[100px]">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </div>

                    <div className="text-right shrink-0 min-w-[90px]">
                      <p className="font-semibold text-sm text-gray-900">
                        Rs {order.total.toLocaleString()}
                      </p>
                      <div className="mt-1">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="shrink-0 w-8 flex justify-end">
                      {expanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {expanded && (
                    <div className="px-5 pb-5 pt-1">
                      <div className="bg-gray-50/70 rounded-xl border border-gray-100 overflow-hidden">
                        {/* Top bar */}
                        <div className="px-4 py-3 bg-[#1a4a2e] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-white/90 text-sm">
                            <Hash className="w-4 h-4 text-green-300" />
                            Order #{shortId}
                            <span className="text-white/30">|</span>
                            <Calendar className="w-4 h-4 text-green-300" />
                            {dt.full}
                          </div>
                          <div className="flex items-center gap-2">
                            <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                          </div>
                        </div>

                        <div className="p-4 grid lg:grid-cols-3 gap-4">
                          {/* Customer */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Customer
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-gray-900 font-medium">{order.name}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-gray-500">{order.email}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-gray-500">{order.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Shipping
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-gray-900">{order.address}</p>
                                  <p className="text-gray-500">{order.city}</p>
                                  {order.postalCode && (
                                    <p className="text-gray-500">{order.postalCode}</p>
                                  )}
                                </div>
                              </div>
                              {order.notes && (
                                <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100 text-xs text-amber-700 mt-2">
                                  <span className="font-semibold text-amber-800">Note: </span>
                                  {order.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payment */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Payment
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-gray-900 font-medium capitalize">
                                  {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : order.paymentMethod}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Truck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-gray-500">
                                  Rs {shipping.toLocaleString()} —{" "}
                                  {shipping === 0 ? "Free" : "Standard"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items Table */}
                        <div className="px-4 pb-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Order Items ({order.items.length})
                          </h4>
                          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-50 text-left text-xs text-gray-400 border-b border-gray-100">
                                  <th className="py-2.5 px-3 font-medium">Product</th>
                                  <th className="py-2.5 px-3 font-medium">SKU</th>
                                  <th className="py-2.5 px-3 text-right font-medium">Qty</th>
                                  <th className="py-2.5 px-3 text-right font-medium">Unit</th>
                                  <th className="py-2.5 px-3 text-right font-medium">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                  <tr key={item.id}>
                                    <td className="py-2.5 px-3">
                                      <div className="font-medium text-gray-900">
                                        {item.product.name}
                                      </div>
                                      {item.product.weight && (
                                        <div className="text-xs text-gray-400">
                                          {item.product.weight}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 text-gray-400 text-xs">
                                      {item.product.sku || "—"}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">{item.quantity}</td>
                                    <td className="py-2.5 px-3 text-right">
                                      Rs {item.price.toLocaleString()}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-medium text-gray-900">
                                      Rs {(item.price * item.quantity).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="border-t-2 border-gray-100 bg-gray-50/50">
                                <tr>
                                  <td colSpan={4} className="py-2 px-3 text-right text-gray-500 text-xs">
                                    Subtotal
                                  </td>
                                  <td className="py-2 px-3 text-right font-medium text-sm text-gray-900">
                                    Rs {(order.total - shipping).toLocaleString()}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={4} className="py-1 px-3 text-right text-gray-500 text-xs">
                                    Shipping
                                  </td>
                                  <td className="py-1 px-3 text-right text-sm text-gray-900">
                                    Rs {shipping.toLocaleString()}
                                  </td>
                                </tr>
                                <tr className="font-bold">
                                  <td colSpan={4} className="py-2.5 px-3 text-right text-gray-900">
                                    Grand Total
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-base text-[#1a4a2e]">
                                    Rs {order.total.toLocaleString()}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer count */}
      {filteredOrders.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      )}
    </div>
  );
}
