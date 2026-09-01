import Link from 'next/link'

export default function SignupPage() {
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
          <p className="text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Create your account</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface">Let&apos;s get started</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Already a member? <Link href="/login" className="font-bold text-primary transition-colors hover:text-primary-hover">Sign in</Link></p>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="full-name" className="block text-sm font-bold text-on-surface">Full name</label>
              <input id="full-name" name="name" type="text" autoComplete="name" required className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter your full name" />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-bold text-on-surface">Email address</label>
              <input id="signup-email" name="email" type="email" autoComplete="email" required className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-bold text-on-surface">Password</label>
              <input id="signup-password" name="password" type="password" autoComplete="new-password" required minLength={8} className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="At least 8 characters" />
            </div>
            <label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed text-on-surface-variant"><input name="updates" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" /> Send me product care tips and early-access offers.</label>
            <button type="submit" className="btn-primary w-full py-3.5 text-sm">Create account</button>
            <p className="text-center text-xs leading-relaxed text-on-surface-variant">By creating an account, you agree to our Terms and Privacy Policy.</p>
          </form>
        </div>
      </div>
    </section>
  )
}
