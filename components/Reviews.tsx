import { ReviewCard } from "./ReviewCard";
import { Review } from "@/type";

interface ReviewsProps {
  review: Review[];
}

const FALLBACK_REVIEWS: Review[] = [];

export function Reviews({ review }: ReviewsProps) {
    const displayReviews  = review.length  > 0 ? review  : FALLBACK_REVIEWS
    return (
        <section id="reviews" className="py-20 bg-[#fdf8f5]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Reviews</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {displayReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      </section>
    );
}