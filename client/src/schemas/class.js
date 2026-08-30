import { z } from 'zod'

export const classFormSchema = z
  .object({
    courseId: z.coerce.number({ message: 'Select a course' }).int().positive('Select a course'),
    sectionId: z.coerce.number({ message: 'Select a section' }).int().positive('Select a section'),
    academicYearId: z.coerce.number({ message: 'Select an academic year' }).int().positive('Select an academic year'),
    teacherId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
    room: z.string().trim().max(30).optional().or(z.literal('')),
    scheduleDay: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', '']).optional(),
    startTime: z.string().optional().or(z.literal('')),
    endTime: z.string().optional().or(z.literal('')),
  })
  .refine((data) => !data.startTime || !data.endTime || data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
