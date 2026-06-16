"use client";

interface SummaryFooterProps {
  totalProducts: number;
  totalOrders: number;
  netProfit: number;
}

export default function SummaryFooter({
  totalProducts,
  totalOrders,
  netProfit,
}: SummaryFooterProps) {
  return (
    <div className="bg-gradient-to-r from-[#1a4a2e] to-[#2d6a4f] rounded-xl p-6 text-white">
      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-green-200 text-sm mb-1">Total Products Listed</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="sm:border-x sm:border-white/20">
          <p className="text-green-200 text-sm mb-1">Conversion Rate (Est.)</p>
          <p className="text-3xl font-bold">
            {totalOrders > 0 ? "~3.2%" : "0%"}
          </p>
        </div>
        <div>
          <p className="text-green-200 text-sm mb-1">Business Health</p>
          <p className="text-3xl font-bold">
            {netProfit > 0 ? "Profitable" : "Break-even"}
          </p>
        </div>
      </div>
    </div>
  );
}
