export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-outline-variant bg-surface shadow-card animate-pulse">
      <div className="aspect-[3/4] bg-surface-container" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-16 rounded bg-surface-container" />
        <div className="h-4 w-full rounded bg-surface-container" />
        <div className="h-4 w-2/3 rounded bg-surface-container" />
        <div className="mt-2 h-5 w-20 rounded bg-surface-container" />
      </div>
    </div>
  )
}
