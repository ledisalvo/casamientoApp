import type { RSVPStatus } from '@/types'

type FilterOption = RSVPStatus | 'all'

interface Props {
  activeFilter:   FilterOption
  onFilterChange: (f: FilterOption) => void
  searchTerm:     string
  onSearchChange: (s: string) => void
}

const FILTERS: { value: FilterOption; label: string }[] = [
  { value: 'all',       label: 'Todos' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'pending',   label: 'Pendientes' },
  { value: 'declined',  label: 'No asisten' },
]

export function RSVPFilters({ activeFilter, onFilterChange, searchTerm, onSearchChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className="px-4 py-2 text-xs uppercase tracking-widest transition-all duration-150"
            style={{
              border:     `1px solid ${activeFilter === value ? '#aa7750' : '#3a3530'}`,
              background: activeFilter === value ? '#aa7750' : 'transparent',
              color:      activeFilter === value ? '#fff'    : '#7a7068',
              fontFamily: "'Montserrat', sans-serif",
              cursor:     'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Buscar por nombre…"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="admin-input sm:ml-auto"
        style={{ maxWidth: '240px', padding: '8px 12px', fontSize: '12px' }}
      />
    </div>
  )
}
