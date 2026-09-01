import Link from 'next/link'

export default function LoginPage() {
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
          <p className="text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Welcome back</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface">Sign in</h2>
          <p className="mt-2 text-sm text-on-surface-variant">New here? <Link href="/signup" className="font-bold text-primary transition-colors hover:text-primary-hover">Create an account</Link></p>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-bold text-on-surface">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter your email" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="password" className="block text-sm font-bold text-on-surface">Password</label>
                <Link href="#" className="text-sm font-bold text-primary transition-colors hover:text-primary-hover">Forgot password?</Link>
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2 block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter your password" />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface"><input name="remember-me" type="checkbox" className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" /> Remember me</label>
            <button type="submit" className="btn-primary w-full py-3.5 text-sm">Sign in</button>
          </form>
        </div>
      </div>
    </section>
  )
}
