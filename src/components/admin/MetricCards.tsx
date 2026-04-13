import type { Metrics } from '@/types'

interface Props {
  metrics: Metrics
}

export function MetricCards({ metrics }: Props) {
  const cards = [
    { label: 'Total invitados',  value: metrics.total_guests,      note: 'familias / grupos' },
    { label: 'Confirmados',      value: metrics.confirmed_people,   note: 'personas' },
    { label: 'Pendientes',       value: metrics.pending_count,      note: 'sin responder' },
    { label: 'No asisten',       value: metrics.declined_count,     note: 'declinaron' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, note }) => (
        <div key={label} className="admin-card">
          <p className="admin-label mb-3">{label}</p>
          <p
            className="text-4xl font-light mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#e0dbd5' }}
          >
            {value}
          </p>
          <p className="text-xs" style={{ color: '#5a5250' }}>{note}</p>
        </div>
      ))}
    </div>
  )
}
