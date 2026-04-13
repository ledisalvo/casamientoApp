const SWATCHES = [
  { color: '#2c2c2c', label: 'Negro' },
  { color: '#4a3728', label: 'Marrón oscuro' },
  { color: '#7a5c4f', label: 'Terracota' },
  { color: '#3b4a3f', label: 'Verde bosque' },
  { color: '#1c2e4a', label: 'Azul marino' },
  { color: '#6b4c6b', label: 'Borravino' },
]

export function DresscodeSection() {
  return (
    <section className="dresscode-section">
      <div>
        <p className="section-label">código de vestimenta</p>
        <h2 className="dresscode-title">Elegante</h2>
        <p className="dresscode-text">
          Te pedimos que evites los tonos claros como el blanco, crema e ivory.<br />
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
