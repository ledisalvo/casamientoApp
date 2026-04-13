import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGuest } from '@/hooks/useGuest'
import { getRSVPDeadline } from '@/lib/queries'
import { RSVPForm } from '@/components/invite/RSVPForm'
import { RSVPConfirmation } from '@/components/invite/RSVPConfirmation'
import { GuestNotFound } from '@/components/invite/GuestNotFound'
import type { RSVPResponse } from '@/types'

export function InvitePage() {
  const { code = '' }                 = useParams<{ code: string }>()
  const { data, loading, error }      = useGuest(code)
  const [deadline, setDeadline]       = useState<Date | null | undefined>(undefined)
  const [submitted, setSubmitted]     = useState<RSVPResponse | null>(null)

  useEffect(() => {
    getRSVPDeadline().then(setDeadline)
  }, [])

  // ── Loading ──────────────────────────────────────────────────
  if (loading || deadline === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f4f1ea' }}>
        <p
          className="text-2xl animate-pulse"
          style={{ fontFamily: "'Great Vibes', cursive", color: '#a39086' }}
        >
          Cargando…
        </p>
      </div>
    )
  }

  // ── Not found ────────────────────────────────────────────────
  if (error === 'not_found') return <GuestNotFound />

  // ── Network error ────────────────────────────────────────────
  if (error === 'network') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#f4f1ea' }}>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Error de conexión
          </h1>
          <p className="text-sm font-light" style={{ color: '#6a6a6a' }}>
            No pudimos cargar tu invitación. Verificá tu conexión y volvé a intentarlo.
          </p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { guest, rsvp } = data
  const isPastDeadline  = deadline !== null && deadline !== undefined && new Date() > deadline

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: '#f4f1ea' }}>
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="mb-3"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: '28px', color: '#aa7750' }}
          >
            están invitados al casamiento de
          </p>
          <h1
            className="font-light mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 8vw, 56px)', color: '#2c2c2c', letterSpacing: '2px' }}
          >
            Lucas <span style={{ fontFamily: "'Great Vibes', cursive", color: '#aa7750' }}>&</span> Cecilia
          </h1>
          <p className="mt-3 text-sm font-light tracking-widest" style={{ color: '#a39086' }}>
            15 · XI · 2025
          </p>
        </div>

        {/* Guest greeting */}
        <p
          className="text-center text-lg font-light mb-10"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: '#4a3728' }}
        >
          {guest.name}
        </p>

        {/* Event details */}
        <div
          className="mb-10 p-6 space-y-3 text-sm font-light text-center"
          style={{ background: '#fff', border: '1px solid #e0d8d0', color: '#5a5a5a' }}
        >
          <p><span className="text-xs uppercase tracking-widest" style={{ color: '#a39086' }}>Ceremonia</span><br />Iglesia San Francisco · 18:00 hs</p>
          <hr style={{ borderColor: '#e0d8d0' }} />
          <p><span className="text-xs uppercase tracking-widest" style={{ color: '#a39086' }}>Recepción</span><br />Salón Los Jardines · 20:30 hs</p>
        </div>

        {/* Content states */}
        {(rsvp && !submitted) ? (
          // Already responded (idempotency)
          <RSVPConfirmation rsvp={rsvp as RSVPResponse} guestName={guest.name} />
        ) : submitted ? (
          // Just submitted
          <RSVPConfirmation rsvp={submitted} guestName={guest.name} />
        ) : isPastDeadline ? (
          // Deadline passed
          <div
            className="text-center p-8"
            style={{ background: '#fff', border: '1px solid #e0d8d0' }}
          >
            <p className="text-sm font-light leading-relaxed" style={{ color: '#6a6a6a' }}>
              El plazo para confirmar asistencia ya cerró.<br />
              Si tenés alguna consulta, contactate con los novios.
            </p>
          </div>
        ) : (
          // Show form
          <RSVPForm
            guest={guest}
            onSubmitted={setSubmitted}
          />
        )}

      </div>
    </div>
  )
}
