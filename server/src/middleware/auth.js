import { verifyAuthToken } from '../utils/jwt.js'
import { getSessionUser } from '../services/auth.service.js'

const COOKIE_NAME = 'eduledger_token'
export const AUTH_COOKIE_NAME = COOKIE_NAME

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    const payload = verifyAuthToken(token)
    const user = await getSessionUser(payload.sub)
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Session expired' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
