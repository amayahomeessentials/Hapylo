'use client'

import { useEffect, useRef } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="animate-slide-up relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-xl border-t border-outline-variant bg-surface shadow-lg"
      >
        <div className="flex w-full shrink-0 justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-surface-variant" />
        </div>
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-outline-variant px-6 pb-4">
            <h2 className="font-display text-h4 text-on-surface">{title}</h2>
            <button
              className="font-label text-label-md text-on-surface-variant transition-colors hover:text-primary"
              onClick={onClose}
            >
              Clear All
            </button>
          </div>
        )}
        <div className="flex-grow overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-outline-variant bg-surface p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
