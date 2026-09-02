interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={`bg-surface-container-low animate-pulse ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm">
      <Skeleton variant="rectangular" className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-5 w-20" />
          <Skeleton variant="rectangular" className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <Skeleton variant="rectangular" className="aspect-square w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <Skeleton variant="text" className="h-10 w-32" />
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
        <Skeleton variant="rectangular" className="h-14 w-full rounded-xl" />
      </div>
    </div>
  )
}
