import { z } from 'zod'

export const teacherFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  departmentId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  hireDate: z.string().optional().or(z.literal('')),
})
