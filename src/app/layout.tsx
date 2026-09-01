import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { NavigationProgress } from '@/components/layout/NavigationProgress'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hapylo — Refreshingly Clean Home Care',
    template: '%s | Hapylo',
  },
  description: 'Plant-powered, ultra-concentrated home care products. Effortless tools for a spotless space — ethically made.',
  keywords: ['home care', 'eco-friendly', 'plant-based', 'laundry', 'cleaning', 'hapylo'],
  openGraph: {
    title: 'Hapylo — Refreshingly Clean',
    description: 'Plant-powered home care products. Ethically made.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hapylo — Refreshingly Clean Home Care',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
