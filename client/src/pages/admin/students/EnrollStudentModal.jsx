import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { fetchClasses } from '../../../services/classService'
import { enrollStudent } from '../../../services/enrollmentService'

export default function EnrollStudentModal({ studentId, onClose, onSuccess }) {
  const [serverError, setServerError] = useState('')
  const { data: classesResult } = useQuery({
    queryKey: ['classes', 'for-enrollment'],
    queryFn: () => fetchClasses({ isActive: 'true', pageSize: 100 }),
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { classId: '' },
  })

  const mutation = useMutation({
    mutationFn: (values) => enrollStudent({ studentId, classId: Number(values.classId) }),
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Could not enroll student.'),
  })

  return (
    <Modal title="Enroll in a class" onClose={onClose} width="max-w-md">
      <form
        onSubmit={handleSubmit((values) => {
          if (!values.classId) return
          mutation.mutate(values)
        })}
        className="space-y-4"
        noValidate
      >
        <FormField label="Class" htmlFor="classId" error={errors.classId?.message}>
          <select
            id="classId"
            {...register('classId', { required: 'Select a class' })}
            className={inputClass}
          >
            <option value="">Select a class…</option>
            {classesResult?.data.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name} · {c.section_name} · {c.academic_year_name}
              </option>
            ))}
          </select>
        </FormField>

        {serverError && (
          <p role="alert" className="rounded-lg bg-danger-100 px-3 py-2 text-sm text-danger-600">
            {serverError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            Enroll
          </Button>
        </div>
      </form>
    </Modal>
  )
}
