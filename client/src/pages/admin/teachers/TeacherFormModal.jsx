import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { teacherFormSchema } from '../../../schemas/teacher'
import { createTeacher, updateTeacher } from '../../../services/teacherService'
import { fetchDepartments } from '../../../services/referenceService'

export default function TeacherFormModal({ teacher, onClose, onSuccess }) {
  const isEdit = !!teacher
  const [serverError, setServerError] = useState('')
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: teacher
      ? {
          firstName: teacher.first_name,
          lastName: teacher.last_name,
          email: teacher.email,
          phone: teacher.phone ?? '',
          departmentId: teacher.department_id ?? '',
          hireDate: teacher.hire_date ?? '',
        }
      : { departmentId: '' },
  })

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        departmentId: values.departmentId === '' ? null : values.departmentId,
        hireDate: values.hireDate === '' ? null : values.hireDate,
      }
      return isEdit ? updateTeacher(teacher.id, payload) : createTeacher(payload)
    },
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.'),
  })

  return (
    <Modal title={isEdit ? 'Edit teacher' : 'Add teacher'} onClose={onClose}>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <input id="firstName" {...register('firstName')} className={inputClass} />
          </FormField>
          <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <input id="lastName" {...register('lastName')} className={inputClass} />
          </FormField>
        </div>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" {...register('email')} className={inputClass} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
            <input id="phone" {...register('phone')} className={inputClass} />
          </FormField>
          <FormField label="Department" htmlFor="departmentId" error={errors.departmentId?.message}>
            <select id="departmentId" {...register('departmentId')} className={inputClass}>
              <option value="">Unassigned</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Hire date" htmlFor="hireDate" error={errors.hireDate?.message}>
          <input id="hireDate" type="date" {...register('hireDate')} className={inputClass} />
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
            {isEdit ? 'Save changes' : 'Add teacher'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
