"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MonthlyRevenueChart({
  data,
}: {
  data: { month: string; revenue: number; profit: number }[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        No monthly data available
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [
            `Rs ${Number(value || 0).toLocaleString()}`,
            "",
          ]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" fill="#52b788" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
