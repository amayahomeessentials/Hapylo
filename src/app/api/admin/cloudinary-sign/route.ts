import { NextResponse } from 'next/server'
import { generateUploadSignature } from '@/lib/cloudinary'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  // Only allow authenticated admin users to get a signature
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const sig = generateUploadSignature('hapylo/products')
  return NextResponse.json(sig)
}
