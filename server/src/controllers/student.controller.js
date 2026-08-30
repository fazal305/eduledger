import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getStudents,
  getStudentProfile,
  createStudent,
  editStudent,
  archiveStudent,
} from '../services/student.service.js'
import { buildReportCard } from '../services/reportCard.service.js'

export const listStudentsHandler = asyncHandler(async (req, res) => {
  res.json(await getStudents(req.validatedQuery))
})

export const getStudentHandler = asyncHandler(async (req, res) => {
  res.json({ data: await getStudentProfile(Number(req.params.id)) })
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
  const academicYearId = req.query.academicYearId ? Number(req.query.academicYearId) : undefined
  const reportCard = await buildReportCard(Number(req.params.id), academicYearId)
  res.json({ data: reportCard })
})
