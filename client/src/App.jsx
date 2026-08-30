import { Navigate, Route, Routes } from 'react-router-dom'
import { useCurrentUser } from './hooks/useCurrentUser'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './layouts/AppShell'
import PortalShell from './layouts/PortalShell'
import LoginPage from './pages/auth/LoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import StaffDashboardPage from './pages/staff/StaffDashboardPage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import ParentOverviewPage from './pages/parent/ParentOverviewPage'
import StudentOverviewPage from './pages/student/StudentOverviewPage'
import NotFoundPage from './pages/NotFoundPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import StudentsListPage from './pages/admin/students/StudentsListPage'
import StudentProfilePage from './pages/admin/students/StudentProfilePage'
import TeachersListPage from './pages/admin/teachers/TeachersListPage'
import TeacherProfilePage from './pages/admin/teachers/TeacherProfilePage'
import CoursesListPage from './pages/admin/courses/CoursesListPage'
import ClassesListPage from './pages/admin/classes/ClassesListPage'
import ClassProfilePage from './pages/admin/classes/ClassProfilePage'

const HOME_BY_ROLE = {
  admin: '/admin',
  staff: '/staff',
  teacher: '/teacher',
  parent: '/parent',
  student: '/student',
}

function HomeRedirect() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={HOME_BY_ROLE[user.role] ?? '/login'} replace />
}

export default function App() {
  useCurrentUser()

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/students" element={<StudentsListPage />} />
          <Route path="/admin/students/:id" element={<StudentProfilePage />} />
          <Route path="/admin/teachers" element={<TeachersListPage />} />
          <Route path="/admin/teachers/:id" element={<TeacherProfilePage />} />
          <Route path="/admin/courses" element={<CoursesListPage />} />
          <Route path="/admin/classes" element={<ClassesListPage />} />
          <Route path="/admin/classes/:id" element={<ClassProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route element={<AppShell />}>
          <Route path="/staff" element={<StaffDashboardPage />} />
          <Route path="/staff/students" element={<StudentsListPage />} />
          <Route path="/staff/students/:id" element={<StudentProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route element={<AppShell />}>
          <Route path="/teacher" element={<TeacherDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
        <Route element={<PortalShell />}>
          <Route path="/parent" element={<ParentOverviewPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<PortalShell />}>
          <Route path="/student" element={<StudentOverviewPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
