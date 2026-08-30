import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, status } = useAuthStore()
  const location = useLocation()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex h-full min-h-screen items-center justify-center text-ink-500">
        Loading EduLedger…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
