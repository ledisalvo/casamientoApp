export function CeremoniaSection() {
  return (
    <section className="event-section" id="ceremonia">
      <div className="event-card event-card--left">
        <div
          className="event-img"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80')" }}
          role="img"
          aria-label="Iglesia San Francisco"
        />
        <div className="event-info">
          <p className="event-tag">Ceremonia</p>
          <h2 className="event-title">Iglesia San Francisco</h2>
          <div className="event-details">
            <p>Sábado 15 de noviembre de 2025</p>
            <p>18:00 hs</p>
            <p>Av. Corrientes 1234, CABA</p>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Ver mapa
          </a>
        </div>
      </div>
    </section>
  )
}
