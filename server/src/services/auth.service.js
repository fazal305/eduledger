import { findUserByEmail, findUserById } from '../repositories/user.repository.js'
import { verifyPassword } from '../utils/password.js'
import { signAuthToken } from '../utils/jwt.js'

export class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function authenticate(email, password) {
  const user = await findUserByEmail(email)
  if (!user || !user.is_active) {
    throw new AuthError('Invalid email or password')
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    throw new AuthError('Invalid email or password')
  }

  const token = signAuthToken({ sub: user.id, role: user.role })
  return { token, user: toPublicUser(user) }
}

export async function getSessionUser(userId) {
  const user = await findUserById(userId)
  if (!user || !user.is_active) return null
  return toPublicUser(user)
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.student_id,
    teacherId: user.teacher_id,
    parentId: user.parent_id,
  }
}
