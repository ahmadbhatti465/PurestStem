"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Droplets, Wind, Shield } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Deep Root Nourishment",
    subtitle: "PurestStem Hair Repairing Oil",
    icon: Droplets,
    timing: "30–60 mins before washing",
    frequency: "2–3 times a week",
    description:
      "Warm a few drops between your palms and gently massage into the scalp for 5 minutes. The cold-pressed Amla, Bhringraj, and Rosemary stimulate micro-circulation and deeply coat the hair shaft to prevent moisture loss.",
    badge: "Pre-Wash Therapy",
  },
  {
    number: "02",
    title: "Gentle Botanical Cleansing",
    subtitle: "PurestStem Herbal Shampoo",
    icon: Wind,
    timing: "2–3 minutes lather",
    frequency: "With every wash",
    description:
      "Lather a small amount into wet hair. The sulfate-free coconut and aloe cleansing agents gently lift buildup, dust, and excess sebum without stripping the hair's protective lipid barrier.",
    badge: "Cleanse & Protect",
  },
  {
    number: "03",
    title: "Long-Term Scalp Fortification",
    subtitle: "Complete Herbal Ritual",
    icon: Shield,
    timing: "Continuous care",
    frequency: "Daily wellness",
    description:
      "Witness reduced hair fall, thicker hair strands, and elimination of dryness within 3 to 4 weeks. Backed by 60+ years of generational herbal satisfaction across Pakistan.",
    badge: "Lasting Results",
  },
];

export function RoutineSteps() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-700" />
            The Proven 3-Step Ritual
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight"
          >
            How to achieve your{" "}
            <span className="text-green-800 italic">healthiest hair ever.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-3 text-base sm:text-lg"
          >
            Simple, consistent botanical care formulated specifically for Pakistani water and weather conditions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative bg-[#f9faf5] hover:bg-green-50/60 border border-gray-200/80 hover:border-green-300 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-black text-4xl text-green-900/20 group-hover:text-green-800/40 transition-colors">
                      {step.number}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-green-800 text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-gray-950 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm font-semibold text-green-800 mb-4">
                    {step.subtitle}
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>⏱ {step.timing}</span>
                  <span>🗓 {step.frequency}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop/products"
            className="inline-flex items-center gap-2 bg-green-900 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm"
          >
            Start Your Herbal Routine Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
