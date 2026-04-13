import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AdminLoginPage() {
  const navigate = useNavigate()

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales inválidas. Intentá de nuevo.')
      setPassword('')   // clear password on error, keep email
      setSubmitting(false)
      return
    }

    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <div className="admin-theme min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6a6a6a' }}>
            Panel de administración
          </p>
          <h1 className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Lucas &amp; Cecilia
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="admin-label">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              placeholder="hola@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="admin-label">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
          </div>

          {error && (
            <p className="text-xs text-center py-3 px-4" style={{ background: '#2a1a1a', color: '#e07070' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="admin-btn-primary w-full mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

      </div>
    </div>
  )
}
