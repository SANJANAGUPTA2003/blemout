import { Star } from 'lucide-react';

export default function StarRating({
  rating = 5,
  size = 14,
  className = 'mt-2.5 flex items-center gap-0.5 text-teal',
}) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <p className={className}>
      <span className="sr-only">{`Rated ${safe} out of 5 stars`}</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < safe ? 'currentColor' : 'none'}
          strokeWidth={i < safe ? 0 : 1.5}
          aria-hidden="true"
        />
      ))}
    </p>
  );
}
