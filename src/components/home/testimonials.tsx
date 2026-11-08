import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import StarRating from "@/components/ui/star-rating";
import { Marquee } from "@/components/motion/marquee";

interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  verified: boolean;
}

interface TestimonialsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="surface flex w-[19rem] shrink-0 flex-col justify-between !bg-green-50 p-6 sm:w-[23rem]">
      <div>
        <StarRating rating={review.rating} size="sm" />
        <blockquote className="mt-4 leading-relaxed text-gray-800">{review.comment}</blockquote>
      </div>
      <figcaption className="mt-5 flex items-center gap-2 text-sm font-medium text-green-950">
        {review.name}
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-normal text-green-800">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function Testimonials({ reviews, averageRating, reviewCount }: TestimonialsProps) {
  if (reviews.length === 0) return null;

  const midpoint = Math.ceil(reviews.length / 2);
  const rows = reviews.length >= 6 ? [reviews.slice(0, midpoint), reviews.slice(midpoint)] : [reviews];

  return (
    <section className="cv-auto bg-white py-16 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="Customer voices"
          title="What our customers say"
          action={
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl text-green-950">{averageRating.toFixed(1)}</span>
              <div>
                <StarRating rating={averageRating} size="sm" />
                <p className="mt-0.5 text-xs text-gray-600">
                  From {reviewCount} {reviewCount === 1 ? "review" : "reviews"} on this site
                </p>
              </div>
            </div>
          }
        />
      </Container>

      <div className="mt-10 space-y-4 [--marquee-gap:1rem]">
        {rows.map((row, index) => (
          <Marquee key={index} reverse={index === 1} duration={55 + index * 10} className="[--marquee-gap:1rem]">
            {row.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
