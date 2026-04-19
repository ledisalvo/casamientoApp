import { useState, useEffect } from 'react'
import { getBankDetails, type BankDetails } from '@/lib/queries'

export function GiftSection() {
  const [showInfo, setShowInfo] = useState(false)
  const [bank, setBank] = useState<BankDetails | null>(null)

  useEffect(() => {
    getBankDetails().then(setBank)
  }, [])

  return (
    <section className="gift-section">
      <div>
        <div className="gift-icon" aria-hidden="true">♥</div>
        <p className="section-label">regalos</p>
        <h2 className="gift-title">
          Tu presencia es el regalo<br />más importante
        </h2>
        <p className="gift-text">
          Pero si querés hacernos un regalo, podés hacerlo a través de una transferencia bancaria.
        </p>
        <button
          className="btn-solid"
          onClick={() => setShowInfo((v) => !v)}
          aria-expanded={showInfo}
          aria-controls="gift-info"
        >
          {showInfo ? 'Ocultar datos' : 'Ver datos bancarios'}
        </button>
        {showInfo && bank && (
          <div className="gift-info" id="gift-info">
            <p><strong>Titular:</strong> {bank.titular}</p>
            <p><strong>Banco:</strong> {bank.banco}</p>
            <p><strong>CBU:</strong> {bank.cbu}</p>
            <p><strong>Alias:</strong> {bank.alias}</p>
          </div>
        )}
      </div>
    </section>
  )
}
