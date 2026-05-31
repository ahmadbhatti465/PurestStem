"use client";

import { useState } from "react";

export default function OrderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
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

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="text-xs font-medium rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
    >
      <option value="pending">pending</option>
      <option value="processing">processing</option>
      <option value="shipped">shipped</option>
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
    </select>
  );
}
