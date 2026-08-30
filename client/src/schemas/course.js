import { z } from 'zod'

export const courseFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150),
  code: z.string().trim().min(1, 'Code is required').max(20),
  departmentId: z.coerce.number({ message: 'Select a department' }).int().positive('Select a department'),
  creditHours: z.coerce.number().int().min(1).max(20).optional(),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
})
