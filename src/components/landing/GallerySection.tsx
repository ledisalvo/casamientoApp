const IMAGES = [
  { url: '/photo-mirror-selfie.jpg',  className: 'gallery-item gallery-item--tall', position: 'center' },
  { url: '/photo-beach-kiss.jpg',     className: 'gallery-item',                    position: 'center' },
  { url: '/photo-night-couple.jpg',   className: 'gallery-item',                    position: 'top' },
  { url: '/photo-beach-heart.jpg',    className: 'gallery-item gallery-item--wide', position: 'center 35%' },
]

export function GallerySection() {
  return (
    <section className="gallery-section">
      <p className="section-label">nuestra historia</p>
      <h2 className="gallery-title">Momentos juntos</h2>
      <div className="gallery-grid" role="list">
        {IMAGES.map(({ url, className, position }, i) => (
          <div
            key={i}
            className={className}
            style={{ backgroundImage: `url('${url}')`, backgroundPosition: position }}
            role="listitem"
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  )
}
