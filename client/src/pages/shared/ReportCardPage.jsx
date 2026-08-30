import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchReportCard } from '../../services/reportCardService'
import Button from '../../components/ui/Button'

export default function ReportCardPage() {
  const { id } = useParams()
  const studentId = Number(id)

  const { data: report, isPending, isError, error } = useQuery({
    queryKey: ['report-card', studentId],
    queryFn: () => fetchReportCard(studentId),
  })

  if (isPending) return <div className="p-6 text-sm text-ink-500">Loading report card…</div>
  if (isError) {
    return (
      <div className="p-6 text-sm text-danger-600">
        {error?.response?.data?.message ?? 'Could not load this report card.'}
      </div>
    )
  }

  const { student, academicYear, courses, attendance, overall } = report
  const totalDays = attendance.present + attendance.absent + attendance.late + attendance.excused

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link to=".." relative="path" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back
        </Link>
        <Button onClick={() => window.print()}>Print / Save as PDF</Button>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-8 print:border-0 print:p-0 print:shadow-none">
        <div className="mb-6 border-b border-ink-100 pb-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            [DEMO] Greenwood Academy — Report Card
          </p>
          <h1 className="mt-1 text-xl font-semibold text-ink-900">
            {student.first_name} {student.last_name}
          </h1>
          <p className="text-sm text-ink-500">
            {student.student_number} · {student.section_name ?? 'Unassigned'} · {academicYear.name}
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-xs font-medium uppercase tracking-wide text-ink-500">
              <th className="py-2">Subject</th>
              <th className="py-2">Total marks</th>
              <th className="py-2">Obtained</th>
              <th className="py-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-ink-400">
                  No exam results recorded yet for this academic year.
                </td>
              </tr>
            )}
            {courses.map((c) => (
              <tr key={c.courseName} className="border-b border-ink-100">
                <td className="py-2 font-medium text-ink-800">{c.courseName}</td>
                <td className="py-2 text-ink-500">{c.totalMax}</td>
                <td className="py-2 text-ink-500">{c.totalObtained}</td>
                <td className="py-2 text-ink-500">{c.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-900">Attendance</h3>
            <p className="text-sm text-ink-600">
              Present {attendance.present} · Absent {attendance.absent} · Late {attendance.late} ·
              Excused {attendance.excused}
              {totalDays > 0 && (
                <span className="text-ink-400"> ({Math.round((attendance.present / totalDays) * 100)}% present)</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <h3 className="mb-2 text-sm font-semibold text-ink-900">Overall result</h3>
            <p className="text-lg font-semibold text-ink-900">
              {overall.percentage !== null ? `${overall.percentage}%` : '—'}
            </p>
            <p className="text-sm text-ink-500">{overall.result}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
