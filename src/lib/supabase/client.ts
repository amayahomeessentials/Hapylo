import { createBrowserClient } from '@supabase/ssr'

// TODO: replace with your actual Supabase project URL and anon key
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
