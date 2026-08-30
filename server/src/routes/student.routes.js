import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { studentSchema, studentListQuerySchema } from '../validators/student.validator.js'
import { setActiveSchema } from '../validators/common.validator.js'
import {
  listStudentsHandler,
  getStudentHandler,
  createStudentHandler,
  updateStudentHandler,
  setStudentActiveHandler,
  getReportCardHandler,
} from '../controllers/student.controller.js'

const router = Router()

router.use(requireAuth, requireRole('admin', 'staff', 'teacher'))

router.get('/', requireRole('admin', 'staff'), validateQuery(studentListQuerySchema), listStudentsHandler)
router.get('/:id', getStudentHandler)
router.get('/:id/report-card', getReportCardHandler)
router.post('/', requireRole('admin', 'staff'), validateBody(studentSchema), createStudentHandler)
router.put('/:id', requireRole('admin', 'staff'), validateBody(studentSchema), updateStudentHandler)
router.patch('/:id/active', requireRole('admin', 'staff'), validateBody(setActiveSchema), setStudentActiveHandler)

export default router
