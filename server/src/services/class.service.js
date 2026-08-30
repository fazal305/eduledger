import {
  listClasses,
  findClassById,
  findClassByCombo,
  insertClass,
  updateClass,
  setClassActive,
  getClassRoster,
} from '../repositories/class.repository.js'
import { parsePagination, buildMeta } from '../utils/pagination.js'
import { NotFoundError, ConflictError } from '../utils/errors.js'

export async function getClasses(query) {
  const { page, pageSize, offset } = parsePagination(query)
  const { rows, total } = await listClasses({
    search: query.search,
    academicYearId: query.academicYearId,
    teacherId: query.teacherId,
    sectionId: query.sectionId,
    isActive: query.isActive,
    limit: pageSize,
    offset,
  })
  return { data: rows, meta: buildMeta(page, pageSize, total) }
}

export async function getClassProfile(id) {
  const klass = await findClassById(id)
  if (!klass) throw new NotFoundError('Class not found')
  const roster = await getClassRoster(id)
  return { ...klass, roster }
}

export async function createClass(data) {
  const existing = await findClassByCombo(data.courseId, data.sectionId, data.academicYearId)
  if (existing) throw new ConflictError('This course is already scheduled for this section and academic year')
  const id = await insertClass(data)
  return findClassById(id)
}

export async function editClass(id, data) {
  const existing = await findClassById(id)
  if (!existing) throw new NotFoundError('Class not found')
  const comboOwner = await findClassByCombo(data.courseId, data.sectionId, data.academicYearId, id)
  if (comboOwner) throw new ConflictError('This course is already scheduled for this section and academic year')
  await updateClass(id, data)
  return findClassById(id)
}

export async function archiveClass(id, isActive) {
  const existing = await findClassById(id)
  if (!existing) throw new NotFoundError('Class not found')
  await setClassActive(id, isActive)
  return findClassById(id)
}
