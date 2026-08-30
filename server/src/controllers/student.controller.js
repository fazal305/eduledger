import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getStudents,
  getStudentProfile,
  createStudent,
  editStudent,
  archiveStudent,
} from '../services/student.service.js'
import { buildReportCard } from '../services/reportCard.service.js'
import { assertCanViewStudent } from '../services/studentAccess.service.js'

export const listStudentsHandler = asyncHandler(async (req, res) => {
  res.json(await getStudents(req.validatedQuery))
})

export const getStudentHandler = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  await assertCanViewStudent(req.user, id)
  res.json({ data: await getStudentProfile(id) })
})

export const createStudentHandler = asyncHandler(async (req, res) => {
  const student = await createStudent(req.body)
  res.status(201).json({ data: student })
})

export const updateStudentHandler = asyncHandler(async (req, res) => {
  const student = await editStudent(Number(req.params.id), req.body)
  res.json({ data: student })
})

export const setStudentActiveHandler = asyncHandler(async (req, res) => {
  const student = await archiveStudent(Number(req.params.id), req.body.isActive)
  res.json({ data: student })
})

export const getReportCardHandler = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  await assertCanViewStudent(req.user, id)
  const academicYearId = req.query.academicYearId ? Number(req.query.academicYearId) : undefined
  const reportCard = await buildReportCard(id, academicYearId)
  res.json({ data: reportCard })
})
