import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { feeSchema, feeListQuerySchema, feeSummaryQuerySchema } from '../validators/fee.validator.js'
import { paymentSchema } from '../validators/payment.validator.js'
import {
  listFeesHandler,
  getFeeHandler,
  createFeeHandler,
  getSummaryHandler,
  createPaymentHandler,
} from '../controllers/fee.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/summary', requireRole('admin', 'staff'), validateQuery(feeSummaryQuerySchema), getSummaryHandler)
router.get(
  '/',
  requireRole('admin', 'staff', 'parent', 'student'),
  validateQuery(feeListQuerySchema),
  listFeesHandler,
)
router.get('/:id', requireRole('admin', 'staff', 'parent', 'student'), getFeeHandler)
router.post('/', requireRole('admin', 'staff'), validateBody(feeSchema), createFeeHandler)
router.post('/:id/payments', requireRole('admin', 'staff'), validateBody(paymentSchema), createPaymentHandler)

export default router
