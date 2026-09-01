'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In production: POST to a contact API route (e.g. SendGrid / Resend)
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-wrap py-12 md:py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-primary">Contact</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow text-accent">Get in touch</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              We&apos;re here to help.
            </h1>
            <p className="mt-4 text-lg text-on-surface-variant">
              Have a question about your order, our products, or just want to say hello? Send us a message and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="mt-10 space-y-6">
              {[
                { icon: 'mail', label: 'Email', value: 'hello@hapylo.com' },
                { icon: 'support_agent', label: 'Support hours', value: 'Mon–Sat, 10am–6pm IST' },
                { icon: 'location_on', label: 'Based in', value: 'India' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{item.label}</p>
                    <p className="font-semibold text-on-surface">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-primary">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">Message sent!</h2>
                <p className="text-on-surface-variant">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-secondary px-8 py-3 text-sm">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-on-surface">Name</label>
                    <input required name="name" value={form.name} onChange={handleChange} className="w-full rounded-md border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-on-surface">Email</label>
                    <input required name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-md border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-on-surface">Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option value="">Select a topic…</option>
                    <option>Order / Shipping</option>
                    <option>Returns &amp; Refunds</option>
                    <option>Product Question</option>
                    <option>Wholesale &amp; Partnerships</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-on-surface">Message</label>
                  <textarea required name="message" value={form.message} onChange={handleChange} rows={5} className="w-full resize-none rounded-md border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="How can we help?" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-60">
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
