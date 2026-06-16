"use client";

const COLORS = ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#d8f3dc"];

export default function TopProductsList({
  data,
}: {
  data: { name: string; quantity: number }[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No sales data yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((product, i) => (
        <div key={product.name} className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          >
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(product.quantity / data[0].quantity) * 100}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {product.quantity}
          </span>
        </div>
      ))}
    </div>
  );
}
