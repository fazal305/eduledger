import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useCurrentUser } from './hooks/useCurrentUser'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './layouts/AppShell'
import PortalShell from './layouts/PortalShell'
import LoginPage from './pages/auth/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const StaffDashboardPage = lazy(() => import('./pages/staff/StaffDashboardPage'))
const TeacherDashboardPage = lazy(() => import('./pages/teacher/TeacherDashboardPage'))
const StudentsListPage = lazy(() => import('./pages/admin/students/StudentsListPage'))
const StudentProfilePage = lazy(() => import('./pages/admin/students/StudentProfilePage'))
const TeachersListPage = lazy(() => import('./pages/admin/teachers/TeachersListPage'))
const TeacherProfilePage = lazy(() => import('./pages/admin/teachers/TeacherProfilePage'))
const CoursesListPage = lazy(() => import('./pages/admin/courses/CoursesListPage'))
const ClassesListPage = lazy(() => import('./pages/admin/classes/ClassesListPage'))
const ClassProfilePage = lazy(() => import('./pages/admin/classes/ClassProfilePage'))
const AttendancePage = lazy(() => import('./pages/shared/AttendancePage'))
const ExamsListPage = lazy(() => import('./pages/shared/ExamsListPage'))
const MarksEntryPage = lazy(() => import('./pages/shared/MarksEntryPage'))
const ReportCardPage = lazy(() => import('./pages/shared/ReportCardPage'))
const FeesListPage = lazy(() => import('./pages/admin/fees/FeesListPage'))
const PortalOverviewPage = lazy(() => import('./pages/shared/portal/PortalOverviewPage'))
const PortalAttendancePage = lazy(() => import('./pages/shared/portal/PortalAttendancePage'))
const PortalMarksPage = lazy(() => import('./pages/shared/portal/PortalMarksPage'))
const PortalFeesPage = lazy(() => import('./pages/shared/portal/PortalFeesPage'))

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

function RouteFallback() {
  return <div className="p-6 text-sm text-ink-400">Loading…</div>
}

export default function App() {
  useCurrentUser()

  return (
    <Suspense fallback={<RouteFallback />}>
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
            <Route path="/admin/students/:id/report-card" element={<ReportCardPage />} />
            <Route path="/admin/attendance" element={<AttendancePage />} />
            <Route path="/admin/exams" element={<ExamsListPage />} />
            <Route path="/admin/exams/:examId/marks" element={<MarksEntryPage />} />
            <Route path="/admin/fees" element={<FeesListPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route element={<AppShell />}>
            <Route path="/staff" element={<StaffDashboardPage />} />
            <Route path="/staff/students" element={<StudentsListPage />} />
            <Route path="/staff/students/:id" element={<StudentProfilePage />} />
            <Route path="/staff/students/:id/report-card" element={<ReportCardPage />} />
            <Route path="/staff/attendance" element={<AttendancePage />} />
            <Route path="/staff/fees" element={<FeesListPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
          <Route element={<AppShell />}>
            <Route path="/teacher" element={<TeacherDashboardPage />} />
            <Route path="/teacher/classes" element={<ClassesListPage />} />
            <Route path="/teacher/classes/:id" element={<ClassProfilePage />} />
            <Route path="/teacher/attendance" element={<AttendancePage />} />
            <Route path="/teacher/marks" element={<ExamsListPage />} />
            <Route path="/teacher/marks/:examId/marks" element={<MarksEntryPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
          <Route element={<PortalShell />}>
            <Route path="/parent" element={<PortalOverviewPage />} />
            <Route path="/parent/attendance" element={<PortalAttendancePage />} />
            <Route path="/parent/marks" element={<PortalMarksPage />} />
            <Route path="/parent/fees" element={<PortalFeesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<PortalShell />}>
            <Route path="/student" element={<PortalOverviewPage />} />
            <Route path="/student/attendance" element={<PortalAttendancePage />} />
            <Route path="/student/marks" element={<PortalMarksPage />} />
            <Route path="/student/fees" element={<PortalFeesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
