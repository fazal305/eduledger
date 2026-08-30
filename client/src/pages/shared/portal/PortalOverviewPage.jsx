import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePortalScope } from '../../../hooks/usePortalScope'
import ChildSelector from './ChildSelector'
import { fetchStudent } from '../../../services/studentService'
import { fetchEnrollments } from '../../../services/enrollmentService'
import { fetchFees } from '../../../services/feeService'
import { fetchStudentAttendanceSummary } from '../../../services/attendanceService'

const DAY_LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }
const FEE_STATUS_LABEL = { paid: 'Paid', partially_paid: 'Partially paid', pending: 'Pending', overdue: 'Overdue' }

export default function PortalOverviewPage() {
  const { studentId, isParent, children, selectedId, setSelectedId } = usePortalScope()

  const { data: student } = useQuery({
    queryKey: ['portal', 'student', studentId],
    queryFn: () => fetchStudent(studentId),
    enabled: !!studentId,
  })

  const { data: enrollments } = useQuery({
    queryKey: ['portal', 'enrollments', studentId],
    queryFn: () => fetchEnrollments({ studentId, status: 'active' }),
    enabled: !!studentId,
  })

  const { data: fees } = useQuery({
    queryKey: ['portal', 'fees', studentId],
    queryFn: () => fetchFees({ studentId }),
    enabled: !!studentId,
  })

  const { data: attendance } = useQuery({
    queryKey: ['portal', 'attendance-summary', studentId],
    queryFn: () => fetchStudentAttendanceSummary(studentId),
    enabled: !!studentId,
  })

  if (!studentId) {
    return <p className="text-sm text-ink-500">No linked student found.</p>
  }

  const totalDays = attendance
    ? attendance.present + attendance.absent + attendance.late + attendance.excused
    : 0

  return (
    <div>
      {isParent && <ChildSelector children={children} selectedId={selectedId} onChange={setSelectedId} />}

      <div className="mb-6 rounded-2xl border border-portal-100 bg-white p-6">
        <h1 className="text-xl font-semibold text-ink-900">
          {student ? `${student.first_name} ${student.last_name}` : 'Loading…'}
        </h1>
        {student && (
          <p className="mt-1 text-sm text-ink-500">
            {student.student_number} · {student.section_name ?? 'Unassigned section'}
          </p>
        )}
        <Link
          to="marks"
          className="mt-3 inline-block text-sm font-medium text-portal-600 hover:underline"
        >
          View report card →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-portal-100 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">My classes</h2>
          {!enrollments || enrollments.data.length === 0 ? (
            <p className="text-sm text-ink-400">No classes enrolled yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {enrollments.data.map((e) => (
                <li key={e.id}>
                  <p className="font-medium text-ink-800">{e.course_name}</p>
                  <p className="text-ink-500">
                    {e.teacher_name ?? 'Unassigned'} ·{' '}
                    {e.schedule_day ? DAY_LABEL[e.schedule_day] : '—'} {e.start_time?.slice(0, 5) ?? ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-portal-100 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">Attendance</h2>
          {attendance ? (
            <div className="text-sm text-ink-600">
              <p>Present: {attendance.present}</p>
              <p>Absent: {attendance.absent}</p>
              <p>Late: {attendance.late}</p>
              <p>Excused: {attendance.excused}</p>
              {totalDays > 0 && (
                <p className="mt-2 font-medium text-ink-800">
                  {Math.round((attendance.present / totalDays) * 100)}% present overall
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-400">No attendance recorded yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-portal-100 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">Fees</h2>
          {!fees || fees.data.length === 0 ? (
            <p className="text-sm text-ink-400">No fees recorded.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {fees.data.map((f) => (
                <li key={f.id} className="flex justify-between">
                  <span className="text-ink-600">{f.fee_type_name}</span>
                  <span className="font-medium text-ink-800">{FEE_STATUS_LABEL[f.status]}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="fees" className="mt-3 inline-block text-sm font-medium text-portal-600 hover:underline">
            View fee details →
          </Link>
        </div>
      </div>
    </div>
  )
}
