import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { fetchStudents } from '../../services/studentService'
import { fetchFees } from '../../services/feeService'

function StatCard({ label, value, isLoading, tone }) {
  const toneClass = tone === 'danger' ? 'text-danger-600' : 'text-ink-900'
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{isLoading ? '—' : value}</p>
    </div>
  )
}

export default function StaffDashboardPage() {
  const students = useQuery({
    queryKey: ['students', { pageSize: 1, isActive: true, stat: true }],
    queryFn: () => fetchStudents({ pageSize: 1, isActive: 'true' }),
  })
  const overdueFees = useQuery({
    queryKey: ['fees', { status: 'overdue', stat: true }],
    queryFn: () => fetchFees({ status: 'overdue', pageSize: 1 }),
  })

  return (
    <div>
      <PageHeader
        title="Staff dashboard"
        description="Registration, attendance, and fee workflows for front-desk staff"
      />

      <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
        <StatCard label="Active students" value={students.data?.meta.total} isLoading={students.isPending} />
        <StatCard
          label="Overdue fees"
          value={overdueFees.data?.meta.total}
          isLoading={overdueFees.isPending}
          tone="danger"
        />
      </div>

      <div className="flex flex-wrap gap-3 px-6 pb-6 text-sm">
        <Link to="students" className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 hover:bg-ink-50">
          Register a student →
        </Link>
        <Link to="attendance" className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 hover:bg-ink-50">
          Mark attendance →
        </Link>
        <Link to="fees" className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 hover:bg-ink-50">
          Record a payment →
        </Link>
      </div>
    </div>
  )
}
