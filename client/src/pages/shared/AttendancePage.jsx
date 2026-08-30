import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/ui/Button'
import { useMyClasses } from '../../hooks/useMyClasses'
import { fetchAttendance, saveAttendance } from '../../services/attendanceService'

const STATUSES = ['present', 'absent', 'late', 'excused']
const STATUS_LABEL = { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused' }
const STATUS_TONE = {
  present: 'bg-success-100 text-success-600',
  absent: 'bg-danger-100 text-danger-600',
  late: 'bg-warning-100 text-warning-600',
  excused: 'bg-ink-100 text-ink-600',
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function AttendancePage() {
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(todayIso())
  const [draft, setDraft] = useState({})
  const queryClient = useQueryClient()

  const { data: classes } = useMyClasses()

  const { data: roster, isPending, isError, error } = useQuery({
    queryKey: ['attendance', classId, date],
    queryFn: () => fetchAttendance(classId, date),
    enabled: !!classId && !!date,
  })

  const mutation = useMutation({
    mutationFn: (records) => saveAttendance({ classId: Number(classId), date, records }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', classId, date] })
      setDraft({})
    },
  })

  function statusFor(studentId, currentStatus) {
    return draft[studentId] ?? currentStatus ?? ''
  }

  function setStatus(studentId, status) {
    setDraft((prev) => ({ ...prev, [studentId]: status }))
  }

  function handleSave() {
    if (!roster) return
    const records = roster
      .map((r) => ({ studentId: r.student_id, status: statusFor(r.student_id, r.status) }))
      .filter((r) => r.status)
    mutation.mutate(records)
  }

  const hasChanges = Object.keys(draft).length > 0

  return (
    <div>
      <PageHeader title="Attendance" description="Mark daily attendance for a class" />

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <select
          value={classId}
          onChange={(e) => {
            setClassId(e.target.value)
            setDraft({})
          }}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Select class"
        >
          <option value="">Select a class…</option>
          {classes?.data.map((c) => (
            <option key={c.id} value={c.id}>
              {c.course_name} · {c.section_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Select date"
        />
        {hasChanges && (
          <Button onClick={handleSave} disabled={mutation.isPending} className="ml-auto">
            {mutation.isPending ? 'Saving…' : 'Save attendance'}
          </Button>
        )}
      </div>

      {!classId && <p className="px-6 text-sm text-ink-400">Select a class to mark attendance.</p>}

      {classId && isPending && <p className="px-6 text-sm text-ink-500">Loading roster…</p>}
      {classId && isError && (
        <p className="px-6 text-sm text-danger-600">
          {error?.response?.data?.message ?? 'Could not load the roster.'}
        </p>
      )}

      {classId && roster && (
        <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Student #</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((r) => {
                const current = statusFor(r.student_id, r.status)
                return (
                  <tr key={r.student_id} className="border-t border-ink-100">
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="px-4 py-3 text-ink-500">{r.student_number}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {STATUSES.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setStatus(r.student_id, status)}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                              current === status ? STATUS_TONE[status] : 'bg-ink-50 text-ink-400 hover:bg-ink-100'
                            }`}
                          >
                            {STATUS_LABEL[status]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
