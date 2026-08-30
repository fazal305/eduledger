import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/ui/Button'
import { fetchExam, saveMarks } from '../../services/examService'

export default function MarksEntryPage() {
  const { examId } = useParams()
  const [draft, setDraft] = useState({})
  const [serverError, setServerError] = useState('')
  const queryClient = useQueryClient()

  const { data: exam, isPending, isError, error } = useQuery({
    queryKey: ['exams', Number(examId)],
    queryFn: () => fetchExam(Number(examId)),
  })

  const mutation = useMutation({
    mutationFn: (records) => saveMarks(Number(examId), records),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', Number(examId)] })
      setDraft({})
      setServerError('')
    },
    onError: (err) => setServerError(err.response?.data?.message ?? 'Could not save marks.'),
  })

  if (isPending) return <div className="p-6 text-sm text-ink-500">Loading exam…</div>
  if (isError) {
    return (
      <div className="p-6 text-sm text-danger-600">
        {error?.response?.data?.message ?? 'Could not load this exam.'}
      </div>
    )
  }

  function valueFor(studentId, current) {
    return draft[studentId] ?? current ?? ''
  }

  function handleSave() {
    const records = exam.roster
      .map((r) => {
        const raw = valueFor(r.student_id, r.obtained_marks)
        if (raw === '') return null
        return { studentId: r.student_id, obtainedMarks: Number(raw) }
      })
      .filter(Boolean)
    mutation.mutate(records)
  }

  return (
    <div>
      <PageHeader
        title={`${exam.name} — ${exam.course_name}`}
        description={`${exam.section_name} · Max marks: ${exam.max_marks} · ${exam.exam_date}`}
      />

      <div className="mx-6 mt-4 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Obtained marks</th>
              <th className="px-4 py-3">Grade</th>
            </tr>
          </thead>
          <tbody>
            {exam.roster.map((r) => (
              <tr key={r.student_id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-900">
                  {r.first_name} {r.last_name}
                  <span className="ml-2 font-normal text-ink-400">{r.student_number}</span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    max={exam.max_marks}
                    step="0.5"
                    value={valueFor(r.student_id, r.obtained_marks)}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, [r.student_id]: e.target.value }))
                    }
                    className="w-24 rounded-lg border border-ink-200 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-ink-500">{r.grade ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {serverError && (
        <p role="alert" className="mx-6 mt-3 rounded-lg bg-danger-100 px-3 py-2 text-sm text-danger-600">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3 px-6 py-4">
        <Button onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save marks'}
        </Button>
        <Link to="../.." relative="path" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to exams
        </Link>
      </div>
    </div>
  )
}
