import { useState, useEffect } from 'react'
import { getQuote, updateQuote } from '@/lib/queries'

export function QuoteConfig() {
  const [text,     setText]     = useState('')
  const [author,   setAuthor]   = useState('')
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    getQuote().then((q) => {
      if (q) { setText(q.text); setAuthor(q.author) }
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    setFeedback(null)
    try {
      await updateQuote({ text, author })
      setFeedback('Frase actualizada.')
      setEditing(false)
    } catch {
      setFeedback('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="admin-label mb-0">Frase:</span>
        <span className="text-sm truncate" style={{ color: '#c0b8b0', maxWidth: '260px' }}>
          {text.split('\n')[0] || '—'}…
        </span>
        <button onClick={() => setEditing(true)} className="admin-btn-ghost" style={{ padding: '4px 12px' }}>
          Editar
        </button>
        {feedback && <span className="text-xs" style={{ color: '#6aaa6a' }}>{feedback}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: '480px' }}>
      <span className="admin-label mb-0">Frase del countdown</span>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="admin-input"
        style={{ padding: '8px 10px', fontSize: '12px', resize: 'vertical', fontFamily: 'inherit' }}
      />
      <div className="flex items-center gap-2">
        <label className="text-xs w-16 shrink-0" style={{ color: '#a09890' }}>Autor</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="admin-input"
          style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ padding: '6px 16px' }}>
          {saving ? '…' : 'Guardar'}
        </button>
        <button onClick={() => setEditing(false)} className="admin-btn-ghost" style={{ padding: '6px 12px' }}>
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
