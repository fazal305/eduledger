import { useQuery } from '@tanstack/react-query'
import PageHeader from '../../components/PageHeader'
import { fetchStudents } from '../../services/studentService'
import { fetchTeachers } from '../../services/teacherService'
import { fetchClasses } from '../../services/classService'
import { fetchFeeSummary } from '../../services/feeService'

const STAT_ICONS = {
  students: <path d="M10 3 2 7l8 4 8-4-8-4Zm-6 6.5V13c0 1.7 2.7 3 6 3s6-1.3 6-3V9.5" />,
  teachers: <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 17c0-2.8 2.7-5 6-5s6 2.2 6 5" />,
  classes: <path d="m10 3 7 3.5-7 3.5-7-3.5L10 3Zm-7 7 7 3.5 7-3.5" />,
  fees: <path d="M10 3v14m4-11.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5S8 8 10 8s4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5" />,
}

const TONE_STYLES = {
  success: { badge: 'bg-success-100 text-success-600', value: 'text-success-600' },
  danger: { badge: 'bg-danger-100 text-danger-600', value: 'text-danger-600' },
  default: { badge: 'bg-brand-50 text-brand-600', value: 'text-ink-900' },
}

function StatCard({ label, value, isLoading, tone, icon }) {
  const styles = TONE_STYLES[tone] ?? TONE_STYLES.default
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.badge}`}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {STAT_ICONS[icon]}
          </svg>
        </span>
        <p className="text-sm text-ink-500">{label}</p>
      </div>
      <p className={`mt-3 text-2xl font-semibold ${styles.value}`}>{isLoading ? '—' : value}</p>
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
        <StatCard label="Active students" value={students.data?.meta.total} isLoading={students.isPending} icon="students" />
        <StatCard label="Active teachers" value={teachers.data?.meta.total} isLoading={teachers.isPending} icon="teachers" />
        <StatCard label="Active classes" value={classes.data?.meta.total} isLoading={classes.isPending} icon="classes" />
        <StatCard
          label="Fees collected"
          value={feeSummary.data ? money(feeSummary.data.total_collected) : undefined}
          isLoading={feeSummary.isPending}
          tone="success"
          icon="fees"
        />
        <StatCard
          label="Fees outstanding"
          value={feeSummary.data ? money(feeSummary.data.total_outstanding) : undefined}
          isLoading={feeSummary.isPending}
          tone="danger"
          icon="fees"
        />
      </div>

      <div className="mx-6 mb-6 rounded-xl border border-dashed border-ink-200 p-5 text-sm text-ink-500">
        Today's attendance and upcoming exam metrics are a future enhancement — see
        Attendance and Exams & Marks in the sidebar for the underlying data today.
      </div>
    </div>
  )
}
