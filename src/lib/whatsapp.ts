import { getInviteUrl } from './qr'

/** Devuelve la URL absoluta de la invitación para incrustar en el mensaje. */
function absoluteInviteUrl(code: string): string {
  const url = getInviteUrl(code)
  // getInviteUrl cae a una ruta relativa ("/invite/CODE") si VITE_PUBLIC_DOMAIN no está seteado.
  // El mensaje de WhatsApp necesita una URL absoluta, así que completamos con el origin actual.
  if (url.startsWith('/')) return `${window.location.origin}${url}`
  return url
}

/** Arma el texto del mensaje de invitación para enviar por WhatsApp. */
export function buildInviteMessage(name: string, seats: number, code: string): string {
  const lugares = seats === 1 ? '1 lugar reservado' : `${seats} lugares reservados`
  return [
    `¡Hola ${name}!`,
    'Nos encantaría contar con tu presencia en este día tan especial.',
    '',
    `Tenemos ${lugares} para vos.`,
    '',
    'Podés ver todos los detalles del gran día ingresando aquí:',
    `💌 ${absoluteInviteUrl(code)}`,
    '',
    '¡Te esperamos!',
  ].join('\n')
}

/** Link click-to-chat de WhatsApp con el mensaje prellenado (sin destinatario fijo). */
export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
