"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Package,
} from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  iconName: string;
}

const iconMap: Record<string, React.ElementType> = {
  DollarSign,
  ShoppingBag,
  BarChart3,
  TrendingUp,
  TrendingDown,
};

export default function StatCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = iconMap[card.iconName] || DollarSign;
        return (
          <div key={card.label} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.sub && <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
