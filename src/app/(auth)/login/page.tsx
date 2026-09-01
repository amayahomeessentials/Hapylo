import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh overflow-hidden bg-background">
      {/* Left Form Side */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-10 sm:px-12 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md rounded-lg bg-surface p-6 shadow-card sm:p-9 lg:max-w-sm lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="text-left">
            <Link href="/" className="mb-10 flex w-fit items-center gap-2 font-display text-2xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs tracking-normal text-white">H</span>Hapylo
            </Link>
            <p className="mb-3 text-xs font-extrabold tracking-[0.14em] text-accent uppercase">Welcome back</p>
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-on-surface sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Don&apos;t have an account? <a href="#" className="font-bold text-primary hover:text-primary-hover transition-colors">Sign up for free</a>
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <form className="space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-bold text-on-surface">Email address</label>
                <div className="mt-2">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-on-surface">Password</label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border border-outline-variant bg-surface px-4 py-3 text-on-surface placeholder-outline shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="block text-sm text-on-surface">
                    Remember me
                  </label>
                </div>

                <div className="shrink-0 text-sm">
                  <a href="#" className="font-bold text-primary hover:text-primary-hover transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary py-3.5 text-sm font-bold tracking-wide text-white shadow-primary-glow transition-all hover:-translate-y-0.5 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM36I_ctJ_4eZAPD4rUNjUQTES---yMlBAYYuxniIfAXz0w42w_N4Ut2mGMUj9U_YkwPOsOIMS8z9gnUOIFJvEff3pgkH-S416GBSr3-llitZi1_8Q_4xHr4_nDv-R_XXn3TwZToZogDtRewUD8rK80Vas1Xr3xUTz6VlW7OFVpv335fp76S9fYXPbzRsutiOLDpX5tre_J-RP3jVliH1EFwxoNWlEM9eNVLfuK7y3A553M0tpCsPi"
          alt="Clean modern living room"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <blockquote className="space-y-4">
            <p className="font-display text-3xl font-extrabold leading-tight">
              "The best cleaning products I've ever used. My home has never smelled better or felt cleaner."
            </p>
            <footer className="text-sm font-medium text-white/80">— Sarah J., Verified Buyer</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
