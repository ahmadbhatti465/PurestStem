"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck, Heart, Sparkles } from "lucide-react";

export function HeritageStory() {
  return (
    <section className="py-24 bg-[#faf8f5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Images collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <img
                src="/about_page.png"
                alt="Traditional PurestStem mountain herb preparation in Pakistan"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping secondary authentic heritage card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-8 bg-[#0a2417] text-white p-6 rounded-3xl shadow-2xl border border-emerald-500/30 max-w-[280px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl text-amber-300">1964</div>
                  <div className="text-[11px] text-emerald-200/70 font-mono">Founding Year</div>
                </div>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Over 60 years of master herbalists preserving pure mountain formulas for Pakistani families.
              </p>
            </motion.div>
          </div>

          {/* Text and Trust Pillars */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              The PurestStem Legacy
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight mb-6">
              Ancient mountain wisdom.{" "}
              <span className="text-green-800 italic">Zero synthetic shortcuts.</span>
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              Born in the high mountain valleys of Pakistan, PurestStem began with a simple belief: nature provides every cure needed for vibrant hair and healthy skin. For six decades, we have refused commercial shortcuts. No cheap petroleum waxes, no synthetic foaming detergents, and no artificial dyes.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 w-full">
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
                <h3 className="font-bold text-gray-900 text-base mb-1">Cold-Macerated</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Steeped in traditional copper & stone vessels to protect vital antioxidants.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
                <h3 className="font-bold text-gray-900 text-base mb-1">Lab Certified</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Every batch tested for heavy metals clearance and microbiological safety.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop/about"
                className="inline-flex items-center gap-2 bg-green-900 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-xl hover:scale-105 text-sm"
              >
                Read Our Complete Heritage Story
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop/products"
                className="inline-flex items-center gap-2 text-green-900 hover:text-green-950 font-bold text-sm px-4 py-3"
              >
                Explore All Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
