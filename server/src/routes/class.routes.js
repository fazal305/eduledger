import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { classSchema, classListQuerySchema } from '../validators/class.validator.js'
import { setActiveSchema } from '../validators/common.validator.js'
import {
  listClassesHandler,
  getClassHandler,
  createClassHandler,
  updateClassHandler,
  setClassActiveHandler,
} from '../controllers/class.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'staff', 'teacher'), validateQuery(classListQuerySchema), listClassesHandler)
router.get('/:id', requireRole('admin', 'staff', 'teacher'), getClassHandler)
router.post('/', requireRole('admin'), validateBody(classSchema), createClassHandler)
router.put('/:id', requireRole('admin'), validateBody(classSchema), updateClassHandler)
router.patch('/:id/active', requireRole('admin'), validateBody(setActiveSchema), setClassActiveHandler)

export default router
