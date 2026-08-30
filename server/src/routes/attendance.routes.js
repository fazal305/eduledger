import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { attendanceQuerySchema, bulkAttendanceSchema } from '../validators/attendance.validator.js'
import {
  getAttendanceHandler,
  saveAttendanceHandler,
  getStudentSummaryHandler,
  getStudentHistoryHandler,
} from '../controllers/attendance.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'staff', 'teacher'), validateQuery(attendanceQuerySchema), getAttendanceHandler)
router.post('/', requireRole('admin', 'staff', 'teacher'), validateBody(bulkAttendanceSchema), saveAttendanceHandler)
router.get(
  '/students/:studentId/summary',
  requireRole('admin', 'staff', 'teacher', 'parent', 'student'),
  getStudentSummaryHandler,
)
router.get(
  '/students/:studentId/history',
  requireRole('admin', 'staff', 'teacher', 'parent', 'student'),
  getStudentHistoryHandler,
)

export default router
