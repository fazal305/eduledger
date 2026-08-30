import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import FormField, { inputClass } from '../../components/ui/FormField'
import { createExam, updateExam } from '../../services/examService'

const examFormSchema = z.object({
  name: z.string().trim().min(1, 'Exam name is required').max(150),
  examDate: z.string().min(1, 'Exam date is required'),
  maxMarks: z.coerce.number().int().positive('Must be greater than 0').max(1000),
})

export default function ExamFormModal({ classId, exam, onClose, onSuccess }) {
  const isEdit = !!exam
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(examFormSchema),
    defaultValues: exam
      ? { name: exam.name, examDate: exam.exam_date, maxMarks: exam.max_marks }
      : { maxMarks: 100 },
  })

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = { ...values, classId }
      return isEdit ? updateExam(exam.id, payload) : createExam(payload)
    },
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.'),
  })

  return (
    <Modal title={isEdit ? 'Edit exam' : 'Create exam'} onClose={onClose} width="max-w-md">
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <FormField label="Exam name" htmlFor="name" error={errors.name?.message}>
          <input id="name" {...register('name')} className={inputClass} placeholder="e.g. Midterm" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Exam date" htmlFor="examDate" error={errors.examDate?.message}>
            <input id="examDate" type="date" {...register('examDate')} className={inputClass} />
          </FormField>
          <FormField label="Max marks" htmlFor="maxMarks" error={errors.maxMarks?.message}>
            <input id="maxMarks" type="number" min={1} max={1000} {...register('maxMarks')} className={inputClass} />
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
            {isEdit ? 'Save changes' : 'Create exam'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
