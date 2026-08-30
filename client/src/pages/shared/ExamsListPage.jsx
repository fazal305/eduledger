import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/ui/Button'
import { useMyClasses } from '../../hooks/useMyClasses'
import { fetchExams } from '../../services/examService'
import ExamFormModal from './ExamFormModal'

export default function ExamsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const classId = searchParams.get('classId') ?? ''
  const [showCreate, setShowCreate] = useState(false)
  const queryClient = useQueryClient()

  const { data: classes } = useMyClasses()

  const { data: exams, isPending } = useQuery({
    queryKey: ['exams', classId],
    queryFn: () => fetchExams(classId),
    enabled: !!classId,
  })

  return (
    <div>
      <PageHeader title="Exams & Marks" description="Create exams and enter marks per class" />

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <select
          value={classId}
          onChange={(e) => setSearchParams(e.target.value ? { classId: e.target.value } : {})}
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
        {classId && (
          <Button className="ml-auto" onClick={() => setShowCreate(true)}>
            + Create exam
          </Button>
        )}
      </div>

      {!classId && <p className="px-6 text-sm text-ink-400">Select a class to see its exams.</p>}
      {classId && isPending && <p className="px-6 text-sm text-ink-500">Loading exams…</p>}

      {classId && exams && (
        <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Max marks</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-ink-400">
                    No exams yet for this class.
                  </td>
                </tr>
              )}
              {exams.map((exam) => (
                <tr key={exam.id} className="border-t border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3 font-medium text-ink-900">{exam.name}</td>
                  <td className="px-4 py-3 text-ink-500">{exam.exam_date}</td>
                  <td className="px-4 py-3 text-ink-500">{exam.max_marks}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`${exam.id}/marks`}
                      className="text-sm font-medium text-brand-600 hover:underline"
                    >
                      Enter marks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <ExamFormModal
          classId={Number(classId)}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false)
            queryClient.invalidateQueries({ queryKey: ['exams', classId] })
          }}
        />
      )}
    </div>
  )
}
