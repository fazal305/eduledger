import { useQuery } from '@tanstack/react-query'
import PageHeader from '../../components/PageHeader'
import { fetchStudents } from '../../services/studentService'
import { fetchTeachers } from '../../services/teacherService'
import { fetchClasses } from '../../services/classService'

function StatCard({ label, value, isLoading }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{isLoading ? '—' : value}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const students = useQuery({
    queryKey: ['students', { pageSize: 1, isActive: true, stat: true }],
    queryFn: () => fetchStudents({ pageSize: 1, isActive: 'true' }),
  })
  const teachers = useQuery({
    queryKey: ['teachers', { pageSize: 1, isActive: true, stat: true }],
    queryFn: () => fetchTeachers({ pageSize: 1, isActive: 'true' }),
  })
  const classes = useQuery({
    queryKey: ['classes', { pageSize: 1, isActive: true, stat: true }],
    queryFn: () => fetchClasses({ pageSize: 1, isActive: 'true' }),
  })

  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        description="[DEMO] Greenwood Academy — overview across students, staff, attendance, and fees"
      />

      <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
        <StatCard label="Active students" value={students.data?.meta.total} isLoading={students.isPending} />
        <StatCard label="Active teachers" value={teachers.data?.meta.total} isLoading={teachers.isPending} />
        <StatCard label="Active classes" value={classes.data?.meta.total} isLoading={classes.isPending} />
      </div>

      <div className="mx-6 mb-6 rounded-xl border border-dashed border-ink-200 p-5 text-sm text-ink-500">
        Today's attendance, fee collection, and upcoming exam metrics land in Phase 3–4
        once attendance, exams, and fees are built out.
      </div>
    </div>
  )
}
