import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  createGuestWithMembers,
  updateGuestWithMembers,
  listGuestMembers,
  sendInviteEmail,
} from '@/lib/queries'
import type { GuestWithRSVP } from '@/types'

interface Member {
  name:  string
  email: string
}

interface Props {
  guest?:  GuestWithRSVP | null
  onSave:  () => void
  onClose: () => void
}

export function GuestForm({ guest, onSave, onClose }: Props) {
  const isEditing = !!guest

  const [familyName, setFamilyName] = useState(guest?.name ?? '')
  const [quantity,   setQuantity]   = useState(guest?.max_seats ?? 1)
  const [members,    setMembers]    = useState<Member[]>(() =>
    Array.from({ length: guest?.max_seats ?? 1 }, () => ({ name: '', email: '' }))
  )
  const [error,   setError]   = useState<string | null>(null)
  const [saving,  setSaving]  = useState(false)
  const [sending, setSending] = useState(false)

  // Load existing members when editing
  useEffect(() => {
    if (!guest) return
    listGuestMembers(guest.id).then((existing) => {
      if (existing.length === 0) return
      setMembers(existing.map((m) => ({ name: m.name, email: m.email ?? '' })))
      setQuantity(existing.length)
    })
  }, [guest])

  function handleQuantityChange(n: number) {
    const clamped = Math.max(1, Math.min(20, n))
    setQuantity(clamped)
    setMembers((prev) => {
      if (clamped > prev.length)
        return [...prev, ...Array.from({ length: clamped - prev.length }, () => ({ name: '', email: '' }))]
      return prev.slice(0, clamped)
    })
  }

  function updateMember(i: number, field: 'name' | 'email', value: string) {
    setMembers((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  function membersPayload() {
    return members.map((m) => ({ name: m.name.trim(), email: m.email.trim() || null }))
  }

  async function handleSave() {
    if (!familyName.trim()) { setError('El nombre de familia es obligatorio.'); return }
    if (members.some((m) => !m.name.trim())) { setError('Todos los integrantes necesitan un nombre.'); return }

    setSaving(true)
    setError(null)
    try {
      if (isEditing) {
        await updateGuestWithMembers(guest.id, { familyName: familyName.trim(), members: membersPayload() })
      } else {
        await createGuestWithMembers({ familyName: familyName.trim(), members: membersPayload() })
      }
      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSaving(false)
    }
  }

  async function handleSendInvite() {
    if (!familyName.trim()) { setError('El nombre de familia es obligatorio.'); return }
    if (members.some((m) => !m.name.trim())) { setError('Todos los integrantes necesitan un nombre.'); return }

    setSending(true)
    setError(null)
    try {
      let guestId: string = guest?.id ?? ''
      if (!guestId) {
        console.log('[sendInvite] creating guest...')
        guestId = await createGuestWithMembers({ familyName: familyName.trim(), members: membersPayload() })
        console.log('[sendInvite] guest created:', guestId)
      } else {
        console.log('[sendInvite] updating guest:', guestId)
        await updateGuestWithMembers(guestId, { familyName: familyName.trim(), members: membersPayload() })
      }
      console.log('[sendInvite] calling edge function...')
      const result = await sendInviteEmail(guestId)
      console.log('[sendInvite] result:', result)
      onSave()
      onClose()
      if (result.total === 0) alert('Guardado. Ningún integrante tiene email cargado.')
      else alert(`Invitación enviada a ${result.sent} de ${result.total} destinatario${result.total > 1 ? 's' : ''}.`)
    } catch (err) {
      console.error('[sendInvite] error:', err)
      setError(err instanceof Error ? err.message : String(err))
      setSending(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="admin-theme border"
        style={{ background: '#1e1e1e', borderColor: '#2e2e2e', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", color: '#e0dbd5', fontWeight: 300, fontSize: '22px' }}>
            {isEditing ? 'Editar familia' : 'Nueva familia'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Family name */}
          <div>
            <label className="admin-label" htmlFor="gf-family">Nombre de familia *</label>
            <input
              id="gf-family"
              className="admin-input"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Jose y Esther"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="admin-label" htmlFor="gf-qty">Cantidad de invitados *</label>
            <input
              id="gf-qty"
              type="number"
              min={1}
              max={20}
              className="admin-input"
              style={{ maxWidth: '100px' }}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          {/* Member rows */}
          <div className="space-y-3">
            <p className="admin-label" style={{ marginBottom: 0 }}>Integrantes</p>
            {members.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div style={{ flex: '1 1 45%' }}>
                  <input
                    className="admin-input"
                    placeholder={`Nombre ${i + 1} *`}
                    value={m.name}
                    onChange={(e) => updateMember(i, 'name', e.target.value)}
                  />
                </div>
                <div style={{ flex: '1 1 55%' }}>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="Email (opcional)"
                    value={m.email}
                    onChange={(e) => updateMember(i, 'email', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs py-2 px-3" style={{ background: '#2a1a1a', color: '#e07070' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={saving || sending}
              className="admin-btn-primary disabled:opacity-40"
            >
              {sending ? 'Enviando…' : 'Enviar invitación'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || sending}
              className="admin-btn-ghost disabled:opacity-40"
            >
              {saving ? 'Guardando…' : 'Solo guardar'}
            </button>
            <button type="button" onClick={onClose} className="admin-btn-ghost">
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
