import { useState, useEffect } from 'react'
import { getRSVPDeadline, updateDeadline } from '@/lib/queries'

export function DeadlineConfig() {
  const [deadline, setDeadline] = useState<string>('')
  const [editing,  setEditing]  = useState(false)
  const [input,    setInput]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    getRSVPDeadline().then((d) => {
      if (d) {
        // Format for display
        setDeadline(d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
        // Format for datetime-local input (YYYY-MM-DDTHH:MM)
        const iso = d.toISOString()
        setInput(iso.slice(0, 16))
      }
    })
  }, [])

  async function handleSave() {
    if (!input) return
    setSaving(true)
    setFeedback(null)
    try {
      await updateDeadline(new Date(input).toISOString())
      const d = new Date(input)
      setDeadline(d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
      setFeedback('Fecha actualizada.')
      setEditing(false)
    } catch {
      setFeedback('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="admin-label mb-0">Cierre RSVP:</span>

      {editing ? (
        <>
          <input
            type="datetime-local"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="admin-input"
            style={{ maxWidth: '200px', padding: '6px 10px', fontSize: '12px' }}
          />
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ padding: '6px 16px' }}>
            {saving ? '…' : 'Guardar'}
          </button>
          <button onClick={() => setEditing(false)} className="admin-btn-ghost" style={{ padding: '6px 12px' }}>
            Cancelar
          </button>
        </>
      ) : (
        <>
          <span className="text-sm" style={{ color: '#c0b8b0' }}>
            {deadline || 'Sin fecha límite'}
          </span>
          <button onClick={() => setEditing(true)} className="admin-btn-ghost" style={{ padding: '4px 12px' }}>
            Editar
          </button>
        </>
      )}

      {feedback && (
        <span className="text-xs" style={{ color: feedback.startsWith('Error') ? '#e07070' : '#6aaa6a' }}>
          {feedback}
        </span>
      )}
    </div>
  )
}
