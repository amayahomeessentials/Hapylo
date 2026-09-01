import { createClient } from '@supabase/supabase-js'

// ⚠️  SERVICE ROLE KEY — NEVER import this in any client-side file.
// Only use in Route Handlers and server-side actions.
// This bypasses RLS — use with extreme caution.

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
