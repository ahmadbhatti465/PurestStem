"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, comment }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-100 p-5 rounded-2xl">
        <p className="text-green-800 font-semibold text-lg">Thank you for your review!</p>
        <p className="text-green-600 text-sm mt-1">Your feedback helps others discover PurestStem.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rating
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
      </div>

      <div>
        <label htmlFor="review-name" className="block text-sm font-semibold text-gray-700 mb-2">
          Name
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-700 mb-2">
          Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white rounded-xl px-6 py-3 font-semibold transition-colors"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
