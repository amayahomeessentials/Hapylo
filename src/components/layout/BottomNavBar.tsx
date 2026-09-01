'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Shop', icon: 'storefront' },
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/account/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/account', label: 'Account', icon: 'person' },
]

export function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around rounded-t-lg border-t border-outline-variant bg-surface pb-safe shadow-lg md:hidden">
      {navItems.map(item => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[56px] w-full flex-col items-center justify-center py-3 transition-colors ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <div className={`mb-1 rounded-md px-5 py-1 transition-colors ${isActive ? 'bg-primary-fixed' : ''}`}>
              <span
                className="material-symbols-outlined block"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            </div>
            <span className="font-label text-caption">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
