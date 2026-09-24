"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How long does shipping take across Pakistan?",
    a: "We ship all orders via express courier services. Major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) usually receive orders within 2 to 3 working days. Rural or remote areas typically take 3 to 4 working days. Cash on delivery is available nationwide.",
  },
  {
    q: "How do I use PurestStem Hair Repairing Oil for best results?",
    a: "Apply 1 to 2 tablespoons to dry scalp and lengths 30 to 60 minutes before bathing (or leave overnight for intensive therapy). Massage gently with fingertips for 5 minutes. Wash off with PurestStem Herbal Shampoo. Use 2 to 3 times a week consistently.",
  },
  {
    q: "Are PurestStem products free from parabens, sulfates, and silicones?",
    a: "Yes, 100%! We strictly avoid SLS, SLES, parabens, synthetic silicones, artificial colorants, and mineral oils. Our formulations are derived entirely from wildcrafted mountain herbs and cold-pressed botanical oils.",
  },
  {
    q: "Is Cash on Delivery (COD) supported?",
    a: "Yes, Cash on Delivery is available in all cities and towns of Pakistan. You pay the rider upon receiving your package at your doorstep.",
  },
  {
    q: "What is your refund or return guarantee?",
    a: "We offer a 7-day hassle-free replacement or return guarantee if your item arrives damaged, leaked, or defective. Just WhatsApp our customer support team with your order number and photo proof for an instant resolution.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#f9faf5] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-green-700" />
            Frequently Asked Questions
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight">
            Got questions? We have answers.
          </h2>
          <p className="text-gray-600 mt-3 text-base">
            Everything you need to know about our herbal formulations and nationwide delivery.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm transition-all hover:border-green-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors"
                >
                  <span className="font-display font-semibold text-lg text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? "bg-green-800 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
