import type { GuestWithRSVP, RSVPStatus } from '@/types'

export function getStatus(guest: GuestWithRSVP): RSVPStatus {
  if (!guest.rsvp)                    return 'pending'
  if (guest.rsvp.attending === true)  return 'confirmed'
  return 'declined'
}

const DIETARY_LABELS: Record<string, string> = {
  ninguna:     'Sin restricciones',
  vegetariano: 'Vegetariano',
  vegano:      'Vegano',
  celiaco:     'Celíaco',
  otro:        'Otro',
}

const STATUS_LABELS: Record<RSVPStatus, string> = {
  confirmed: 'Confirmado',
  declined:  'No asiste',
  pending:   'Pendiente',
}

/** Exported for testing — returns the raw CSV string with BOM. */
export function buildCSVString(guests: GuestWithRSVP[]): string {
  const BOM = '\uFEFF'

  const headers = [
    'Nombre / Familia',
    'Código',
    'Estado',
    'Cant. personas',
    'Restricción alimentaria',
    'Fecha de confirmación',
  ]

  const rows = guests.map((g) => {
    const status = getStatus(g)
    const date   = g.rsvp?.responded_at
      ? new Date(g.rsvp.responded_at).toLocaleDateString('es-AR')
      : ''

    return [
      escape(g.name),
      g.code,
      STATUS_LABELS[status],
      status === 'confirmed' ? String(g.rsvp?.seat_count ?? '') : '',
      status === 'confirmed' ? (DIETARY_LABELS[g.rsvp?.dietary ?? ''] ?? '') : '',
      date,
    ]
  })

  return (
    BOM +
    [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n')
  )
}

export function exportCSV(guests: GuestWithRSVP[]): void {
  const csv  = buildCSVString(guests)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href     = url
  link.download = `invitados-${date}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function escape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
