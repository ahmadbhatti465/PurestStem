"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function OrderStatusUpdate({
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

      if (!res.ok) {
        throw new Error("Update failed");
      }
    } catch {
      setStatus(currentStatus);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    processing: "bg-blue-500/20 text-blue-200 border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-200 border-purple-500/30",
    completed: "bg-green-500/20 text-green-200 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-200 border-red-500/30",
  };

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none text-xs font-semibold rounded-full pl-3 pr-8 py-1.5 border focus:outline-none focus:ring-2 focus:ring-green-500/50 cursor-pointer transition-all ${
          statusColors[status] || "bg-white/10 text-white border-white/20"
        } ${loading ? "opacity-50" : ""}`}
      >
        <option value="pending">pending</option>
        <option value="processing">processing</option>
        <option value="shipped">shipped</option>
        <option value="completed">completed</option>
        <option value="cancelled">cancelled</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60 pointer-events-none" />
    </div>
  );
}
