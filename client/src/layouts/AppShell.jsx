import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logoutRequest } from '../services/authService'

const ICONS = {
  dashboard: (
    <path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" />
  ),
  students: (
    <path d="M10 3 2 7l8 4 8-4-8-4Zm-6 6.5V13c0 1.7 2.7 3 6 3s6-1.3 6-3V9.5M16 9v5" />
  ),
  teachers: (
    <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 17c0-2.8 2.7-5 6-5s6 2.2 6 5" />
  ),
  courses: (
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H16v14H5.5A1.5 1.5 0 0 0 4 18.5v-14ZM16 17H5.5A1.5 1.5 0 0 0 4 18.5" />
  ),
  classes: (
    <path d="m10 3 7 3.5-7 3.5-7-3.5L10 3Zm-7 7 7 3.5 7-3.5m-14 4 7 3.5 7-3.5" />
  ),
  attendance: (
    <path d="M5 3v2m10-2v2M4 7h12M4 5h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3 6 2 2 4-4" />
  ),
  exams: (
    <path d="M7 3h6a1 1 0 0 1 1 1v13l-4-2-4 2V4a1 1 0 0 1 1-1Zm-1 6h8" />
  ),
  fees: (
    <path d="M10 3v14m4-11.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5S8 8 10 8s4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5" />
  ),
}

function NavIcon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      {ICONS[name]}
    </svg>
  )
}

const NAV_BY_ROLE = {
  admin: [
    { to: '/admin', label: 'Dashboard', end: true, icon: 'dashboard' },
    { to: '/admin/students', label: 'Students', icon: 'students' },
    { to: '/admin/teachers', label: 'Teachers', icon: 'teachers' },
    { to: '/admin/courses', label: 'Courses', icon: 'courses' },
    { to: '/admin/classes', label: 'Classes', icon: 'classes' },
    { to: '/admin/attendance', label: 'Attendance', icon: 'attendance' },
    { to: '/admin/exams', label: 'Exams & Marks', icon: 'exams' },
    { to: '/admin/fees', label: 'Fees & Payments', icon: 'fees' },
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', end: true, icon: 'dashboard' },
    { to: '/staff/students', label: 'Students', icon: 'students' },
    { to: '/staff/attendance', label: 'Attendance', icon: 'attendance' },
    { to: '/staff/fees', label: 'Fees & Payments', icon: 'fees' },
  ],
  teacher: [
    { to: '/teacher', label: 'Dashboard', end: true, icon: 'dashboard' },
    { to: '/teacher/classes', label: 'My Classes', icon: 'classes' },
    { to: '/teacher/attendance', label: 'Attendance', icon: 'attendance' },
    { to: '/teacher/marks', label: 'Marks Entry', icon: 'exams' },
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
              `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`
            }
          >
            <NavIcon name={item.icon} />
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
