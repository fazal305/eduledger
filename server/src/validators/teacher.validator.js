import { z } from 'zod'

export const teacherSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  departmentId: z.coerce.number().int().positive().nullable().optional(),
  hireDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)')
    .nullable()
    .optional(),
})

export const teacherListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})
