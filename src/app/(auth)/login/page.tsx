'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    })
    setForgotLoading(false)
    if (resetError) {
      setForgotError(resetError.message)
    } else {
      setForgotSent(true)
    }
  }

  return (
    <section className="min-h-[calc(100dvh-9rem)] bg-background py-10 sm:py-16 lg:py-20">
      <div className="page-wrap grid items-center gap-10 lg:grid-cols-[1fr_minmax(25rem,30rem)] lg:gap-16">
        <div className="max-w-xl">
          <span className="eyebrow text-accent">Your Hapylo account</span>
          <h1 className="section-heading mt-4 text-4xl text-on-surface sm:text-5xl">Good routines start here.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-on-surface-variant">Sign in to revisit your favourites, manage orders, and make every clean feel more effortless.</p>
          <div className="mt-8 hidden items-center gap-4 text-sm text-on-surface-variant sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-primary"><span className="material-symbols-outlined">local_shipping</span></span>
            Free shipping on orders over $50
          </div>
        </div>

        <div className="surface-card p-6 sm:p-8">
          {/* ── Forgot password panel ── */}
          {showForgot ? (
            <div>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotError('') }} className="mb-4 flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to sign in
              </button>
              <p className="text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Password reset</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface">Forgot your password?</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Enter your email and we&apos;ll send you a reset link.</p>
              {forgotSent ? (
                <div className="mt-6 rounded-md bg-secondary-container p-4 text-sm text-primary">
                  <span className="material-symbols-outlined mr-2 align-bottom text-[18px]">check_circle</span>
                  Reset email sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="mt-6 space-y-5">
                  {forgotError && (
                    <div className="rounded-md bg-error-container p-3 text-sm text-on-error-container">{forgotError}</div>
                  )}
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-bold text-on-surface">Email address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-3.5 text-sm disabled:opacity-60">
                    {forgotLoading ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Welcome back</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface">Sign in</h2>
              <p className="mt-2 text-sm text-on-surface-variant">New here? <Link href="/signup" className="font-bold text-primary transition-colors hover:text-primary-hover">Create an account</Link></p>

              {/* Google OAuth */}
              <div className="mt-6">
                <GoogleSignInButton label="Continue with Google" />
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-outline-variant" />
                <span className="text-xs font-medium text-on-surface-variant">or sign in with email</span>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>

              {error && (
                <div className="mb-4 rounded-md bg-error-container p-3 text-sm text-on-error-container">{error}</div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-bold text-on-surface">Email address</label>
                  <input
                    id="email-address"
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
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="password" className="block text-sm font-bold text-on-surface">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-sm font-bold text-primary transition-colors hover:text-primary-hover"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm disabled:opacity-60"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
