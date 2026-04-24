export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-rose-400' : 'text-stone-200'}
          style={{ fontSize: 14 }}
        >
          ★
        </span>
      ))}
    </div>
  )
}