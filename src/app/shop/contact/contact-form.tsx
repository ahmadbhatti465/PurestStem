"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Connection problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="surface p-8 text-center sm:p-12" role="status">
        <CheckCircle className="mx-auto h-10 w-10 text-green-700" strokeWidth={1.25} aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl text-green-950">Message sent</h2>
        <p className="mt-2 text-gray-600">Thank you for reaching out. We&apos;ll be in touch soon.</p>
        <button type="button" onClick={() => setSent(false)} className="link-arrow mt-5 min-h-11">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="surface p-6 sm:p-8">
      <h2 className="font-display text-2xl text-green-950">Send us a message</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="field-label">Name</label>
            <input id="contact-name" name="name" type="text" required autoComplete="name" className="field" />
          </div>
          <div>
            <label htmlFor="contact-email" className="field-label">Email</label>
            <input id="contact-email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
        </div>
        <div>
          <label htmlFor="contact-subject" className="field-label">Subject (optional)</label>
          <input id="contact-subject" name="subject" type="text" className="field" />
        </div>
        <div>
          <label htmlFor="contact-message" className="field-label">Message</label>
          <textarea id="contact-message" name="message" rows={5} required className="field resize-none" />
        </div>

        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {loading ? "Sending" : "Send message"}
        </button>
      </form>
    </div>
  );
}
