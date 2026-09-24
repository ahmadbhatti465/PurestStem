"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { Award, Users, Leaf, Star, Sparkles } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

function Counter({ value, suffix = "", prefix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, motionVal, value]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [springVal]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AnimatedStats() {
  const STATS = [
    {
      icon: Award,
      value: 60,
      suffix: "+",
      label: "Years of Mountain Heritage",
      sublabel: "Rooted in authentic herbalism since 1964",
    },
    {
      icon: Users,
      value: 50000,
      suffix: "+",
      label: "Happy Pakistani Customers",
      sublabel: "Trusted for hair regrowth & scalp health",
    },
    {
      icon: Leaf,
      value: 100,
      suffix: "%",
      label: "Wildcrafted & Pure",
      sublabel: "Zero sulfates, parabens, or synthetic fragrance",
    },
    {
      icon: Star,
      value: 99,
      suffix: "%",
      label: "Customer Satisfaction",
      sublabel: "4.9/5 rating across 12,000+ verified buyers",
    },
  ];

  return (
    <section className="py-20 bg-white text-gray-900 relative overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Verified Impact
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gray-950">
            Six decades of trusted mountain healing.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-[#f9faf6] border border-gray-200 hover:border-green-300 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-green-800 mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="font-display text-4xl sm:text-5xl font-black text-green-950 mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                <h3 className="font-bold text-base text-gray-900 mb-1">{stat.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{stat.sublabel}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
