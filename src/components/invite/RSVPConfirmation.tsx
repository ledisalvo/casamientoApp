import type { RSVPResponse } from '@/types'

interface Props {
  rsvp:       RSVPResponse
  guestName:  string
}

const DIETARY_LABELS: Record<string, string> = {
  ninguna:      'Sin restricciones',
  vegetariano:  'Vegetariano',
  vegano:       'Vegano',
  celiaco:      'Celíaco',
  otro:         'Otro',
}

export function RSVPConfirmation({ rsvp, guestName }: Props) {
  const date = new Date(rsvp.responded_at).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="text-center">
      <div
        className="text-4xl mb-4"
        aria-hidden="true"
        style={{ color: '#aa7750' }}
      >
        {rsvp.attending ? '♥' : '♡'}
      </div>

      <h2
        className="text-3xl font-light mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2c2c2c' }}
      >
        {rsvp.attending ? '¡Ya estás confirmado!' : 'Respuesta registrada'}
      </h2>

      <p className="text-sm font-light mb-8" style={{ color: '#6a6a6a' }}>
        {guestName}
      </p>

      <div
        className="text-left border p-6 space-y-3 max-w-xs mx-auto"
        style={{ background: '#fff', borderColor: '#e0d8d0' }}
      >
        <Row label="Estado">
          <span style={{ color: rsvp.attending ? '#3b4a3f' : '#7a5c4f' }}>
            {rsvp.attending ? 'Asiste ✓' : 'No asiste'}
          </span>
        </Row>
        {rsvp.attending && (
          <>
            <Row label="Personas">{rsvp.seat_count ?? 1}</Row>
            <Row label="Alimentación">{DIETARY_LABELS[rsvp.dietary] ?? rsvp.dietary}</Row>
          </>
        )}
        <Row label="Confirmado el">{date}</Row>
      </div>

      {rsvp.attending && (
        <p
          className="mt-8 text-sm font-light"
          style={{ fontFamily: "'Great Vibes', cursive", fontSize: '22px', color: '#a39086' }}
        >
          ¡Los esperamos con mucha alegría!
        </p>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-xs uppercase tracking-widest" style={{ color: '#a39086' }}>
        {label}
      </span>
      <span className="text-sm font-light" style={{ color: '#2c2c2c' }}>
        {children}
      </span>
    </div>
  )
}
