import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { recordPayment } from '../../../services/feeService'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function PaymentFormModal({ fee, onClose, onSuccess }) {
  const [serverError, setServerError] = useState('')
  const remaining = Number(fee.remaining_amount)

  const paymentFormSchema = z.object({
    amount: z.coerce
      .number()
      .positive('Amount must be greater than 0')
      .max(remaining, `Cannot exceed the remaining balance of ${remaining}`),
    paymentDate: z.string().min(1, 'Payment date is required'),
    method: z.enum(['cash', 'bank_transfer', 'card', 'other']),
    reference: z.string().trim().max(100).optional().or(z.literal('')),
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { paymentDate: todayIso(), method: 'cash', amount: remaining },
  })

  const mutation = useMutation({
    mutationFn: (values) => recordPayment(fee.id, values),
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Could not record this payment.'),
  })

  return (
    <Modal title="Record payment" onClose={onClose} width="max-w-md">
      <p className="mb-4 text-sm text-ink-500">
        {fee.student_first_name} {fee.student_last_name} · {fee.fee_type_name} · Remaining balance:{' '}
        <span className="font-medium text-ink-800">{remaining.toFixed(2)}</span>
      </p>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Amount" htmlFor="amount" error={errors.amount?.message}>
            <input id="amount" type="number" min={0} max={remaining} step="0.01" {...register('amount')} className={inputClass} />
          </FormField>
          <FormField label="Payment date" htmlFor="paymentDate" error={errors.paymentDate?.message}>
            <input id="paymentDate" type="date" {...register('paymentDate')} className={inputClass} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Method" htmlFor="method" error={errors.method?.message}>
            <select id="method" {...register('method')} className={inputClass}>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Reference" htmlFor="reference" error={errors.reference?.message}>
            <input id="reference" {...register('reference')} className={inputClass} placeholder="Optional" />
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
            Record payment
          </Button>
        </div>
      </form>
    </Modal>
  )
}
