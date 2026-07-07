import { useState, useEffect } from 'react'
import { listPublicRSVPs, deletePublicRSVP } from '@/lib/queries'
import type { PublicRSVP } from '@/types'

export function PublicRSVPPanel() {
  const [rows,     setRows]     = useState<PublicRSVP[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      setRows(await listPublicRSVPs())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(row: PublicRSVP) {
    const ok = window.confirm(
      `¿Eliminar la confirmación de "${row.name}"? Esto no se puede deshacer.`
    )
    if (!ok) return
    setDeleting(row.id)
    try {
      await deletePublicRSVP(row.id)
      setRows((prev) => prev.filter((r) => r.id !== row.id))
    } finally {
      setDeleting(null)
    }
  }

  const going = rows.filter((r) => r.attending).reduce((sum, r) => sum + r.seat_count, 0)

  return (
    <div className="admin-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium" style={{ color: '#c0b8b0', letterSpacing: '1px' }}>
          Confirmaciones desde la landing
          {!loading && (
            <span style={{ color: '#7a6a60', marginLeft: '8px' }}>
              ({rows.length} respuesta{rows.length !== 1 ? 's' : ''} · {going} asisten)
            </span>
          )}
        </h2>
      </div>

      {loading && <p className="text-xs" style={{ color: '#7a6a60' }}>Cargando…</p>}

      {!loading && rows.length === 0 && (
        <p className="text-xs" style={{ color: '#7a6a60' }}>Todavía no hay confirmaciones.</p>
      )}

      {!loading && rows.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Personas</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`status-badge status-badge--${row.attending ? 'confirmed' : 'declined'}`}>
                      {row.attending ? 'Asiste' : 'No asiste'}
                    </span>
                  </td>
                  <td style={{ color: '#c0b8b0' }}>{row.attending ? row.seat_count : '—'}</td>
                  <td style={{ color: '#7a7068', fontSize: '12px' }}>
                    {new Date(row.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(row)}
                      disabled={deleting === row.id}
                      className="admin-btn-danger"
                    >
                      {deleting === row.id ? '…' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
