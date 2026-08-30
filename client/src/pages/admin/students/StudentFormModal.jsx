import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { studentFormSchema } from '../../../schemas/student'
import { createStudent, updateStudent } from '../../../services/studentService'
import { fetchSections } from '../../../services/referenceService'

export default function StudentFormModal({ student, onClose, onSuccess }) {
  const isEdit = !!student
  const [serverError, setServerError] = useState('')
  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: () => fetchSections() })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: student
      ? {
          firstName: student.first_name,
          lastName: student.last_name,
          dateOfBirth: student.date_of_birth,
          gender: student.gender,
          admissionDate: student.admission_date,
          sectionId: student.section_id ?? '',
        }
      : { gender: 'female', sectionId: '' },
  })

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = { ...values, sectionId: values.sectionId === '' ? null : values.sectionId }
      return isEdit ? updateStudent(student.id, payload) : createStudent(payload)
    },
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.'),
  })

  return (
    <Modal title={isEdit ? 'Edit student' : 'Register student'} onClose={onClose}>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <input id="firstName" {...register('firstName')} className={inputClass} />
          </FormField>
          <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <input id="lastName" {...register('lastName')} className={inputClass} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
            <input id="dateOfBirth" type="date" {...register('dateOfBirth')} className={inputClass} />
          </FormField>
          <FormField label="Gender" htmlFor="gender" error={errors.gender?.message}>
            <select id="gender" {...register('gender')} className={inputClass}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Admission date" htmlFor="admissionDate" error={errors.admissionDate?.message}>
            <input id="admissionDate" type="date" {...register('admissionDate')} className={inputClass} />
          </FormField>
          <FormField label="Section" htmlFor="sectionId" error={errors.sectionId?.message}>
            <select id="sectionId" {...register('sectionId')} className={inputClass}>
              <option value="">Unassigned</option>
              {sections?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

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
            {isEdit ? 'Save changes' : 'Register student'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
