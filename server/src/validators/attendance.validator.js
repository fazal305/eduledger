import { z } from 'zod'

export const attendanceQuerySchema = z.object({
  classId: z.coerce.number().int().positive('Class is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)'),
})

export const bulkAttendanceSchema = z.object({
  classId: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)'),
  records: z
    .array(
      z.object({
        studentId: z.coerce.number().int().positive(),
        status: z.enum(['present', 'absent', 'late', 'excused']),
      }),
    )
    .min(1, 'At least one attendance record is required'),
})
