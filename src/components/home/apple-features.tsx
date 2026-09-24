"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, Droplets, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const PILLARS = [
  {
    id: "harvesting",
    title: "Mountain Harvesting",
    subtitle: "Wildcrafted at 8,000+ ft altitude",
    icon: Leaf,
    badge: "Purity First",
    description:
      "Our botanicals are responsibly hand-harvested from the pristine Himalayan foothills of Pakistan, where unpolluted glacial water and rich mineral soil nurture plants with 3x higher active antioxidant concentration.",
    stats: [
      { label: "Altitude Sourcing", value: "8,000+ ft" },
      { label: "Active Density", value: "3.2x Higher" },
      { label: "Wildcrafted", value: "100%" },
    ],
    image: "/natural_herbs.jpg",
    highlights: [
      "Zero commercial pesticide exposure",
      "Handpicked by local indigenous herbalists",
      "Sustainable seasonal regeneration",
    ],
  },
  {
    id: "extraction",
    title: "Cold Maceration",
    subtitle: "Ancient copper & stone pressing",
    icon: Droplets,
    badge: "Bio-Active",
    description:
      "Unlike modern factory methods that destroy delicate plant enzymes with intense heat, we employ a 45-day cold infusion process in traditional stone and copper vessels, preserving the living nutrients of every herb.",
    stats: [
      { label: "Infusion Period", value: "45 Days" },
      { label: "Heat Exposure", value: "0° Heated" },
      { label: "Nutrient Retention", value: "99.4%" },
    ],
    image: "/mortar_pestle.jpg",
    highlights: [
      "Traditional 60-year family recipe",
      "Preserves volatile phytosterols & vitamins",
      "Gentle natural sediment filtering",
    ],
  },
  {
    id: "zero-chemicals",
    title: "0% Compromise",
    subtitle: "No synthetic fillers or parabens",
    icon: ShieldCheck,
    badge: "Clean Formula",
    description:
      "We believe what you put on your scalp enters your body. Every PurestStem bottle is certified free of SLS, sulfates, parabens, silicones, artificial foaming agents, and synthetic fragrance.",
    stats: [
      { label: "Sulfates / SLS", value: "0.0%" },
      { label: "Parabens", value: "0.0%" },
      { label: "Cruelty Free", value: "100%" },
    ],
    image: "/about_page.png",
    highlights: [
      "Naturally derived gentle foaming",
      "Safe for sensitive & inflamed scalps",
      "Color-treated hair friendly",
    ],
  },
  {
    id: "testing",
    title: "Lab Verified",
    subtitle: "Third-party purity tested",
    icon: Sparkles,
    badge: "Certified",
    description:
      "Ancient mountain knowledge backed by rigorous analytical verification. Each batch undergoes multi-stage laboratory testing for microbiological purity, heavy metals clearance, and standardized potency.",
    stats: [
      { label: "Batch Testing", value: "Every Batch" },
      { label: "Microbial Purity", value: "Pass 100%" },
      { label: "Customer Approval", value: "98.7%" },
    ],
    image: "/lab_testing.jpg",
    highlights: [
      "Certificate of Analysis for every batch",
      "Standardized active polyphenol levels",
      "Meets strict Pakistan DRAP & PCSIR guidelines",
    ],
  },
];

export function AppleFeatures() {
  const [activeTab, setActiveTab] = useState(PILLARS[0]);

  return (
    <section className="py-24 bg-[#f8faf5] text-gray-900 relative overflow-hidden border-b border-gray-100">
      {/* Background ambient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Apple-style eyebrow and bold headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 font-mono text-xs uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            The Botanical Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight"
          >
            Engineered by nature.{" "}
            <span className="italic font-normal text-emerald-800">
              Perfected by tradition.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore how ancient mountain herbalism combines with modern analytical purity to craft Pakistan&apos;s most potent botanical remedies.
          </motion.p>
        </div>

        {/* Apple-style Interactive Pill Switcher */}
        <div className="flex justify-center mb-10 overflow-x-auto no-scrollbar py-2">
          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            {PILLARS.map((pillar) => {
              const isSelected = activeTab.id === pillar.id;
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(pillar)}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                    isSelected ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activePillarTabLight"
                      className="absolute inset-0 bg-green-900 rounded-xl shadow-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {pillar.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Spotlight Card */}
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Text & Specs */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit mb-4">
                  {activeTab.badge}
                </div>

                <h3 className="font-display text-2xl sm:text-4xl font-bold text-gray-950 mb-2">
                  {activeTab.title}
                </h3>
                <p className="text-emerald-800 text-sm sm:text-base font-semibold mb-4">
                  {activeTab.subtitle}
                </p>

                <p className="text-gray-600 text-base leading-relaxed mb-6 font-normal">
                  {activeTab.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 mb-8">
                  {activeTab.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Apple-style key stat metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  {activeTab.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="font-display text-xl sm:text-2xl font-extrabold text-green-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Showcase Image with Glass Overlay */}
              <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-md group">
                <img
                  src={activeTab.image}
                  alt={activeTab.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-xs font-mono text-emerald-800 uppercase font-bold">PurestStem Protocol</p>
                    <p className="text-sm font-semibold text-gray-900">{activeTab.title} Standard</p>
                  </div>
                  <Link
                    href="/shop/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green-900 hover:text-green-700 transition-colors"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
