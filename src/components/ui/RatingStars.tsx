interface RatingStarsProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export function RatingStars({ rating, reviewCount, size = 'md' }: RatingStarsProps) {
  const starSize = size === 'sm' ? 'text-[14px]' : 'text-[16px]'

  const renderStar = (index: number) => {
    const filled = rating >= index + 1
    const half = !filled && rating >= index + 0.5
    return (
      <span
        key={index}
        className={`material-symbols-outlined text-accent ${starSize} ${filled || half ? 'fill' : ''}`}
        style={{ fontVariationSettings: filled || half ? "'FILL' 1" : "'FILL' 0" }}
      >
        {half ? 'star_half' : 'star'}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-accent">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      {reviewCount !== undefined && (
        <span className="font-label text-caption text-on-surface-variant">
          {rating.toFixed(1)} ({reviewCount} Reviews)
        </span>
      )}
    </div>
  )
}
