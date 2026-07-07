import { getLandingUrl } from './qr'

/** Link click-to-chat de WhatsApp con el mensaje prellenado (sin destinatario fijo). */
export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

// ── Envío masivo (link genérico) ─────────────────────────────

/** Mensaje genérico de invitación: sin nombre ni cupos, con link a la landing. */
export function buildGenericInviteMessage(): string {
  return [
    '¡Nos casamos! 💍',
    'Nos encantaría contar con tu presencia en este día tan especial.',
    '',
    'Mirá todos los detalles y confirmá tu asistencia acá:',
    `💌 ${getLandingUrl()}`,
    '',
    '¡Te esperamos!',
  ].join('\n')
}

export type ShareResult = 'shared' | 'copied' | 'whatsapp' | 'cancelled'

/**
 * Comparte la invitación genérica. En móvil usa la Web Share API: abre la hoja
 * de compartir del sistema y, al elegir WhatsApp, se pueden seleccionar VARIOS
 * contactos y enviarles el mismo mensaje de una sola vez.
 * Fallback (desktop / sin Web Share): copia el mensaje al portapapeles, o abre
 * wa.me si tampoco hay portapapeles disponible.
 */
export async function shareInvite(): Promise<ShareResult> {
  const message = buildGenericInviteMessage()

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ text: message })
      return 'shared'
    } catch (err) {
      // El usuario cerró la hoja de compartir sin elegir destino
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      // Cualquier otro error → caemos al fallback
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message)
      return 'copied'
    }
  } catch {
    // sin portapapeles → último fallback
  }

  window.open(getWhatsAppShareUrl(message), '_blank')
  return 'whatsapp'
}
