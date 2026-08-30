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

router.use(requireAuth, requireRole('admin', 'staff'))

router.get('/', validateQuery(enrollmentListQuerySchema), listEnrollmentsHandler)
router.post('/', validateBody(enrollmentSchema), createEnrollmentHandler)
router.patch('/:id/drop', dropEnrollmentHandler)

export default router
