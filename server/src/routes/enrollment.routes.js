import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { enrollmentSchema, enrollmentListQuerySchema } from '../validators/enrollment.validator.js'
import {
  listEnrollmentsHandler,
  createEnrollmentHandler,
  dropEnrollmentHandler,
} from '../controllers/enrollment.controller.js'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requireRole('admin', 'staff', 'parent', 'student'),
  validateQuery(enrollmentListQuerySchema),
  listEnrollmentsHandler,
)
router.post('/', requireRole('admin', 'staff'), validateBody(enrollmentSchema), createEnrollmentHandler)
router.patch('/:id/drop', requireRole('admin', 'staff'), dropEnrollmentHandler)

export default router
