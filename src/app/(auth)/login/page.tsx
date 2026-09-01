import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Form Side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-[-0.06em] text-primary transition-colors hover:text-primary-hover mb-8 w-fit">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs tracking-normal text-white">H</span>Hapylo
            </Link>
            <h2 className="font-display text-3xl font-extrabold text-on-surface">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Don't have an account? <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors">Sign up for free</a>
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-on-surface">Email address</label>
                <div className="mt-2">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border border-outline-variant px-3 py-2.5 text-on-surface placeholder-outline shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-on-surface">Password</label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border border-outline-variant px-3 py-2.5 text-on-surface placeholder-outline shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
