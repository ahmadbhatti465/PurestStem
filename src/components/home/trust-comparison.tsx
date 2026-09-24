"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";

export function TrustComparison() {
  const COMPARISONS = [
    {
      feature: "Active Botanical Extraction",
      chemical: "Synthetically synthesized with high-heat factory chemicals",
      purest: "45-day cold stone & copper maceration preserving living enzymes",
    },
    {
      feature: "Sulfates & Surfactants",
      chemical: "Harsh SLS / SLES that strip natural scalp moisture and cause frizz",
      purest: "100% Sulfate-Free with gentle mountain coconut & soapnut cleansers",
    },
    {
      feature: "Mineral Oils & Silicones",
      chemical: "Plastic silicone coat that creates fake shine while choking follicles",
      purest: "Pure cold-pressed Amla, Bhringraj, Rosemary & Almond oils",
    },
    {
      feature: "Origin & Heritage",
      chemical: "Mass manufactured in chemical plants with artificial fragrances",
      purest: "Formulated with 60+ years of family mountain herbalism since 1964",
    },
    {
      feature: "Scalp Long-Term Health",
      chemical: "Drying rebound effect, recurring dandruff, accelerated hair fall",
      purest: "Strengthens hair roots, stimulates keratin, restores scalp microbiome",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            The Pure Difference
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight"
          >
            Why Pakistani families trust{" "}
            <span className="text-green-800 italic">PurestStem</span> over commercial brands.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-3 text-base sm:text-lg"
          >
            See how honest herbal medicine protects your hair where ordinary chemical products fail.
          </motion.p>
        </div>

        {/* Comparison Table Grid */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[680px] bg-[#faf8f5] rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 py-4 px-6 font-display font-bold text-sm sm:text-base">
              <div className="col-span-4 text-gray-500 uppercase font-mono text-xs tracking-wider">
                Ingredient & Standard
              </div>
              <div className="col-span-4 text-rose-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Ordinary Commercial Haircare
              </div>
              <div className="col-span-4 text-green-900 flex items-center gap-2 bg-green-100/60 -my-4 py-4 px-4 border-l border-green-200">
                <ShieldCheck className="w-5 h-5 text-green-700" />
                PurestStem Mountain Formula
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200/80">
              {COMPARISONS.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 py-5 px-6 items-center hover:bg-white transition-colors text-sm"
                >
                  <div className="col-span-4 font-semibold text-gray-900 pr-4">
                    {row.feature}
                  </div>

                  <div className="col-span-4 text-gray-600 pr-4 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span className="text-xs sm:text-sm">{row.chemical}</span>
                  </div>

                  <div className="col-span-4 text-green-950 font-medium pl-4 -my-5 py-5 border-l border-green-200 bg-green-50/40 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{row.purest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
