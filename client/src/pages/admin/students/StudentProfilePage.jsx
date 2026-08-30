import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { fetchStudent, setStudentActive } from '../../../services/studentService'
import { fetchEnrollments, dropEnrollment } from '../../../services/enrollmentService'
import StudentFormModal from './StudentFormModal'
import EnrollStudentModal from './EnrollStudentModal'

export default function StudentProfilePage() {
  const { id } = useParams()
  const studentId = Number(id)
  const queryClient = useQueryClient()
  const [showEdit, setShowEdit] = useState(false)
  const [showEnroll, setShowEnroll] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [dropTarget, setDropTarget] = useState(null)

  const { data: student, isPending, isError, error } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => fetchStudent(studentId),
  })

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', { studentId }],
    queryFn: () => fetchEnrollments({ studentId, status: 'active' }),
    enabled: !!studentId,
  })

  const archiveMutation = useMutation({
    mutationFn: (isActive) => setStudentActive(studentId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setConfirmArchive(false)
    },
  })

  const dropMutation = useMutation({
    mutationFn: (enrollmentId) => dropEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', { studentId }] })
      setDropTarget(null)
    },
  })

  if (isPending) return <div className="p-6 text-sm text-ink-500">Loading student…</div>
  if (isError) {
    return (
      <div className="p-6 text-sm text-danger-600">
        {error?.response?.data?.message ?? 'Could not load this student.'}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`${student.first_name} ${student.last_name}`}
        description={`${student.student_number} · ${student.section_name ?? 'Unassigned section'}`}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <section className="rounded-xl border border-ink-100 bg-white p-5 lg:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">Basic information</h3>
            <Badge tone={student.is_active ? 'success' : 'neutral'}>
              {student.is_active ? 'Active' : 'Archived'}
            </Badge>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Date of birth" value={student.date_of_birth} />
            <Row label="Gender" value={student.gender} />
            <Row label="Admission date" value={student.admission_date} />
            <Row label="Section" value={student.section_name ?? '—'} />
          </dl>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => setShowEdit(true)}>
              Edit
            </Button>
            <Button variant={student.is_active ? 'danger' : 'primary'} onClick={() => setConfirmArchive(true)}>
              {student.is_active ? 'Archive' : 'Reactivate'}
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Guardians</h3>
          {student.guardians.length === 0 ? (
            <p className="text-sm text-ink-400">No guardians linked yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {student.guardians.map((g) => (
                <li key={g.id}>
                  <p className="font-medium text-ink-800">
                    {g.first_name} {g.last_name}{' '}
                    <span className="font-normal text-ink-400">({g.relationship})</span>
                  </p>
                  <p className="text-ink-500">{g.email}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-5 lg:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">Enrolled classes</h3>
            <Button variant="secondary" onClick={() => setShowEnroll(true)}>
              + Enroll
            </Button>
          </div>
          {!enrollments || enrollments.data.length === 0 ? (
            <p className="text-sm text-ink-400">Not enrolled in any class yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {enrollments.data.map((e) => (
                <li key={e.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink-800">{e.course_name}</p>
                    <p className="text-ink-500">
                      {e.section_name} · {e.academic_year_name}
                    </p>
                  </div>
                  <button
                    onClick={() => setDropTarget(e)}
                    className="text-xs font-medium text-danger-600 hover:underline"
                  >
                    Drop
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="px-6 pb-6">
        <Link to=".." relative="path" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to students
        </Link>
      </div>

      {showEdit && (
        <StudentFormModal
          student={student}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false)
            queryClient.invalidateQueries({ queryKey: ['students', studentId] })
          }}
        />
      )}

      {showEnroll && (
        <EnrollStudentModal
          studentId={studentId}
          onClose={() => setShowEnroll(false)}
          onSuccess={() => {
            setShowEnroll(false)
            queryClient.invalidateQueries({ queryKey: ['enrollments', { studentId }] })
          }}
        />
      )}

      {confirmArchive && (
        <ConfirmDialog
          title={student.is_active ? 'Archive student?' : 'Reactivate student?'}
          message={
            student.is_active
              ? 'The student will be marked inactive. Their historical records are kept.'
              : 'The student will be marked active again.'
          }
          confirmLabel={student.is_active ? 'Archive' : 'Reactivate'}
          isLoading={archiveMutation.isPending}
          onCancel={() => setConfirmArchive(false)}
          onConfirm={() => archiveMutation.mutate(!student.is_active)}
        />
      )}

      {dropTarget && (
        <ConfirmDialog
          title="Drop enrollment?"
          message={`Remove this student from ${dropTarget.course_name}?`}
          confirmLabel="Drop"
          isLoading={dropMutation.isPending}
          onCancel={() => setDropTarget(null)}
          onConfirm={() => dropMutation.mutate(dropTarget.id)}
        />
      )}
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
