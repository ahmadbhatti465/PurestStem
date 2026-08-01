"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function StarRating({
  rating,
  size = "md",
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  const filledCount = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < filledCount;
        const star = (
          <Star
            className={`${sizeClasses[size]} ${
              isFilled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200"
            } transition-colors duration-200`}
          />
        );

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange?.(i + 1)}
              className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 transition-transform hover:scale-110"
              aria-label={`Rate ${i + 1} out of 5 stars`}
            >
              {star}
            </button>
          );
        }

        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          >
            {star}
          </motion.span>
        );
      })}
    </div>
  );
}
