'use client'

import { useEffect, ReactNode } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  position?: 'left' | 'right'
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
}: DrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const slideClass = position === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
  const positionClass = position === 'right' ? 'right-0' : 'left-0'

  return (
    <div className="fixed inset-0 z-[9998] flex items-stretch">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`relative ${positionClass} bg-surface w-full max-w-md shadow-2xl flex flex-col ${slideClass}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          {title && (
            <h3 className="text-xl font-bold text-on-surface">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
