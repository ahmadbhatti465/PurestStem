"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";

export function CinematicCta() {
  return (
    <section className="py-24 bg-[#05110a] text-white relative overflow-hidden text-center">
      {/* Background radial glowing aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-emerald-500/15 blur-[170px] animate-pulse-glow" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs uppercase tracking-wider mb-6"
        >
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
          Join 50,000+ Happy Pakistani Customers
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6"
        >
          Experience the pure power of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-lime-300">
            Himalayan Botanicals.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-emerald-100/75 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Make the permanent switch to 100% natural care. Free shipping on orders over ₨ 5,000 with Cash on Delivery nationwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/shop/products"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-emerald-950 font-bold text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
          >
            <span>Shop Now with Cash on Delivery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://wa.me/923334117668?text=Hello%2C%20I%20want%20to%20order%20PurestStem%20herbal%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base backdrop-blur transition-all"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            Order on WhatsApp
          </a>
        </motion.div>

        {/* Guarantees Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-emerald-900/50 max-w-3xl mx-auto text-xs text-emerald-200/80 font-medium">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Fast Express Dispatch in 24h</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>7-Day Replacement Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>100% Original Mountain Herbs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
