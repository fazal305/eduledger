import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { useMyClasses } from '../../hooks/useMyClasses'

const DAY_LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

export default function TeacherDashboardPage() {
  const { data: classes, isPending } = useMyClasses()

  return (
    <div>
      <PageHeader title="Teacher dashboard" description="Your classes, attendance, and marks entry" />

      <div className="p-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">My classes</h2>
        {isPending && <p className="text-sm text-ink-500">Loading…</p>}
        {!isPending && classes?.data.length === 0 && (
          <p className="text-sm text-ink-400">No classes assigned yet.</p>
        )}
        {!isPending && classes?.data.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {classes.data.map((c) => (
              <div key={c.id} className="rounded-xl border border-ink-100 bg-white p-4">
                <p className="font-medium text-ink-900">{c.course_name}</p>
                <p className="text-sm text-ink-500">
                  {c.section_name} ·{' '}
                  {c.schedule_day ? DAY_LABEL[c.schedule_day] : 'No schedule'}{' '}
                  {c.start_time?.slice(0, 5) ?? ''}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link to="attendance" className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 hover:bg-ink-50">
            Mark attendance →
          </Link>
          <Link to="marks" className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 hover:bg-ink-50">
            Enter marks →
          </Link>
        </div>
      </div>
    </div>
  )
}
