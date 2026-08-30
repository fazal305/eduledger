import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import { fetchClass } from '../../../services/classService'

const DAY_LABEL = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }

export default function ClassProfilePage() {
  const { id } = useParams()
  const classId = Number(id)

  const { data: klass, isPending, isError, error } = useQuery({
    queryKey: ['classes', classId],
    queryFn: () => fetchClass(classId),
  })

  if (isPending) return <div className="p-6 text-sm text-ink-500">Loading class…</div>
  if (isError) {
    return (
      <div className="p-6 text-sm text-danger-600">
        {error?.response?.data?.message ?? 'Could not load this class.'}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`${klass.course_name} · ${klass.section_name}`}
        description={`${klass.academic_year_name} · ${klass.teacher_name ?? 'Unassigned teacher'}`}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <section className="rounded-xl border border-ink-100 bg-white p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Schedule</h3>
          <dl className="space-y-2 text-sm">
            <Row label="Day" value={klass.schedule_day ? DAY_LABEL[klass.schedule_day] : 'Not set'} />
            <Row
              label="Time"
              value={klass.start_time ? `${klass.start_time.slice(0, 5)}–${klass.end_time?.slice(0, 5) ?? ''}` : '—'}
            />
            <Row label="Room" value={klass.room ?? '—'} />
          </dl>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">
            Roster <span className="font-normal text-ink-400">({klass.roster.length} enrolled)</span>
          </h3>
          {klass.roster.length === 0 ? (
            <p className="text-sm text-ink-400">No students enrolled yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs font-medium uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="py-2">Student</th>
                  <th className="py-2">Student #</th>
                  <th className="py-2">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {klass.roster.map((s) => (
                  <tr key={s.id} className="border-t border-ink-100">
                    <td className="py-2">
                      <Link to={`/admin/students/${s.id}`} className="font-medium text-ink-800 hover:text-brand-600">
                        {s.first_name} {s.last_name}
                      </Link>
                    </td>
                    <td className="py-2 text-ink-500">{s.student_number}</td>
                    <td className="py-2 text-ink-500">{s.enrolled_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <div className="px-6 pb-6">
        <Link to="/admin/classes" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to classes
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-800">{value}</dd>
    </div>
  )
}
