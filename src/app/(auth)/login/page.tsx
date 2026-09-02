'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  
  // Auth methods state
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  
  // Password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Email OTP state
  const [otpEmail, setOtpEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  // General state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      // Check if user is admin → redirect to admin panel
      if (signInData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single()
        if (profile?.role === 'admin') {
          router.push('/admin')
          router.refresh()
          return
        }
      }
      router.push('/')
      router.refresh()
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, type: 'login' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }
      
      setOtpSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { data: signInData, error: verifyError } = await supabase.auth.verifyOtp({ email: otpEmail, token: otpCode, type: 'email' })
    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
    } else {
      // Check if user is admin → redirect to admin panel
      if (signInData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single()
        if (profile?.role === 'admin') {
          router.push('/admin')
          router.refresh()
          return
        }
      }
      router.push('/')
      router.refresh()
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    try {
      const response = await fetch('/api/auth/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset code')
      }
      
      setForgotSent(true)
    } catch (err: any) {
      setForgotError(err.message)
    } finally {
      setForgotLoading(false)
    }
  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)
    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({ 
      email: forgotEmail, 
      token: forgotOtp, 
      type: 'recovery' 
    })
    
    if (verifyError) {
      setForgotError(verifyError.message)
      setForgotLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    setForgotLoading(false)
    if (updateError) {
      setForgotError(updateError.message)
    } else {
      setShowForgot(false)
      setForgotSent(false)
      setLoginMethod('password')
      setError('Password reset successfully. Please log in.')
    }
  }

  const perks = [
    { icon: 'local_shipping', label: 'Free shipping on orders over ₹500' },
    { icon: 'replay', label: 'Easy 30-day returns' },
    { icon: 'workspace_premium', label: 'Exclusive member offers & early access' },
    { icon: 'favorite', label: 'Save favourites to your wishlist' },
  ]

  return (
    <div className="flex min-h-[calc(100dvh-4.5rem)] bg-background">

      {/* ── Left: Brand panel (desktop only) ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary px-12 py-14 lg:flex lg:w-[45%] xl:w-[40%]">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 left-1/4 h-96 w-96 rounded-full bg-white/5" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-[-0.05em] text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-base tracking-normal text-white backdrop-blur-sm">H</span>
          Hapylo
        </Link>

        {/* Main copy */}
        <div className="relative">
          <p className="mb-3 text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/50">
            Your account
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
            Good routines<br />start here.
          </h1>
          <p className="mt-5 max-w-xs text-base leading-relaxed text-white/70">
            Sign in to manage your orders, track deliveries, and discover curated essentials.
          </p>

          {/* Perks list */}
          <ul className="mt-9 space-y-4">
            {perks.map(perk => (
              <li key={perk.icon} className="flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[18px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {perk.icon}
                  </span>
                </span>
                <span className="text-[14px] font-medium text-white/80">{perk.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative text-[12px] text-white/40">
          © 2026 Hapylo · Home Essentials, Thoughtfully Made.
        </p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">

          {/* Mobile logo (hidden on desktop) */}
          <Link href="/" className="mb-8 flex items-center gap-2 font-display text-2xl font-extrabold tracking-[-0.05em] text-primary lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs tracking-normal text-white">H</span>
            Hapylo
          </Link>

          {/* ── Forgot password panel ── */}
          {showForgot ? (
            <div>
              <button
                onClick={() => { setShowForgot(false); setForgotSent(false); setForgotError('') }}
                className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to sign in
              </button>

              <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-accent">Password reset</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-on-surface">
                Forgot your password?
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {forgotSent ? (
                <form onSubmit={handleVerifyForgotOtp} className="mt-7 space-y-5">
                  {forgotError && (
                    <div className="flex items-center gap-2 rounded-xl bg-error-container p-3.5 text-sm text-on-error-container">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {forgotError}
                    </div>
                  )}
                  <div>
                    <label htmlFor="forgot-otp" className="block text-sm font-semibold text-on-surface">Verification Code</label>
                    <p className="mt-1 mb-2 text-xs text-on-surface-variant">We sent a 6-digit code to {forgotEmail}</p>
                    <input
                      id="forgot-otp"
                      type="text"
                      required
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-semibold text-on-surface">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full rounded-xl py-3.5 text-sm disabled:opacity-60">
                    {forgotLoading ? 'Resetting…' : 'Reset Password'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="mt-7 space-y-5">
                  {forgotError && (
                    <div className="flex items-center gap-2 rounded-xl bg-error-container p-3.5 text-sm text-on-error-container">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {forgotError}
                    </div>
                  )}
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-semibold text-on-surface">Email address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full rounded-xl py-3.5 text-sm disabled:opacity-60">
                    {forgotLoading ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-accent">Welcome back</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-on-surface">
                Sign in to Hapylo
              </h2>

              {/* No account banner */}
              <div className="mt-5 flex flex-col gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-on-surface-variant">New to Hapylo?</span>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white hover:border-primary"
                >
                  Create account
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </Link>
              </div>

              {/* Google OAuth */}
              <div className="mt-6">
                <GoogleSignInButton label="Continue with Google" />
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-outline-variant" />
                <span className="text-xs font-medium text-on-surface-variant">or continue with</span>
                <div className="h-px flex-1 bg-outline-variant" />
              </div>

              {/* Auth Method Tabs */}
              <div className="mb-6 flex gap-2 rounded-xl bg-surface-container-low p-1">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setError(''); }}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                    loginMethod === 'password' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setError(''); }}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                    loginMethod === 'otp' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Email OTP
                </button>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-container p-3.5 text-sm text-on-error-container">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              {loginMethod === 'password' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-semibold text-on-surface">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-semibold text-on-surface">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-xs font-bold text-primary transition-colors hover:text-primary-hover"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 pr-12 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full rounded-xl py-3.5 text-sm disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        Signing in…
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {/* Email OTP */}
                  {!otpSent ? (
                    <div>
                      <label htmlFor="otp-email" className="block text-sm font-semibold text-on-surface">
                        Email address
                      </label>
                      <input
                        id="otp-email"
                        name="otpEmail"
                        type="email"
                        autoComplete="email"
                        required
                        value={otpEmail}
                        onChange={e => setOtpEmail(e.target.value)}
                        className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="you@example.com"
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="otp-code" className="block text-sm font-semibold text-on-surface">
                        Verification Code
                      </label>
                      <p className="mt-1 mb-2 text-xs text-on-surface-variant">We sent a 6-digit code to {otpEmail}</p>
                      <input
                        id="otp-code"
                        name="otpCode"
                        type="text"
                        autoComplete="one-time-code"
                        required
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        className="block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface placeholder-outline shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="123456"
                      />
                      <button 
                        type="button" 
                        onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); }}
                        className="mt-2 text-xs font-semibold text-primary hover:underline"
                      >
                        Change email address
                      </button>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full rounded-xl py-3.5 text-sm disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        {otpSent ? 'Verifying…' : 'Sending…'}
                      </span>
                    ) : (
                      otpSent ? 'Verify & Sign in' : 'Send Magic Code'
                    )}
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-xs text-on-surface-variant">
                By signing in, you agree to our{' '}
                <Link href="/privacy-policy" className="font-semibold text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
