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
} from '../controllers/student.controller.js'

const router = Router()

router.use(requireAuth, requireRole('admin', 'staff'))

router.get('/', validateQuery(studentListQuerySchema), listStudentsHandler)
router.get('/:id', getStudentHandler)
router.post('/', validateBody(studentSchema), createStudentHandler)
router.put('/:id', validateBody(studentSchema), updateStudentHandler)
router.patch('/:id/active', validateBody(setActiveSchema), setStudentActiveHandler)

export default router
