"use client";

import { Sparkles, ShieldCheck, Leaf, Truck, Heart, Award, Clock } from "lucide-react";

const MARQUEE_ITEMS = [
  { icon: Leaf, text: "100% PURE BOTANICALS" },
  { icon: Award, text: "60+ YEARS MOUNTAIN HERITAGE" },
  { icon: Truck, text: "FREE DELIVERY OVER ₨ 5,000" },
  { icon: ShieldCheck, text: "LAB-TESTED PURITY" },
  { icon: Heart, text: "50,000+ HAPPY CUSTOMERS" },
  { icon: Sparkles, text: "0% PARABENS & SULFATES" },
  { icon: Clock, text: "CASH ON DELIVERY IN PAKISTAN" },
];

export function TickerMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-emerald-900/30 bg-[#07170e] py-4 select-none">
      {/* Edge gradient masks for smooth fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07170e] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07170e] to-transparent z-10" />

      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap items-center">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-emerald-300/80 hover:text-emerald-100 transition-colors"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold">{item.text}</span>
              <span className="text-emerald-500/30 text-sm ml-4">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
