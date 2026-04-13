import { exportCSV } from '@/lib/csv'
import type { GuestWithRSVP } from '@/types'

interface Props {
  guests: GuestWithRSVP[]
}

export function CSVExport({ guests }: Props) {
  return (
    <button
      onClick={() => exportCSV(guests)}
      className="admin-btn-ghost"
      disabled={guests.length === 0}
    >
      Exportar CSV
    </button>
  )
}
