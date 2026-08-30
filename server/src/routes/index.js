import { Router } from 'express'
import authRoutes from './auth.routes.js'
import referenceRoutes from './reference.routes.js'
import studentRoutes from './student.routes.js'
import teacherRoutes from './teacher.routes.js'
import courseRoutes from './course.routes.js'
import classRoutes from './class.routes.js'
import enrollmentRoutes from './enrollment.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/reference', referenceRoutes)
router.use('/students', studentRoutes)
router.use('/teachers', teacherRoutes)
router.use('/courses', courseRoutes)
router.use('/classes', classRoutes)
router.use('/enrollments', enrollmentRoutes)

export default router
