import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getDepartments,
  getAcademicYears,
  getSections,
  getFeeTypes,
} from '../controllers/reference.controller.js'

const router = Router()

router.use(requireAuth, requireRole('admin', 'staff', 'teacher'))
router.get('/departments', getDepartments)
router.get('/academic-years', getAcademicYears)
router.get('/sections', getSections)
router.get('/fee-types', getFeeTypes)

export default router
