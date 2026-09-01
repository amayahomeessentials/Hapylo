'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, loading, children, className = '', disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-deep-teal shadow-sm hover:shadow-md',
      secondary: 'bg-secondary-container text-primary hover:bg-primary-fixed active:bg-primary-fixed shadow-sm',
      outline: 'border-2 border-primary text-primary hover:bg-secondary-container active:bg-primary-fixed bg-surface',
      ghost: 'text-primary hover:bg-secondary-container hover:text-primary-hover bg-transparent',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
