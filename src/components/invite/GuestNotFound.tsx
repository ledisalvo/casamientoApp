export function GuestNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#f4f1ea' }}>
      <div className="text-center max-w-md">
        <p
          className="text-5xl mb-6"
          aria-hidden="true"
          style={{ fontFamily: "'Great Vibes', cursive", color: '#aa7750' }}
        >
          Oops
        </p>
        <h1
          className="text-2xl font-light mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2c2c2c' }}
        >
          Este código de invitación no existe
        </h1>
        <p className="text-sm font-light leading-relaxed" style={{ color: '#6a6a6a' }}>
          Si creés que hay un error, contactate con los novios para que te envíen el link correcto.
        </p>
      </div>
    </div>
  )
}
