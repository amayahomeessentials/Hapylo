import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

import ProfileForm from './ProfileForm'

export default async function AccountPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Fetch default address
  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_default', true)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-on-surface tracking-tight">Personal Information</h1>
        <p className="text-on-surface-variant mt-1">Manage your account details and default shipping address.</p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm">
        <ProfileForm 
          initialProfile={{
            full_name: profile?.full_name || '',
            email: session.user.email || '',
          }}
          initialAddress={address || {
            line1: '', line2: '', city: '', state: '', pincode: ''
          }}
        />
      </div>
    </div>
  )
}
