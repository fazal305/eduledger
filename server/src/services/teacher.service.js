import {
  listTeachers,
  findTeacherById,
  findTeacherByEmail,
  insertTeacher,
  updateTeacher,
  setTeacherActive,
  getTeacherClasses,
} from '../repositories/teacher.repository.js'
import { parsePagination, buildMeta } from '../utils/pagination.js'
import { NotFoundError, ConflictError } from '../utils/errors.js'

export async function getTeachers(query) {
  const { page, pageSize, offset } = parsePagination(query)
  const { rows, total } = await listTeachers({
    search: query.search,
    departmentId: query.departmentId,
    isActive: query.isActive,
    limit: pageSize,
    offset,
  })
  return { data: rows, meta: buildMeta(page, pageSize, total) }
}

export async function getTeacherProfile(id) {
  const teacher = await findTeacherById(id)
  if (!teacher) throw new NotFoundError('Teacher not found')
  const classes = await getTeacherClasses(id)
  return { ...teacher, classes }
}

export async function createTeacher(data) {
  const existing = await findTeacherByEmail(data.email)
  if (existing) throw new ConflictError('A teacher with this email already exists')
  const id = await insertTeacher(data)
  return findTeacherById(id)
}

export async function editTeacher(id, data) {
  const existing = await findTeacherById(id)
  if (!existing) throw new NotFoundError('Teacher not found')
  const emailOwner = await findTeacherByEmail(data.email)
  if (emailOwner && emailOwner.id !== id) throw new ConflictError('A teacher with this email already exists')
  await updateTeacher(id, data)
  return findTeacherById(id)
}

export async function archiveTeacher(id, isActive) {
  const existing = await findTeacherById(id)
  if (!existing) throw new NotFoundError('Teacher not found')
  await setTeacherActive(id, isActive)
  return findTeacherById(id)
}
