"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  FileText,
  Download,
  Printer,
  Eye,
  Layers,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import OrderDocumentsModal from "@/components/admin/order-documents-modal";
import OrderShippingEditor from "@/components/admin/order-shipping-editor";

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
  invoiceNumber?: string | null;
  awbNumber?: string | null;
  trackingNumber?: string | null;
  courier?: string | null;
  invoiceGeneratedAt?: string | null;
  awbGeneratedAt?: string | null;
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

/** Fixed time zone so the server render and the browser render produce the same text. */
const TIME_ZONE = "Asia/Karachi";

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
  return date.toLocaleDateString("en-PK", { day: "numeric", month: "short", timeZone: TIME_ZONE });
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: TIME_ZONE,
    }),
    time: date.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE }),
    full: date.toLocaleString("en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TIME_ZONE,
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
  status,
  onChanged,
}: {
  orderId: string;
  status: string;
  onChanged: (status: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const select = e.target;
    const newStatus = select.value;
    if (newStatus === status) return;
    if (newStatus === "cancelled" && !confirm("Cancel this order? Its items will be returned to stock.")) {
      select.value = status;
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to update status");
      onChanged(newStatus);
    } catch (err) {
      select.value = status;
      alert(err instanceof Error ? err.message : "Failed to update status");
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

interface OrdersListProps {
  orders: Order[];
  counts: Record<string, number>;
  totalRevenue: number;
  todayCount: number;
  filter: string;
  search: string;
  page: number;
  totalPages: number;
  matching: number;
}

export default function OrdersList({
  orders: initialOrders,
  counts: initialCounts,
  totalRevenue,
  todayCount,
  filter,
  search: initialSearch,
  page,
  totalPages,
  matching,
}: OrdersListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, startTransition] = useTransition();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [counts, setCounts] = useState(initialCounts);
  const [search, setSearch] = useState(initialSearch);
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Document modal preview state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewOrderId, setPreviewOrderId] = useState<string>("");
  const [previewOrderShortId, setPreviewOrderShortId] = useState<string>("");
  const [previewDocType, setPreviewDocType] = useState<"invoice" | "awb" | "combined">("invoice");

  // Document download loading states
  const [downloadingState, setDownloadingState] = useState<Record<string, "invoice" | "awb" | "combined" | null>>({});

  // Relative times ("5m ago", "New") depend on the clock, so only show them after mount.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Close the actions menu on any click outside it, or on Escape.
  useEffect(() => {
    if (!activeDropdownId) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-order-menu]")) setActiveDropdownId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDropdownId(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [activeDropdownId]);

  function navigate(next: { status?: string; q?: string; page?: number }) {
    const params = new URLSearchParams();
    const status = next.status ?? filter;
    const q = next.q ?? search;
    const p = next.page ?? 1;
    if (status !== "all") params.set("status", status);
    if (q.trim()) params.set("q", q.trim());
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  }

  // Debounced server-side search.
  useEffect(() => {
    if (search.trim() === initialSearch) return;
    const t = setTimeout(() => navigate({ q: search, page: 1 }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function handleStatusChanged(orderId: string, from: string, to: string) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: to } : o)));
    setCounts((prev) => ({
      ...prev,
      [from]: Math.max(0, (prev[from] ?? 0) - 1),
      [to]: (prev[to] ?? 0) + 1,
    }));
    // Revenue and stock figures come from the server; refresh them quietly.
    router.refresh();
  }

  const stats = {
    total: counts.all ?? 0,
    pending: counts.pending ?? 0,
    todayCount,
    totalRevenue,
  };
  const filteredOrders = orders;

  const handleDownload = async (
    orderId: string,
    type: "invoice" | "awb" | "combined",
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
    }
    setDownloadingState((prev) => ({ ...prev, [orderId]: type }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/${type}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Unable to download ${type}. Please try again.`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Extract filename from header or construct fallback
      const contentDisposition = res.headers.get("content-disposition");
      let filename = `PurestStem-${type}-${orderId.slice(-6).toUpperCase()}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : `Unable to download ${type}. Please try again.`);
    } finally {
      setDownloadingState((prev) => ({ ...prev, [orderId]: null }));
    }
  };

  const handleOpenPreview = (
    orderId: string,
    shortId: string,
    type: "invoice" | "awb" | "combined",
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
    }
    setActiveDropdownId(null);
    setPreviewOrderId(orderId);
    setPreviewOrderShortId(shortId);
    setPreviewDocType(type);
    setPreviewModalOpen(true);
  };

  const handleShippingSaved = (
    orderId: string,
    data: { courier: string | null; awbNumber: string | null; trackingNumber: string | null }
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              courier: data.courier,
              awbNumber: data.awbNumber,
              trackingNumber: data.trackingNumber,
            }
          : o
      )
    );
  };

  const statusFilters = [
    { key: "all", label: "All Orders", count: counts.all ?? 0 },
    { key: "pending", label: "Pending", count: counts.pending ?? 0 },
    { key: "processing", label: "Processing", count: counts.processing ?? 0 },
    { key: "shipped", label: "Shipped", count: counts.shipped ?? 0 },
    { key: "completed", label: "Completed", count: counts.completed ?? 0 },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled ?? 0 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage customer orders, invoices, and AWB shipping labels
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
              <p className="text-xs text-gray-500">Revenue (excl. cancelled)</p>
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
              onClick={() => navigate({ status: s.key, page: 1 })}
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
            placeholder="Search orders, invoices, tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      {/* Orders Table Container */}
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
              const _new = mounted && isNewOrder(order.createdAt);
              const expanded = expandedId === order.id;
              const shortId = order.id.slice(-6).toUpperCase();
              const shipping = order.shippingCost ?? 190;
              const isCurrentDownloading = downloadingState[order.id];
              const isDropdownOpen = activeDropdownId === order.id;

              return (
                <div key={order.id} className="group">
                  {/* Table Row */}
                  <div
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    className="w-full text-left px-4 sm:px-5 py-4 hover:bg-gray-50/70 transition-colors flex flex-wrap lg:flex-nowrap items-center gap-3 sm:gap-4 cursor-pointer"
                  >
                    {/* Order icon + Short ID */}
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Hash className="w-4 h-4 text-gray-500" />
                    </div>

                    <div className="min-w-[90px] shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">#{shortId}</span>
                        {_new && (
                          <span className="px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {mounted ? formatRelativeTime(order.createdAt) : dt.date}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="hidden md:block min-w-[130px] shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {dt.date}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{dt.time}</div>
                    </div>

                    {/* Customer Info (NO EMAIL ON DOCUMENTS) */}
                    <div className="flex-1 min-w-[140px] hidden sm:block">
                      <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium truncate">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{order.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{order.phone}</span>
                        <span className="text-gray-300">•</span>
                        <span>{order.city}</span>
                      </div>
                    </div>

                    {/* Items count */}
                    <div className="hidden xl:flex items-center gap-1 text-xs text-gray-500 shrink-0 w-[90px]">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </div>

                    {/* Total & Status */}
                    <div className="text-right shrink-0 min-w-[95px] ml-auto sm:ml-0">
                      <p className="font-bold text-sm text-gray-900">
                        Rs {order.total.toLocaleString()}
                      </p>
                      <div className="mt-1">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Actions Column (Compact buttons + Dropdown) */}
                    <div
                      className="flex items-center gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Direct Invoice Download Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDownload(order.id, "invoice", e)}
                        disabled={isCurrentDownloading === "invoice"}
                        title="Download Invoice PDF"
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs"
                      >
                        {isCurrentDownloading === "invoice" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                        <span className="hidden md:inline">Invoice</span>
                      </button>

                      {/* Direct AWB Download Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDownload(order.id, "awb", e)}
                        disabled={isCurrentDownloading === "awb"}
                        title="Download AWB Shipping Label PDF"
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1a4a2e]/10 hover:bg-[#1a4a2e]/20 text-[#1a4a2e] border border-[#1a4a2e]/20 transition-colors shadow-2xs"
                      >
                        {isCurrentDownloading === "awb" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1a4a2e]" />
                        ) : (
                          <Truck className="w-3.5 h-3.5 text-[#1a4a2e]" />
                        )}
                        <span className="hidden md:inline">AWB</span>
                      </button>

                      {/* More / Combined Dropdown Menu */}
                      <div className="relative" data-order-menu>
                        <button
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded={isDropdownOpen}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(isDropdownOpen ? null : order.id);
                          }}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                          title="More Document Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in-50 zoom-in-95">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                              Order #{shortId} Actions
                            </div>

                            {/* Mobile only quick downloads */}
                            <div className="sm:hidden border-b border-gray-100 pb-1">
                              <button
                                onClick={(e) => {
                                  setActiveDropdownId(null);
                                  handleDownload(order.id, "invoice", e);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                Download Invoice
                              </button>
                              <button
                                onClick={(e) => {
                                  setActiveDropdownId(null);
                                  handleDownload(order.id, "awb", e);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Truck className="w-3.5 h-3.5 text-[#1a4a2e]" />
                                Download AWB
                              </button>
                            </div>

                            {/* Combined Download */}
                            <button
                              onClick={(e) => {
                                setActiveDropdownId(null);
                                handleDownload(order.id, "combined", e);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#1a4a2e] flex items-center gap-2 font-medium"
                            >
                              <Layers className="w-3.5 h-3.5 text-[#1a4a2e]" />
                              Download Invoice + AWB
                            </button>

                            {/* Preview Actions */}
                            <button
                              onClick={(e) => handleOpenPreview(order.id, shortId, "invoice", e)}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                              Preview Invoice
                            </button>

                            <button
                              onClick={(e) => handleOpenPreview(order.id, shortId, "awb", e)}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                              Preview AWB Label
                            </button>

                            <button
                              onClick={() => {
                                setActiveDropdownId(null);
                                setExpandedId(expanded ? null : order.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                            >
                              <Package className="w-3.5 h-3.5 text-gray-500" />
                              {expanded ? "Collapse Details" : "View Order Details"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expand / Collapse Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : order.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {expanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {expanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1">
                      <div className="bg-gray-50/80 rounded-xl border border-gray-200 overflow-hidden shadow-inner">
                        {/* Top Bar */}
                        <div className="px-4 py-3 bg-[#132e1f] flex flex-wrap items-center justify-between gap-3 text-white">
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <Hash className="w-4 h-4 text-green-300" />
                            <span>Order #{shortId}</span>
                            <span className="text-white/30">|</span>
                            <Calendar className="w-4 h-4 text-green-300" />
                            <span>{dt.full}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <OrderStatusUpdate
                              orderId={order.id}
                              status={order.status}
                              onChanged={(to) => handleStatusChanged(order.id, order.status, to)}
                            />
                          </div>
                        </div>

                        {/* ORDER DOCUMENTS SECTION (MAIN REQUIREMENT) */}
                        <div className="p-4 bg-gradient-to-r from-[#1a4a2e]/10 via-[#2d6a4f]/5 to-transparent border-b border-gray-200">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                            <div>
                              <h4 className="text-xs font-bold text-[#132e1f] uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-[#1a4a2e]" />
                                Order Documents & Generation
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Official PurestStem tax invoices, shipping labels, and logistics packets
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Download Invoice */}
                              <button
                                onClick={() => handleDownload(order.id, "invoice")}
                                disabled={isCurrentDownloading === "invoice"}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1a4a2e] hover:bg-[#132e1f] text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                              >
                                {isCurrentDownloading === "invoice" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Download className="w-3.5 h-3.5 text-green-300" />
                                )}
                                Download Invoice
                              </button>

                              {/* Download AWB */}
                              <button
                                onClick={() => handleDownload(order.id, "awb")}
                                disabled={isCurrentDownloading === "awb"}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#2d6a4f] hover:bg-[#1a4a2e] text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                              >
                                {isCurrentDownloading === "awb" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Truck className="w-3.5 h-3.5 text-green-300" />
                                )}
                                Download AWB
                              </button>

                              {/* Download Combined */}
                              <button
                                onClick={() => handleDownload(order.id, "combined")}
                                disabled={isCurrentDownloading === "combined"}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                              >
                                {isCurrentDownloading === "combined" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Layers className="w-3.5 h-3.5 text-gray-600" />
                                )}
                                Invoice + AWB
                              </button>

                              {/* Preview & Print */}
                              <button
                                onClick={() => handleOpenPreview(order.id, shortId, "invoice")}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                                Preview / Print
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Customer, Shipping, Payment Grid */}
                        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                                <span className="text-gray-900 font-semibold">{order.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Details + Courier/AWB Assignment */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Shipping & Delivery
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-gray-900 font-medium">{order.address}</p>
                                  <p className="text-gray-600 font-semibold">{order.city.toUpperCase()}</p>
                                  {order.postalCode && (
                                    <p className="text-gray-500 text-xs">Postal Code: {order.postalCode}</p>
                                  )}
                                </div>
                              </div>
                              {order.notes && (
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100 text-xs text-amber-700 mt-2">
                                  <span className="font-semibold text-amber-800">Note: </span>
                                  {order.notes}
                                </div>
                              )}
                            </div>

                            {/* Shipping & AWB Tracking Editor */}
                            <OrderShippingEditor
                              orderId={order.id}
                              initialCourier={order.courier}
                              initialAwbNumber={order.awbNumber}
                              initialTrackingNumber={order.trackingNumber}
                              onSaved={(data) => handleShippingSaved(order.id, data)}
                            />
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
                                  {shipping === 0 ? "Free Shipping" : "Standard Shipping"}
                                </span>
                              </div>

                              {order.paymentMethod === "cod" && (
                                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                                  <p className="text-[11px] font-bold text-amber-800">
                                    Amount to Collect on Delivery:
                                  </p>
                                  <p className="text-base font-extrabold text-amber-900">
                                    Rs {order.total.toLocaleString()}
                                  </p>
                                </div>
                              )}
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
                                    <td className="py-2.5 px-3 text-right font-semibold">{item.quantity}</td>
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

      {/* Footer count + pagination */}
      {matching > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages} · {matching} matching order{matching === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isNavigating}
              onClick={() => navigate({ page: page - 1 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || isNavigating}
              onClick={() => navigate({ page: page + 1 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Document Preview & Print Modal */}
      <OrderDocumentsModal
        key={previewModalOpen ? `${previewOrderId}-${previewDocType}` : "closed"}
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        orderId={previewOrderId}
        orderShortId={previewOrderShortId}
        initialDocType={previewDocType}
      />
    </div>
  );
}
