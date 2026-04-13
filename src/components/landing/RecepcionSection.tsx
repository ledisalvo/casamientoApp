export function RecepcionSection() {
  return (
    <section className="event-section event-section--alt">
      <div className="event-card event-card--right">
        <div className="event-info">
          <p className="event-tag">Recepción</p>
          <h2 className="event-title">Salón Los Jardines</h2>
          <div className="event-details">
            <p>Sábado 15 de noviembre de 2025</p>
            <p>20:30 hs</p>
            <p>Av. del Libertador 5678, CABA</p>
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
        <div
          className="event-img"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80')" }}
          role="img"
          aria-label="Salón Los Jardines"
        />
      </div>
    </section>
  )
}
