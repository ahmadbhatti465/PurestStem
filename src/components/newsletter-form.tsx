"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm({ variant = "default" }: { variant?: "default" | "dark" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const isDark = variant === "dark";

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

  if (success) {
    return (
      <p className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-white" : "text-green-900"}`} role="status">
        <Check className="h-4 w-4" aria-hidden="true" />
        You&apos;re subscribed. Welcome to PurestStem.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className={
            isDark
              ? "h-12 w-full rounded-full border border-white/25 bg-white/10 pl-5 pr-14 text-base text-white placeholder:text-green-100/70 focus:border-white focus:outline-none"
              : "field !rounded-full !pr-14"
          }
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Subscribe"
          className={`absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
            isDark ? "bg-white text-green-900 hover:bg-green-100" : "bg-green-900 text-white hover:bg-green-800"
          }`}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p className={`mt-2 text-sm ${isDark ? "text-red-200" : "text-red-700"}`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
