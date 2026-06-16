"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#d8f3dc"];

export default function StatusPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        No orders yet
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
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={4}
          dataKey="value"
          label={({ name, value }: { name: string; value: number }) =>
            `${name}: ${value}`
          }
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
