"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center"
      >
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-7 h-7 text-green-700" />
        </div>
        <p className="text-green-800 font-semibold text-lg">Thank you for your review!</p>
        <p className="text-green-600 text-sm mt-1">Your feedback helps others discover PurestStem.</p>
      </motion.div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      <div>
        <label htmlFor="review-name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          placeholder="Share your experience with this product..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto min-h-[44px] bg-green-700 hover:bg-green-800 text-white rounded-xl px-6 py-3 font-semibold transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
