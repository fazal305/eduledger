import { z } from 'zod'

export const enrollmentSchema = z.object({
  studentId: z.coerce.number().int().positive('Student is required'),
  classId: z.coerce.number().int().positive('Class is required'),
  enrolledAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)')
    .optional(),
})

export const enrollmentListQuerySchema = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  classId: z.coerce.number().int().positive().optional(),
  status: z.enum(['active', 'dropped', 'completed']).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})
