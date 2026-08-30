import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getChildrenForParent } from '../repositories/parent.repository.js'

const router = Router()

router.use(requireAuth, requireRole('parent'))

router.get(
  '/children',
  asyncHandler(async (req, res) => {
    res.json({ data: await getChildrenForParent(req.user.parentId) })
  }),
)

export default router
