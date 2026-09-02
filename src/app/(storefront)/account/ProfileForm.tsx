'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ProfileFormProps = {
  initialProfile: { full_name: string; email: string }
  initialAddress: any
}

export default function ProfileForm({ initialProfile, initialAddress }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const [fullName, setFullName] = useState(initialProfile.full_name)
  const [address, setAddress] = useState({
    line1: initialAddress.line1 || '',
    line2: initialAddress.line2 || '',
    city: initialAddress.city || '',
    state: initialAddress.state || '',
    pincode: initialAddress.pincode || '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) return

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', session.user.id)
        
      if (profileError) throw profileError

      // Update or insert default address
      if (initialAddress.id) {
        const { error: addressError } = await supabase
          .from('addresses')
          .update(address)
          .eq('id', initialAddress.id)
        if (addressError) throw addressError
      } else {
        const { error: addressError } = await supabase
          .from('addresses')
          .insert({
            ...address,
            user_id: session.user.id,
            is_default: true,
          })
        if (addressError) throw addressError
      }

      setMessage({ text: 'Profile updated successfully!', type: 'success' })
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-error-container text-on-error-container'
        }`}>
          <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-on-surface">Email Address</label>
          <input
            type="email"
            disabled
            value={initialProfile.email}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface-container/50 px-4 py-3 text-sm text-on-surface-variant shadow-sm cursor-not-allowed"
          />
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-on-surface">Full Name</label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-outline-variant">
          <h3 className="text-lg font-bold text-on-surface">Default Shipping Address</h3>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="line1" className="block text-sm font-semibold text-on-surface">Address Line 1</label>
          <input
            id="line1"
            type="text"
            required
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="line2" className="block text-sm font-semibold text-on-surface">Address Line 2 (Optional)</label>
          <input
            id="line2"
            type="text"
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-on-surface">City</label>
          <input
            id="city"
            type="text"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-on-surface">State</label>
          <input
            id="state"
            type="text"
            required
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label htmlFor="pincode" className="block text-sm font-semibold text-on-surface">Pincode / ZIP</label>
          <input
            id="pincode"
            type="text"
            required
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-6 py-3 text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
