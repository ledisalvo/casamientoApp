import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useGuests } from '@/hooks/useGuests'
import { getStatus } from '@/lib/csv'
import { MetricCards }      from '@/components/admin/MetricCards'
import { RSVPFilters }      from '@/components/admin/RSVPFilters'
import { GuestTable }       from '@/components/admin/GuestTable'
import { GuestForm }        from '@/components/admin/GuestForm'
import { DeleteConfirm }    from '@/components/admin/DeleteConfirm'
import { DeadlineConfig }   from '@/components/admin/DeadlineConfig'
import { CSVExport }        from '@/components/admin/CSVExport'
import { DashboardSkeleton } from '@/components/admin/DashboardSkeleton'
import '@/styles/admin.css'
import type { GuestWithRSVP, RSVPStatus } from '@/types'

type FilterOption = RSVPStatus | 'all'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const { guests, metrics, loading, error, refetch } = useGuests()

  const [filter,      setFilter]      = useState<FilterOption>('all')
  const [search,      setSearch]      = useState('')
  const [formGuest,   setFormGuest]   = useState<GuestWithRSVP | null | undefined>(undefined) // undefined = closed
  const [deleteGuest, setDeleteGuest] = useState<GuestWithRSVP | null>(null)

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  if (loading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: '#e07070' }}>{error}</p>
      </div>
    )
  }

  // Filter + search (search on unfiltered list, CSV also on unfiltered)
  const filteredGuests = guests.filter((g) => {
    const statusMatch = filter === 'all' || getStatus(g) === filter
    const searchMatch = !search || g.name.toLowerCase().includes(search.toLowerCase())
    return statusMatch && searchMatch
  })

  return (
    <div className="admin-theme min-h-screen">

      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between flex-wrap gap-4" style={{ borderBottom: '1px solid #2e2e2e' }}>
        <div className="flex items-center gap-6 flex-wrap">
          <h1 className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '1px' }}>
            Lucas &amp; Cecilia — Invitados
          </h1>
          <DeadlineConfig />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFormGuest(null)}  // null = create mode
            className="admin-btn-primary"
            style={{ padding: '8px 20px' }}
          >
            + Nuevo invitado
          </button>
          <CSVExport guests={guests} />
          <button onClick={handleSignOut} className="admin-btn-ghost">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="px-8 py-8 space-y-8">

        {/* Metrics */}
        {metrics && <MetricCards metrics={metrics} />}

        {/* Filters + Table */}
        <div className="admin-card space-y-5">
          <RSVPFilters
            activeFilter={filter}
            onFilterChange={setFilter}
            searchTerm={search}
            onSearchChange={setSearch}
          />
          <GuestTable
            guests={filteredGuests}
            onEdit={(g) => setFormGuest(g)}
            onDelete={(g) => setDeleteGuest(g)}
          />
        </div>

      </main>

      {/* Guest form modal (undefined = closed, null = create, GuestWithRSVP = edit) */}
      {formGuest !== undefined && (
        <GuestForm
          guest={formGuest}
          onSave={refetch}
          onClose={() => setFormGuest(undefined)}
        />
      )}

      {/* Delete confirm modal */}
      {deleteGuest && (
        <DeleteConfirm
          guest={deleteGuest}
          onDone={refetch}
          onClose={() => setDeleteGuest(null)}
        />
      )}

    </div>
  )
}
