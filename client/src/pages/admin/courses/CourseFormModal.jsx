import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { courseFormSchema } from '../../../schemas/course'
import { createCourse, updateCourse } from '../../../services/courseService'
import { fetchDepartments } from '../../../services/referenceService'

export default function CourseFormModal({ course, onClose, onSuccess }) {
  const isEdit = !!course
  const [serverError, setServerError] = useState('')
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: course
      ? {
          name: course.name,
          code: course.code,
          departmentId: course.department_id,
          creditHours: course.credit_hours,
          description: course.description ?? '',
        }
      : { creditHours: 1 },
  })

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? updateCourse(course.id, values) : createCourse(values)),
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.'),
  })

  return (
    <Modal title={isEdit ? 'Edit course' : 'Add course'} onClose={onClose}>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <FormField label="Course name" htmlFor="name" error={errors.name?.message}>
          <input id="name" {...register('name')} className={inputClass} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Course code" htmlFor="code" error={errors.code?.message}>
            <input id="code" {...register('code')} className={inputClass} />
          </FormField>
          <FormField label="Credit hours" htmlFor="creditHours" error={errors.creditHours?.message}>
            <input id="creditHours" type="number" min={1} max={20} {...register('creditHours')} className={inputClass} />
          </FormField>
        </div>

        <FormField label="Department" htmlFor="departmentId" error={errors.departmentId?.message}>
          <select id="departmentId" {...register('departmentId')} className={inputClass}>
            <option value="">Select a department…</option>
            {departments?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <textarea id="description" rows={3} {...register('description')} className={inputClass} />
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
            {isEdit ? 'Save changes' : 'Add course'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
