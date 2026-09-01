import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping Policy — Hapylo',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap py-12 md:py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">Shipping Policy</span>
        </nav>
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow text-accent">Delivery</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface">Shipping &amp; Delivery</h1>
          <div className="prose prose-slate mt-10 max-w-none space-y-8 text-on-surface-variant">
            <section className="surface-card p-6">
              <h2 className="mb-3 font-display text-xl font-bold text-on-surface">Delivery Timeframes</h2>
              <p>All orders are processed within 1–2 business days. Delivery typically takes <strong>3–7 business days</strong> across India. Metro cities may receive orders in 2–4 days.</p>
            </section>
            <section className="surface-card p-6">
              <h2 className="mb-3 font-display text-xl font-bold text-on-surface">Shipping Costs</h2>
              <p>We offer <strong>free standard shipping</strong> on all orders above ₹500 (or $50). For orders below this threshold, a flat shipping fee of ₹60 (or $5) applies.</p>
            </section>
            <section className="surface-card p-6">
              <h2 className="mb-3 font-display text-xl font-bold text-on-surface">Carbon-Neutral Shipping</h2>
              <p>We offset 100% of our shipping emissions through certified reforestation programmes. Every order delivered is a step towards a cleaner planet.</p>
            </section>
            <section className="surface-card p-6">
              <h2 className="mb-3 font-display text-xl font-bold text-on-surface">Order Tracking</h2>
              <p>Once your order ships, you'll receive a tracking number via email. You can also view your order status in your <Link href="/account/orders" className="font-bold text-primary hover:underline">order history</Link>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
