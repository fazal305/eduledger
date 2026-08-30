import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { courseSchema, courseListQuerySchema } from '../validators/course.validator.js'
import { setActiveSchema } from '../validators/common.validator.js'
import {
  listCoursesHandler,
  getCourseHandler,
  createCourseHandler,
  updateCourseHandler,
  setCourseActiveHandler,
} from '../controllers/course.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'staff', 'teacher'), validateQuery(courseListQuerySchema), listCoursesHandler)
router.get('/:id', requireRole('admin', 'staff', 'teacher'), getCourseHandler)
router.post('/', requireRole('admin'), validateBody(courseSchema), createCourseHandler)
router.put('/:id', requireRole('admin'), validateBody(courseSchema), updateCourseHandler)
router.patch('/:id/active', requireRole('admin'), validateBody(setActiveSchema), setCourseActiveHandler)

export default router
