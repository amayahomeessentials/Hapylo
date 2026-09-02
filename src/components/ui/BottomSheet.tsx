'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface BottomSheetProps {
  isOpen?: boolean
  open?: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
  children: ReactNode
  snapPoints?: number[] // e.g., [0.3, 0.6, 0.9] for 30%, 60%, 90% of screen height
}

export function BottomSheet({
  isOpen,
  open,
  onClose,
  title,
  footer,
  children,
  snapPoints = [0.9],
}: BottomSheetProps) {
  const isSheetOpen = open !== undefined ? open : !!isOpen
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSheetOpen])

  if (!isSheetOpen) return null

  const maxHeight = `${Math.max(...snapPoints) * 100}vh`

  return (
    <div className="fixed inset-0 z-[9998] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl animate-slide-up flex flex-col"
        style={{ maxHeight }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant shrink-0">
            <h3 className="text-lg font-bold text-on-surface">{title}</h3>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-outline-variant bg-surface shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
