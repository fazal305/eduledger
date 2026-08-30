import {
  listStudents,
  findStudentById,
  insertStudent,
  updateStudent,
  setStudentActive,
  getStudentGuardians,
} from '../repositories/student.repository.js'
import { parsePagination, buildMeta } from '../utils/pagination.js'
import { NotFoundError } from '../utils/errors.js'

export async function getStudents(query) {
  const { page, pageSize, offset } = parsePagination(query)
  const { rows, total } = await listStudents({
    search: query.search,
    sectionId: query.sectionId,
    isActive: query.isActive,
    sortBy: query.sortBy,
    sortDir: query.sortDir,
    limit: pageSize,
    offset,
  })
  return { data: rows, meta: buildMeta(page, pageSize, total) }
}

export async function getStudentProfile(id) {
  const student = await findStudentById(id)
  if (!student) throw new NotFoundError('Student not found')
  const guardians = await getStudentGuardians(id)
  return { ...student, guardians }
}

export async function createStudent(data) {
  const id = await insertStudent(data)
  return findStudentById(id)
}

export async function editStudent(id, data) {
  const existing = await findStudentById(id)
  if (!existing) throw new NotFoundError('Student not found')
  await updateStudent(id, data)
  return findStudentById(id)
}

export async function archiveStudent(id, isActive) {
  const existing = await findStudentById(id)
  if (!existing) throw new NotFoundError('Student not found')
  await setStudentActive(id, isActive)
  return findStudentById(id)
}
