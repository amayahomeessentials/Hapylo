import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop/combo-kits', label: 'Combo Kits' },
]

interface HeaderDesktopProps {
  activeHref?: string
  cartCount?: number
}

export function HeaderDesktop({ activeHref = '/', cartCount = 0 }: HeaderDesktopProps) {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-outline-variant bg-surface/95 backdrop-blur-xl transition-all duration-300 md:block">
      <nav className="page-wrap flex h-[5.5rem] items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 font-display text-3xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm tracking-normal text-white">H</span>Hapylo
          </Link>
          <div className="flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-bold tracking-wide transition-colors duration-200 ${
                  activeHref === link.href
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                  activeHref === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-on-surface">
          <Link href="/search" aria-label="Search" className="rounded-full p-2.5 transition-colors hover:bg-secondary-container hover:text-primary">
            <span className="material-symbols-outlined">search</span>
          </Link>
          <Link href="/account" aria-label="Account" className="rounded-full p-2.5 transition-colors hover:bg-secondary-container hover:text-primary">
            <span className="material-symbols-outlined">person</span>
          </Link>
          <Link href="/account/orders" aria-label="Orders" className="rounded-full p-2.5 transition-colors hover:bg-secondary-container hover:text-primary">
            <span className="material-symbols-outlined">receipt_long</span>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative rounded-full bg-primary p-2.5 text-white shadow-primary-glow transition-colors hover:bg-primary-hover">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 rounded-full bg-sale-red px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
