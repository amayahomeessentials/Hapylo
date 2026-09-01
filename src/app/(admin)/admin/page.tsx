export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-on-surface">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Stats Cards */}
        <div className="rounded-lg border border-outline-variant bg-surface p-6 shadow-sm">
          <h3 className="text-sm font-medium text-on-surface-variant">Total Revenue</h3>
          <p className="mt-2 font-display text-3xl font-bold text-on-surface">$12,450.00</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-6 shadow-sm">
          <h3 className="text-sm font-medium text-on-surface-variant">Total Orders</h3>
          <p className="mt-2 font-display text-3xl font-bold text-on-surface">156</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-6 shadow-sm">
          <h3 className="text-sm font-medium text-on-surface-variant">Active Products</h3>
          <p className="mt-2 font-display text-3xl font-bold text-on-surface">24</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-outline-variant bg-surface shadow-sm">
        <div className="border-b border-outline-variant px-6 py-4">
          <h2 className="font-display text-xl font-bold text-on-surface">Recent Orders</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-on-surface-variant">No recent orders to display.</p>
        </div>
      </div>
    </div>
  )
}
