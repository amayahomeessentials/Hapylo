import Link from 'next/link'
import { getAdminUsers } from '@/data/admin'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await getAdminUsers()

  const fmtDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const fmtDatetime = (iso: string | null) => {
    if (!iso) return 'Never'
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
          Users
        </h1>
        <p className="mt-1.5 text-sm text-on-surface-variant">
          {users.length} registered customer{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          {
            label: 'Total Users',
            value: users.length,
            icon: 'group',
            accent: '#0EA5E9',
            accentBg: '#E0F2FE',
          },
          {
            label: 'With Orders',
            value: users.filter(u => u.order_count > 0).length,
            icon: 'shopping_bag',
            accent: '#10B981',
            accentBg: '#D1FAE5',
          },
          {
            label: 'No Orders Yet',
            value: users.filter(u => u.order_count === 0).length,
            icon: 'person_add',
            accent: '#F59E0B',
            accentBg: '#FEF3C7',
          },
        ].map(card => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-2xl bg-white p-5"
            style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)' }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: card.accentBg }}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ color: card.accent, fontVariationSettings: "'FILL' 1" }}
              >
                {card.icon}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{card.label}</p>
              <p className="mt-0.5 font-display text-2xl font-extrabold tracking-tight text-on-surface">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl bg-white"
        style={{ border: '1px solid #E0E4E0', boxShadow: '0 1px 3px rgba(12,46,50,0.05), 0 4px 12px rgba(12,46,50,0.05)' }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E8ECE8' }}>
          <div>
            <h2 className="font-display text-base font-bold text-on-surface">All Users</h2>
            <p className="text-xs text-on-surface-variant">Registered accounts, sorted by newest first</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="material-symbols-outlined mb-3 text-5xl text-outline">group</span>
            <p className="font-semibold text-on-surface">No users yet</p>
            <p className="mt-1 text-sm text-on-surface-variant">Users will appear here once customers sign up.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#F7F9F7', borderBottom: '1px solid #E8ECE8' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    User
                  </th>
                  <th className="hidden px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant sm:table-cell">
                    Joined
                  </th>
                  <th className="hidden px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant md:table-cell">
                    Last Sign In
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#F0F2EC' }}>
                {users
                  .slice()
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map(user => (
                    <tr key={user.id} className="transition-colors hover:bg-surface-container-low">
                      {/* User info */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Avatar initials */}
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ background: '#123C3E' }}
                          >
                            {(user.full_name ?? user.email)?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-on-surface">
                              {user.full_name ?? <span className="italic text-on-surface-variant">No name</span>}
                            </p>
                            <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="hidden px-6 py-3.5 text-on-surface-variant sm:table-cell">
                        {fmtDate(user.created_at)}
                      </td>

                      {/* Last sign in */}
                      <td className="hidden px-6 py-3.5 text-on-surface-variant md:table-cell">
                        {fmtDatetime(user.last_sign_in_at)}
                      </td>

                      {/* Order count */}
                      <td className="px-6 py-3.5 text-right">
                        {user.order_count > 0 ? (
                          <Link
                            href={`/admin/orders?user=${user.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold text-white hover:opacity-80 transition-opacity"
                            style={{ background: '#123C3E' }}
                          >
                            <span className="material-symbols-outlined text-[12px]">receipt_long</span>
                            {user.order_count}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant">
                            0
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
