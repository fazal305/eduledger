import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:00)?$/

export const classSchema = z
  .object({
    courseId: z.coerce.number().int().positive('Course is required'),
    sectionId: z.coerce.number().int().positive('Section is required'),
    academicYearId: z.coerce.number().int().positive('Academic year is required'),
    teacherId: z.coerce.number().int().positive().nullable().optional(),
    room: z.string().trim().max(30).optional().or(z.literal('')),
    scheduleDay: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']).nullable().optional(),
    startTime: z.string().regex(timeRegex, 'Use HH:MM').nullable().optional(),
    endTime: z.string().regex(timeRegex, 'Use HH:MM').nullable().optional(),
  })
  .refine((data) => !data.startTime || !data.endTime || data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export const classListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  academicYearId: z.coerce.number().int().positive().optional(),
  teacherId: z.coerce.number().int().positive().optional(),
  sectionId: z.coerce.number().int().positive().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
})
