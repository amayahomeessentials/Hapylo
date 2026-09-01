interface BadgeProps {
  type?: 'bestseller' | 'sale' | 'eco' | 'new' | 'custom'
  label?: string
  className?: string
}

export function Badge({ type, label, className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    bestseller: 'bg-surface text-primary border border-outline-variant rounded-md',
    sale: 'bg-sale-red text-white rounded-md',
    eco: 'bg-secondary-container text-primary rounded-md',
    new: 'bg-primary text-on-primary rounded-md',
    custom: 'bg-surface-container-low text-on-surface rounded-md',
  }

  const labels: Record<string, string> = {
    bestseller: 'Bestseller',
    sale: 'Sale',
    eco: 'Eco-Friendly',
    new: 'New Arrival',
  }

  const key = type ?? 'custom'
  const text = label ?? labels[key] ?? ''

  return (
    <span className={`inline-block px-3 py-1 text-caption font-semibold tracking-wider uppercase shadow-sm ${styles[key]} ${className}`}>
      {text}
    </span>
  )
}
