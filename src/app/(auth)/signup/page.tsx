'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <section className="min-h-[calc(100dvh-9rem)] bg-background py-10 sm:py-16 lg:py-20">
      <div className="page-wrap grid items-center gap-10 lg:grid-cols-[1fr_minmax(25rem,30rem)] lg:gap-16">
        <div className="max-w-xl">
          <span className="eyebrow text-accent">Join the community</span>
          <h1 className="section-heading mt-4 text-4xl text-on-surface sm:text-5xl">A cleaner routine, made personal.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-on-surface-variant">Create your Hapylo account for a simpler checkout, order tracking, and first access to new essentials.</p>
          <div className="mt-8 hidden items-center gap-4 text-sm text-on-surface-variant sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-primary"><span className="material-symbols-outlined">eco</span></span>
            Thoughtful products for every home
          </div>
        </div>

        <div className="surface-card p-6 sm:p-8">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-primary">
                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-on-surface">Check your email</h2>
              <p className="text-sm text-on-surface-variant">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
              <Link href="/login" className="btn-primary mt-2 px-8 py-3 text-sm">Back to sign in</Link>
            </div>
          ) : (
            <>
              <p className="text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Create your account</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface">Let&apos;s get started</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Already a member? <Link href="/login" className="font-bold text-primary transition-colors hover:text-primary-hover">Sign in</Link></p>

              {/* Google OAuth */}
              <div className="mt-6">
                <GoogleSignInButton label="Continue with Google" />
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-outline-variant" />
                <span className="text-xs font-medium text-on-surface-variant">or sign up with email</span>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>

              {error && (
                <div className="mb-4 rounded-md bg-error-container p-3 text-sm text-on-error-container">{error}</div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-bold text-on-surface">Full name</label>
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-bold text-on-surface">Email address</label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-bold text-on-surface">Password</label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="At least 8 characters"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm disabled:opacity-60"
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
                <p className="text-center text-xs leading-relaxed text-on-surface-variant">By creating an account, you agree to our Terms and Privacy Policy.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
