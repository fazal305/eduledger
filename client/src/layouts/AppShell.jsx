import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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

function SidebarContent({ items, user, onNavigate, onLogout }) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-5">
        <span className="text-lg font-semibold tracking-tight text-ink-900">EduLedger</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
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
          onClick={onLogout}
          className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-ink-600 hover:bg-ink-50"
        >
          Sign out
        </button>
      </div>
    </>
  )
}

export default function AppShell() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = NAV_BY_ROLE[user?.role] ?? []
  const currentLabel = items.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)))?.label

  async function handleLogout() {
    await logoutRequest()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200 bg-white md:flex">
        <SidebarContent items={items} user={user} onLogout={handleLogout} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-lg">
            <SidebarContent
              items={items}
              user={user}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-ink-100 bg-white px-4 md:hidden">
          <button
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-ink-600 hover:bg-ink-50"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-medium text-ink-900">{currentLabel ?? 'EduLedger'}</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
