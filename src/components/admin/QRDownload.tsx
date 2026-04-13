import { useState } from 'react'
import { downloadQR } from '@/lib/qr'

interface Props {
  code: string
}

export function QRDownload({ code }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await downloadQR(code)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="admin-btn-ghost disabled:opacity-40"
      title={`Descargar QR de ${code}`}
    >
      {loading ? '…' : 'QR'}
    </button>
  )
}
