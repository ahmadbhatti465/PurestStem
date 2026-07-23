"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

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

  return (
    <FadeIn direction="right" delay={0.2}>
      <div className="bg-green-50 p-6 md:p-8 rounded-2xl border border-green-100 relative overflow-hidden">
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Send us a Message</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                name="subject"
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                placeholder="Order, shipping, product question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message *</label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                placeholder="How can we help you today?"
              />
            </div>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </FadeIn>
  );
}
