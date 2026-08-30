import { z } from 'zod'

export const studentFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['female', 'male', 'other'], { message: 'Select a gender' }),
  admissionDate: z.string().min(1, 'Admission date is required'),
  sectionId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
})
