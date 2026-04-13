import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase" style={{ color: '#6a6a6a' }}>
          Cargando…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
