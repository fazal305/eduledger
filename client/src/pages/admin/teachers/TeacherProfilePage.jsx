import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { fetchTeacher, setTeacherActive } from '../../../services/teacherService'
import TeacherFormModal from './TeacherFormModal'

const DAY_LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

export default function TeacherProfilePage() {
  const { id } = useParams()
  const teacherId = Number(id)
  const queryClient = useQueryClient()
  const [showEdit, setShowEdit] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  const { data: teacher, isPending, isError, error } = useQuery({
    queryKey: ['teachers', teacherId],
    queryFn: () => fetchTeacher(teacherId),
  })

  const archiveMutation = useMutation({
    mutationFn: (isActive) => setTeacherActive(teacherId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      setConfirmArchive(false)
    },
  })

  if (isPending) return <div className="p-6 text-sm text-ink-500">Loading teacher…</div>
  if (isError) {
    return (
      <div className="p-6 text-sm text-danger-600">
        {error?.response?.data?.message ?? 'Could not load this teacher.'}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`${teacher.first_name} ${teacher.last_name}`}
        description={teacher.department_name ?? 'No department assigned'}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <section className="rounded-xl border border-ink-100 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">Basic information</h3>
            <Badge tone={teacher.is_active ? 'success' : 'neutral'}>
              {teacher.is_active ? 'Active' : 'Archived'}
            </Badge>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Email" value={teacher.email} />
            <Row label="Phone" value={teacher.phone ?? '—'} />
            <Row label="Hire date" value={teacher.hire_date ?? '—'} />
          </dl>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => setShowEdit(true)}>
              Edit
            </Button>
            <Button variant={teacher.is_active ? 'danger' : 'primary'} onClick={() => setConfirmArchive(true)}>
              {teacher.is_active ? 'Archive' : 'Reactivate'}
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Assigned classes</h3>
          {teacher.classes.length === 0 ? (
            <p className="text-sm text-ink-400">No classes assigned yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {teacher.classes.map((c) => (
                <li key={c.id}>
                  <p className="font-medium text-ink-800">
                    {c.course_name} · {c.section_name}
                  </p>
                  <p className="text-ink-500">
                    {DAY_LABEL[c.schedule_day] ?? '—'} {c.start_time ?? ''}–{c.end_time ?? ''} · {c.room ?? 'No room'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="px-6 pb-6">
        <Link to="/admin/teachers" className="text-sm font-medium text-brand-600 hover:underline">
          ← Back to teachers
        </Link>
      </div>

      {showEdit && (
        <TeacherFormModal
          teacher={teacher}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false)
            queryClient.invalidateQueries({ queryKey: ['teachers', teacherId] })
          }}
        />
      )}

      {confirmArchive && (
        <ConfirmDialog
          title={teacher.is_active ? 'Archive teacher?' : 'Reactivate teacher?'}
          message={
            teacher.is_active
              ? 'The teacher will be marked inactive. Their historical records are kept.'
              : 'The teacher will be marked active again.'
          }
          confirmLabel={teacher.is_active ? 'Archive' : 'Reactivate'}
          isLoading={archiveMutation.isPending}
          onCancel={() => setConfirmArchive(false)}
          onConfirm={() => archiveMutation.mutate(!teacher.is_active)}
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
