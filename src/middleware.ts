import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Only run Supabase session refresh if env vars are properly configured (not placeholders)
  const isSupabaseConfigured = (() => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
      new URL(url) // throws if not a valid HTTP(S) URL
      return url.startsWith('https://') && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    } catch {
      return false
    }
  })()
  if (isSupabaseConfigured) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string, value: string, options: any }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session (required for Server Components)
    const { data: { user } } = await supabase.auth.getUser()

    // ── Admin route guard ──────────────────────────────────────────────────
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      // Check role server-side (not just hidden UI)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // ── Protected account routes ───────────────────────────────────────────
    if (request.nextUrl.pathname.startsWith('/account') && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
