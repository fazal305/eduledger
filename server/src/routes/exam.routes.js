import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { examSchema, examListQuerySchema, marksSchema } from '../validators/exam.validator.js'
import {
  listExamsHandler,
  createExamHandler,
  updateExamHandler,
  getExamHandler,
  saveMarksHandler,
} from '../controllers/exam.controller.js'

const router = Router()

router.use(requireAuth, requireRole('admin', 'staff', 'teacher'))

router.get('/', validateQuery(examListQuerySchema), listExamsHandler)
router.post('/', validateBody(examSchema), createExamHandler)
router.get('/:id', getExamHandler)
router.put('/:id', validateBody(examSchema), updateExamHandler)
router.put('/:id/marks', validateBody(marksSchema), saveMarksHandler)

export default router
