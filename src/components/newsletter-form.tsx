"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Check, Sparkles } from "lucide-react";

interface NewsletterFormProps {
  variant?: "default" | "inline" | "dark";
  className?: string;
}

export function NewsletterForm({ variant = "default", className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email,
          subject: "Newsletter Signup",
          message: `Newsletter signup request from ${email}`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDark = variant === "dark";

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${isDark ? "bg-white/10" : "bg-green-50"}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-white/20" : "bg-green-100"}`}>
              <Check className={`w-5 h-5 ${isDark ? "text-white" : "text-green-700"}`} />
            </div>
            <div>
              <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>You&apos;re subscribed!</p>
              <p className={`text-sm ${isDark ? "text-green-100/80" : "text-gray-600"}`}>Welcome to the PurestStem family.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className={variant === "inline" ? "flex flex-col sm:flex-row gap-3" : "space-y-3"}
          >
            <div className="relative flex-1">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-green-100/60" : "text-gray-400"}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full rounded-xl px-12 py-3.5 text-sm outline-none transition-all ${
                  isDark
                    ? "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-green-300/50"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                isDark
                  ? "bg-white text-green-900 hover:bg-green-50 shadow-lg"
                  : "bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-700/20"
              }`}
            >
              {loading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {error && (
              <p className={`text-sm ${isDark ? "text-red-200" : "text-red-600"}`}>{error}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NewsletterSectionProps {
  variant?: "default" | "dark";
  className?: string;
}

export function NewsletterSection({ variant = "default", className }: NewsletterSectionProps) {
  const isDark = variant === "dark";

  return (
    <section className={className}>
      <div className={`rounded-3xl p-8 md:p-12 ${isDark ? "bg-[#1a4a2e] text-white" : "bg-green-50 border border-green-100"}`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-4 ${isDark ? "bg-white/10 text-green-100 border border-white/10" : "bg-green-100 text-green-800"}`}>
              <Sparkles className="w-4 h-4" />
              Join the Wellness Circle
            </span>
            <h3 className={`font-display text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Get Herbal Tips & Exclusive Offers
            </h3>
            <p className={isDark ? "text-green-100/80" : "text-gray-600"}>
              Subscribe for weekly herbal wellness tips, new product alerts, and special discounts delivered straight to your inbox.
            </p>
          </div>
          <NewsletterForm variant={isDark ? "dark" : "default"} />
        </div>
      </div>
    </section>
  );
}
