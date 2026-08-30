import { getClassTeacherId } from '../repositories/class.repository.js'
import { NotFoundError, ForbiddenError } from '../utils/errors.js'

export async function assertCanManageClass(user, classId) {
  const teacherId = await getClassTeacherId(classId)
  if (teacherId === null) throw new NotFoundError('Class not found')

  if (user.role === 'admin' || user.role === 'staff') return
  if (user.role === 'teacher' && user.teacherId === teacherId) return

  throw new ForbiddenError('You do not have access to this class')
}
