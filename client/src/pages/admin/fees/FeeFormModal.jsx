import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { createFee } from '../../../services/feeService'
import { fetchStudents } from '../../../services/studentService'
import { fetchFeeTypes } from '../../../services/referenceService'
import { fetchAcademicYears } from '../../../services/referenceService'

const feeFormSchema = z.object({
  studentId: z.coerce.number({ message: 'Select a student' }).int().positive('Select a student'),
  feeTypeId: z.coerce.number({ message: 'Select a fee type' }).int().positive('Select a fee type'),
  academicYearId: z.coerce.number({ message: 'Select an academic year' }).int().positive('Select an academic year'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
})

export default function FeeFormModal({ onClose, onSuccess }) {
  const [serverError, setServerError] = useState('')
  const { data: students } = useQuery({
    queryKey: ['students', 'for-fees'],
    queryFn: () => fetchStudents({ isActive: 'true', pageSize: 100 }),
  })
  const { data: feeTypes } = useQuery({ queryKey: ['feeTypes'], queryFn: fetchFeeTypes })
  const { data: academicYears } = useQuery({ queryKey: ['academicYears'], queryFn: fetchAcademicYears })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(feeFormSchema),
  })

  const mutation = useMutation({
    mutationFn: (values) => createFee(values),
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.'),
  })

  return (
    <Modal title="Add fee" onClose={onClose}>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <FormField label="Student" htmlFor="studentId" error={errors.studentId?.message}>
          <select id="studentId" {...register('studentId')} className={inputClass}>
            <option value="">Select a student…</option>
            {students?.data.map((s) => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} ({s.student_number})
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fee type" htmlFor="feeTypeId" error={errors.feeTypeId?.message}>
            <select id="feeTypeId" {...register('feeTypeId')} className={inputClass}>
              <option value="">Select…</option>
              {feeTypes?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Academic year" htmlFor="academicYearId" error={errors.academicYearId?.message}>
            <select id="academicYearId" {...register('academicYearId')} className={inputClass}>
              <option value="">Select…</option>
              {academicYears?.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Amount" htmlFor="amount" error={errors.amount?.message}>
            <input id="amount" type="number" min={0} step="0.01" {...register('amount')} className={inputClass} />
          </FormField>
          <FormField label="Due date" htmlFor="dueDate" error={errors.dueDate?.message}>
            <input id="dueDate" type="date" {...register('dueDate')} className={inputClass} />
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
            Add fee
          </Button>
        </div>
      </form>
    </Modal>
  )
}
