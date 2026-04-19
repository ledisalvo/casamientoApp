import { useState, useEffect } from 'react'
import { getBankDetails, updateBankDetails, type BankDetails } from '@/lib/queries'

const EMPTY: BankDetails = { titular: '', banco: '', cbu: '', alias: '' }

export function BankDetailsConfig() {
  const [details,  setDetails]  = useState<BankDetails>(EMPTY)
  const [editing,  setEditing]  = useState(false)
  const [draft,    setDraft]    = useState<BankDetails>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    getBankDetails().then((d) => {
      if (d) { setDetails(d); setDraft(d) }
    })
  }, [])

  function handleChange(field: keyof BankDetails, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)
    try {
      await updateBankDetails(draft)
      setDetails(draft)
      setFeedback('Datos actualizados.')
      setEditing(false)
    } catch {
      setFeedback('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setDraft(details)
    setEditing(false)
    setFeedback(null)
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="admin-label mb-0">Datos bancarios:</span>
        <span className="text-sm" style={{ color: '#c0b8b0' }}>
          {details.titular || '—'} · {details.alias || '—'}
        </span>
        <button onClick={() => setEditing(true)} className="admin-btn-ghost" style={{ padding: '4px 12px' }}>
          Editar
        </button>
        {feedback && (
          <span className="text-xs" style={{ color: '#6aaa6a' }}>{feedback}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: '400px' }}>
      <span className="admin-label mb-0">Datos bancarios</span>
      {(['titular', 'banco', 'cbu', 'alias'] as const).map((field) => (
        <div key={field} className="flex items-center gap-2">
          <label className="text-xs w-16 shrink-0" style={{ color: '#a09890', textTransform: 'capitalize' }}>
            {field}
          </label>
          <input
            type="text"
            value={draft[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="admin-input"
            style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ padding: '6px 16px' }}>
          {saving ? '…' : 'Guardar'}
        </button>
        <button onClick={handleCancel} className="admin-btn-ghost" style={{ padding: '6px 12px' }}>
          Cancelar
        </button>
        {feedback && (
          <span className="text-xs self-center" style={{ color: feedback.startsWith('Error') ? '#e07070' : '#6aaa6a' }}>
            {feedback}
          </span>
        )}
      </div>
    </div>
  )
}
