import Link from 'next/link'

const shopLinks = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop/laundry', label: 'Laundry Care' },
  { href: '/shop/sprays', label: 'Surface Sprays' },
  { href: '/shop/combo-kits', label: 'Combo Kits' },
]

const serviceLinks = [
  { href: '#', label: 'Shipping & Delivery' },
  { href: '#', label: 'Returns & Refunds' },
  { href: '#', label: 'FAQ' },
  { href: '#', label: 'Contact Us' },
  { href: '#', label: 'Privacy Policy' },
]

const socials = [
  { href: '#', label: 'Instagram', icon: 'photo_camera' },
  { href: '#', label: 'Facebook', icon: 'public' },
  { href: '#', label: 'Twitter', icon: 'alternate_email' },
  { href: '#', label: 'YouTube', icon: 'play_circle' },
]

function PaymentMark({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 min-w-[48px] items-center justify-center rounded-sm border border-white/15 bg-white/10 px-2 text-[10px] font-semibold tracking-wider text-on-footer">
      {label}
    </span>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-accent bg-footer text-on-footer">
      <div className="page-wrap grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-16">
        {/* Brand / about */}
        <div className="space-y-4">
          <div className="font-display text-3xl font-extrabold tracking-[-0.06em] text-white">Hapylo</div>
          <p className="font-display text-sm font-bold tracking-widest text-accent uppercase">Refreshingly Clean.</p>
          <p className="text-sm leading-relaxed text-on-footer-muted">
            Plant-powered home care products that respect your family and the planet. Ultra-concentrated formulas, ethically made.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socials.map(({ href, label, icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-on-footer transition-colors hover:border-accent hover:bg-white/10 hover:text-accent"
              >
                <span className="material-symbols-outlined text-[19px]">{icon}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          {shopLinks.map(link => (
            <Link
              key={link.href}
              className="text-sm text-on-footer-muted transition-colors hover:text-white"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Customer service */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Customer Service</h4>
          {serviceLinks.map(link => (
            <Link
              key={link.label}
              className="text-sm text-on-footer-muted transition-colors hover:text-white"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h4>
          <p className="text-sm leading-relaxed text-on-footer-muted">
            Sign up for tips, new arrivals, and exclusive offers.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="min-h-11 flex-grow rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-on-footer-muted transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Your email address"
              type="email"
            />
            <button className="btn-primary min-h-11 whitespace-nowrap px-5 py-2.5 text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-wrap flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-caption text-on-footer-muted">
            © 2026 Hapylo Home Care. Ethically Made. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
            <PaymentMark label="VISA" />
            <PaymentMark label="MC" />
            <PaymentMark label="AMEX" />
            <PaymentMark label="UPI" />
            <PaymentMark label="RZP" />
          </div>
        </div>
      </div>
    </footer>
  )
}
