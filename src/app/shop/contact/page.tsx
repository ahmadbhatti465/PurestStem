"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PurestStem | Herbal Products Support in Pakistan",
  description:
    "Contact PurestStem for orders, shipping, returns, or product questions. Call 03334117668 or email pureststemofficial@gmail.com. We deliver herbal products across Pakistan.",
  openGraph: {
    title: "Contact PurestStem | Herbal Products Support in Pakistan",
    description:
      "Get in touch with Pakistan's trusted herbal brand. Call, email or send us a message.",
    type: "website",
  },
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        (e.target as HTMLFormElement).reset();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FadeIn className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Have questions about our herbal products, shipping, or returns? We are here to help. Reach
          out to our team and we will get back to you within 24 hours.
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12">
        <StaggerContainer staggerDelay={0.12} className="space-y-6">
          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone / WhatsApp</h3>
                <p className="text-gray-600">03334117668</p>
                <p className="text-sm text-gray-500 mt-1">Available Monday to Saturday, 9 AM to 7 PM</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">pureststemofficial@gmail.com</p>
                <p className="text-sm text-gray-500 mt-1">We reply to all emails within 24 hours</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Head Office</h3>
                <p className="text-gray-600">Gulberg 3, Eden Tower</p>
                <p className="text-gray-600">Lahore, Punjab, Pakistan</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Response Time</h3>
                <p className="text-gray-600">Usually within 2-4 hours during business hours</p>
                <p className="text-sm text-gray-500 mt-1">Cash on delivery available across Pakistan</p>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

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
                  onClick={() => { setSent(false); setError(""); }}
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
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>
                )}
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
      </div>
    </div>
  );
}
