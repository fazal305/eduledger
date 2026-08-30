import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller.js'
import { validateBody } from '../middleware/validate.js'
import { loginSchema } from '../validators/auth.validator.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', validateBody(loginSchema), login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
