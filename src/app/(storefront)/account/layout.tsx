'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/account', label: 'Profile', icon: 'person' },
  { href: '/account/orders', label: 'Orders', icon: 'receipt_long' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/account')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
            
            <button
              onClick={handleSignOut}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-error transition-colors hover:bg-error/10"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign out
            </button>
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1">
          {children}
        </main>
        
      </div>
    </div>
  )
}
