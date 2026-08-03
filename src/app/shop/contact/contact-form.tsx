"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSent(true);
        e.currentTarget.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all";

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-green-50 border border-green-100 rounded-2xl p-8 md:p-10 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. Our team will contact you soon.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setError("");
            }}
            className="text-green-700 font-medium hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a Message</h2>
          <p className="text-gray-500 text-sm mb-6">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5 text-gray-700">Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5 text-gray-700">Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className={inputClasses}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5 text-gray-700">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                className={inputClasses}
                placeholder="Order, shipping, product question..."
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5 text-gray-700">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                className={`${inputClasses} resize-none`}
                placeholder="How can we help you today?"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-green-700 text-white py-3.5 rounded-full font-semibold hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
