'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-error-container text-on-error-container">
        <span className="material-symbols-outlined text-6xl">error</span>
      </div>
      <div>
        <p className="eyebrow text-accent">Something went wrong</p>
        <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface">
          Unexpected error
        </h2>
        <p className="mt-4 max-w-md text-lg text-on-surface-variant">
          We&apos;re sorry — something went wrong on our end. Please try again.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={reset} className="btn-primary px-10 py-3">
          Try again
        </button>
        <Link href="/" className="btn-secondary px-10 py-3">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
