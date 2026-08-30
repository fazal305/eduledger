import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getTeachers,
  getTeacherProfile,
  createTeacher,
  editTeacher,
  archiveTeacher,
} from '../services/teacher.service.js'

export const listTeachersHandler = asyncHandler(async (req, res) => {
  res.json(await getTeachers(req.validatedQuery))
})

export const getTeacherHandler = asyncHandler(async (req, res) => {
  res.json({ data: await getTeacherProfile(Number(req.params.id)) })
})

export const createTeacherHandler = asyncHandler(async (req, res) => {
  const teacher = await createTeacher(req.body)
  res.status(201).json({ data: teacher })
})

export const updateTeacherHandler = asyncHandler(async (req, res) => {
  const teacher = await editTeacher(Number(req.params.id), req.body)
  res.json({ data: teacher })
})

export const setTeacherActiveHandler = asyncHandler(async (req, res) => {
  const teacher = await archiveTeacher(Number(req.params.id), req.body.isActive)
  res.json({ data: teacher })
})
