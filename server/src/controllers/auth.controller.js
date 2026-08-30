import { authenticate, AuthError } from '../services/auth.service.js'
import { AUTH_COOKIE_NAME } from '../middleware/auth.js'
import { env } from '../config/env.js'

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 8 * 60 * 60 * 1000,
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    const { token, user } = await authenticate(email, password)
    res.cookie(AUTH_COOKIE_NAME, token, cookieOptions)
    res.json({ user })
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(401).json({ message: err.message })
    }
    throw err
  }
}

export function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOptions, maxAge: undefined })
  res.status(204).end()
}

export function me(req, res) {
  res.json({ user: req.user })
}
