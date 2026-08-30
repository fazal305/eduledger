import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getAttendanceForClassDate,
  saveAttendance,
  getStudentAttendanceSummary,
  getStudentAttendanceHistory,
} from '../services/attendance.service.js'
import { assertCanViewStudent } from '../services/studentAccess.service.js'

export const getAttendanceHandler = asyncHandler(async (req, res) => {
  const { classId, date } = req.validatedQuery
  const roster = await getAttendanceForClassDate(req.user, classId, date)
  res.json({ data: roster })
})

export const saveAttendanceHandler = asyncHandler(async (req, res) => {
  const roster = await saveAttendance(req.user, req.body)
  res.json({ data: roster })
})

export const getStudentSummaryHandler = asyncHandler(async (req, res) => {
  const studentId = Number(req.params.studentId)
  await assertCanViewStudent(req.user, studentId)
  const summary = await getStudentAttendanceSummary(studentId)
  res.json({ data: summary })
})

export const getStudentHistoryHandler = asyncHandler(async (req, res) => {
  const studentId = Number(req.params.studentId)
  await assertCanViewStudent(req.user, studentId)
  const classId = req.query.classId ? Number(req.query.classId) : undefined
  const history = await getStudentAttendanceHistory(studentId, classId)
  res.json({ data: history })
})
