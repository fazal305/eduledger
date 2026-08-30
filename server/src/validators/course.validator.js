import { z } from 'zod'

export const courseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150),
  code: z.string().trim().min(1, 'Code is required').max(20),
  departmentId: z.coerce.number().int().positive('Department is required'),
  creditHours: z.coerce.number().int().min(1).max(20).optional(),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
})

export const courseListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})
