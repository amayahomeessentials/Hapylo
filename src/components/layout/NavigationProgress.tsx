'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Slim top-of-page progress bar that animates on every client-side route change.
 * Uses pathname + searchParams as the "navigation trigger".
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  // Fire whenever the route changes
  useEffect(() => {
    // Clear previous timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    // Start the bar
    setVisible(true)
    setProgress(0)

    // Quickly jump to ~30%, then crawl to ~85%
    let start: number | null = null
    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      // Ease-out curve: fast at the start, slows near 85%
      const pct = Math.min(85, (elapsed / 500) * 100 * 0.85)
      setProgress(pct)
      if (pct < 85) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)

    // Finish bar after a short delay (simulating load complete)
    timerRef.current = setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setProgress(100)
      // Hide after transition
      timerRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 400)
    }, 350)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [pathname, searchParams])

  if (!visible) return null

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
      style={{
        width: `${progress}%`,
        transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.3s ease' : 'width 0.4s ease-out',
        opacity: progress === 100 ? 0 : 1,
        background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))',
        boxShadow: '0 0 10px rgba(239,127,60,0.6)',
      }}
    />
  )
}
