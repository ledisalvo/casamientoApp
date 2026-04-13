import { useState } from 'react'

export function GiftSection() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <section className="gift-section">
      <div>
        <div className="gift-icon" aria-hidden="true">♥</div>
        <p className="section-label">regalos</p>
        <h2 className="gift-title">
          Tu presencia es el regalo<br />más importante
        </h2>
        <p className="gift-text">
          Si querés hacernos un regalo, podés hacerlo a través de una transferencia bancaria.
        </p>
        <button
          className="btn-solid"
          onClick={() => setShowInfo((v) => !v)}
          aria-expanded={showInfo}
          aria-controls="gift-info"
        >
          {showInfo ? 'Ocultar datos' : 'Ver datos bancarios'}
        </button>
        {showInfo && (
          <div className="gift-info" id="gift-info">
            <p><strong>Titular:</strong> Lucas Gómez</p>
            <p><strong>Banco:</strong> Banco Nación</p>
            <p><strong>CBU:</strong> 0110123456789012345678</p>
            <p><strong>Alias:</strong> LUCAS.BODA.2025</p>
          </div>
        )}
      </div>
    </section>
  )
}
