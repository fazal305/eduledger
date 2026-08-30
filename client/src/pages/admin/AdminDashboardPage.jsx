import { useQuery } from '@tanstack/react-query'
import PageHeader from '../../components/PageHeader'
import { fetchStudents } from '../../services/studentService'
import { fetchTeachers } from '../../services/teacherService'
import { fetchClasses } from '../../services/classService'
import { fetchFeeSummary } from '../../services/feeService'

function StatCard({ label, value, isLoading, tone }) {
  const toneClass = tone === 'success' ? 'text-success-600' : tone === 'danger' ? 'text-danger-600' : 'text-ink-900'
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{isLoading ? '—' : value}</p>
    </div>
  )
}

function money(value) {
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
  const feeSummary = useQuery({
    queryKey: ['fees', 'summary', 'dashboard'],
    queryFn: () => fetchFeeSummary(),
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
        <StatCard
          label="Fees collected"
          value={feeSummary.data ? money(feeSummary.data.total_collected) : undefined}
          isLoading={feeSummary.isPending}
          tone="success"
        />
        <StatCard
          label="Fees outstanding"
          value={feeSummary.data ? money(feeSummary.data.total_outstanding) : undefined}
          isLoading={feeSummary.isPending}
          tone="danger"
        />
      </div>

      <div className="mx-6 mb-6 rounded-xl border border-dashed border-ink-200 p-5 text-sm text-ink-500">
        Today's attendance and upcoming exam metrics land alongside the parent/student
        portals in Phase 5.
      </div>
    </div>
  )
}
