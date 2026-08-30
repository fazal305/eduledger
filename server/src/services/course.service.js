import {
  listCourses,
  findCourseById,
  findCourseByCode,
  insertCourse,
  updateCourse,
  setCourseActive,
} from '../repositories/course.repository.js'
import { parsePagination, buildMeta } from '../utils/pagination.js'
import { NotFoundError, ConflictError } from '../utils/errors.js'

export async function getCourses(query) {
  const { page, pageSize, offset } = parsePagination(query)
  const { rows, total } = await listCourses({
    search: query.search,
    departmentId: query.departmentId,
    isActive: query.isActive,
    limit: pageSize,
    offset,
  })
  return { data: rows, meta: buildMeta(page, pageSize, total) }
}

export async function getCourse(id) {
  const course = await findCourseById(id)
  if (!course) throw new NotFoundError('Course not found')
  return course
}

export async function createCourse(data) {
  const existing = await findCourseByCode(data.code)
  if (existing) throw new ConflictError('A course with this code already exists')
  const id = await insertCourse(data)
  return findCourseById(id)
}

export async function editCourse(id, data) {
  const existing = await findCourseById(id)
  if (!existing) throw new NotFoundError('Course not found')
  const codeOwner = await findCourseByCode(data.code)
  if (codeOwner && codeOwner.id !== id) throw new ConflictError('A course with this code already exists')
  await updateCourse(id, data)
  return findCourseById(id)
}

export async function archiveCourse(id, isActive) {
  const existing = await findCourseById(id)
  if (!existing) throw new NotFoundError('Course not found')
  await setCourseActive(id, isActive)
  return findCourseById(id)
}
