interface RatingStarsProps {
  rating: number // 0-5
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  count?: number
  reviewCount?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showCount = false,
  count,
  reviewCount,
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const effectiveCount = count ?? reviewCount
  const shouldShowCount = showCount || reviewCount !== undefined
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  const handleClick = (newRating: number) => {
    if (interactive && onChange) {
      onChange(newRating)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1)

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              {/* Empty star (background) */}
              <span className={`material-symbols-outlined ${sizeClasses[size]} text-outline`}>
                star
              </span>

              {/* Filled star (overlay) */}
              {fillPercentage > 0 && (
                <span
                  className={`material-symbols-outlined ${sizeClasses[size]} text-amber-500 absolute inset-0 overflow-hidden`}
                  style={{
                    clipPath: `inset(0 ${(1 - fillPercentage) * 100}% 0 0)`,
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  star
                </span>
              )}
            </button>
          )
        })}
      </div>

      {shouldShowCount && effectiveCount !== undefined && (
        <span className="text-sm text-on-surface-variant">
          ({effectiveCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
