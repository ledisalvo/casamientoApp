import { createBrowserRouter } from 'react-router-dom'
import { HomePage }             from '@/pages/HomePage'
import { InvitePage }           from '@/pages/InvitePage'
import { AdminLoginPage }       from '@/pages/AdminLoginPage'
import { AdminDashboardPage }   from '@/pages/AdminDashboardPage'
import { ProtectedRoute }       from '@/components/admin/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/',                element: <HomePage /> },
  { path: '/invite/:code',   element: <InvitePage /> },
  { path: '/admin',          element: <AdminLoginPage /> },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
])

export default router
