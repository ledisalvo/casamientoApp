const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', className: 'gallery-item' },
  { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80', className: 'gallery-item gallery-item--tall' },
  { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80', className: 'gallery-item' },
  { url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80', className: 'gallery-item' },
  { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', className: 'gallery-item gallery-item--wide' },
  { url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&q=80', className: 'gallery-item' },
]

export function GallerySection() {
  return (
    <section className="gallery-section">
      <p className="section-label">nuestra historia</p>
      <h2 className="gallery-title">Momentos juntos</h2>
      <div className="gallery-grid" role="list">
        {IMAGES.map(({ url, className }, i) => (
          <div
            key={i}
            className={className}
            style={{ backgroundImage: `url('${url}')` }}
            role="listitem"
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  )
}
