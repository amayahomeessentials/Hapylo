import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Hapylo',
  description: 'Find answers to common questions about Hapylo products, shipping, returns, and more.',
}

const faqs = [
  {
    q: 'What makes Hapylo products plant-powered?',
    a: 'Every Hapylo formula uses plant-derived enzymes and surfactants — ingredients sourced from natural, renewable plant sources. We never use harsh synthetic chemicals, artificial brighteners, or toxic dyes.',
  },
  {
    q: 'How concentrated are your products?',
    a: 'Our products are ultra-concentrated — a single bottle can last up to 64 laundry loads. This means less plastic waste and better value per use compared to conventional products.',
  },
  {
    q: 'Are your products safe for sensitive skin?',
    a: 'Yes! All Hapylo formulas are dermatologist-tested and hypoallergenic. They are free of artificial fragrances and dyes that commonly trigger sensitivities.',
  },
  {
    q: 'How long does shipping take?',
    a: 'We ship across India in 3–7 business days. Orders above ₹500 (or $50) qualify for free shipping. Express delivery options are available at checkout.',
  },
  {
    q: 'Can I return a product I don\'t like?',
    a: 'Absolutely. We offer a 30-day risk-free guarantee. If you\'re not satisfied, contact us and we\'ll arrange a return or replacement at no cost to you.',
  },
  {
    q: 'Are your products safe for greywater and septic systems?',
    a: 'Yes — our biodegradable formulas are fully greywater and septic safe. We design our products with environmental impact in mind.',
  },
  {
    q: 'Can I use promo codes?',
    a: 'Yes! You can apply a promo code at the cart page. Try HAPYLO10 for 10% off your first order.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap py-12 md:py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">FAQ</span>
        </nav>

        <div className="mb-12">
          <span className="eyebrow text-accent">Help centre</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-xl text-lg text-on-surface-variant">
            Everything you need to know about Hapylo. Can&apos;t find your answer?{' '}
            <Link href="/contact" className="font-bold text-primary hover:underline">Contact us</Link>.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group surface-card overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-6 text-base font-semibold text-on-surface marker:content-none">
                {faq.q}
                <span className="material-symbols-outlined shrink-0 text-primary transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="border-t border-outline-variant px-6 py-4 text-base leading-relaxed text-on-surface-variant">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
