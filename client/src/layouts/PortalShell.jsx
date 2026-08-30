import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logoutRequest } from '../services/authService'

const NAV_BY_ROLE = {
  parent: [
    { to: '/parent', label: 'Overview', end: true },
    { to: '/parent/attendance', label: 'Attendance' },
    { to: '/parent/marks', label: 'Marks & Report Cards' },
    { to: '/parent/fees', label: 'Fees' },
  ],
  student: [
    { to: '/student', label: 'Overview', end: true },
    { to: '/student/attendance', label: 'Attendance' },
    { to: '/student/marks', label: 'Marks & Report Cards' },
    { to: '/student/fees', label: 'Fees' },
  ],
}

export default function PortalShell() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const items = NAV_BY_ROLE[user?.role] ?? []

  async function handleLogout() {
    await logoutRequest()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div data-theme="portal" className="min-h-screen bg-portal-50">
      <header className="border-b border-portal-100 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-semibold tracking-tight text-ink-900">EduLedger</span>
          <nav className="flex items-center gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-portal-100 text-portal-600'
                      : 'text-ink-600 hover:bg-portal-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-ink-500 hover:text-ink-800"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
