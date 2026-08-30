import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAuthToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.JWT_SECRET)
}
