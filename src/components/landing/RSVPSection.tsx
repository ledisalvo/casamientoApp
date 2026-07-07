import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { submitPublicRSVP } from '@/lib/queries'

const MAX_SEATS = 20

export function RSVPSection() {
  const [params] = useSearchParams()
  const initialName = (params.get('n') ?? '').trim()

  const [name,       setName]       = useState(initialName)
  const [attending,  setAttending]  = useState<boolean | null>(null)
  const [seatCount,  setSeatCount]  = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [nameError,  setNameError]  = useState<string | null>(null)
  const [submitted,  setSubmitted]  = useState<boolean | null>(null)

  const attendOptions = [
    { value: true,  label: 'Sí, ahí estaré' },
    { value: false, label: 'No puedo ir' },
  ]

  function handleAttendKey(e: React.KeyboardEvent) {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault()
      setAttending((prev) => (prev === true ? false : true))
      setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setNameError('Por favor ingresá tu nombre'); return }
    if (attending === null) { setError('Indicá si podés asistir'); return }

    setSubmitting(true)
    setError(null)
    try {
      await submitPublicRSVP({
        name,
        attending,
        seatCount: attending ? seatCount : null,
      })
      setSubmitted(attending)
    } catch {
      setError('Hubo un error al enviar tu respuesta. Intentá de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <section className="rsvp-section" id="rsvp">
      <div className="rsvp-inner">
        <p className="section-label">confirmá tu asistencia</p>
        <h2 className="rsvp-title">¿Contamos con vos?</h2>

        {submitted !== null ? (
          <div className="rsvp-confirm fade-in-up" role="status" aria-live="polite">
            <div className="rsvp-confirm-icon" aria-hidden="true">
              {submitted ? '♥' : '♡'}
            </div>
            <p className="rsvp-confirm-title">
              {submitted ? '¡Gracias por confirmar!' : 'Respuesta registrada'}
            </p>
            <p className="rsvp-confirm-text">
              {submitted
                ? `${name.trim()}, ¡te esperamos con mucha alegría!`
                : `${name.trim()}, gracias por avisarnos. ¡Te vamos a extrañar!`}
            </p>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="rsvp-field">
              <label htmlFor="rsvp-name" className="rsvp-label">Tu nombre</label>
              <input
                id="rsvp-name"
                type="text"
                className="rsvp-input"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(null) }}
                placeholder="Nombre y apellido"
                aria-describedby={nameError ? 'rsvp-name-error' : undefined}
                autoComplete="name"
              />
              {nameError && (
                <p id="rsvp-name-error" className="rsvp-error">{nameError}</p>
              )}
            </div>

            {/* ¿Asistís? */}
            <div className="rsvp-field">
              <span className="rsvp-label" id="rsvp-attend-label">¿Asistís?</span>
              <div
                className="rsvp-toggle"
                role="radiogroup"
                aria-labelledby="rsvp-attend-label"
                onKeyDown={handleAttendKey}
              >
                {attendOptions.map(({ value, label }) => (
                  <button
                    key={String(value)}
                    type="button"
                    role="radio"
                    aria-checked={attending === value}
                    tabIndex={attending === value || (attending === null && value) ? 0 : -1}
                    className={`rsvp-toggle-btn${attending === value ? ' is-active' : ''}`}
                    onClick={() => { setAttending(value); setError(null) }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad — solo si asiste */}
            {attending === true && (
              <div className="rsvp-field fade-in-up">
                <span className="rsvp-label">¿Cuántos asisten?</span>
                <div className="rsvp-stepper" role="group" aria-label="Cantidad de asistentes">
                  <button
                    type="button"
                    className="rsvp-stepper-btn"
                    aria-label="Restar una persona"
                    disabled={seatCount <= 1}
                    onClick={() => setSeatCount((n) => Math.max(1, n - 1))}
                  >
                    −
                  </button>
                  <span className="rsvp-stepper-value" aria-live="polite">{seatCount}</span>
                  <button
                    type="button"
                    className="rsvp-stepper-btn"
                    aria-label="Sumar una persona"
                    disabled={seatCount >= MAX_SEATS}
                    onClick={() => setSeatCount((n) => Math.min(MAX_SEATS, n + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {error && <p className="rsvp-error rsvp-error--global">{error}</p>}

            <button
              type="submit"
              className="btn-solid btn-solid--full"
              disabled={submitting}
            >
              {submitting ? 'Enviando…' : 'Confirmar asistencia'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
