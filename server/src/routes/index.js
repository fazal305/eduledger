import { Router } from 'express'
import authRoutes from './auth.routes.js'
import referenceRoutes from './reference.routes.js'
import studentRoutes from './student.routes.js'
import teacherRoutes from './teacher.routes.js'
import courseRoutes from './course.routes.js'
import classRoutes from './class.routes.js'
import enrollmentRoutes from './enrollment.routes.js'
import attendanceRoutes from './attendance.routes.js'
import examRoutes from './exam.routes.js'
import feeRoutes from './fee.routes.js'
import portalRoutes from './portal.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/reference', referenceRoutes)
router.use('/students', studentRoutes)
router.use('/teachers', teacherRoutes)
router.use('/courses', courseRoutes)
router.use('/classes', classRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/attendance', attendanceRoutes)
router.use('/exams', examRoutes)
router.use('/fees', feeRoutes)
router.use('/portal', portalRoutes)

export default router
