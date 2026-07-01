import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) return <p>Cargando…</p>
  if (!session) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
