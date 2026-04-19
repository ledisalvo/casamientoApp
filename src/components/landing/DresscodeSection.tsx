const SWATCHES = [
  { color: '#2c2c2c', label: 'Negro' },        // ~44
  { color: '#1c2e4a', label: 'Azul marino' },  // ~49
  { color: '#4a3728', label: 'Marrón oscuro' },// ~56
  { color: '#6b4c6b', label: 'Borravino' },    // ~97
  { color: '#7a5c4f', label: 'Terracota' },    // ~98
  { color: '#7c5c8a', label: 'Lila oscuro' },  // ~118
]

export function DresscodeSection() {
  return (
    <section className="dresscode-section">
      <div>
        <p className="section-label">código de vestimenta</p>
        <h2 className="dresscode-title">Elegante</h2>
        <p className="dresscode-text">
          Te pedimos que evites los tonos blancos, beiges y verdes; lo reservamos para los novios.<br />
          ¡Vení a brillar con nosotros!
        </p>
        <div className="dresscode-palette" role="list" aria-label="Paleta de colores sugerida">
          {SWATCHES.map(({ color, label }) => (
            <span
              key={color}
              className="swatch"
              style={{ background: color }}
              title={label}
              role="listitem"
              aria-label={label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
