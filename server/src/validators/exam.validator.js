import { z } from 'zod'

export const examListQuerySchema = z.object({
  classId: z.coerce.number().int().positive('Class is required'),
})

export const examSchema = z.object({
  classId: z.coerce.number().int().positive('Class is required'),
  name: z.string().trim().min(1, 'Exam name is required').max(150),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)'),
  maxMarks: z.coerce.number().int().positive('Max marks must be greater than 0').max(1000),
})

export const marksSchema = z.object({
  records: z
    .array(
      z.object({
        studentId: z.coerce.number().int().positive(),
        obtainedMarks: z.coerce.number().min(0, 'Marks cannot be negative'),
        remarks: z.string().trim().max(255).optional().or(z.literal('')),
      }),
    )
    .min(1, 'At least one mark entry is required'),
})
