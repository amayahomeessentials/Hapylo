import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Returns & Refunds — Hapylo' }

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap py-12 md:py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">Returns &amp; Refunds</span>
        </nav>
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow text-accent">Our promise</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface">Returns &amp; Refunds</h1>
          <p className="mt-4 text-lg text-on-surface-variant">We stand behind every product. If you&apos;re not completely satisfied, we&apos;ll make it right.</p>
          <div className="mt-10 space-y-6">
            {[
              { icon: 'verified', title: '30-Day Risk-Free Guarantee', body: 'Try any Hapylo product risk-free for 30 days. If you\'re not satisfied for any reason, contact us for a full refund or replacement — no questions asked.' },
              { icon: 'local_shipping', title: 'Free Return Shipping', body: 'We cover the return shipping cost for all eligible returns within India. Simply reach out to our support team to initiate a return.' },
              { icon: 'payments', title: 'Refund Timeline', body: 'Once your return is received and inspected, refunds are processed within 5–7 business days to your original payment method.' },
              { icon: 'help', title: 'Non-Returnable Items', body: 'Opened products that have been significantly used beyond a reasonable trial period may not be eligible for return. Contact us if you\'re unsure.' },
            ].map(item => (
              <div key={item.title} className="surface-card flex gap-6 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-primary">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-on-surface">{item.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-lg bg-primary p-8 text-center text-white">
            <h2 className="font-display text-2xl font-bold">Need to start a return?</h2>
            <p className="mt-2 text-white/75">Our team is happy to help.</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-8 py-3 font-bold text-white transition-all hover:bg-accent-hover">
              Contact Support <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
