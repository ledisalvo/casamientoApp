import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createGuest, updateGuest } from '@/lib/queries'
import type { GuestWithRSVP } from '@/types'

interface Props {
  guest?:   GuestWithRSVP | null
  onSave:   () => void
  onClose:  () => void
}

export function GuestForm({ guest, onSave, onClose }: Props) {
  const isEditing = !!guest

  const [name,      setName]      = useState(guest?.name      ?? '')
  const [code,      setCode]      = useState(guest?.code      ?? '')
  const [email,     setEmail]     = useState(guest?.email     ?? '')
  const [maxSeats,  setMaxSeats]  = useState(guest?.max_seats ?? 1)
  const [error,     setError]     = useState<string | null>(null)
  const [saving,    setSaving]    = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (isEditing) {
        await updateGuest(guest.id, {
          name,
          code:      code.toUpperCase(),
          email:     email || null,
          max_seats: maxSeats,
        })
      } else {
        await createGuest({
          name,
          code:      code.toUpperCase(),
          email:     email || null,
          max_seats: maxSeats,
        })
      }
      onSave()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg.includes('duplicate') ? 'Ese código ya existe. Usá uno diferente.' : msg)
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="admin-theme border"
        style={{ background: '#1e1e1e', borderColor: '#2e2e2e', maxWidth: '440px' }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", color: '#e0dbd5', fontWeight: 300, fontSize: '22px' }}>
            {isEditing ? 'Editar invitado' : 'Nuevo invitado'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="admin-label" htmlFor="gf-name">Nombre / Familia *</label>
            <input
              id="gf-name"
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Familia García"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="gf-code">Código *</label>
            <input
              id="gf-code"
              className="admin-input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              placeholder="GARCIA-2025"
              style={{ fontFamily: 'monospace' }}
            />
            <p className="mt-1 text-xs" style={{ color: '#4a4540' }}>
              Se usa en la URL del QR. Sin espacios.
            </p>
          </div>

          <div>
            <label className="admin-label" htmlFor="gf-email">Email (opcional)</label>
            <input
              id="gf-email"
              type="email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="familia@correo.com"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="gf-seats">Máx. asistentes *</label>
            <input
              id="gf-seats"
              type="number"
              min={1}
              max={20}
              className="admin-input"
              value={maxSeats}
              onChange={(e) => setMaxSeats(Math.max(1, parseInt(e.target.value, 10) || 1))}
              required
            />
          </div>

          {error && (
            <p className="text-xs py-2 px-3" style={{ background: '#2a1a1a', color: '#e07070' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="admin-btn-primary disabled:opacity-40">
              {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear invitado'}
            </button>
            <button type="button" onClick={onClose} className="admin-btn-ghost">
              Cancelar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
