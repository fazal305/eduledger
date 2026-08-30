import { isParentOfStudent } from '../repositories/parent.repository.js'
import { ForbiddenError } from '../utils/errors.js'

export async function assertCanViewStudent(user, studentId) {
  if (user.role === 'admin' || user.role === 'staff' || user.role === 'teacher') return
  if (user.role === 'student' && user.studentId === studentId) return
  if (user.role === 'parent' && (await isParentOfStudent(user.parentId, studentId))) return

  throw new ForbiddenError('You do not have access to this student')
}
