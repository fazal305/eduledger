import { useQuery } from '@tanstack/react-query'
import { usePortalScope } from '../../../hooks/usePortalScope'
import ChildSelector from './ChildSelector'
import { fetchReportCard } from '../../../services/reportCardService'
import Button from '../../../components/ui/Button'

export default function PortalMarksPage() {
  const { studentId, isParent, children, selectedId, setSelectedId } = usePortalScope()

  const { data: report, isPending } = useQuery({
    queryKey: ['portal', 'report-card', studentId],
    queryFn: () => fetchReportCard(studentId),
    enabled: !!studentId,
  })

  if (!studentId) return <p className="text-sm text-ink-500">No linked student found.</p>
  if (isPending) return <p className="text-sm text-ink-500">Loading marks…</p>

  const { student, academicYear, courses, overall } = report

  return (
    <div>
      {isParent && <ChildSelector children={children} selectedId={selectedId} onChange={setSelectedId} />}

      <div className="mb-4 flex items-center justify-between print:hidden">
        <h1 className="text-xl font-semibold text-ink-900">Marks & Report Card</h1>
        <Button onClick={() => window.print()}>Print / Save as PDF</Button>
      </div>

      <div className="rounded-2xl border border-portal-100 bg-white p-6">
        <p className="text-sm text-ink-500">
          {student.first_name} {student.last_name} · {student.student_number} · {academicYear.name}
        </p>

        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-portal-100 text-xs font-medium uppercase tracking-wide text-ink-500">
              <th className="py-2">Subject</th>
              <th className="py-2">Total</th>
              <th className="py-2">Obtained</th>
              <th className="py-2">%</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-ink-400">
                  No exam results recorded yet.
                </td>
              </tr>
            )}
            {courses.map((c) => (
              <tr key={c.courseName} className="border-b border-portal-50">
                <td className="py-2 font-medium text-ink-800">{c.courseName}</td>
                <td className="py-2 text-ink-500">{c.totalMax}</td>
                <td className="py-2 text-ink-500">{c.totalObtained}</td>
                <td className="py-2 text-ink-500">{c.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between border-t border-portal-100 pt-4">
          <span className="text-sm text-ink-500">Overall result</span>
          <span className="text-sm font-semibold text-ink-900">
            {overall.percentage !== null ? `${overall.percentage}% — ${overall.result}` : overall.result}
          </span>
        </div>
      </div>
    </div>
  )
}
