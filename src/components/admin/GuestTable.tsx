import { useState } from 'react'
import { QRDownload } from './QRDownload'
import { getStatus } from '@/lib/csv'
import type { GuestWithRSVP } from '@/types'

interface Props {
  guests:   GuestWithRSVP[]
  onEdit:   (guest: GuestWithRSVP) => void
  onDelete: (guest: GuestWithRSVP) => void
}

type SortKey = 'name' | 'status' | 'responded_at'

const PAGE_SIZE = 50

const DIETARY_LABELS: Record<string, string> = {
  ninguna:     '—',
  vegetariano: 'Vegetariano',
  vegano:      'Vegano',
  celiaco:     'Celíaco',
  otro:        'Otro',
}

export function GuestTable({ guests, onEdit, onDelete }: Props) {
  const [sortKey,  setSortKey]  = useState<SortKey>('name')
  const [sortAsc,  setSortAsc]  = useState(true)
  const [page,     setPage]     = useState(0)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v)
    else { setSortKey(key); setSortAsc(true) }
    setPage(0)
  }

  const sorted = [...guests].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name')         cmp = a.name.localeCompare(b.name, 'es')
    if (sortKey === 'status')       cmp = getStatus(a).localeCompare(getStatus(b))
    if (sortKey === 'responded_at') {
      const da = a.rsvp?.responded_at ?? ''
      const db = b.rsvp?.responded_at ?? ''
      cmp = da.localeCompare(db)
    }
    return sortAsc ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged      = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function SortBtn({ k, label }: { k: SortKey; label: string }) {
    return (
      <button
        onClick={() => toggleSort(k)}
        className="flex items-center gap-1 hover:text-accent transition-colors"
        style={{ color: sortKey === k ? '#aa7750' : '#7a7068', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}
      >
        {label} {sortKey === k ? (sortAsc ? '↑' : '↓') : ''}
      </button>
    )
  }

  return (
    <div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th><SortBtn k="name" label="Nombre / Familia" /></th>
              <th>Código</th>
              <th><SortBtn k="status" label="Estado" /></th>
              <th>Personas</th>
              <th>Alimentación</th>
              <th><SortBtn k="responded_at" label="Confirmado" /></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8" style={{ color: '#4a4540' }}>
                  No hay invitados que coincidan.
                </td>
              </tr>
            )}
            {paged.map((guest) => {
              const status = getStatus(guest)
              return (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>
                    <code style={{ fontSize: '11px', color: '#8a8078', background: '#252525', padding: '2px 6px' }}>
                      {guest.code}
                    </code>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${status}`}>
                      {status === 'confirmed' ? 'Confirmado' : status === 'declined' ? 'No asiste' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ color: '#c0b8b0' }}>
                    {status === 'confirmed' ? guest.rsvp?.seat_count ?? '—' : '—'}
                  </td>
                  <td style={{ color: '#c0b8b0' }}>
                    {status === 'confirmed'
                      ? DIETARY_LABELS[guest.rsvp?.dietary ?? 'ninguna'] ?? '—'
                      : '—'}
                  </td>
                  <td style={{ color: '#7a7068', fontSize: '12px' }}>
                    {guest.rsvp?.responded_at
                      ? new Date(guest.rsvp.responded_at).toLocaleDateString('es-AR')
                      : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => onEdit(guest)} className="admin-btn-ghost">Editar</button>
                      <QRDownload code={guest.code} />
                      <button onClick={() => onDelete(guest)} className="admin-btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-xs" style={{ color: '#7a7068' }}>
          <span>{sorted.length} invitados · página {page + 1} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="admin-btn-ghost disabled:opacity-30"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="admin-btn-ghost disabled:opacity-30"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
