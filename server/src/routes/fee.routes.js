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

router.use(requireAuth, requireRole('admin', 'staff'))

router.get('/summary', validateQuery(feeSummaryQuerySchema), getSummaryHandler)
router.get('/', validateQuery(feeListQuerySchema), listFeesHandler)
router.get('/:id', getFeeHandler)
router.post('/', validateBody(feeSchema), createFeeHandler)
router.post('/:id/payments', validateBody(paymentSchema), createPaymentHandler)

export default router
