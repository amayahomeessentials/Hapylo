import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy — Hapylo' }

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap py-12 md:py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">Privacy Policy</span>
        </nav>
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow text-accent">Legal</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface">Privacy Policy</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Last updated: September 2026</p>

          <div className="mt-10 space-y-8 text-on-surface-variant [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-on-surface [&_p]:text-base [&_p]:leading-relaxed">
            <section className="surface-card p-6">
              <h2>Information We Collect</h2>
              <p>We collect information you provide directly — such as your name, email address, shipping address, and payment details during checkout. We also collect usage data such as pages visited and products viewed to improve our service.</p>
            </section>
            <section className="surface-card p-6">
              <h2>How We Use Your Information</h2>
              <p>Your information is used to process orders, send order confirmation and shipping notifications, personalise your experience, and occasionally send you product updates (which you can opt out of at any time).</p>
            </section>
            <section className="surface-card p-6">
              <h2>Data Sharing</h2>
              <p>We do not sell your personal data. We share information only with trusted service providers (payment processors, shipping partners) strictly necessary to fulfil your order. All partners are bound by data processing agreements.</p>
            </section>
            <section className="surface-card p-6">
              <h2>Cookies</h2>
              <p>We use essential cookies to keep your cart and session active, and analytics cookies (with your consent) to understand how visitors use our site. You can manage cookie preferences in your browser settings.</p>
            </section>
            <section className="surface-card p-6">
              <h2>Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:privacy@hapylo.com" className="font-bold text-primary hover:underline">privacy@hapylo.com</a>.</p>
            </section>
            <section className="surface-card p-6">
              <h2>Contact</h2>
              <p>Questions about this policy? <Link href="/contact" className="font-bold text-primary hover:underline">Contact our team</Link> — we&apos;re happy to help.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
