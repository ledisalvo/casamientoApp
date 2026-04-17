export function CeremoniaSection() {
  return (
    <section className="event-section" id="ceremonia" style={{ background: '#e8e4dc' }}>
      <div className="event-card event-card--left">
        <div
          className="event-img"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80')" }}
          role="img"
          aria-label="Golf Club Eventos"
        />
        <div className="event-info">
          <p className="event-tag">Ceremonia y Recepción</p>
          <h2 className="event-title">Golf Club Eventos</h2>
          <div className="event-details">
            <p>Viernes 5 de febrero de 2027</p>
            <p>19:00 hs</p>
            <p>Cam. de Cintura 9051, B1839 9 de Abril, Buenos Aires</p>
          </div>
          <a
            href="https://maps.google.com/?q=Cam.+de+Cintura+9051,+B1839+9+de+Abril,+Buenos+Aires"
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
