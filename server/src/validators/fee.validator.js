import { z } from 'zod'

export const feeSchema = z.object({
  studentId: z.coerce.number().int().positive('Student is required'),
  feeTypeId: z.coerce.number().int().positive('Fee type is required'),
  academicYearId: z.coerce.number().int().positive('Academic year is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0').max(10_000_000),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)'),
})

export const feeListQuerySchema = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  academicYearId: z.coerce.number().int().positive().optional(),
  status: z.enum(['pending', 'partially_paid', 'paid', 'overdue']).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})

export const feeSummaryQuerySchema = z.object({
  academicYearId: z.coerce.number().int().positive().optional(),
})
