import { useQuery } from '@tanstack/react-query'
import { usePortalScope } from '../../../hooks/usePortalScope'
import ChildSelector from './ChildSelector'
import { fetchStudentAttendanceHistory, fetchStudentAttendanceSummary } from '../../../services/attendanceService'
import Badge from '../../../components/ui/Badge'

const STATUS_TONE = { present: 'success', absent: 'danger', late: 'warning', excused: 'neutral' }
const STATUS_LABEL = { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused' }

export default function PortalAttendancePage() {
  const { studentId, isParent, children, selectedId, setSelectedId } = usePortalScope()

  const { data: summary } = useQuery({
    queryKey: ['portal', 'attendance-summary', studentId],
    queryFn: () => fetchStudentAttendanceSummary(studentId),
    enabled: !!studentId,
  })

  const { data: history } = useQuery({
    queryKey: ['portal', 'attendance-history', studentId],
    queryFn: () => fetchStudentAttendanceHistory(studentId),
    enabled: !!studentId,
  })

  if (!studentId) return <p className="text-sm text-ink-500">No linked student found.</p>

  return (
    <div>
      {isParent && <ChildSelector children={children} selectedId={selectedId} onChange={setSelectedId} />}

      <h1 className="mb-4 text-xl font-semibold text-ink-900">Attendance</h1>

      {summary && (
        <div className="mb-6 grid grid-cols-4 gap-3">
          <SummaryTile label="Present" value={summary.present} />
          <SummaryTile label="Absent" value={summary.absent} />
          <SummaryTile label="Late" value={summary.late} />
          <SummaryTile label="Excused" value={summary.excused} />
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-portal-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(!history || history.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-ink-400">
                  No attendance recorded yet.
                </td>
              </tr>
            )}
            {history?.map((h, i) => (
              <tr key={i} className="border-t border-portal-50">
                <td className="px-4 py-3 text-ink-600">{h.date}</td>
                <td className="px-4 py-3 text-ink-600">{h.course_name}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[h.status]}>{STATUS_LABEL[h.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-xl border border-portal-100 bg-white p-4 text-center">
      <p className="text-2xl font-semibold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  )
}
