import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found — Hapylo',
  description: 'The page you were looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-secondary-container text-primary">
        <span className="material-symbols-outlined text-6xl">search_off</span>
      </div>
      <div>
        <p className="eyebrow text-accent">Error 404</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-lg text-on-surface-variant">
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary px-10 py-3">
          Back to Home
        </Link>
        <Link href="/shop" className="btn-secondary px-10 py-3">
          Browse Products
        </Link>
      </div>
    </div>
  )
}
