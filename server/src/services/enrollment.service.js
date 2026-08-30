import {
  listEnrollments,
  findEnrollment,
  findEnrollmentById,
  insertEnrollment,
  reactivateEnrollment,
  setEnrollmentStatus,
  studentExists,
  classExists,
} from '../repositories/enrollment.repository.js'
import { parsePagination, buildMeta } from '../utils/pagination.js'
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors.js'

export async function getEnrollments(query) {
  const { page, pageSize, offset } = parsePagination(query)
  const { rows, total } = await listEnrollments({
    studentId: query.studentId,
    classId: query.classId,
    status: query.status,
    limit: pageSize,
    offset,
  })
  return { data: rows, meta: buildMeta(page, pageSize, total) }
}

export async function enrollStudent({ studentId, classId, enrolledAt }) {
  if (!(await studentExists(studentId))) throw new BadRequestError('Student does not exist')
  if (!(await classExists(classId))) throw new BadRequestError('Class does not exist')

  const date = enrolledAt ?? new Date().toISOString().slice(0, 10)
  const existing = await findEnrollment(studentId, classId)

  if (existing) {
    if (existing.status === 'active') {
      throw new ConflictError('This student is already enrolled in this class')
    }
    await reactivateEnrollment(existing.id, date)
    return findEnrollmentById(existing.id)
  }

  try {
    const id = await insertEnrollment(studentId, classId, date)
    return findEnrollmentById(id)
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new ConflictError('This student is already enrolled in this class')
    }
    throw err
  }
}

export async function dropEnrollment(id) {
  const existing = await findEnrollmentById(id)
  if (!existing) throw new NotFoundError('Enrollment not found')
  await setEnrollmentStatus(id, 'dropped')
  return findEnrollmentById(id)
}
