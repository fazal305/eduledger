import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logoutRequest } from '../services/authService'

const NAV_BY_ROLE = {
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/teachers', label: 'Teachers' },
    { to: '/admin/courses', label: 'Courses' },
    { to: '/admin/classes', label: 'Classes' },
    { to: '/admin/attendance', label: 'Attendance' },
    { to: '/admin/exams', label: 'Exams & Marks' },
    { to: '/admin/fees', label: 'Fees & Payments' },
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', end: true },
    { to: '/staff/students', label: 'Students' },
    { to: '/staff/attendance', label: 'Attendance' },
    { to: '/staff/fees', label: 'Fees & Payments' },
  ],
  teacher: [
    { to: '/teacher', label: 'Dashboard', end: true },
    { to: '/teacher/classes', label: 'My Classes' },
    { to: '/teacher/attendance', label: 'Attendance' },
    { to: '/teacher/marks', label: 'Marks Entry' },
  ],
}

export default function AppShell() {
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
    <div className="flex min-h-screen bg-ink-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-5">
          <span className="text-lg font-semibold tracking-tight text-ink-900">EduLedger</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink-100 p-3">
          <div className="mb-2 px-2 text-xs text-ink-400">
            Signed in as <span className="font-medium text-ink-600">{user?.name}</span> ({user?.role})
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
