import { ReviewCardProps } from "@/type";
import { StarRating } from "./ui/StarRating";


export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.author
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-white border border-rose-100 rounded-2xl p-6">
      <StarRating rating={review.rating} />
      <p className="mt-3 mb-5 text-sm text-stone-600 leading-relaxed italic">
        &ldquo;{review.body}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-stone-700">{review.author}</p>
          <p className="text-xs text-stone-400">
            {new Date(review.created_at).toLocaleDateString('vi-VN', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}