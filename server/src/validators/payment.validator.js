import { z } from 'zod'

export const paymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0').max(10_000_000),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)'),
  method: z.enum(['cash', 'bank_transfer', 'card', 'other']),
  reference: z.string().trim().max(100).optional().or(z.literal('')),
})
