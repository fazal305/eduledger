import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { teacherSchema, teacherListQuerySchema } from '../validators/teacher.validator.js'
import { setActiveSchema } from '../validators/common.validator.js'
import {
  listTeachersHandler,
  getTeacherHandler,
  createTeacherHandler,
  updateTeacherHandler,
  setTeacherActiveHandler,
} from '../controllers/teacher.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'staff'), validateQuery(teacherListQuerySchema), listTeachersHandler)
router.get('/:id', requireRole('admin', 'staff'), getTeacherHandler)
router.post('/', requireRole('admin'), validateBody(teacherSchema), createTeacherHandler)
router.put('/:id', requireRole('admin'), validateBody(teacherSchema), updateTeacherHandler)
router.patch('/:id/active', requireRole('admin'), validateBody(setActiveSchema), setTeacherActiveHandler)

export default router
