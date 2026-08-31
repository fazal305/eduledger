import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logoutRequest } from '../services/authService'

const NAV_BY_ROLE = {
  parent: [
    { to: '/parent', label: 'Overview', end: true },
    { to: '/parent/attendance', label: 'Attendance' },
    { to: '/parent/marks', label: 'Marks' },
    { to: '/parent/fees', label: 'Fees' },
  ],
  student: [
    { to: '/student', label: 'Overview', end: true },
    { to: '/student/attendance', label: 'Attendance' },
    { to: '/student/marks', label: 'Marks' },
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
          <nav className="hidden items-center gap-1 md:flex">
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

      <main className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      <nav
        aria-label="Portal navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-portal-100 bg-white md:hidden"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                isActive ? 'text-portal-600' : 'text-ink-500'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
