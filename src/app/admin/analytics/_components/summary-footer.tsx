"use client";

interface SummaryFooterProps {
  totalProducts: number;
  totalOrders: number;
  avgOrderValue: number;
}

export default function SummaryFooter({ totalProducts, totalOrders, avgOrderValue }: SummaryFooterProps) {
  return (
    <div className="bg-gradient-to-r from-[#1a4a2e] to-[#2d6a4f] rounded-xl p-6 text-white">
      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-green-200 text-sm mb-1">Products Listed</p>
          <p className="text-3xl font-bold">{totalProducts.toLocaleString()}</p>
        </div>
        <div className="sm:border-x sm:border-white/20">
          <p className="text-green-200 text-sm mb-1">Orders (all statuses)</p>
          <p className="text-3xl font-bold">{totalOrders.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-green-200 text-sm mb-1">Average Order</p>
          <p className="text-3xl font-bold">Rs {Math.round(avgOrderValue).toLocaleString("en-PK")}</p>
        </div>
      </div>
    </div>
  );
}
