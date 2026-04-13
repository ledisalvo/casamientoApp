import QRCode from 'qrcode'

export function getInviteUrl(code: string): string {
  const domain = import.meta.env.VITE_PUBLIC_DOMAIN
  // Guard against undefined being interpolated as the string "undefined"
  if (domain && domain !== 'undefined') return `${domain}/invite/${code}`
  // Fallback for local dev — not scannable but functional for preview
  return `/invite/${code}`
}

export async function downloadQR(code: string): Promise<void> {
  const url = getInviteUrl(code)

  const dataUrl = await QRCode.toDataURL(url, {
    width:           400,
    margin:          2,
    color: {
      dark:  '#2c2c2c',
      light: '#f4f1ea',
    },
  })

  const link     = document.createElement('a')
  link.href      = dataUrl
  link.download  = `qr-${code}.png`
  link.click()
}
