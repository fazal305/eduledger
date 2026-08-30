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

router.use(requireAuth, requireRole('admin', 'staff', 'teacher'))

router.get('/', validateQuery(attendanceQuerySchema), getAttendanceHandler)
router.post('/', validateBody(bulkAttendanceSchema), saveAttendanceHandler)
router.get('/students/:studentId/summary', getStudentSummaryHandler)
router.get('/students/:studentId/history', getStudentHistoryHandler)

export default router
