"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-4.5 h-4.5",
  lg: "w-7 h-7",
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
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Your rating" : `Rated ${rating.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const star = (
          <Star
            aria-hidden="true"
            className={`${sizeClasses[size]} ${i < filledCount ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        );

        if (!interactive) return <span key={i}>{star}</span>;

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i + 1 === filledCount}
            aria-label={`${i + 1} out of 5 stars`}
            onClick={() => onChange?.(i + 1)}
            className="rounded p-1"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
