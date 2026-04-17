export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-pre">nos casamos</p>
        <h1 className="hero-names">
          Lucas <span>&amp;</span> Cecilia
        </h1>
        <p className="hero-date">05 · Febrero · 2027</p>
        <a href="#ceremonia" className="hero-btn">Ver invitación</a>
      </div>
      <div className="hero-scroll-hint" aria-hidden="true">&#8964;</div>
    </section>
  )
}
