import { useState } from 'react'
import { submitRSVP } from '@/lib/queries'
import type { DietaryOption, Guest, RSVPResponse } from '@/types'

interface Props {
  guest:       Pick<Guest, 'id' | 'name' | 'max_seats'>
  onSubmitted: (rsvp: RSVPResponse) => void
}

const DIETARY_OPTIONS: { value: DietaryOption; label: string }[] = [
  { value: 'ninguna',     label: 'Sin restricciones' },
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'vegano',      label: 'Vegano' },
  { value: 'celiaco',     label: 'Celíaco' },
  { value: 'otro',        label: 'Otro' },
]

export function RSVPForm({ guest, onSubmitted }: Props) {
  const [attending,   setAttending]   = useState<boolean | null>(null)
  const [seatCount,   setSeatCount]   = useState(1)
  const [dietary,     setDietary]     = useState<DietaryOption>('ninguna')
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [seatError,   setSeatError]   = useState<string | null>(null)

  function validateSeats(value: number): string | null {
    if (value < 1) return 'Mínimo 1 asistente'
    if (value > guest.max_seats)
      return `Máximo ${guest.max_seats} asistente${guest.max_seats !== 1 ? 's' : ''}`
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (attending === null) return

    if (attending) {
      const err = validateSeats(seatCount)
      if (err) { setSeatError(err); return }
    }

    setSubmitting(true)
    setError(null)

    try {
      await submitRSVP({
        guestId:   guest.id,
        attending,
        seatCount: attending ? seatCount : null,
        dietary:   attending ? dietary : 'ninguna',
      })

      // Build a local RSVPResponse to hand back immediately (no refetch needed)
      onSubmitted({
        id:           crypto.randomUUID(),
        guest_id:     guest.id,
        attending,
        seat_count:   attending ? seatCount : null,
        dietary:      attending ? dietary : 'ninguna',
        responded_at: new Date().toISOString(),
      })
    } catch {
      setError('Hubo un error al enviar tu respuesta. Intentá de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>

      {/* Attend toggle */}
      <fieldset>
        <legend
          className="block text-xs uppercase tracking-widest mb-3"
          style={{ color: '#888' }}
        >
          ¿Asistís?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: true,  label: 'Sí, ahí estaré' },
            { value: false, label: 'No puedo ir' },
          ].map(({ value, label }) => (
            <button
              key={String(value)}
              type="button"
              role="radio"
              aria-checked={attending === value}
              onClick={() => { setAttending(value); setError(null) }}
              className="py-3 px-4 text-xs tracking-wide transition-all duration-200"
              style={{
                border:      `1px solid ${attending === value ? '#2c2c2c' : '#d8d0c8'}`,
                background:  attending === value ? '#2c2c2c' : '#faf8f5',
                color:       attending === value ? '#fff'    : '#4a4a4a',
                fontFamily:  "'Montserrat', sans-serif",
                cursor:      'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Seat count — only when attending */}
      {attending === true && (
        <div>
          <label
            htmlFor="seat-count"
            className="block text-xs uppercase tracking-widest mb-2"
            style={{ color: '#888' }}
          >
            Cantidad de asistentes
          </label>
          <input
            id="seat-count"
            type="number"
            min={1}
            max={guest.max_seats}
            value={seatCount}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              setSeatCount(isNaN(v) ? 1 : v)
              setSeatError(validateSeats(isNaN(v) ? 1 : v))
            }}
            aria-describedby={seatError ? 'seat-error' : undefined}
            className="w-full py-3 px-4 text-sm font-light outline-none transition-colors"
            style={{
              border:      `1px solid ${seatError ? '#c0392b' : '#d8d0c8'}`,
              background:  '#faf8f5',
              color:       '#2c2c2c',
              fontFamily:  "'Montserrat', sans-serif",
            }}
          />
          {seatError && (
            <p id="seat-error" className="mt-1 text-xs" style={{ color: '#c0392b' }}>
              {seatError}
            </p>
          )}
          <p className="mt-1 text-xs" style={{ color: '#a39086' }}>
            Podés traer hasta {guest.max_seats} persona{guest.max_seats !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Dietary — only when attending */}
      {attending === true && (
        <div>
          <label
            htmlFor="dietary"
            className="block text-xs uppercase tracking-widest mb-2"
            style={{ color: '#888' }}
          >
            Restricción alimentaria
          </label>
          <select
            id="dietary"
            value={dietary}
            onChange={(e) => setDietary(e.target.value as DietaryOption)}
            required
            className="w-full py-3 px-4 text-sm font-light outline-none transition-colors appearance-none"
            style={{
              border:     '1px solid #d8d0c8',
              background: '#faf8f5',
              color:      '#2c2c2c',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {DIETARY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Global error */}
      {error && (
        <p className="text-xs text-center py-3 px-4" style={{ background: '#fff0f0', color: '#c0392b' }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={attending === null || submitting}
        className="w-full py-4 text-xs font-medium uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: '#2c2c2c',
          color:      '#fff',
          border:     '1px solid #2c2c2c',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {submitting ? 'Enviando…' : 'Confirmar asistencia'}
      </button>
    </form>
  )
}
