export function DashboardSkeleton() {
  return (
    <div className="admin-theme min-h-screen p-8 space-y-8 animate-pulse">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="admin-card h-28" style={{ background: '#252525' }} />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="admin-card space-y-3">
        <div className="h-4 w-48 rounded" style={{ background: '#2e2e2e' }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 rounded" style={{ background: '#252525' }} />
        ))}
      </div>
    </div>
  )
}
