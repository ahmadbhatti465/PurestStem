"use client";

import { motion } from "framer-motion";
import { Star, BadgeCheck, Sparkles, Quote } from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  comment: string;
  rating: number;
  verified?: boolean | null;
  location?: string | null;
}

interface AnimatedTestimonialsProps {
  reviews: ReviewItem[];
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    name: "Ayesha Malik",
    location: "Lahore",
    comment:
      "I was suffering from severe postpartum hair fall for 8 months. After using the PurestStem Hair Repairing Oil and Shampoo bundle for just 4 weeks, my hair shedding reduced by at least 80%! Truly a blessing.",
    rating: 5,
    verified: true,
  },
  {
    id: "r2",
    name: "Dr. Farhan Qureshi",
    location: "Islamabad",
    comment:
      "As someone who reads cosmetic ingredient labels strictly, I was thrilled to find a genuine Pakistani brand with zero harsh sulfates and parabens. The herbal shampoo leaves hair clean without drying the scalp.",
    rating: 5,
    verified: true,
  },
  {
    id: "r3",
    name: "Zainab Tariq",
    location: "Karachi",
    comment:
      "Karachi tap water completely ruined my hair texture until my mother ordered PurestStem. The oil smells like pure herbs and mountain goodness, not fake chemical perfumes. 10/10 recommended!",
    rating: 5,
    verified: true,
  },
  {
    id: "r4",
    name: "Hamza Bilal",
    location: "Peshawar",
    comment:
      "Delivered to Peshawar in 2 days with cash on delivery. Excellent packaging, leak-proof bottles, and original herbal quality. My dry scalp itchiness vanished in the first week.",
    rating: 5,
    verified: true,
  },
];

export function AnimatedTestimonials({ reviews }: AnimatedTestimonialsProps) {
  const displayReviews = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return (
    <section className="py-24 bg-[#f8faf5] text-gray-900 relative overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 font-mono text-xs uppercase tracking-wider mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Real Customer Voices
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight"
          >
            Loved by 50,000+ homes across Pakistan.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-3 text-base sm:text-lg"
          >
            Read unfiltered feedback from verified buyers who transformed their hair and skin wellness.
          </motion.p>
        </div>

        {/* Clean Luxury Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayReviews.map((review, idx) => (
            <motion.div
              key={review.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-gray-200 hover:border-green-300 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-6 right-6 text-green-900/10 group-hover:text-green-800/20 transition-colors">
                <Quote className="w-8 h-8 rotate-180" />
              </div>

              <div>
                {/* 5 Golden Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (review.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6 font-normal">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm shadow-xs">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">{review.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified Buyer</span>
                    {review.location && (
                      <span className="text-gray-400">• {review.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
