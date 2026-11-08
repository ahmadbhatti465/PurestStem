"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import StarRating from "@/components/ui/star-rating";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, comment }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "We couldn't save your review. Please try again.");
      }
    } catch {
      setError("We couldn't save your review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center" role="status">
        <CheckCircle className="mx-auto h-8 w-8 text-green-700" aria-hidden="true" />
        <p className="mt-3 font-display text-xl text-green-950">Thank you for your review</p>
        <p className="mt-1 text-sm text-gray-600">Your feedback helps others discover PurestStem.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="field-label">Your rating</p>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>
      <div>
        <label htmlFor="review-name" className="field-label">Name</label>
        <input id="review-name" type="text" required minLength={2} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="review-comment" className="field-label">Review</label>
        <textarea id="review-comment" required minLength={3} maxLength={2000} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="field resize-none" />
      </div>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {loading ? "Submitting" : "Submit review"}
      </button>
    </form>
  );
}
